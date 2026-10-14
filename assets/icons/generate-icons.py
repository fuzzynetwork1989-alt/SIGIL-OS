#!/usr/bin/env python3
"""
SIGIL OS Icon Generator

This script converts the SVG icon to PNG and ICO formats for various platforms.
Requires: Python 3, cairosvg, pillow

Install dependencies:
pip install cairosvg pillow
"""

import os
import sys
from pathlib import Path

try:
    import cairosvg
    from PIL import Image
except ImportError as e:
    print(f"Error: Missing required dependencies.")
    print(f"Install with: pip install cairosvg pillow")
    sys.exit(1)

# Paths
SCRIPT_DIR = Path(__file__).parent
SVG_PATH = SCRIPT_DIR / "sigil-icon.svg"
OUTPUT_DIR = SCRIPT_DIR / ".." / ".."  # Project root

# Sizes to generate
PNG_SIZES = [16, 32, 48, 64, 128, 256, 512]
ICO_SIZES = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]

def generate_png(size):
    """Generate PNG of specified size"""
    output_path = OUTPUT_DIR / f"sigil-icon-{size}x{size}.png"
    print(f"Generating PNG {size}x{size}...")

    cairosvg.svg2png(
        url=str(SVG_PATH),
        write_to=str(output_path),
        output_width=size,
        output_height=size
    )

    print(f"  ✓ Created: {output_path}")

def generate_ico():
    """Generate ICO file with multiple sizes"""
    output_path = OUTPUT_DIR / "sigil-icon.ico"
    print(f"Generating ICO file...")

    # Generate temporary PNGs for ICO
    temp_images = []
    for size in ICO_SIZES:
        width, height = size
        temp_path = OUTPUT_DIR / f"temp-{width}x{height}.png"
        cairosvg.svg2png(
            url=str(SVG_PATH),
            write_to=str(temp_path),
            output_width=width,
            output_height=height
        )
        img = Image.open(temp_path)
        temp_images.append(img)

    # Create ICO
    temp_images[0].save(
        output_path,
        format='ICO',
        sizes=[(img.width, img.height) for img in temp_images]
    )

    # Clean up temp files
    for img, size in zip(temp_images, ICO_SIZES):
        width, height = size
        temp_path = OUTPUT_DIR / f"temp-{width}x{height}.png"
        if temp_path.exists():
            temp_path.unlink()

    print(f"  ✓ Created: {output_path}")

def generate_app_icons():
    """Generate app icons for different platforms"""
    print("\nGenerating app icons...")

    # Windows
    print("\nWindows icons:")
    generate_png(256)  # For Windows exe

    # macOS
    print("\nmacOS icons:")
    generate_png(512)  # For macOS app

    # Linux
    print("\nLinux icons:")
    for size in [32, 48, 64, 128, 256]:
        generate_png(size)

    # Web
    print("\nWeb icons:")
    generate_png(192)  # PWA icon
    generate_png(512)  # PWA icon

    # ICO
    print("\nICO file:")
    generate_ico()

    print("\n✓ All icons generated successfully!")

def main():
    """Main entry point"""
    print("=" * 50)
    print("SIGIL OS Icon Generator")
    print("=" * 50)
    print()

    # Check if SVG exists
    if not SVG_PATH.exists():
        print(f"Error: SVG file not found at {SVG_PATH}")
        sys.exit(1)

    # Generate icons
    generate_app_icons()

    print()
    print("Generated files:")
    print(f"  - {OUTPUT_DIR / 'sigil-icon.ico'} (Windows)")
    print(f"  - {OUTPUT_DIR / 'sigil-icon-256x256.png'} (Windows exe)")
    print(f"  - {OUTPUT_DIR / 'sigil-icon-512x512.png'} (macOS)")
    print(f"  - {OUTPUT_DIR / 'sigil-icon-192x192.png'} (Web PWA)")
    print(f"  - {OUTPUT_DIR / 'sigil-icon-512x512.png'} (Web PWA)")
    print()
    print("You can now use these icons in your application.")

if __name__ == "__main__":
    main()
