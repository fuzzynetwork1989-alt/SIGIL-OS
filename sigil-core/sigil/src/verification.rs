//! Verification infrastructure for sigils
//!
//! This module provides Ed25519 signature verification for sigils.

use ed25519_dalek::{VerifyingKey, Signature, Verifier};
use serde::Serialize;

use crate::sigil::Sigil;

/// Verifier for checking sigil signatures
pub struct SigilVerifier;

impl SigilVerifier {
    /// Verify a sigil's signature
    ///
    /// Returns true if the signature is valid, false otherwise
    pub fn verify(sigil: &Sigil) -> anyhow::Result<bool> {
        // Reconstruct the data that was signed
        let sigil_for_verification = SigilForVerification::from(sigil);
        let serialized = serde_json::to_vec(&sigil_for_verification)?;

        // Reconstruct the signature
        let signature_bytes: [u8; 64] = sigil.signature.bytes.clone().try_into()
            .map_err(|_| anyhow::anyhow!("Invalid signature length"))?;
        let signature = Signature::from_bytes(&signature_bytes);

        // Reconstruct the public key
        let public_key_bytes: [u8; 32] = sigil.signature.public_key.clone().try_into()
            .map_err(|_| anyhow::anyhow!("Invalid public key length"))?;
        let public_key = VerifyingKey::from_bytes(&public_key_bytes)
            .map_err(|_| anyhow::anyhow!("Invalid public key"))?;

        // Verify
        match public_key.verify(&serialized, &signature) {
            Ok(()) => Ok(true),
            Err(_) => Ok(false),
        }
    }
}

/// Sigil representation for verification (excludes signature field)
#[derive(Serialize)]
struct SigilForVerification<'a> {
    id: &'a uuid::Uuid,
    actor: &'a crate::sigil::AttestedIdentity,
    kind: &'a crate::sigil::SigilKind,
    provenance: &'a crate::sigil::Provenance,
    warrant: &'a Option<crate::sigil::Warrant>,
    rollback: &'a crate::sigil::RollbackKey,
    issued_at: &'a chrono::DateTime<chrono::Utc>,
    expires_at: &'a Option<chrono::DateTime<chrono::Utc>>,
}

impl<'a> From<&'a Sigil> for SigilForVerification<'a> {
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
    use crate::sigil::{AttestedIdentity, EpistemicStatus, HalfLife, Provenance, RollbackKey, SigilKind, Ed25519Signature};
    use crate::signing::SigilSigner;

    #[test]
    fn test_valid_signature_verification() {
        let signer = SigilSigner::new();

        let mut sigil = Sigil {
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

        // Sign the sigil
        sigil.signature = signer.sign(&sigil).unwrap();

        // Verify
        let verified = SigilVerifier::verify(&sigil).unwrap();
        assert!(verified);
    }

    #[test]
    fn test_invalid_signature_verification() {
        let signer = SigilSigner::new();

        let mut sigil = Sigil {
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

        // Sign the sigil
        sigil.signature = signer.sign(&sigil).unwrap();

        // Tamper with the sigil
        sigil.id = uuid::Uuid::new_v4();

        // Verify (should fail)
        let verified = SigilVerifier::verify(&sigil).unwrap();
        assert!(!verified);
    }
}
