@echo off
REM SIGIL OS - Mobile Client Build Script for Windows
REM This script builds the Expo mobile client for Android and iOS

echo ========================================
echo SIGIL OS - Mobile Client Build
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

REM Check if sigil-mobile directory exists
if not exist "sigil-mobile" (
    echo ERROR: sigil-mobile directory not found.
    echo Please run this script from the SIGIL OS root directory.
    pause
    exit /b 1
)

echo Step 1: Installing Expo CLI...
echo.
call npm install -g expo-cli

if %errorLevel% neq 0 (
    echo.
    echo ERROR: Failed to install Expo CLI.
    echo Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo Step 2: Installing mobile dependencies...
echo.
cd sigil-mobile
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
echo Step 3: Checking for EAS CLI...
echo.
where eas >nul 2>&1
if %errorLevel% neq 0 (
    echo EAS CLI not found. Installing...
    call npm install -g eas-cli
    
    if %errorLevel% neq 0 (
        echo.
        echo WARNING: Failed to install EAS CLI.
        echo You can still build locally, but for production builds you'll need EAS.
        echo.
    )
) else (
    echo EAS CLI already installed.
)

echo.
echo ========================================
echo Mobile dependencies installed!
echo ========================================
echo.
echo Next steps:
echo.
echo For local development:
echo 1. Run run-mobile.bat to start the Expo development server
echo 2. Scan the QR code with Expo Go app on your phone
echo 3. Or run: cd sigil-mobile ^&^& npm run android (for Android emulator)
echo 4. Or run: cd sigil-mobile ^&^& npm run ios (for iOS simulator)
echo.
echo For production builds:
echo 1. Login to Expo: eas login
echo 2. Configure app in app.json
echo 3. Build: eas build --platform android
echo 4. Build: eas build --platform ios
echo 5. Submit: eas submit --platform all
echo.
echo Requirements for production builds:
echo - Expo account (free at https://expo.dev)
echo - Android: Google Play Developer account ($25 one-time)
echo - iOS: Apple Developer account ($99/year)
echo - App Store screenshots and metadata
echo - Privacy policy and terms of service
echo.
cd ..
pause
