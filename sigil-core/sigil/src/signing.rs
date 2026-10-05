//! Cryptographic signing infrastructure for sigils
//!
//! This module provides Ed25519 signing capabilities for sigils.

use ed25519_dalek::{SigningKey, VerifyingKey, SecretKey, Signer as Ed25519Signer};
use rand::rngs::OsRng;
use serde::Serialize;

use crate::sigil::{Ed25519Signature, Sigil};

/// Key pair for signing
#[derive(Debug, Clone)]
pub struct KeyPair {
    pub signing_key: SigningKey,
    pub public_key: VerifyingKey,
}

impl KeyPair {
    /// Generate a new random key pair
    pub fn generate() -> Self {
        let mut csprng = OsRng;
        let mut keypair_bytes = [0u8; 64];
        csprng.fill_bytes(&mut keypair_bytes);
        let signing_key = SigningKey::from_keypair_bytes(&keypair_bytes).expect("Invalid keypair bytes");
        let public_key = signing_key.verifying_key();

        Self {
            signing_key,
            public_key,
        }
    }

    /// Get the public key bytes
    pub fn public_key_bytes(&self) -> Vec<u8> {
        self.public_key.to_bytes().to_vec()
    }
}

/// Signer for creating sigil signatures
pub struct SigilSigner {
    key_pair: KeyPair,
}

impl SigilSigner {
    /// Create a new signer with a random key pair
    pub fn new() -> Self {
        Self {
            key_pair: KeyPair::generate(),
        }
    }

    /// Create a signer with a specific key pair
    pub fn with_key_pair(key_pair: KeyPair) -> Self {
        Self { key_pair }
    }

    /// Sign a sigil
    ///
    /// This signs the serialized sigil data (excluding the signature field itself)
    pub fn sign(&self, sigil: &Sigil) -> anyhow::Result<Ed25519Signature> {
        // Create a copy of the sigil without the signature for signing
        let sigil_for_signing = SigilForSigning::from(sigil);
        let serialized = serde_json::to_vec(&sigil_for_signing)?;

        let signature = self.key_pair.signing_key.sign(&serialized);

        Ok(Ed25519Signature {
            bytes: signature.to_bytes().to_vec(),
            public_key: self.key_pair.public_key_bytes(),
        })
    }

    /// Get the public key
    pub fn public_key(&self) -> &VerifyingKey {
        &self.key_pair.public_key
    }
}

/// Sigil representation for signing (excludes signature field)
#[derive(Serialize)]
struct SigilForSigning<'a> {
    id: &'a uuid::Uuid,
    actor: &'a crate::sigil::AttestedIdentity,
    kind: &'a crate::sigil::SigilKind,
    provenance: &'a crate::sigil::Provenance,
    warrant: &'a Option<crate::sigil::Warrant>,
    rollback: &'a crate::sigil::RollbackKey,
    issued_at: &'a chrono::DateTime<chrono::Utc>,
    expires_at: &'a Option<chrono::DateTime<chrono::Utc>>,
}

impl<'a> From<&'a Sigil> for SigilForSigning<'a> {
    fn from(sigil: &'a Sigil) -> Self {
        Self {
            id: &sigil.id,
            actor: &sigil.actor,
            kind: &sigil.kind,
            provenance: &sigil.provenance,
            warrant: &sigil.warrant,
            rollback: &sigil.rollback,
            issued_at: &sigil.issued_at,
            expires_at: &sigil.expires_at,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::sigil::{AttestedIdentity, EpistemicStatus, HalfLife, Provenance, RollbackKey, SigilKind};

    #[test]
    fn test_key_pair_generation() {
        let key_pair = KeyPair::generate();
        let public_key_bytes = key_pair.public_key_bytes();
        assert_eq!(public_key_bytes.len(), 32);
    }

    #[test]
    fn test_signer_creation() {
        let signer = SigilSigner::new();
        let public_key = signer.public_key();
        assert_eq!(public_key.to_bytes().len(), 32);
    }

    #[test]
    fn test_sigil_signing() {
        let signer = SigilSigner::new();

        let sigil = Sigil {
            id: uuid::Uuid::new_v4(),
            actor: AttestedIdentity {
                device_id: uuid::Uuid::new_v4(),
                actor_id: uuid::Uuid::new_v4(),
                attestation: vec![1, 2, 3],
            },
            kind: SigilKind::Belief {
                proposition: "test proposition".to_string(),
                confidence: 0.9,
                half_life: HalfLife { seconds: 3600 },
                epistemic_status: EpistemicStatus::Active,
            },
            provenance: Provenance {
                parents: vec![],
                inputs: vec![],
                sources: vec![],
            },
            warrant: None,
            rollback: RollbackKey {
                id: uuid::Uuid::new_v4(),
                data: vec![],
            },
            signature: Ed25519Signature {
                bytes: vec![0u8; 64],
                public_key: vec![0u8; 32],
            },
            issued_at: chrono::Utc::now(),
            expires_at: None,
        };

        let signature = signer.sign(&sigil).unwrap();
        assert_eq!(signature.bytes.len(), 64);
        assert_eq!(signature.public_key.len(), 32);
    }
}
