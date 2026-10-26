//! Device Trust Layer - SCA-1R device trust management

use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use uuid::Uuid;

/// Trust level for devices
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum TrustLevel {
    Trusted,
    Known,
    Guest,
    Untrusted,
}

/// Device Trust Manager - manages device trust levels
pub struct DeviceTrustManager {
    device_trust: Arc<RwLock<HashMap<Uuid, TrustLevel>>>,
    user_devices: Arc<RwLock<HashMap<Uuid, Vec<Uuid>>>>,
}

impl DeviceTrustManager {
    /// Create a new device trust manager
    pub async fn new() -> Result<Self> {
        Ok(Self {
            device_trust: Arc::new(RwLock::new(HashMap::new())),
            user_devices: Arc::new(RwLock::new(HashMap::new())),
        })
    }

    /// Get trust level for a device
    pub async fn get_trust_level(&self, device_id: Uuid) -> Result<TrustLevel> {
        let trust = self.device_trust.read().await;
        Ok(trust.get(&device_id).copied().unwrap_or(TrustLevel::Untrusted))
    }

    /// Register a device for a user
    pub async fn register_device(&self, user_id: Uuid, device_id: Uuid) -> Result<()> {
        let mut trust = self.device_trust.write().await;
        let mut user_devices = self.user_devices.write().await;

        trust.insert(device_id, TrustLevel::Known);
        user_devices.entry(user_id).or_insert_with(Vec::new).push(device_id);

        Ok(())
    }

    /// Set device trust level
    pub async fn set_trust_level(&self, device_id: Uuid, level: TrustLevel) -> Result<()> {
        let mut trust = self.device_trust.write().await;
        trust.insert(device_id, level);
        Ok(())
    }
}
