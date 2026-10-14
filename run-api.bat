@echo off
REM SIGIL OS - API Server Startup Script for Windows
REM This script starts the SIGIL OS API server

echo ========================================
echo SIGIL OS - API Server
echo ========================================
echo.

REM Check if build exists
if not exist "target\release\sigil-api.exe" (
    echo ERROR: sigil-api.exe not found.
    echo Please run build.bat first.
    pause
    exit /b 1
)

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
    echo Configuration file created at %APPDATA%\SIGIL-OS\config.yaml
    echo.
)

echo Starting SIGIL OS API server...
echo.
echo The API server will start on http://127.0.0.1:8080
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
