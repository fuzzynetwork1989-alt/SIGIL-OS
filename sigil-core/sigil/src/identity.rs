//! Persistent device identity for SIGIL OS
//!
//! A `DeviceIdentity` binds a stable `device_id`/`actor_id` pair to an
//! Ed25519 signing key persisted at a configurable path. Without this,
//! every process restart would generate fresh keys and sigils emitted by a
//! previous run could not be verified against a stable device identity.

use std::path::Path;

use ed25519_dalek::{SecretKey, SigningKey, VerifyingKey};
use rand::rngs::OsRng;
use rand::RngCore;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::signing::KeyPair;

/// On-disk identity file format
#[derive(Debug, Serialize, Deserialize)]
struct IdentityFile {
    device_id: Uuid,
    actor_id: Uuid,
    /// Hex-encoded 32-byte Ed25519 secret key
    secret_key: String,
}

/// Stable device + actor identity with a persisted signing key
#[derive(Debug)]
pub struct DeviceIdentity {
    pub device_id: Uuid,
    pub actor_id: Uuid,
    signing_key: SigningKey,
}

impl DeviceIdentity {
    /// Generate a fresh random identity (not persisted)
    pub fn generate() -> Self {
        let mut csprng = OsRng;
        let mut secret = [0u8; 32];
        csprng.fill_bytes(&mut secret);

        Self::from_secret(secret, Uuid::new_v4(), Uuid::new_v4())
    }

    /// Build an identity from raw parts
    fn from_secret(secret: [u8; 32], device_id: Uuid, actor_id: Uuid) -> Self {
        let secret_key = SecretKey::from(secret);
        Self {
            device_id,
            actor_id,
            signing_key: SigningKey::from(&secret_key),
        }
    }

    /// Load an identity from `path`, creating and persisting a new one if
    /// the file does not exist.
    ///
    /// Returns an error on corrupt files or I/O failures — callers must not
    /// silently fall back to ephemeral keys when a path was explicitly
    /// configured.
    pub fn load_or_create(path: &Path) -> anyhow::Result<Self> {
        if path.exists() {
            let contents = std::fs::read_to_string(path)?;
            let file: IdentityFile = serde_json::from_str(&contents)
                .map_err(|e| anyhow::anyhow!("Corrupt identity file {}: {}", path.display(), e))?;

            let secret_bytes = hex::decode(&file.secret_key)
                .map_err(|e| anyhow::anyhow!("Invalid secret key hex in {}: {}", path.display(), e))?;
            let secret: [u8; 32] = secret_bytes
                .try_into()
                .map_err(|_| anyhow::anyhow!("Secret key in {} is not 32 bytes", path.display()))?;

            Ok(Self::from_secret(secret, file.device_id, file.actor_id))
        } else {
            let identity = Self::generate();
            identity.persist(path)?;
            Ok(identity)
        }
    }

    /// Write this identity to `path` (creates parent directories).
    fn persist(&self, path: &Path) -> anyhow::Result<()> {
        if let Some(parent) = path.parent() {
            if !parent.as_os_str().is_empty() {
                std::fs::create_dir_all(parent)?;
            }
        }

        let file = IdentityFile {
            device_id: self.device_id,
            actor_id: self.actor_id,
            secret_key: hex::encode(self.signing_key.to_bytes()),
        };

        std::fs::write(path, serde_json::to_string_pretty(&file)?)?;

        // Best-effort restrictive permissions on Unix; Windows relies on
        // user-profile ACLs.
        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;
            std::fs::set_permissions(path, std::fs::Permissions::from_mode(0o600))?;
        }

        Ok(())
    }

    /// Reconstruct this identity's key pair
    pub fn key_pair(&self) -> KeyPair {
        KeyPair {
            signing_key: self.signing_key.clone(),
            verifying_key: VerifyingKey::from(&self.signing_key),
        }
    }

    /// Public key bytes for this identity
    pub fn public_key_bytes(&self) -> Vec<u8> {
        VerifyingKey::from(&self.signing_key).to_bytes().to_vec()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_generate_identity() {
        let identity = DeviceIdentity::generate();
        assert_eq!(identity.public_key_bytes().len(), 32);
    }

    #[test]
    fn test_load_or_create_roundtrip() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("identity.json");

        let first = DeviceIdentity::load_or_create(&path).unwrap();
        assert!(path.exists());

        let second = DeviceIdentity::load_or_create(&path).unwrap();
        assert_eq!(first.device_id, second.device_id);
        assert_eq!(first.actor_id, second.actor_id);
        assert_eq!(first.public_key_bytes(), second.public_key_bytes());
    }

    #[test]
    fn test_corrupt_identity_file_errors() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("identity.json");
        std::fs::write(&path, "not json").unwrap();

        assert!(DeviceIdentity::load_or_create(&path).is_err());
    }
}
