@echo off
REM Script to create GitHub repository using GitHub CLI or curl
REM Requires GitHub personal access token with repo scope

echo Creating GitHub repository for SIGIL OS...
echo.

REM Check if gh CLI is available
where gh >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Using GitHub CLI...
    gh repo create sigil-os --public --description "The Post-AI Operating System with Cryptographic Warrant - A new category of computing where intelligence is the substrate and every act of cognition bears a sigil — a verifiable mark of provenance, authorization, and reversibility."
    if %ERRORLEVEL% EQU 0 (
        echo Repository created successfully!
        echo.
        echo Now pushing code...
        cd /d "%~dp0sigil-os"
        git remote set-url origin https://github.com/fuzzynetwork1989-alt/sigil-os.git
        git push -u origin main
        echo.
        echo Done! Repository at: https://github.com/fuzzynetwork1989-alt/sigil-os
    ) else (
        echo Failed to create repository with gh CLI
    )
) else (
    echo GitHub CLI not found.
    echo.
    echo To create the repository manually:
    echo 1. Go to https://github.com/new
    echo 2. Repository name: sigil-os
    echo 3. Description: The Post-AI Operating System with Cryptographic Warrant
    echo 4. Make it Public
    echo 5. Uncheck all boxes (README, .gitignore, license)
    echo 6. Click Create repository
    echo.
    echo Then run these commands:
    echo cd sigil-os
    echo git remote set-url origin https://github.com/fuzzynetwork1989-alt/sigil-os.git
    echo git push -u origin main
)

pause
