@echo off
REM SIGIL OS - Complete Installation Script for Windows
REM This script installs everything needed for Desktop, Mobile, and Web UI

echo ========================================
echo SIGIL OS - Complete Installation
echo ========================================
echo.
echo This script will install:
echo 1. Rust toolchain (for API server and Tauri)
echo 2. Git (for version control)
echo 3. Visual Studio Build Tools (for Rust compilation)
echo 4. Node.js (for Desktop, Mobile, and Web UI)
echo 5. pnpm (package manager for workspaces)
echo 6. Expo CLI (for mobile development)
echo 7. Desktop client dependencies
echo 8. Mobile client dependencies
echo 9. Web UI files
echo.
echo ========================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo WARNING: This script may require administrator privileges for some installations.
    echo Some steps may fail without admin rights.
    echo.
    echo Do you want to continue anyway? (Y/N)
    set /p CONTINUE=
    if /i not "%CONTINUE%"=="Y" (
        echo Please right-click and run as Administrator.
        pause
        exit /b 1
    )
    echo.
)

echo [1/9] Installing Rust toolchain...
echo.
call install-prerequisites.bat

if %errorLevel% neq 0 (
    echo.
    echo ERROR: Failed to install Rust prerequisites.
    echo Please run install-prerequisites.bat manually.
    pause
    exit /b 1
)

echo.
echo [2/9] Checking Node.js installation...
echo.
where node >nul 2>&1
if %errorLevel% neq 0 (
    echo Node.js not found. Installing via winget...
    winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
    
    if %errorLevel% neq 0 (
        echo ERROR: Failed to install Node.js via winget.
        echo Please install manually from https://nodejs.org/
        pause
        exit /b 1
    )
    
    echo Node.js installed successfully.
    echo IMPORTANT: Restart your terminal or run: refreshenv
    echo Then run this script again.
    pause
    exit /b 0
) else (
    node --version
    echo Node.js already installed.
)

echo.
echo [3/9] Installing pnpm...
echo.
where pnpm >nul 2>&1
if %errorLevel% neq 0 (
    echo pnpm not found. Installing...
    call npm install -g pnpm
    
    if %errorLevel% neq 0 (
        echo ERROR: Failed to install pnpm.
        echo Please install manually: npm install -g pnpm
        pause
        exit /b 1
    )
    
    echo pnpm installed successfully.
) else (
    pnpm --version
    echo pnpm already installed.
)

echo.
echo [4/9] Installing Expo CLI for mobile development...
echo.
where expo >nul 2>&1
if %errorLevel% neq 0 (
    echo Expo CLI not found. Installing...
    call npm install -g expo-cli
    
    if %errorLevel% neq 0 (
        echo ERROR: Failed to install Expo CLI.
        echo Please install manually: npm install -g expo-cli
        pause
        exit /b 1
    )
    
    echo Expo CLI installed successfully.
) else (
    expo --version
    echo Expo CLI already installed.
)

echo.
echo [5/9] Installing EAS CLI for production mobile builds...
echo.
where eas >nul 2>&1
if %errorLevel% neq 0 (
    echo EAS CLI not found. Installing...
    call npm install -g eas-cli
    
    if %errorLevel% neq 0 (
        echo WARNING: Failed to install EAS CLI.
        echo EAS CLI is required for production mobile builds.
        echo You can install it later with: npm install -g eas-cli
    )
) else (
    eas --version
    echo EAS CLI already installed.
)

echo.
echo [6/9] Installing Desktop client dependencies...
echo.
if exist "desktop-client" (
    cd desktop-client
    call npm install
    
    if %errorLevel% neq 0 (
        echo.
        echo ERROR: Failed to install desktop client dependencies.
        cd ..
        pause
        exit /b 1
    )
    
    echo Desktop client dependencies installed successfully.
    cd ..
) else (
    echo WARNING: desktop-client directory not found.
    echo Skipping desktop client dependencies.
)

echo.
echo [7/9] Installing Mobile client dependencies...
echo.
if exist "sigil-mobile" (
    cd sigil-mobile
    call npm install
    
    if %errorLevel% neq 0 (
        echo.
        echo ERROR: Failed to install mobile client dependencies.
        cd ..
        pause
        exit /b 1
    )
    
    echo Mobile client dependencies installed successfully.
    cd ..
) else (
    echo WARNING: sigil-mobile directory not found.
    echo Skipping mobile client dependencies.
)

echo.
echo [8/9] Verifying Web UI files...
echo.
if exist "web\simple-chat.html" (
    echo Web UI files found.
) else (
    echo WARNING: Web UI files not found in web/ directory.
    echo The Web UI may need to be built separately.
)

echo.
echo [9/9] Verifying installations...
echo.
echo Rust:
rustc --version
cargo --version
echo.
echo Node.js:
node --version
npm --version
echo.
echo Package Managers:
pnpm --version
echo.
echo Mobile Tools:
expo --version
where eas >nul 2>&1
if %errorLevel% equ 0 (
    eas --version
) else (
    echo EAS CLI: Not installed (run: npm install -g eas-cli)
)

echo.
echo ========================================
echo Installation complete!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Build and run the API server:
echo    - Run: build-and-run.bat
echo    - Or: build.bat then run-api.bat
echo.
echo 2. Build and run the Desktop client:
echo    - Build: build-desktop.bat
echo    - Run: run-desktop.bat
echo.
echo 3. Run the Mobile client:
echo    - Run: run-mobile.bat
echo    - Scan QR code with Expo Go app
echo.
echo 4. Use the Web UI:
echo    - Run: run-api.bat to start the API server
echo    - Open web\simple-chat.html in your browser
echo.
echo.
echo For detailed instructions, see:
echo - README.md
echo - SIMPLE_GUIDE.md
echo - DESKTOP_CLIENT_BUILD_REPORT.md
echo.
pause
