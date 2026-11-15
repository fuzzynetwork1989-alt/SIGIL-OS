@echo off
REM SIGIL OS - Web UI Build Script for Windows
REM This script prepares and serves the Web UI

echo ========================================
echo SIGIL OS - Web UI Build
echo ========================================
echo.

REM Check if the web directory exists
if not exist "web" (
    echo ERROR: web directory not found.
    echo Please run this script from the SIGIL OS root directory.
    pause
    exit /b 1
)

echo Step 1: Checking Web UI files...
echo.
if exist "web\simple-chat.html" (
    echo Found: simple-chat.html (Simple web app)
) else (
    echo WARNING: simple-chat.html not found
)

if exist "web\app.html" (
    echo Found: app.html (Full web UI)
) else (
    echo WARNING: app.html not found
)

if exist "web\index.html" (
    echo Found: index.html (Landing page)
) else (
    echo WARNING: index.html not found
)

if exist "web\onboarding.html" (
    echo Found: onboarding.html (Onboarding flow)
) else (
    echo WARNING: onboarding.html not found
)

echo.
echo Step 2: Verifying API server connection requirements...
echo.
echo The Web UI requires the API server to be running.
echo Default API endpoint: http://localhost:8080
echo.
echo To start the API server, run: run-api.bat
echo.

echo ========================================
echo Web UI is ready!
echo ========================================
echo.
echo The Web UI consists of static HTML files that can be:
echo.
echo 1. Opened directly in a browser:
echo    - Double-click web\simple-chat.html
echo    - Double-click web\app.html
echo    - Double-click web\index.html
echo.
echo 2. Served via a local web server:
echo    - Using Python: python -m http.server 8080 --directory web
echo    - Using Node.js: npx serve web -p 8080
echo    - Using VS Code: Live Server extension
echo.
echo 3. Deployed to free hosting:
echo    - GitHub Pages (free)
echo    - Netlify (free)
echo    - Vercel (free)
echo    - Render (free)
echo.
echo For deployment instructions, see:
echo - DEPLOYMENT.md
echo - DEPLOYMENT_QUICKSTART.md
echo - WEBSITE_SETUP_GUIDE.md
echo.
echo Quick Start:
echo 1. Run run-api.bat to start the API server
echo 2. Open web\simple-chat.html in your browser
echo 3. Configure API key in settings
echo 4. Start chatting!
echo.
pause
