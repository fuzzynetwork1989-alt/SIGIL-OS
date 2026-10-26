//! Capability Layer - SCA-1R capability-based security

use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::sync::Arc;
use tokio::sync::RwLock;
use uuid::Uuid;

/// SCA-1R Capabilities
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum Capability {
    MemoryRead,
    MemoryWrite,
    MemoryDelete,
    MissionCreate,
    MissionUpdate,
    RoomAccess,
    VoiceAccess,
    AvatarControl,
    SpatialAccess,
    ToolExecution,
    Admin,
}

/// Capability Manager - manages user capabilities
pub struct CapabilityManager {
    user_capabilities: Arc<RwLock<HashMap<Uuid, HashSet<Capability>>>>,
}

impl CapabilityManager {
    /// Create a new capability manager
    pub async fn new() -> Result<Self> {
        Ok(Self {
            user_capabilities: Arc::new(RwLock::new(HashMap::new())),
        })
    }

    /// Check if user has a capability
    pub async fn check_capability(&self, user_id: Uuid, capability: Capability) -> Result<bool> {
        let capabilities = self.user_capabilities.read().await;
        Ok(capabilities.get(&user_id)
            .map(|caps| caps.contains(&capability))
            .unwrap_or(false))
    }

    /// Grant a capability to a user
    pub async fn grant_capability(&self, user_id: Uuid, capability: Capability) -> Result<()> {
        let mut capabilities = self.user_capabilities.write().await;
        capabilities.entry(user_id)
            .or_insert_with(HashSet::new)
            .insert(capability);
        Ok(())
    }

    /// Revoke a capability from a user
    pub async fn revoke_capability(&self, user_id: Uuid, capability: Capability) -> Result<()> {
        let mut capabilities = self.user_capabilities.write().await;
        if let Some(caps) = capabilities.get_mut(&user_id) {
            caps.remove(&capability);
        }
        Ok(())
    }
}
