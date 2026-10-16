@echo off
REM SIGIL OS - Fix Common Windows Build Issues
REM This script fixes common build failures

echo ========================================
echo SIGIL OS - Build Issue Fixes
echo ========================================
echo.

echo [1/6] Checking Rust installation...
where rustc >nul 2>&1
if %errorLevel% neq 0 (
    echo Rust not found. Installing...
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    if %errorLevel% neq 0 (
        echo ERROR: Failed to install Rust.
        pause
        exit /b 1
    )
    echo Rust installed.
    for /f "delims=" %%i in ('"%USERPROFILE%\.cargo\bin"') do set PATH=%%i;%PATH%
    setx PATH "%PATH%" /M
    echo Rust added to PATH.
) else (
    rustc --version
    echo Rust installed.
)

echo.
echo [2/6] Checking Visual Studio Build Tools...
where cl >nul 2>&1
if %errorLevel% neq 0 (
    echo Visual Studio Build Tools not found.
    echo Installing via winget...
    winget install Microsoft.VisualStudio.2022.BuildTools --accept-package-agreements --accept-source-agreements --override "--wait --passive --add Microsoft.VisualStudio.Workload.VCTools;includeRecommended"
    if %errorLevel% neq 0 (
        echo WARNING: Build tools installation failed.
        echo Please install manually from:
        echo https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022
    )
) else (
    echo Visual Studio Build Tools installed.
)

echo.
echo [3/6] Cleaning build cache...
if exist target (
    echo Removing target directory...
    rmdir /s /q target
    echo Build cache cleaned.
) else (
    echo No build cache to clean.
)

echo.
echo [4/6] Updating Rust toolchain...
rustup update
rustup self update

echo.
echo [5/6] Checking for port conflicts...
netstat -ano | findstr :8080 >nul 2>&1
if %errorLevel% equ 0 (
    echo WARNING: Port 8080 is in use.
    echo Attempting to free the port...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do (
        taskkill /F /PID %%a >nul 2>&1
        echo Killed process %%a using port 8080.
    )
) else (
    echo Port 8080 is available.
)

echo.
echo [6/6] Verifying build environment...
cargo --version
rustc --version
git --version

echo.
echo ========================================
echo Build issues fixed!
echo ========================================
echo.
echo Next steps:
echo 1. Run build-and-run.bat to build and run SIGIL OS
echo 2. If build still fails, run: cargo clean && cargo build
echo.
pause
