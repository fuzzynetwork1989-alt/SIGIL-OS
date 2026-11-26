#!/usr/bin/env python3
"""
SIGIL OS Store Asset Generator

Renders the Sigil Eye mark (sigil-mark.svg / sigil-mark-foreground.svg)
into every PNG size required by the app stores and desktop bundlers.

Requires: pip install cairosvg pillow

Outputs:
  sigil-mobile/assets/icon.png            1024x1024  iOS + Play listing icon
  sigil-mobile/assets/adaptive-icon.png   1024x1024  Android adaptive foreground (transparent)
  sigil-mobile/assets/splash.png          1242x2436  Expo splash (transparent, logo centered)
  sigil-mobile/assets/favicon.png         48x48      Web favicon
  web-console/src/app/icon.png            512x512    Next.js auto favicon
  web-console/src/app/apple-icon.png      180x180    iOS web clip icon
  assets/icons/sigil-icon-1024.png        1024x1024  Master raster for tauri icon / stores
"""

import sys
from pathlib import Path

try:
    import cairosvg
    from PIL import Image
except ImportError:
    print("Missing deps. Run: pip install cairosvg pillow")
    sys.exit(1)

SCRIPT_DIR = Path(__file__).parent          # assets/icons
ROOT = SCRIPT_DIR.parent.parent             # SIGIL-OS/
MOBILE_ASSETS = ROOT / "sigil-mobile" / "assets"
WEB_APP = ROOT / "web-console" / "src" / "app"
MASTER_SVG = SCRIPT_DIR / "sigil-mark.svg"
FG_SVG = SCRIPT_DIR / "sigil-mark-foreground.svg"


def render(svg_path: Path, size: int) -> Image.Image:
    """Render an SVG to an RGBA PIL image at `size` x `size`."""
    png = cairosvg.svg2png(
        url=str(svg_path),
        output_width=size,
        output_height=size,
    )
    import io
    return Image.open(io.BytesIO(png)).convert("RGBA")


def save(img: Image.Image, path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG")
    print(f"  ✓ {path.relative_to(ROOT)}  ({img.width}x{img.height})")


def main():
    print("=" * 56)
    print("SIGIL OS — Store Asset Generator")
    print("=" * 56)

    # 1) Mobile app icon — full-bleed square, no alpha (store requirement)
    icon = render(MASTER_SVG, 1024)
    icon_rgb = Image.new("RGB", icon.size, (0, 0, 0))
    icon_rgb.paste(icon, mask=icon.split()[3])
    save(icon_rgb, MOBILE_ASSETS / "icon.png")

    # 2) Android adaptive icon foreground — transparent, mark inside safe zone
    adaptive = render(FG_SVG, 1024)
    save(adaptive, MOBILE_ASSETS / "adaptive-icon.png")

    # 3) Splash — transparent canvas, mark centered at ~1/3 screen height
    mark = render(FG_SVG, 1024)
    splash = Image.new("RGBA", (1242, 2436), (0, 0, 0, 0))
    mark_h = 850
    mark_w = int(mark.width * mark_h / mark.height)
    mark_resized = mark.resize((mark_w, mark_h), Image.LANCZOS)
    splash.paste(mark_resized, ((1242 - mark_w) // 2, (2436 - mark_h) // 2), mark_resized)
    save(splash, MOBILE_ASSETS / "splash.png")

    # 4) Mobile favicon
    save(render(MASTER_SVG, 48), MOBILE_ASSETS / "favicon.png")

    # 5) Web console favicon (Next.js app-router convention)
    save(render(MASTER_SVG, 512), WEB_APP / "icon.png")
    save(render(MASTER_SVG, 180), WEB_APP / "apple-icon.png")

    # 6) Master raster for `tauri icon` and any other tooling
    save(icon_rgb, SCRIPT_DIR / "sigil-icon-1024.png")

    print()
    print("Done. Next steps:")
    print("  cd desktop-client/src-tauri && npx tauri icon ../../assets/icons/sigil-icon-1024.png")
    print("  cd sigil-mobile && npx expo start   # verify assets load")


if __name__ == "__main__":
    main()
