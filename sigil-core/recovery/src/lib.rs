use anyhow::Result;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use uuid::Uuid;

pub mod backup;
pub mod disaster_recovery;
pub mod recovery_runbook;
pub mod encryption;
pub mod redundancy;

use backup::BackupManager;
use disaster_recovery::DisasterRecovery;
use recovery_runbook::RecoveryRunbook;
use encryption::BackupEncryption;
use redundancy::RedundancyManager;

/// Recovery system
pub struct RecoverySystem {
    backup_manager: BackupManager,
    disaster_recovery: DisasterRecovery,
    recovery_runbook: RecoveryRunbook,
}

impl RecoverySystem {
    /// Create a new recovery system
    pub async fn new(backup_dir: PathBuf) -> Result<Self> {
        let backup_manager = BackupManager::new(backup_dir.clone()).await?;
        let disaster_recovery = DisasterRecovery::new(backup_dir).await?;
        let recovery_runbook = RecoveryRunbook::new();
        
        Ok(Self {
            backup_manager,
            disaster_recovery,
            recovery_runbook,
        })
    }
    
    /// Create a backup
    pub async fn create_backup(&self) -> Result<Uuid> {
        self.backup_manager.create_backup().await
    }
    
    /// Restore from backup
    pub async fn restore_backup(&self, backup_id: Uuid) -> Result<()> {
        self.disaster_recovery.restore(backup_id).await
    }
    
    /// List available backups
    pub async fn list_backups(&self) -> Result<Vec<BackupInfo>> {
        self.backup_manager.list_backups().await
    }
    
    /// Initiate disaster recovery
    pub async fn initiate_disaster_recovery(&self) -> Result<()> {
        self.disaster_recovery.initiate().await
    }
    
    /// Get recovery runbook
    pub fn get_runbook(&self) -> &RecoveryRunbook {
        &self.recovery_runbook
    }
}

/// Backup information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BackupInfo {
    pub id: Uuid,
    pub created_at: DateTime<Utc>,
    pub size_bytes: u64,
    pub checksum: String,
    pub status: BackupStatus,
}

/// Backup status
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum BackupStatus {
    InProgress,
    Completed,
    Failed,
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[tokio::test]
    async fn test_recovery_system() {
        let backup_dir = PathBuf::from("/tmp/test_backups");
        let recovery_system = RecoverySystem::new(backup_dir).await.unwrap();
        assert!(true);
    }
}
