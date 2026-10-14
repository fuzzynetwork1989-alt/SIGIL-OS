@echo off
REM SIGIL OS - Prerequisites Installation Script for Windows
REM This script installs all required software for building SIGIL OS

echo ========================================
echo SIGIL OS - Prerequisites Installation
echo ========================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: This script requires administrator privileges.
    echo Please right-click and run as Administrator.
    pause
    exit /b 1
)

echo [1/5] Checking for winget...
where winget >nul 2>&1
if %errorLevel% neq 0 (
    echo WARNING: winget not found. Some installations may fail.
    echo Please install Windows Package Manager from Microsoft Store.
    echo.
) else (
    echo winget found.
)

echo.
echo [2/5] Installing Rust toolchain...
where rustc >nul 2>&1
if %errorLevel% neq 0 (
    echo Rust not found. Installing via winget...
    winget install Rustlang.Rustup --accept-package-agreements --accept-source-agreements
    if %errorLevel% neq 0 (
        echo ERROR: Failed to install Rust.
        echo Please install manually from https://rustup.rs/
        pause
        exit /b 1
    )
    echo Rust installed successfully.
    echo.
    echo Please restart your terminal or run: refreshenv
    echo Then run this script again.
    pause
    exit /b 0
) else (
    rustc --version
    echo Rust already installed.
)

echo.
echo [3/5] Installing Git...
where git >nul 2>&1
if %errorLevel% neq 0 (
    echo Git not found. Installing via winget...
    winget install Git.Git --accept-package-agreements --accept-source-agreements
    if %errorLevel% neq 0 (
        echo ERROR: Failed to install Git.
        pause
        exit /b 1
    )
    echo Git installed successfully.
) else (
    git --version
    echo Git already installed.
)

echo.
echo [4/5] Installing Visual Studio Build Tools...
where cl >nul 2>&1
if %errorLevel% neq 0 (
    echo Visual Studio Build Tools not found.
    echo Installing via winget...
    winget install Microsoft.VisualStudio.2022.BuildTools --accept-package-agreements --accept-source-agreements --override "--wait --passive --add Microsoft.VisualStudio.Workload.VCTools;includeRecommended"
    if %errorLevel% neq 0 (
        echo WARNING: Failed to install Visual Studio Build Tools.
        echo Please install manually from:
        echo https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022
        echo Select "Desktop development with C++" workload.
    )
) else (
    echo Visual Studio Build Tools already installed.
)

echo.
echo [5/5] Verifying installations...
echo.
echo Rust:
rustc --version
cargo --version
echo.
echo Git:
git --version
echo.
echo Build Tools:
where cl >nul 2>&1
if %errorLevel% equ 0 (
    echo Visual Studio Build Tools: Installed
) else (
    echo Visual Studio Build Tools: Not found (may need manual installation)
)

echo.
echo ========================================
echo Prerequisites installation complete!
echo ========================================
echo.
echo Next steps:
echo 1. Restart your terminal or run: refreshenv
echo 2. Run setup-environment.bat to configure environment variables
echo 3. Run build-and-run.bat to build and run SIGIL OS
echo.
pause
