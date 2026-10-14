@echo off
REM SIGIL OS - Environment Setup Script for Windows
REM This script sets up environment variables for SIGIL OS development

echo ========================================
echo SIGIL OS - Environment Setup
echo ========================================
echo.

REM Set SIGIL OS environment variables
set SIGIL_OS_HOME=%USERPROFILE%\.sigil-os
set SIGIL_OS_CONFIG=%APPDATA%\SIGIL-OS
set SIGIL_OS_DATA=%LOCALAPPDATA%\SIGIL-OS
set SIGIL_OS_MODELS=%SIGIL_OS_HOME%\models

REM Create directories
echo Creating SIGIL OS directories...
if not exist "%SIGIL_OS_HOME%" mkdir "%SIGIL_OS_HOME%"
if not exist "%SIGIL_OS_CONFIG%" mkdir "%SIGIL_OS_CONFIG%"
if not exist "%SIGIL_OS_DATA%" mkdir "%SIGIL_OS_DATA%"
if not exist "%SIGIL_OS_MODELS%" mkdir "%SIGIL_OS_MODELS%"

echo Directories created:
echo - %SIGIL_OS_HOME%
echo - %SIGIL_OS_CONFIG%
echo - %SIGIL_OS_DATA%
echo - %SIGIL_OS_MODELS%
echo.

REM Set Rust environment (if not already set)
if "%CARGO_HOME%"=="" (
    set CARGO_HOME=%USERPROFILE%\.cargo
    set PATH=%PATH%;%CARGO_HOME%\bin
    echo Added Cargo to PATH
)

echo.
echo ========================================
echo Environment setup complete!
echo ========================================
echo.
echo Environment variables set for this session:
echo SIGIL_OS_HOME=%SIGIL_OS_HOME%
echo SIGIL_OS_CONFIG=%SIGIL_OS_CONFIG%
echo SIGIL_OS_DATA=%SIGIL_OS_DATA%
echo SIGIL_OS_MODELS=%SIGIL_OS_MODELS%
echo.
echo NOTE: These variables are only set for this session.
echo To make them permanent, add them to System Environment Variables.
echo.
echo Next steps:
echo 1. Run build-and-run.bat to build and run SIGIL OS
echo 2. Or run build.bat to build only
echo.
pause
