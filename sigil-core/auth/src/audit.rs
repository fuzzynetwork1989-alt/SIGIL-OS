//! Audit Layer - SCA-1R audit logging

use anyhow::Result;
use chrono::Utc;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::RwLock;
use uuid::Uuid;

use super::capability::Capability;

/// Audit event
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuditEvent {
    pub id: Uuid,
    pub user_id: Uuid,
    pub event_type: AuditEventType,
    pub timestamp: chrono::DateTime<chrono::Utc>,
    pub details: String,
}

/// Audit event type
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AuditEventType {
    Registration,
    Authentication,
    Logout,
    CapabilityGrant,
    CapabilityRevoke,
    DeviceRegistration,
    PreferenceUpdate,
    AvatarUpdate,
}

/// Audit Manager - logs all identity-related events
pub struct AuditManager {
    audit_log: Arc<RwLock<Vec<AuditEvent>>>,
}

impl AuditManager {
    /// Create a new audit manager
    pub async fn new() -> Result<Self> {
        Ok(Self {
            audit_log: Arc::new(RwLock::new(Vec::new())),
        })
    }

    /// Log registration
    pub async fn log_registration(&self, user_id: Uuid) -> Result<()> {
        self.log_event(user_id, AuditEventType::Registration, "User registered".to_string()).await
    }

    /// Log authentication
    pub async fn log_authentication(&self, user_id: Uuid) -> Result<()> {
        self.log_event(user_id, AuditEventType::Authentication, "User authenticated".to_string()).await
    }

    /// Log logout
    pub async fn log_logout(&self, user_id: Uuid) -> Result<()> {
        self.log_event(user_id, AuditEventType::Logout, "User logged out".to_string()).await
    }

    /// Log capability grant
    pub async fn log_capability_grant(&self, user_id: Uuid, capability: Capability) -> Result<()> {
        self.log_event(user_id, AuditEventType::CapabilityGrant, format!("Granted capability: {:?}", capability)).await
    }

    /// Log device registration
    pub async fn log_device_registration(&self, user_id: Uuid, device_id: Uuid) -> Result<()> {
        self.log_event(user_id, AuditEventType::DeviceRegistration, format!("Device registered: {}", device_id)).await
    }

    /// Log preference update
    pub async fn log_preference_update(&self, user_id: Uuid) -> Result<()> {
        self.log_event(user_id, AuditEventType::PreferenceUpdate, "Preferences updated".to_string()).await
    }

    /// Log avatar update
    pub async fn log_avatar_update(&self, user_id: Uuid) -> Result<()> {
        self.log_event(user_id, AuditEventType::AvatarUpdate, "Avatar profile updated".to_string()).await
    }

    /// Get audit log for a user
    pub async fn get_user_audit_log(&self, user_id: Uuid) -> Result<Vec<AuditEvent>> {
        let log = self.audit_log.read().await;
        Ok(log.iter().filter(|e| e.user_id == user_id).cloned().collect())
    }

    /// Log an audit event
    async fn log_event(&self, user_id: Uuid, event_type: AuditEventType, details: String) -> Result<()> {
        let event = AuditEvent {
            id: Uuid::new_v4(),
            user_id,
            event_type,
            timestamp: Utc::now(),
            details,
        };
        let mut log = self.audit_log.write().await;
        log.push(event);
        Ok(())
    }
}
