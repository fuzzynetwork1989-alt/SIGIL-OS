@echo off
REM SIGIL OS - Build and Run Script for Windows
REM This script builds and runs SIGIL OS in one step

echo ========================================
echo SIGIL OS - Build and Run
echo ========================================
echo.

REM Check if Rust is installed
where rustc >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: Rust not found.
    echo Please run install-prerequisites.bat first.
    pause
    exit /b 1
)

REM Check if in the correct directory
if not exist "Cargo.toml" (
    echo ERROR: Cargo.toml not found.
    echo Please run this script from the SIGIL OS root directory.
    pause
    exit /b 1
)

echo Step 1: Building SIGIL OS...
echo.

cargo build --release

if %errorLevel% neq 0 (
    echo.
    echo ERROR: Build failed.
    echo Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Build successful!
echo ========================================
echo.

echo Step 2: Starting API server...
echo.

REM Create config directory if it doesn't exist
if not exist "%APPDATA%\SIGIL-OS" mkdir "%APPDATA%\SIGIL-OS"

REM Create default config if it doesn't exist
if not exist "%APPDATA%\SIGIL-OS\config.yaml" (
    echo Creating default configuration...
    (
        echo # SIGIL OS Configuration
        echo.
        echo # Model Configuration
        echo model:
        echo   provider: "local"
        echo   model_name: "qwen-7b"
        echo   model_path: "%USERPROFILE%\.sigil-os\models\qwen-7b"
        echo   download_if_missing: true
        echo.
        echo # UI Configuration
        echo ui:
        echo   theme: "dark"
        echo   icon_pack: "default"
        echo   avatar_style: "realistic"
        echo.
        echo # Dream Weaving Configuration
        echo dream_weaving:
        echo   enabled: true
        echo   max_generations: 10
        echo   auto_approve_mutations: false
        echo.
        echo # Quest 3 Configuration
        echo quest:
        echo   enabled: false
        echo   auto_connect: true
        echo.
        echo # API Configuration
        echo api:
        echo   host: "127.0.0.1"
        echo   port: 8080
        echo   enable_cors: true
    ) > "%APPDATA%\SIGIL-OS\config.yaml"
    echo Configuration file created.
    echo.
)

echo Starting SIGIL OS API server on http://127.0.0.1:8080
echo Press Ctrl+C to stop the server.
echo.

target\release\sigil-api.exe

if %errorLevel% neq 0 (
    echo.
    echo ERROR: API server failed to start.
    echo Please check the error messages above.
    pause
    exit /b 1
)

pause
