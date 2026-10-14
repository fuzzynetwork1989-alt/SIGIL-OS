@echo off
REM SIGIL OS - Quest SDK Setup Script for Windows
REM This script sets up environment variables for Quest 3 development

echo ========================================
echo SIGIL OS - Quest SDK Setup
echo ========================================
echo.

REM Check if Android SDK is installed
if not exist "%LOCALAPPDATA%\Android\Sdk" (
    echo ERROR: Android SDK not found.
    echo Please install Android Studio first:
    echo https://developer.android.com/studio
    echo.
    echo After installation, open Android Studio and:
    echo 1. Go to Tools -^> SDK Manager
    echo 2. Install Android SDK Platform-Tools
    echo 3. Install Android SDK Build-Tools
    echo 4. Install Android NDK (Side by side)
    echo.
    pause
    exit /b 1
)

REM Set Android SDK environment variables
set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
set ANDROID_NDK_HOME=%ANDROID_HOME%\ndk\25.2.9519653

REM Check if NDK is installed
if not exist "%ANDROID_NDK_HOME%" (
    echo WARNING: Android NDK not found at %ANDROID_NDK_HOME%
    echo Please install NDK via Android Studio SDK Manager.
    echo.
    echo After installation, update the path in this script to match your NDK version.
    echo.
)

REM Set Quest SDK path (user may need to customize)
set QUEST_SDK=C:\OculusMobileSDK

if not exist "%QUEST_SDK%" (
    echo WARNING: Quest SDK not found at %QUEST_SDK%
    echo Please download and extract the Quest SDK:
    echo https://developer.oculus.com/downloads/package/occulus-mobile-sdk/
    echo.
    echo After extraction, update the path in this script.
    echo.
)

REM Set OpenXR path
set OPENXR_SDK=C:\Program Files\OpenXR

if not exist "%OPENXR_SDK%" (
    echo WARNING: OpenXR SDK not found at %OPENXR_SDK%
    echo Please download and install OpenXR:
    echo https://github.com/KhronosGroup/OpenXR-SDK/releases
    echo.
    echo After installation, update the path in this script.
    echo.
)

REM Add to PATH
set PATH=%PATH%;%ANDROID_HOME%\platform-tools
set PATH=%PATH%;%ANDROID_HOME%\emulator
set PATH=%PATH%;%ANDROID_NDK_HOME%
set PATH=%PATH%;%QUEST_SDK%\Tools
set PATH=%PATH%;%OPENXR_SDK%\bin

echo Environment variables set:
echo.
echo ANDROID_HOME=%ANDROID_HOME%
echo ANDROID_NDK_HOME=%ANDROID_NDK_HOME%
echo QUEST_SDK=%QUEST_SDK%
echo OPENXR_SDK=%OPENXR_SDK%
echo.
echo ========================================
echo Quest SDK setup complete!
echo ========================================
echo.
echo Environment variables set for this session.
echo.
echo To make these permanent, add them to System Environment Variables:
echo 1. Press Win+R, type: sysdm.cpl
echo 2. Go to Advanced -^> Environment Variables
echo 3. Add the variables under User variables
echo.
echo Next steps:
echo 1. Enable Developer Mode on your Quest 3
echo 2. Connect Quest 3 via USB-C
echo 3. Run: adb devices
echo 4. Install cargo-apk: cargo install cargo-apk
echo 5. Build Quest app: cargo apk build
echo.
pause
