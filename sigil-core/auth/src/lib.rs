 9use anyhow::Result;
use async_trait::async_trait;
use chrono::{DateTime, Utc, Duration};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use uuid::Uuid;

pub mod authentication;
pub mod session;
pub mod permissions;
pub mod user;
pub mod capability;
pub mod device_trust;
pub mod preferences;
pub mod avatar_layer;
pub mod audit;

use authentication::AuthService;
use session::SessionManager;
use permissions::PermissionManager;
use user::User;

/// SIGIL Identity Vault - SCA-1R compliant identity system
///
/// Replaces API-key-centric systems with identity-based trust.
/// Structure:
/// - Identity Layer
/// - Device Trust Layer
/// - Capability Layer
/// - Security Layer
/// - Preference Layer
/// - Mission Layer
/// - Memory Layer
/// - Avatar Layer
/// - Audit Layer
pub struct IdentityVault {
    auth_service: Arc<AuthService>,
    session_manager: Arc<SessionManager>,
    permission_manager: Arc<PermissionManager>,
    capability_manager: Arc<capability::CapabilityManager>,
    device_trust_manager: Arc<device_trust::DeviceTrustManager>,
    preference_manager: Arc<preferences::PreferenceManager>,
    avatar_manager: Arc<avatar_layer::AvatarManager>,
    audit_manager: Arc<audit::AuditManager>,
}

impl IdentityVault {
    /// Create a new identity vault with all SCA-1R layers
    pub async fn new() -> Result<Self> {
        let auth_service = Arc::new(AuthService::new().await?);
        let session_manager = Arc::new(SessionManager::new().await?);
        let permission_manager = Arc::new(PermissionManager::new().await?);
        let capability_manager = Arc::new(capability::CapabilityManager::new().await?);
        let device_trust_manager = Arc::new(device_trust::DeviceTrustManager::new().await?);
        let preference_manager = Arc::new(preferences::PreferenceManager::new().await?);
        let avatar_manager = Arc::new(avatar_layer::AvatarManager::new().await?);
        let audit_manager = Arc::new(audit::AuditManager::new().await?);

        Ok(Self {
            auth_service,
            session_manager,
            permission_manager,
            capability_manager,
            device_trust_manager,
            preference_manager,
            avatar_manager,
            audit_manager,
        })
    }

    /// Register a new user
    pub async fn register(&self, username: String, password: String) -> Result<Uuid> {
        let user_id = self.auth_service.register(username, password).await?;
        // Audit the registration
        self.audit_manager.log_registration(user_id).await?;
        Ok(user_id)
    }

    /// Authenticate a user
    pub async fn authenticate(&self, username: String, password: String) -> Result<String> {
        let user = self.auth_service.authenticate(username, password).await?;
        let session_token = self.session_manager.create_session(user.id).await?;
        // Audit the authentication
        self.audit_manager.log_authentication(user.id).await?;
        Ok(session_token)
    }

    /// Verify a session token
    pub async fn verify_session(&self, token: &str) -> Result<Uuid> {
        self.session_manager.verify_session(token).await
    }

    /// Check user capabilities (SCA-1R capability-based security)
    pub async fn check_capability(&self, user_id: Uuid, capability: capability::Capability) -> Result<bool> {
        self.capability_manager.check_capability(user_id, capability).await
    }

    /// Grant a capability to a user
    pub async fn grant_capability(&self, user_id: Uuid, capability: capability::Capability) -> Result<()> {
        self.capability_manager.grant_capability(user_id, capability).await?;
        self.audit_manager.log_capability_grant(user_id, capability).await?;
        Ok(())
    }

    /// Check device trust level
    pub async fn check_device_trust(&self, device_id: Uuid) -> Result<device_trust::TrustLevel> {
        self.device_trust_manager.get_trust_level(device_id).await
    }

    /// Register a device for a user
    pub async fn register_device(&self, user_id: Uuid, device_id: Uuid) -> Result<()> {
        self.device_trust_manager.register_device(user_id, device_id).await?;
        self.audit_manager.log_device_registration(user_id, device_id).await?;
        Ok(())
    }

    /// Get user preferences
    pub async fn get_preferences(&self, user_id: Uuid) -> Result<preferences::UserPreferences> {
        self.preference_manager.get_preferences(user_id).await
    }

    /// Update user preferences
    pub async fn update_preferences(&self, user_id: Uuid, prefs: preferences::UserPreferences) -> Result<()> {
        self.preference_manager.update_preferences(user_id, prefs).await?;
        self.audit_manager.log_preference_update(user_id).await?;
        Ok(())
    }

    /// Get user avatar profile
    pub async fn get_avatar_profile(&self, user_id: Uuid) -> Result<avatar_layer::AvatarProfile> {
        self.avatar_manager.get_profile(user_id).await
    }

    /// Update user avatar profile
    pub async fn update_avatar_profile(&self, user_id: Uuid, profile: avatar_layer::AvatarProfile) -> Result<()> {
        self.avatar_manager.update_profile(user_id, profile).await?;
        self.audit_manager.log_avatar_update(user_id).await?;
        Ok(())
    }

    /// Logout user
    pub async fn logout(&self, token: &str) -> Result<()> {
        let user_id = self.session_manager.verify_session(token).await?;
        self.session_manager.invalidate_session(token).await?;
        self.audit_manager.log_logout(user_id).await?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_identity_vault() {
        let vault = IdentityVault::new().await.unwrap();
        assert!(true);
    }
}






























