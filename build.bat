@echo off
REM SIGIL OS - Build Script for Windows
REM This script builds the entire SIGIL OS workspace

echo ========================================
echo SIGIL OS - Build
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

echo Building SIGIL OS workspace...
echo.

REM Build the workspace
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
echo Binaries created in target\release\:
echo - sigil-api.exe (API server)
echo - sigil-cli.exe (CLI tool)
echo - dream-weaving.exe (Dream Weaving engine)
echo - quest-integration.exe (Quest 3 integration)
echo.
echo Next steps:
echo 1. Run run-api.bat to start the API server
echo 2. Run run-ui.bat to start the UI (when implemented)
echo 3. Or run build-and-run.bat to build and run everything
echo.
pause
