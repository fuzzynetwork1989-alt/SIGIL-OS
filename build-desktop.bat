@echo off
REM SIGIL OS - Desktop Client Build Script for Windows
REM This script builds the Tauri desktop client

echo ========================================
echo SIGIL OS - Desktop Client Build
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: Node.js not found.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: npm not found.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if desktop-client directory exists
if not exist "desktop-client" (
    echo ERROR: desktop-client directory not found.
    echo Please run this script from the SIGIL OS root directory.
    pause
    exit /b 1
)

echo Step 1: Installing dependencies...
echo.
cd desktop-client
call npm install

if %errorLevel% neq 0 (
    echo.
    echo ERROR: npm install failed.
    echo Please check the error messages above.
    cd ..
    pause
    exit /b 1
)

echo.
echo Step 2: Building frontend...
echo.
call npm run build

if %errorLevel% neq 0 (
    echo.
    echo ERROR: Frontend build failed.
    echo Please check the error messages above.
    cd ..
    pause
    exit /b 1
)

echo.
echo Step 3: Building Tauri desktop application...
echo.
call npm run tauri:build

if %errorLevel% neq 0 (
    echo.
    echo ERROR: Tauri build failed.
    echo Please check the error messages above.
    echo.
    echo Common issues:
    echo - Disk space insufficient (need ~5-10 GB free)
    echo - Rust toolchain not installed
    echo - Visual Studio Build Tools not installed
    echo.
    echo To install prerequisites, run install-prerequisites.bat
    cd ..
    pause
    exit /b 1
)

echo.
echo ========================================
echo Desktop build successful!
echo ========================================
echo.
echo Installer location:
echo - Windows: desktop-client\src-tauri\target\release\bundle\msi\
echo - NSIS Setup: desktop-client\src-tauri\target\release\bundle\nsis\
echo.
echo Next steps:
echo 1. Run the installer to install SIGIL OS Desktop
echo 2. Launch SIGIL OS Desktop from Start Menu
echo 3. The desktop app will connect to the API server at localhost:8080
echo.
echo Note: Make sure the API server is running before launching the desktop app.
echo Run run-api.bat to start the API server.
echo.
cd ..
pause
