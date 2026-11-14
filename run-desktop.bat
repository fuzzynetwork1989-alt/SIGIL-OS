@echo off
REM SIGIL OS - Desktop Client Run Script for Windows
REM This script runs the Tauri desktop client in development mode

echo ========================================
echo SIGIL OS - Desktop Client Run
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

REM Check if desktop-client directory exists
if not exist "desktop-client" (
    echo ERROR: desktop-client directory not found.
    echo Please run this script from the SIGIL OS root directory.
    pause
    exit /b 1
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
        echo The desktop app will try to connect to the API server anyway.
        echo.
    )
) else (
    echo API server is running on http://localhost:8080
    echo.
)

echo Starting Tauri desktop client in development mode...
echo.
cd desktop-client
call npm run tauri:dev

if %errorLevel% neq 0 (
    echo.
    echo ERROR: Failed to start desktop client.
    echo Please check the error messages above.
    echo.
    echo Common issues:
    echo - Port 5173 already in use (close other dev servers)
    echo - Disk space insufficient (need ~5-10 GB free)
    echo - Dependencies not installed (run build-desktop.bat first)
    echo.
    cd ..
    pause
    exit /b 1
)

cd ..
