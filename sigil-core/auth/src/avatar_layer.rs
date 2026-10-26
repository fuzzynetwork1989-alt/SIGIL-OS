//! Avatar Layer - SCA-1R avatar profile management

use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use uuid::Uuid;

/// Avatar profile
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AvatarProfile {
    pub avatar_name: String,
    pub style: String,
    pub skin_tone: String,
    pub eye_color: String,
    pub expression: String,
    pub custom: HashMap<String, String>,
}

impl Default for AvatarProfile {
    fn default() -> Self {
        let mut custom = HashMap::new();
        Self {
            avatar_name: "sigil_default".to_string(),
            style: "default".to_string(),
            skin_tone: "medium".to_string(),
            eye_color: "blue".to_string(),
            expression: "friendly".to_string(),
            custom,
        }
    }
}

/// Avatar Manager - manages user avatar profiles
pub struct AvatarManager {
    user_avatars: Arc<RwLock<HashMap<Uuid, AvatarProfile>>>,
}

impl AvatarManager {
    /// Create a new avatar manager
    pub async fn new() -> Result<Self> {
        Ok(Self {
            user_avatars: Arc::new(RwLock::new(HashMap::new())),
        })
    }

    /// Get user avatar profile
    pub async fn get_profile(&self, user_id: Uuid) -> Result<AvatarProfile> {
        let avatars = self.user_avatars.read().await;
        Ok(avatars.get(&user_id).cloned().unwrap_or_default())
    }

    /// Update user avatar profile
    pub async fn update_profile(&self, user_id: Uuid, profile: AvatarProfile) -> Result<()> {
        let mut avatars = self.user_avatars.write().await;
        avatars.insert(user_id, profile);
        Ok(())
    }
}
