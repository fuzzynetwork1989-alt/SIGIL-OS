# SIGIL OS Icons

This directory contains icon assets for SIGIL OS across all platforms.

## Files

- `sigil-icon.svg` - Source SVG icon (vector format)
- `generate-icons.py` - Python script to generate PNG/ICO from SVG
- `generate-icons.bat` - Windows batch script to generate PNG/ICO from SVG
- `README.md` - This file

## Generated Icons

After running the generation scripts, the following files will be created in the project root:

### Desktop
- `sigil-icon.ico` - Windows icon (multiple sizes embedded)
- `sigil-icon-256x256.png` - Windows executable icon
- `sigil-icon-512x512.png` - macOS app icon

### Linux
- `sigil-icon-32x32.png` - Linux desktop icon
- `sigil-icon-48x48.png` - Linux desktop icon
- `sigil-icon-64x64.png` - Linux desktop icon
- `sigil-icon-128x128.png` - Linux desktop icon
- `sigil-icon-256x256.png` - Linux desktop icon

### Web
- `sigil-icon-192x192.png` - PWA icon (Android Chrome)
- `sigil-icon-512x512.png` - PWA icon (iOS Safari)

### Mobile
- `sigil-icon-192x192.png` - Android app icon
- `sigil-icon-512x512.png` - iOS app icon

## Generating Icons

### Option 1: Python Script (Recommended)

**Prerequisites:**
```bash
pip install cairosvg pillow
```

**Run:**
```bash
cd assets/icons
python generate-icons.py
```

### Option 2: Windows Batch Script

**Prerequisites:**
- Install ImageMagick from https://imagemagick.org/script/download.php#windows

**Run:**
```batch
cd assets/icons
generate-icons.bat
```

### Option 3: Manual Conversion

Use an online SVG to PNG converter or your preferred graphics tool:
- https://cloudconvert.com/svg-to-png
- https://convertio.co/svg-png/
- Adobe Illustrator
- Inkscape

## Icon Design

The SIGIL OS icon features:
- **Gradient:** Purple to blue gradient (modern, tech-focused)
- **Symbol:** Stylized "S" representing SIGIL
- **Cryptographic Elements:** Orbital dots and connection lines representing the cryptographic warrant system
- **Clean Design:** Minimalist and scalable

## Usage

### Windows (Cargo.toml)

Add to your Windows binary:
```toml
[package.metadata.winres]
OriginalFilename = "sigil-api.exe"
FileDescription = "SIGIL OS API Server"
ProductName = "SIGIL OS"
CompanyName = "SIGIL OS Team"
LegalCopyright = "MIT License"
IconFile = "sigil-icon.ico"
```

### macOS (Info.plist)

```xml
<key>CFBundleIconFile</key>
<string>sigil-icon.icns</string>
```

### Linux (.desktop file)

```ini
Icon=/usr/share/icons/hicolor/256x256/apps/sigil-icon.png
```

### Web (index.html)

```html
<link rel="icon" type="image/png" sizes="192x192" href="sigil-icon-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="sigil-icon-512x512.png">
<link rel="apple-touch-icon" sizes="192x192" href="sigil-icon-192x192.png">
<link rel="apple-touch-icon" sizes="512x512" href="sigil-icon-512x512.png">
```

## Customization

To customize the icon:
1. Edit `sigil-icon.svg` in a vector graphics editor (Inkscape, Adobe Illustrator, Figma)
2. Regenerate icons using the scripts above
3. Update icon references in your project

## License

The SIGIL OS icon is part of the SIGIL OS project and is licensed under the MIT License.
