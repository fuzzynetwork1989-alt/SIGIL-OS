@echo off
REM SIGIL OS Complete Installation Script for Windows
REM This script installs all prerequisites for SIGIL OS

echo ========================================
echo SIGIL OS Complete Installation
echo ========================================
echo.

REM Check administrator privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: This script requires administrator privileges.
    echo Please run as administrator.
    pause
    exit /b 1
)

echo [1/8] Installing Rust...
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
if %errorLevel% neq 0 (
    echo ERROR: Failed to install Rust
    pause
    exit /b 1
)
echo Rust installed successfully.
echo.

echo [2/8] Installing Node.js...
winget install OpenJS.NodeJS.LTS
if %errorLevel% neq 0 (
    echo ERROR: Failed to install Node.js
    echo Please install manually from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js installed successfully.
echo.

echo [3/8] Installing Git...
winget install Git.Git
if %errorLevel% neq 0 (
    echo ERROR: Failed to install Git
    echo Please install manually from https://git-scm.com/
    pause
    exit /b 1
)
echo Git installed successfully.
echo.

echo [4/8] Installing Python...
winget install Python.Python.3.9
if %errorLevel% neq 0 (
    echo ERROR: Failed to install Python
    echo Please install manually from https://python.org/
    pause
    exit /b 1
)
echo Python installed successfully.
echo.

echo [5/8] Installing Python dependencies...
pip install transformers tiktoken
if %errorLevel% neq 0 (
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)
echo Python dependencies installed successfully.
echo.

echo [6/8] Installing Visual Studio Build Tools...
winget install Microsoft.VisualStudio.2022.BuildTools
if %errorLevel% neq 0 (
    echo WARNING: Failed to install VS Build Tools
    echo This may be required for some native modules.
    echo Please install manually if needed.
)
echo.

echo [7/8] Creating SIGIL OS directories...
if not exist "%USERPROFILE%\.sigil-os" mkdir "%USERPROFILE%\.sigil-os"
if not exist "%USERPROFILE%\.sigil-os\models" mkdir "%USERPROFILE%\.sigil-os\models"
if not exist "%APPDATA%\SIGIL-OS" mkdir "%APPDATA%\SIGIL-OS"
echo Directories created successfully.
echo.

echo [8/8] Creating default configuration...
if not exist "%APPDATA%\SIGIL-OS\config.yaml" (
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
) else (
    echo Configuration file already exists.
)
echo.

echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Please restart your terminal to use the newly installed tools.
echo.
echo Next steps:
echo 1. Clone the repository: git clone https://github.com/fuzzynetwork1989-alt/SIGIL-OS.git
echo 2. Navigate to the directory: cd SIGIL-OS
echo 3. Build the project: cargo build --release
echo 4. Run the API server: .\target\release\api.exe
echo 5. Start the web UI: cd desktop-client ^&^& npm run dev
echo.
echo For detailed instructions, see COMPLETE_SETUP_GUIDE.md
echo.
pause
