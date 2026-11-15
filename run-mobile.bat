@echo off
REM SIGIL OS - Mobile Client Run Script for Windows
REM This script runs the Expo mobile client in development mode

echo ========================================
echo SIGIL OS - Mobile Client Run
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

REM Check if sigil-mobile directory exists
if not exist "sigil-mobile" (
    echo ERROR: sigil-mobile directory not found.
    echo Please run this script from the SIGIL OS root directory.
    pause
    exit /b 1
)

echo Checking if dependencies are installed...
echo.
if not exist "sigil-mobile\node_modules" (
    echo Dependencies not found. Installing...
    cd sigil-mobile
    call npm install
    
    if %errorLevel% neq 0 (
        echo.
        echo ERROR: Failed to install dependencies.
        echo Please check the error messages above.
        cd ..
        pause
        exit /b 1
    )
    cd ..
    echo Dependencies installed successfully.
    echo.
) else (
    echo Dependencies already installed.
    echo.
)

echo Checking if API server is running...
echo.
curl -s http://localhost:8080/health >nul 2>&1
if %errorLevel% neq 0 (
    echo WARNING: API server not responding on http://localhost:8080
    echo.
    echo Please start the API server first by running: run-api.bat
    echo.
    echo Do you want to start the API server now? (Y/N)
    set /p START_API=
    if /i "%START_API%"=="Y" (
        echo Starting API server...
        start cmd /k "cd /d %CD% && run-api.bat"
        echo Waiting 10 seconds for API server to start...
        timeout /t 10 /nobreak >nul
    ) else (
        echo.
        echo The mobile app will try to connect to the API server anyway.
        echo.
    )
) else (
    echo API server is running on http://localhost:8080
    echo.
)

echo Starting Expo development server...
echo.
cd sigil-mobile
call npm start

if %errorLevel% neq 0 (
    echo.
    echo ERROR: Failed to start Expo development server.
    echo Please check the error messages above.
    echo.
    echo Common issues:
    echo - Port 19000 or 19001 already in use
    echo - Dependencies not installed (run build-mobile.bat first)
    echo - Android/iOS emulator not configured
    echo.
    echo For Android:
    echo 1. Install Android Studio
    echo 2. Create an AVD (Android Virtual Device)
    echo 3. Run: npm run android
    echo.
    echo For iOS:
    echo 1. Install Xcode (macOS only)
    echo 2. Run: npm run ios
    echo.
    cd ..
    pause
    exit /b 1
)

cd ..
