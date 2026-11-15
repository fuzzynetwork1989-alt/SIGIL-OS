@echo off
REM Quest 3 Deployment Script
REM Deploys SIGIL OS Quest 3 app to Quest 3 device

echo ========================================
echo SIGIL OS Quest 3 Deployment
echo ========================================
echo.

REM Check if ADB is available
adb version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: ADB not found. Please install Android SDK Platform-Tools.
    echo See docs/QUEST_SDK_REQUIREMENTS.md for installation instructions.
    exit /b 1
)

echo [1/5] Checking ADB connection...
adb devices
echo.

REM Check if Quest 3 device is connected
adb devices | findstr "device" >nul
if %errorlevel% neq 0 (
    echo ERROR: No Quest 3 device found.
    echo Please:
    echo 1. Connect Quest 3 via USB-C cable
    echo 2. Enable Developer Mode on Quest 3
    echo 3. Enable USB Debugging on Quest 3
    echo 4. Allow USB debugging when prompted
    exit /b 1
)

echo [2/5] Building APK...
cd /d "%~dp0android"
call gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    echo ERROR: Build failed.
    exit /b 1
)
echo.
echo Build successful: app\build\outputs\apk\debug\app-debug.apk
echo.

echo [3/5] Uninstalling previous version (if exists)...
adb uninstall com.sigilos.quest >nul 2>&1
echo.

echo [4/5] Installing APK...
adb install -r app\build\outputs\apk\debug\app-debug.apk
if %errorlevel% neq 0 (
    echo ERROR: Installation failed.
    exit /b 1
)
echo.
echo Installation successful.
echo.

echo [5/5] Launching app...
adb shell am start -n com.sigilos.quest/.MainActivity
if %errorlevel% neq 0 (
    echo WARNING: Failed to launch app automatically.
    echo Please launch SIGIL OS from your Quest 3 library.
) else (
    echo App launched successfully.
)
echo.

echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Put on your Quest 3 headset
echo 2. Launch SIGIL OS from your library
echo 3. Grant camera and microphone permissions
echo 4. Test voice commands, gestures, and spatial features
echo.

cd /d "%~dp0..\.."
