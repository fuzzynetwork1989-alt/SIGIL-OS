@echo off
REM SIGIL OS - Mobile App Installation Script for Windows
REM Fixes common mobile app build issues

echo ========================================
echo SIGIL OS - Mobile App Setup
echo ========================================
echo.

REM Check Node.js
echo [1/6] Checking Node.js...
where node >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: Node.js not found. Please install from https://nodejs.org
    pause
    exit /b 1
)
node --version
echo Node.js installed.
echo.

REM Check npm
echo [2/6] Checking npm...
where npm >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: npm not found
    pause
    exit /b 1
)
npm --version
echo npm installed.
echo.

REM Check Expo CLI
echo [3/6] Checking Expo CLI...
where expo >nul 2>&1
if %errorLevel% neq 0 (
    echo Expo CLI not found. Installing...
    npm install -g expo-cli
    if %errorLevel% neq 0 (
        echo ERROR: Failed to install Expo CLI
        pause
        exit /b 1
    )
)
expo --version
echo Expo CLI installed.
echo.

REM Navigate to mobile directory
echo [4/6] Navigating to mobile directory...
cd sigil-mobile
if %errorLevel% neq 0 (
    echo ERROR: sigil-mobile directory not found
    pause
    exit /b 1
)
echo In sigil-mobile directory.
echo.

REM Install dependencies
echo [5/6] Installing dependencies...
if exist node_modules (
    echo Removing existing node_modules...
    rmdir /s /q node_modules
)
npm install
if %errorLevel% neq 0 (
    echo ERROR: Failed to install dependencies
    echo Trying with legacy peer deps...
    npm install --legacy-peer-deps
)
echo Dependencies installed.
echo.

REM Clear Metro cache
echo [6/6] Clearing Metro cache...
npx expo start --clear
echo Metro cache cleared.
echo.

echo ========================================
echo Mobile app setup complete!
echo ========================================
echo.
echo Next steps:
echo 1. Run: npm start
echo 2. Scan QR code with Expo Go app
echo 3. Or run: eas build --platform android
echo.
pause
