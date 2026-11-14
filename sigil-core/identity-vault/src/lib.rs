//! Identity Vault - Capability-based security, no API keys

use serde::{Deserialize, Serialize};
use std::collections::{HashMap, HashSet};
use std::sync::{Arc, RwLock};
use uuid::Uuid;
use ed25519_dalek::{SigningKey, VerifyingKey};

/// Capability types for SIGIL
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum Capability {
    MemoryRead,
    MemoryWrite,
    MissionCreate,
    MissionUpdate,
    MissionDelete,
    RoomAccess,
    VoiceAccess,
    SpatialAccess,
    ModelExecute,
    Admin,
}

/// Trust level for devices
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum TrustLevel {
    Trusted,
    Known,
    Guest,
    Untrusted,
}

/// Device information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Device {
    pub id: Uuid,
    pub device_type: String,
    pub trust_level: TrustLevel,
    pub capabilities: HashSet<Capability>,
    pub last_seen: chrono::DateTime<chrono::Utc>,
    pub expires_at: Option<chrono::DateTime<chrono::Utc>>,
}

/// Identity record
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Identity {
    pub id: Uuid,
    pub display_name: String,
    pub trust_level: TrustLevel,
    pub capabilities: HashSet<Capability>,
    pub devices: Vec<Device>,
    pub avatar_profile: AvatarProfile,
    pub public_key: VerifyingKey,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AvatarProfile {
    pub id: String,
    pub appearance: HashMap<String, String>,
    pub behavior_mode: String,
}

pub struct IdentityVault {
    identities: Arc<RwLock<HashMap<Uuid, Identity>>>,
    keypairs: Arc<RwLock<HashMap<Uuid, SigningKey>>>,
}

impl IdentityVault {
    pub fn new() -> Self {
        Self {
            identities: Arc::new(RwLock::new(HashMap::new())),
            keypairs: Arc::new(RwLock::new(HashMap::new())),
        }
    }

    /// Create new identity with keypair
    pub fn create_identity(&self, display_name: String) -> anyhow::Result<(Uuid, Identity, SigningKey)> {
        let id = Uuid::new_v4();
        let signing_key = SigningKey::generate(&mut rand::rngs::OsRng);
        let verifying_key = signing_key.verifying_key();

        let identity = Identity {
            id,
            display_name,
            trust_level: TrustLevel::Trusted,
            capabilities: HashSet::new(),
            devices: vec![],
            avatar_profile: AvatarProfile {
                id: "sigil_default".to_string(),
                appearance: HashMap::new(),
                behavior_mode: "collaborative".to_string(),
            },
            public_key: *verifying_key,
            created_at: chrono::Utc::now(),
        };

        let mut identities = self.identities.write().unwrap();
        identities.insert(id, identity.clone());

        let mut keypairs = self.keypairs.write().unwrap();
        keypairs.insert(id, signing_key);

        Ok((id, identity, signing_key))
    }

    /// Authenticate using public key
    pub fn authenticate(&self, public_key: VerifyingKey) -> anyhow::Result<Identity> {
        let identities = self.identities.read().unwrap();
        
        identities.values()
            .find(|id| id.public_key == public_key)
            .cloned()
            .ok_or_else(|| anyhow::anyhow!("Identity not found"))
    }

    /// Check if identity has capability
    pub fn authorize(&self, identity_id: Uuid, capability: Capability) -> bool {
        let identities = self.identities.read().unwrap();
        
        if let Some(identity) = identities.get(&identity_id) {
            identity.capabilities.contains(&capability)
        } else {
            false
        }
    }

    /// Grant capability to identity
    pub fn grant_capability(&self, identity_id: Uuid, capability: Capability) -> Result<()> {
        let mut identities = self.identities.write().unwrap();
        
        if let Some(identity) = identities.get_mut(&identity_id) {
            identity.capabilities.insert(capability);
            Ok(())
        } else {
            Err(anyhow::anyhow!("Identity not found"))
        }
    }

    /// Revoke capability from identity
    pub fn revoke_capability(&self, identity_id: Uuid, capability: Capability) -> Result<()> {
        let mut identities = self.identities.write().unwrap();
        
        if let Some(identity) = identities.get_mut(&identity_id) {
            identity.capabilities.remove(&capability);
            Ok(())
        } else {
            Err(anyhow::anyhow!("Identity not found"))
        }
    }

    /// Register device for identity
    pub fn register_device(&self, identity_id: Uuid, device: Device) -> Result<()> {
        let mut identities = self.identities.write().unwrap();
        
        if let Some(identity) = identities.get_mut(&identity_id) {
            identity.devices.push(device);
            Ok(())
        } else {
            Err(anyhow::anyhow!("Identity not found"))
        }
    }
}

impl Default for IdentityVault {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_identity_creation() {
        let vault = IdentityVault::new();
        let (id, identity, _secret) = vault.create_identity("Test User".to_string()).unwrap();
        
        assert_eq!(identity.display_name, "Test User");
        assert_eq!(identity.trust_level, TrustLevel::Trusted);
        assert_eq!(id, identity.id);
    }

    #[test]
    fn test_capability_grant_revoke() {
        let vault = IdentityVault::new();
        let (id, _, _) = vault.create_identity("Test".to_string()).unwrap();
        
        vault.grant_capability(id, Capability::MemoryRead).unwrap();
        assert!(vault.authorize(id, Capability::MemoryRead));
        
        vault.revoke_capability(id, Capability::MemoryRead).unwrap();
        assert!(!vault.authorize(id, Capability::MemoryRead));
    }

    #[test]
    fn test_device_registration() {
        let vault = IdentityVault::new();
        let (id, _, _) = vault.create_identity("Test".to_string()).unwrap();
        
        let device = Device {
            id: Uuid::new_v4(),
            device_type: "quest3".to_string(),
            trust_level: TrustLevel::Trusted,
            capabilities: HashSet::new(),
            last_seen: chrono::Utc::now(),
            expires_at: None,
        };
        
        vault.register_device(id, device).unwrap();
        let identities = vault.identities.read().unwrap();
        assert_eq!(identities.get(&id).unwrap().devices.len(), 1);
    }
}
