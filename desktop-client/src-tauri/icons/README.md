# Icon Placeholders

This directory should contain the following icon files for Tauri bundling:

- 32x32.png
- 128x128.png
- 128x128@2x.png
- icon.icns (macOS)
- icon.ico (Windows)

For now, use the icon.svg file as reference. Convert SVG to required formats using:
- ImageMagick
- Online converters
- Design tools (Figma, Sketch, etc.)

Quick conversion using ImageMagick (if installed):
```bash
convert icon.svg -resize 32x32 32x32.png
convert icon.svg -resize 128x128 128x128.png
convert icon.svg -resize 256x256 128x128@2x.png
```

For macOS and Windows icons, use specialized tools like:
- macOS: iconutil (built-in)
- Windows: GIMP, IcoFX, or online converters
