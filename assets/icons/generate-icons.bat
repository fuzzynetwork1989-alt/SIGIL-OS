@echo off
REM SIGIL OS Icon Generator for Windows
REM This script converts SVG to PNG and ICO using ImageMagick
REM Install ImageMagick from: https://imagemagick.org/script/download.php#windows

echo ========================================
echo SIGIL OS Icon Generator
echo ========================================
echo.

REM Check if ImageMagick is installed
where magick >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: ImageMagick not found.
    echo Please install ImageMagick from: https://imagemagick.org/script/download.php#windows
    echo.
    echo Alternative: Use the Python script generate-icons.py
    echo Install dependencies: pip install cairosvg pillow
    echo Then run: python generate-icons.py
    pause
    exit /b 1
)

set ICON_DIR=%~dp0
set PROJECT_ROOT=%ICON_DIR%..\..
set SVG_FILE=%ICON_DIR%sigil-icon.svg

if not exist "%SVG_FILE%" (
    echo ERROR: SVG file not found at %SVG_FILE%
    pause
    exit /b 1
)

echo Generating icons...
echo.

REM Generate PNG files in various sizes
echo Generating PNG files...
magick "%SVG_FILE%" -resize 16x16 "%PROJECT_ROOT%\sigil-icon-16x16.png"
magick "%SVG_FILE%" -resize 32x32 "%PROJECT_ROOT%\sigil-icon-32x32.png"
magick "%SVG_FILE%" -resize 48x48 "%PROJECT_ROOT%\sigil-icon-48x48.png"
magick "%SVG_FILE%" -resize 64x64 "%PROJECT_ROOT%\sigil-icon-64x64.png"
magick "%SVG_FILE%" -resize 128x128 "%PROJECT_ROOT%\sigil-icon-128x128.png"
magick "%SVG_FILE%" -resize 256x256 "%PROJECT_ROOT%\sigil-icon-256x256.png"
magick "%SVG_FILE%" -resize 512x512 "%PROJECT_ROOT%\sigil-icon-512x512.png"
magick "%SVG_FILE%" -resize 192x192 "%PROJECT_ROOT%\sigil-icon-192x192.png"

echo.
echo Generating ICO file...
magick "%PROJECT_ROOT%\sigil-icon-16x16.png" "%PROJECT_ROOT%\sigil-icon-32x32.png" "%PROJECT_ROOT%\sigil-icon-48x48.png" "%PROJECT_ROOT%\sigil-icon-64x64.png" "%PROJECT_ROOT%\sigil-icon-128x128.png" "%PROJECT_ROOT%\sigil-icon-256x256.png" "%PROJECT_ROOT%\sigil-icon.ico"

echo.
echo ========================================
echo Icon generation complete!
echo ========================================
echo.
echo Generated files:
echo   - %PROJECT_ROOT%\sigil-icon.ico (Windows)
echo   - %PROJECT_ROOT%\sigil-icon-256x256.png (Windows exe)
echo   - %PROJECT_ROOT%\sigil-icon-512x512.png (macOS)
echo   - %PROJECT_ROOT%\sigil-icon-192x192.png (Web PWA)
echo   - %PROJECT_ROOT%\sigil-icon-512x512.png (Web PWA)
echo.
echo You can now use these icons in your application.
echo.
pause
