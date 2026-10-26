//! Preference Layer - SCA-1R user preference management

use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use uuid::Uuid;

/// User preferences
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserPreferences {
    pub language: String,
    pub theme: String,
    pub notifications_enabled: bool,
    pub privacy_level: String,
    pub custom: HashMap<String, String>,
}

impl Default for UserPreferences {
    fn default() -> Self {
        let mut custom = HashMap::new();
        Self {
            language: "en".to_string(),
            theme: "dark".to_string(),
            notifications_enabled: true,
            privacy_level: "standard".to_string(),
            custom,
        }
    }
}

/// Preference Manager - manages user preferences
pub struct PreferenceManager {
    user_preferences: Arc<RwLock<HashMap<Uuid, UserPreferences>>>,
}

impl PreferenceManager {
    /// Create a new preference manager
    pub async fn new() -> Result<Self> {
        Ok(Self {
            user_preferences: Arc::new(RwLock::new(HashMap::new())),
        })
    }

    /// Get user preferences
    pub async fn get_preferences(&self, user_id: Uuid) -> Result<UserPreferences> {
        let prefs = self.user_preferences.read().await;
        Ok(prefs.get(&user_id).cloned().unwrap_or_default())
    }

    /// Update user preferences
    pub async fn update_preferences(&self, user_id: Uuid, prefs: UserPreferences) -> Result<()> {
        let mut preferences = self.user_preferences.write().await;
        preferences.insert(user_id, prefs);
        Ok(())
    }
}
