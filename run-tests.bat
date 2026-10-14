@echo off
REM SIGIL OS - Test Script for Windows
REM This script runs all tests in the SIGIL OS workspace

echo ========================================
echo SIGIL OS - Running Tests
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

echo Running all tests...
echo.

REM Run tests
cargo test --release

if %errorLevel% neq 0 (
    echo.
    echo ERROR: Tests failed.
    echo Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo ========================================
echo All tests passed!
echo ========================================
echo.
pause
