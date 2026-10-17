@echo off
REM SIGIL OS Backup Automation Script (Windows) - Simplified
REM This script automates daily and hourly backups of critical data

setlocal enabledelayedexpansion

REM Configuration
set BACKUP_DIR=C:\backups
set DATA_DIR=C:\data
set LOG_FILE=C:\logs\sigil-os-backup.log
set NOTIFICATION_WEBHOOK=%SLACK_WEBHOOK%

REM Create backup directories if they don't exist
if not exist "%BACKUP_DIR%\daily" mkdir "%BACKUP_DIR%\daily"
if not exist "%BACKUP_DIR%\hourly" mkdir "%BACKUP_DIR%\hourly"
if not exist "%BACKUP_DIR%\weekly" mkdir "%BACKUP_DIR%\weekly"
if not exist "%BACKUP_DIR%\logs" mkdir "%BACKUP_DIR%\logs"

REM Logging function
:log
echo [%date% %time%] %~1 >> "%LOG_FILE%"
echo [%date% %time%] %~1
goto :eof

REM Notification function
:notify
call :log %~1
if defined NOTIFICATION_WEBHOOK (
    curl -X POST "%NOTIFICATION_WEBHOOK%" -H "Content-Type: application/json" -d "{\"text\":\"%~1\"}" 2>nul
)
goto :eof

REM Critical data backup (hourly)
:backup_critical
call :log "Starting critical data backup..."
set backup_file=%BACKUP_DIR%\hourly\critical.tar.gz

REM Backup warrant ledger
if exist "%DATA_DIR%\warrants" (
    tar -czf "%backup_file%" -C "%DATA_DIR%" warrants
    if errorlevel 1 (
        call :notify "CRITICAL: Warrant ledger backup failed"
        exit /b 1
    )
    call :log "Warrant ledger backed up to %backup_file%"
)

REM Verify backup
if exist "%backup_file%" (
    call :log "Backup file created successfully"
    call :notify "Critical data backup completed successfully"
) else (
    call :notify "CRITICAL: Backup file not created"
    exit /b 1
)
goto :eof

REM Full backup (daily)
:backup_full
call :log "Starting full backup..."
set backup_file=%BACKUP_DIR%\daily\full.tar.gz

REM Backup all critical data
tar -czf "%backup_file%" -C "%DATA_DIR%" .
if errorlevel 1 (
    call :notify "CRITICAL: Full backup failed"
    exit /b 1
)

call :log "Full backup completed: %backup_file%"
call :notify "Full backup completed successfully"

REM Clean up old daily backups (keep 30 days)
forfiles /P "%BACKUP_DIR%\daily" /M full_*.tar.gz /D -30 /C "cmd /c del @path" 2>nul
call :log "Cleaned up old daily backups"
goto :eof

REM Model weights backup (weekly)
:backup_models
call :log "Starting model weights backup..."
set backup_file=%BACKUP_DIR%\weekly\models.tar.gz

if exist "%DATA_DIR%\models" (
    tar -czf "%backup_file%" -C "%DATA_DIR%" models
    if errorlevel 1 (
        call :notify "WARNING: Model weights backup failed"
        exit /b 1
    )
    call :log "Model weights backed up to %backup_file%"
    call :notify "Model weights backup completed successfully"

    REM Clean up old weekly backups (keep 12 weeks)
    forfiles /P "%BACKUP_DIR%\weekly" /M models_*.tar.gz /D -84 /C "cmd /c del @path" 2>nul
    call :log "Cleaned up old weekly backups"
) else (
    call :log "No models directory found, skipping"
)
goto :eof

REM Verify backup integrity
:verify_backup
set backup_file=%~1
call :log "Verifying backup: %backup_file%"

if not exist "%backup_file%" (
    call :notify "CRITICAL: Backup file not found: %backup_file%"
    exit /b 1
)

REM Test gzip integrity (if 7-Zip is available)
where 7z >nul 2>&1
if %errorlevel% equ 0 (
    7z t "%backup_file%" >nul
    if errorlevel 1 (
        call :notify "CRITICAL: Backup integrity check failed: %backup_file%"
        exit /b 1
    )
    call :log "Backup integrity verified: %backup_file%"
) else (
    call :log "7-Zip not found, skipping integrity check"
)
goto :eof

REM Main function
:main
set operation=%~1

if "%operation%"=="" set operation=full

if "%operation%"=="critical" (
    call :backup_critical
) else if "%operation%"=="full" (
    call :backup_full
) else if "%operation%"=="models" (
    call :backup_models
) else if "%operation%"=="verify" (
    if "%~2"=="" (
        call :log "Usage: %~0 verify ^<backup_file^>"
        exit /b 1
    )
    call :verify_backup %~2
) else if "%operation%"=="all" (
    call :backup_critical
    call :backup_full
    call :backup_models
) else (
    call :log "Usage: %~0 {critical^|full^|models^|verify^|all}"
    exit /b 1
)

exit /b 0

REM Run main function
call :main %*
