#!/bin/bash
# SIGIL OS Backup Automation Script
# This script automates daily and hourly backups of critical data

set -e

# Configuration
BACKUP_DIR="/backups"
DATA_DIR="/data"
LOG_FILE="/var/log/sigil-os-backup.log"
NOTIFICATION_WEBHOOK="${SLACK_WEBHOOK:-}"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR/daily"
mkdir -p "$BACKUP_DIR/hourly"
mkdir -p "$BACKUP_DIR/weekly"
mkdir -p "$BACKUP_DIR/logs"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Notification function
notify() {
    local message="$1"
    log "$message"
    if [ -n "$NOTIFICATION_WEBHOOK" ]; then
        curl -X POST "$NOTIFICATION_WEBHOOK" \
            -H 'Content-Type: application/json' \
            -d "{\"text\":\"$message\"}" \
            2>/dev/null || true
    fi
}

# Critical data backup (hourly)
backup_critical() {
    log "Starting critical data backup..."
    local timestamp=$(date +%Y%m%d_%H)
    local backup_file="$BACKUP_DIR/hourly/critical_$timestamp.tar.gz"

    # Backup warrant ledger
    if [ -d "$DATA_DIR/warrants" ]; then
        tar -czf "$backup_file" -C "$DATA_DIR" warrants/ || {
            notify "CRITICAL: Warrant ledger backup failed"
            return 1
        }
        log "Warrant ledger backed up to $backup_file"
    fi

    # Verify backup
    if [ -f "$backup_file" ]; then
        local size=$(stat -f%z "$backup_file" 2>/dev/null || stat -c%s "$backup_file")
        log "Backup size: $size bytes"
        notify "Critical data backup completed successfully"
    else
        notify "CRITICAL: Backup file not created"
        return 1
    fi
}

# Full backup (daily)
backup_full() {
    log "Starting full backup..."
    local timestamp=$(date +%Y%m%d)
    local backup_file="$BACKUP_DIR/daily/full_$timestamp.tar.gz"

    # Backup all critical data
    tar -czf "$backup_file" -C "$DATA_DIR" . || {
        notify "CRITICAL: Full backup failed"
        return 1
    }

    log "Full backup completed: $backup_file"
    notify "Full backup completed successfully"

    # Clean up old daily backups (keep 30 days)
    find "$BACKUP_DIR/daily" -name "full_*.tar.gz" -mtime +30 -delete
    log "Cleaned up old daily backups"
}

# Model weights backup (weekly)
backup_models() {
    log "Starting model weights backup..."
    local timestamp=$(date +%Y%m%d)
    local backup_file="$BACKUP_DIR/weekly/models_$timestamp.tar.gz"

    if [ -d "$DATA_DIR/models" ]; then
        tar -czf "$backup_file" -C "$DATA_DIR" models/ || {
            notify "WARNING: Model weights backup failed"
            return 1
        }
        log "Model weights backed up to $backup_file"
        notify "Model weights backup completed successfully"

        # Clean up old weekly backups (keep 12 weeks)
        find "$BACKUP_DIR/weekly" -name "models_*.tar.gz" -mtime +84 -delete
        log "Cleaned up old weekly backups"
    else
        log "No models directory found, skipping"
    fi
}

# Verify backup integrity
verify_backup() {
    local backup_file="$1"
    log "Verifying backup: $backup_file"

    if [ ! -f "$backup_file" ]; then
        notify "CRITICAL: Backup file not found: $backup_file"
        return 1
    fi

    # Test gzip integrity
    if gzip -t "$backup_file"; then
        log "Backup integrity verified: $backup_file"
        return 0
    else
        notify "CRITICAL: Backup integrity check failed: $backup_file"
        return 1
    fi
}

# Main function
main() {
    local operation="${1:-full}"

    case "$operation" in
        critical)
            backup_critical
            ;;
        full)
            backup_full
            ;;
        models)
            backup_models
            ;;
        verify)
            if [ -n "$2" ]; then
                verify_backup "$2"
            else
                log "Usage: $0 verify <backup_file>"
                exit 1
            fi
            ;;
        all)
            backup_critical
            backup_full
            backup_models
            ;;
        *)
            log "Usage: $0 {critical|full|models|verify|all}"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
