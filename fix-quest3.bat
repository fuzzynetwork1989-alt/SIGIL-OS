@echo off
REM SIGIL OS - Quest 3 Build Fix Script
REM Fixes common Quest 3 build and connection issues

echo ========================================
echo SIGIL OS - Quest 3 Build Fixes
echo ========================================
echo.

echo [1/7] Checking ADB installation...
where adb >nul 2>&1
if %errorLevel% neq 0 (
    echo ADB not found in PATH.
    echo Please add Android SDK platform-tools to PATH.
    echo Location: %%LOCALAPPDATA%%\Android\Sdk\platform-tools
    pause
    exit /b 1
)
adb version
echo ADB installed.
echo.

echo [2/7] Checking Quest 3 connection...
adb devices
echo.
echo If your Quest 3 is not listed:
echo 1. Ensure USB-C cable is connected
echo 2. Put on Quest 3 and accept "Allow USB debugging"
echo 3. Try a different USB-C cable
echo 4. Restart Quest 3
echo.

echo [3/7] Checking Rust Android target...
rustup target list | findstr aarch64-linux-android >nul 2>&1
if %errorLevel% neq 0 (
    echo Android target not installed. Installing...
    rustup target add aarch64-linux-android
)
echo Android target installed.
echo.

echo [4/7] Checking cargo-apk...
where cargo-apk >nul 2>&1
if %errorLevel% neq 0 (
    echo cargo-apk not found. Installing...
    cargo install cargo-apk
)
echo cargo-apk installed.
echo.

echo [5/7] Checking NDK configuration...
set ANDROID_NDK_PATH=
if exist "%LOCALAPPDATA%\Android\Sdk\ndk" (
    for /d %%d in ("%LOCALAPPDATA%\Android\Sdk\ndk\*") do (
        set ANDROID_NDK_PATH=%%d
    )
)
if defined ANDROID_NDK_PATH (
    echo NDK found at: %ANDROID_NDK_PATH%
    set ANDROID_NDK_HOME=%ANDROID_NDK_PATH%
    set CARGO_NDK_ANDROID_NDK_HOME=%ANDROID_NDK_PATH%
) else (
    echo WARNING: NDK not found. Please install Android NDK.
    echo Run setup-quest-sdk.bat to install.
)
echo.

echo [6/7] Cleaning build cache...
if exist target\aarch64-linux-android (
    echo Removing Android build cache...
    rmdir /s /q target\aarch64-linux-android
)
echo Build cache cleaned.
echo.

echo [7/7] Building APK...
cargo apk build
if %errorLevel% neq 0 (
    echo ERROR: Build failed.
    echo Common issues:
    echo 1. NDK not configured correctly
    echo 2. Missing dependencies
    echo 3. Platform mismatch
    echo.
    echo Try running: cargo clean && cargo apk build
    pause
    exit /b 1
)
echo Build successful.
echo.

echo ========================================
echo Quest 3 build fixes complete!
echo ========================================
echo.
echo Next steps:
echo 1. Install APK: cargo apk install
echo 2. Or manually install: adb install target\apk\release\sigil-os.apk
echo 3. Launch on Quest 3 from Unknown Sources
echo.
pause
