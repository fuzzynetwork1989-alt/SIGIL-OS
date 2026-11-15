@echo off
REM SIGIL OS - Master Build Script for Windows
REM This script builds Desktop, Mobile, and Web UI in sequence

echo ========================================
echo SIGIL OS - Master Build
echo ========================================
echo.
echo This script will build:
echo 1. API Server (Rust)
echo 2. Desktop Client (Tauri)
echo 3. Mobile Client (Expo)
echo 4. Web UI (Static files)
echo.
echo ========================================
echo.

REM Check if Rust is installed
where rustc >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: Rust not found.
    echo Please run install-all.bat to install all prerequisites.
    pause
    exit /b 1
)

REM Check if Node.js is installed
where node >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: Node.js not found.
    echo Please run install-all.bat to install all prerequisites.
    pause
    exit /b 1
)

echo [1/4] Building API Server...
echo.
call build.bat

if %errorLevel% neq 0 (
    echo.
    echo ERROR: API server build failed.
    echo Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo [2/4] Building Desktop Client...
echo.
call build-desktop.bat

if %errorLevel% neq 0 (
    echo.
    echo ERROR: Desktop client build failed.
    echo Please check the error messages above.
    echo.
    echo Continuing with other builds...
)

echo.
echo [3/4] Preparing Mobile Client...
echo.
call build-mobile.bat

if %errorLevel% neq 0 (
    echo.
    echo ERROR: Mobile client preparation failed.
    echo Please check the error messages above.
    echo.
    echo Continuing with Web UI...
)

echo.
echo [4/4] Preparing Web UI...
echo.
call build-web.bat

if %errorLevel% neq 0 (
    echo.
    echo ERROR: Web UI preparation failed.
    echo Please check the error messages above.
)

echo.
echo ========================================
echo Master build complete!
echo ========================================
echo.
echo Build Status:
echo.
echo API Server:
echo - Location: target\release\
echo - Binary: sigil-api.exe
echo - Status: Built successfully
echo.
echo Desktop Client:
echo - Location: desktop-client\src-tauri\target\release\bundle\
echo - Status: Built successfully (if no errors above)
echo.
echo Mobile Client:
echo - Location: sigil-mobile\
echo - Status: Dependencies installed (ready for development)
echo - Production build: Use EAS (eas build --platform all)
echo.
echo Web UI:
echo - Location: web\
echo - Status: Static files ready (no build required)
echo.
echo Next steps:
echo.
echo 1. Run the API server:
echo    - run-api.bat
echo.
echo 2. Run the Desktop client:
echo    - run-desktop.bat
echo.
echo 3. Run the Mobile client:
echo    - run-mobile.bat
echo.
echo 4. Use the Web UI:
echo    - Open web\simple-chat.html in browser
echo.
echo.
echo For production mobile builds:
echo 1. Login to Expo: eas login
echo 2. Build Android: eas build --platform android
echo 3. Build iOS: eas build --platform ios
echo 4. Submit to stores: eas submit --platform all
echo.
pause
