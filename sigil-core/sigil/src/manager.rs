//! Sigil Manager for automatic signing and state change tracking
//!
//! This module provides the SigilManager which handles:
//! - Automatic sigil signing on state changes
//! - State change tracking and ledger emission
//! - Rollback key management

use crate::identity::DeviceIdentity;
use crate::rollback::RollbackManager;
use crate::sigil::{
    AnchoredCriterion, AttestedIdentity, DescentProof, Ed25519Signature, ModelTier, Provenance,
    ReasoningTrace, RollbackKey, Sigil, SigilKind, TraceStep, Variant,
};
use crate::signing::{attestation_payload, SigilSigner};
use crate::verification::SigilVerifier;
use chrono::{DateTime, Utc};
use uuid::Uuid;

/// Manager for sigil creation and signing
pub struct SigilManager {
    signer: SigilSigner,
    device_id: Uuid,
    actor_id: Uuid,
}

impl SigilManager {
    /// Create a new sigil manager
    pub fn new(device_id: Uuid, actor_id: Uuid) -> Self {
        Self {
            signer: SigilSigner::new(),
            device_id,
            actor_id,
        }
    }

    /// Create a sigil manager with a specific signer
    pub fn with_signer(signer: SigilSigner, device_id: Uuid, actor_id: Uuid) -> Self {
        Self {
            signer,
            device_id,
            actor_id,
        }
    }

    /// Create a sigil manager backed by a persistent device identity
    ///
    /// Loads (or creates and persists) the device identity at
    /// `identity_path`, giving stable `device_id`/`actor_id` and a stable
    /// signing key across restarts. Returns an error if the identity file
    /// is corrupt — callers must not silently fall back to ephemeral keys
    /// when persistence was requested.
    pub fn load_or_create(identity_path: &std::path::Path) -> anyhow::Result<Self> {
        let identity = DeviceIdentity::load_or_create(identity_path)?;
        let signer = SigilSigner::with_key_pair(identity.key_pair());
        Ok(Self::with_signer(
            signer,
            identity.device_id,
            identity.actor_id,
        ))
    }

    /// Create and sign a belief sigil
    pub fn create_belief_sigil(
        &self,
        proposition: String,
        confidence: f64,
        half_life_seconds: u64,
        parents: Vec<Uuid>,
        inputs: Vec<Uuid>,
        sources: Vec<String>,
    ) -> anyhow::Result<Sigil> {
        let id = Uuid::new_v4();
        let rollback_key = RollbackKey {
            id: Uuid::new_v4(),
            data: vec![], // TODO: Encrypt rollback data
        };

        let mut sigil = Sigil {
            id,
            actor: self.attested_identity()?,
            kind: SigilKind::Belief {
                proposition,
                confidence,
                half_life: crate::sigil::HalfLife {
                    seconds: half_life_seconds,
                },
                epistemic_status: crate::sigil::EpistemicStatus::Active,
            },
            provenance: Provenance {
                parents,
                inputs,
                sources,
            },
            warrant: None,
            rollback: rollback_key,
            signature: Ed25519Signature {
                bytes: vec![0u8; 64],
                public_key: vec![0u8; 32],
            },
            issued_at: Utc::now(),
            expires_at: None,
        };

        // Sign the sigil
        sigil.signature = self.signer.sign(&sigil)?;

        // Verify the signature
        if !SigilVerifier::verify(&sigil)? {
            return Err(anyhow::anyhow!("Signature verification failed"));
        }

        Ok(sigil)
    }

    /// Create and sign an action sigil
    pub fn create_action_sigil(
        &self,
        capability_type: String,
        resource_id: Option<Uuid>,
        warrant_criteria: String,
        warrant_expires_at: DateTime<Utc>,
        predicted_outcome: String,
        prediction_confidence: f64,
        parents: Vec<Uuid>,
        inputs: Vec<Uuid>,
        sources: Vec<String>,
    ) -> anyhow::Result<Sigil> {
        let id = Uuid::new_v4();
        let rollback_key = RollbackKey {
            id: Uuid::new_v4(),
            data: vec![], // TODO: Encrypt rollback data
        };

        let capability_lease = crate::sigil::CapabilityLease {
            capability_type: capability_type.clone(),
            expires_at: warrant_expires_at,
            scope: if let Some(rid) = resource_id {
                crate::sigil::CapabilityScope::Resource { resource_id: rid }
            } else {
                crate::sigil::CapabilityScope::ResourceType {
                    type_name: capability_type.clone(),
                }
            },
        };

        let warrant = crate::sigil::Warrant {
            criteria: warrant_criteria,
            expires_at: warrant_expires_at,
            scope: if let Some(rid) = resource_id {
                crate::sigil::WarrantScope::Resource { resource_id: rid }
            } else {
                crate::sigil::WarrantScope::Capability {
                    capability_type: capability_type.clone(),
                }
            },
        };

        let mut sigil = Sigil {
            id,
            actor: self.attested_identity()?,
            kind: SigilKind::Action {
                capability: capability_lease,
                warrant,
                predicted_effect: crate::sigil::Prediction {
                    outcome: predicted_outcome,
                    confidence: prediction_confidence,
                },
            },
            provenance: Provenance {
                parents,
                inputs,
                sources,
            },
            warrant: None, // Action warrants are embedded in SigilKind
            rollback: rollback_key,
            signature: Ed25519Signature {
                bytes: vec![0u8; 64],
                public_key: vec![0u8; 32],
            },
            issued_at: Utc::now(),
            expires_at: None,
        };

        // Sign the sigil
        sigil.signature = self.signer.sign(&sigil)?;

        // Verify the signature
        if !SigilVerifier::verify(&sigil)? {
            return Err(anyhow::anyhow!("Signature verification failed"));
        }

        Ok(sigil)
    }

    /// Create and sign a memory sigil
    pub fn create_memory_sigil(
        &self,
        decay_rate: f64,
        spatial_anchor: Option<(f64, f64, f64)>,
        consolidates: Vec<Uuid>,
        parents: Vec<Uuid>,
        inputs: Vec<Uuid>,
        sources: Vec<String>,
    ) -> anyhow::Result<Sigil> {
        let id = Uuid::new_v4();
        let rollback_key = RollbackKey {
            id: Uuid::new_v4(),
            data: vec![], // TODO: Encrypt rollback data
        };

        let anchor = spatial_anchor.map(|coords| crate::sigil::Anchor {
            id: Uuid::new_v4(),
            coordinates: coords,
            created_at: Utc::now(),
        });

        let mut sigil = Sigil {
            id,
            actor: self.attested_identity()?,
            kind: SigilKind::Memory {
                decay: crate::sigil::Decay { rate: decay_rate },
                spatial_anchor: anchor,
                consolidates,
            },
            provenance: Provenance {
                parents,
                inputs,
                sources,
            },
            warrant: None,
            rollback: rollback_key,
            signature: Ed25519Signature {
                bytes: vec![0u8; 64],
                public_key: vec![0u8; 32],
            },
            issued_at: Utc::now(),
            expires_at: None,
        };

        // Sign the sigil
        sigil.signature = self.signer.sign(&sigil)?;

        // Verify the signature
        if !SigilVerifier::verify(&sigil)? {
            return Err(anyhow::anyhow!("Signature verification failed"));
        }

        Ok(sigil)
    }

    /// Create and sign an inference sigil
    ///
    /// `trace_steps` are `(description, input, output)` triples describing
    /// the reasoning that produced the inference.
    pub fn create_inference_sigil(
        &self,
        model: ModelTier,
        criterion_definition: String,
        trace_steps: Vec<(String, String, String)>,
        parents: Vec<Uuid>,
        inputs: Vec<Uuid>,
        sources: Vec<String>,
    ) -> anyhow::Result<Sigil> {
        let id = Uuid::new_v4();
        let rollback_key = RollbackKey {
            id: Uuid::new_v4(),
            data: vec![], // TODO: Encrypt rollback data
        };

        let trace = ReasoningTrace {
            steps: trace_steps
                .into_iter()
                .map(|(description, input, output)| TraceStep {
                    id: Uuid::new_v4(),
                    description,
                    input,
                    output,
                })
                .collect(),
        };

        let mut sigil = Sigil {
            id,
            actor: self.attested_identity()?,
            kind: SigilKind::Inference {
                model,
                criteria: AnchoredCriterion {
                    id: Uuid::new_v4(),
                    definition: criterion_definition,
                    anchored_at: Utc::now(),
                },
                trace,
            },
            provenance: Provenance {
                parents,
                inputs,
                sources,
            },
            warrant: None,
            rollback: rollback_key,
            signature: Ed25519Signature {
                bytes: vec![0u8; 64],
                public_key: vec![0u8; 32],
            },
            issued_at: Utc::now(),
            expires_at: None,
        };

        sigil.signature = self.signer.sign(&sigil)?;

        if !SigilVerifier::verify(&sigil)? {
            return Err(anyhow::anyhow!("Signature verification failed"));
        }

        Ok(sigil)
    }

    /// Create and sign an improvement sigil
    ///
    /// `descent_proof` carries the evidence that this variant descends from
    /// an approved lineage; `probation_cycles` is the number of evaluation
    /// cycles the improvement must survive before full promotion.
    pub fn create_improvement_sigil(
        &self,
        variant_description: String,
        descent_proof: Vec<u8>,
        probation_cycles: u32,
        parents: Vec<Uuid>,
        inputs: Vec<Uuid>,
        sources: Vec<String>,
    ) -> anyhow::Result<Sigil> {
        let id = Uuid::new_v4();
        let rollback_key = RollbackKey {
            id: Uuid::new_v4(),
            data: vec![], // TODO: Encrypt rollback data
        };

        let mut sigil = Sigil {
            id,
            actor: self.attested_identity()?,
            kind: SigilKind::Improvement {
                variant: Variant {
                    id: Uuid::new_v4(),
                    description: variant_description,
                },
                descent_proof: DescentProof {
                    data: descent_proof,
                },
                probation_cycles,
            },
            provenance: Provenance {
                parents,
                inputs,
                sources,
            },
            warrant: None,
            rollback: rollback_key,
            signature: Ed25519Signature {
                bytes: vec![0u8; 64],
                public_key: vec![0u8; 32],
            },
            issued_at: Utc::now(),
            expires_at: None,
        };

        sigil.signature = self.signer.sign(&sigil)?;

        if !SigilVerifier::verify(&sigil)? {
            return Err(anyhow::anyhow!("Signature verification failed"));
        }

        Ok(sigil)
    }

    /// Build the attested identity for this manager
    ///
    /// The attestation is an Ed25519 signature over the canonical
    /// (device_id, actor_id) payload, produced by this manager's signing key.
    fn attested_identity(&self) -> anyhow::Result<AttestedIdentity> {
        let payload = attestation_payload(&self.device_id, &self.actor_id)?;
        Ok(AttestedIdentity {
            device_id: self.device_id,
            actor_id: self.actor_id,
            attestation: self.signer.sign_bytes(&payload),
        })
    }

    /// Get the public key of this manager
    pub fn public_key(&self) -> Vec<u8> {
        self.signer.public_key_bytes()
    }

    /// Roll back a cognitive act and emit a signed rollback sigil
    ///
    /// Delegates kind routing to `RollbackManager`, then signs and
    /// self-verifies the resulting sigil so every emitted act remains
    /// cryptographically warranted.
    pub fn rollback(&self, sigil: &Sigil) -> anyhow::Result<Sigil> {
        let mut rollback_sigil = RollbackManager::rollback(sigil)?;
        rollback_sigil.signature = self.signer.sign(&rollback_sigil)?;

        if !SigilVerifier::verify(&rollback_sigil)? {
            return Err(anyhow::anyhow!("Rollback signature verification failed"));
        }

        Ok(rollback_sigil)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sigil_manager_creation() {
        let device_id = Uuid::new_v4();
        let actor_id = Uuid::new_v4();
        let manager = SigilManager::new(device_id, actor_id);
        assert_eq!(manager.public_key().len(), 32);
    }

    #[test]
    fn test_create_belief_sigil() {
        let device_id = Uuid::new_v4();
        let actor_id = Uuid::new_v4();
        let manager = SigilManager::new(device_id, actor_id);

        let sigil = manager
            .create_belief_sigil(
                "test proposition".to_string(),
                0.9,
                3600,
                vec![],
                vec![],
                vec![],
            )
            .unwrap();

        assert_eq!(sigil.actor.device_id, device_id);
        assert_eq!(sigil.actor.actor_id, actor_id);
        assert_eq!(sigil.signature.bytes.len(), 64);
        assert_eq!(sigil.signature.public_key.len(), 32);
    }

    #[test]
    fn test_create_action_sigil() {
        let device_id = Uuid::new_v4();
        let actor_id = Uuid::new_v4();
        let manager = SigilManager::new(device_id, actor_id);

        let sigil = manager
            .create_action_sigil(
                "file_write".to_string(),
                Some(Uuid::new_v4()),
                "user_authorized".to_string(),
                Utc::now() + chrono::Duration::hours(1),
                "file_written".to_string(),
                0.95,
                vec![],
                vec![],
                vec![],
            )
            .unwrap();

        assert_eq!(sigil.actor.device_id, device_id);
        assert_eq!(sigil.signature.bytes.len(), 64);
    }

    #[test]
    fn test_create_memory_sigil() {
        let device_id = Uuid::new_v4();
        let actor_id = Uuid::new_v4();
        let manager = SigilManager::new(device_id, actor_id);

        let sigil = manager
            .create_memory_sigil(0.1, Some((1.0, 2.0, 3.0)), vec![], vec![], vec![], vec![])
            .unwrap();

        assert_eq!(sigil.actor.device_id, device_id);
        assert_eq!(sigil.signature.bytes.len(), 64);
    }

    #[test]
    fn test_attestation_verifies() {
        let device_id = Uuid::new_v4();
        let actor_id = Uuid::new_v4();
        let manager = SigilManager::new(device_id, actor_id);

        let sigil = manager
            .create_belief_sigil(
                "attested proposition".to_string(),
                0.9,
                3600,
                vec![],
                vec![],
                vec![],
            )
            .unwrap();

        assert!(!sigil.actor.attestation.is_empty());
        assert!(SigilVerifier::verify_attestation(&sigil).unwrap());
        assert!(SigilVerifier::verify(&sigil).unwrap());
    }

    #[test]
    fn test_attestation_fails_on_tampered_identity() {
        let device_id = Uuid::new_v4();
        let actor_id = Uuid::new_v4();
        let manager = SigilManager::new(device_id, actor_id);

        let mut sigil = manager
            .create_belief_sigil(
                "attested proposition".to_string(),
                0.9,
                3600,
                vec![],
                vec![],
                vec![],
            )
            .unwrap();

        sigil.actor.device_id = Uuid::new_v4();
        assert!(!SigilVerifier::verify_attestation(&sigil).unwrap());
    }

    #[test]
    fn test_rollback_produces_signed_sigil() {
        let device_id = Uuid::new_v4();
        let actor_id = Uuid::new_v4();
        let manager = SigilManager::new(device_id, actor_id);

        let sigil = manager
            .create_belief_sigil("rollback me".to_string(), 0.9, 3600, vec![], vec![], vec![])
            .unwrap();

        let rollback_sigil = manager.rollback(&sigil).unwrap();

        assert!(SigilVerifier::verify(&rollback_sigil).unwrap());
        assert!(SigilVerifier::verify_attestation(&rollback_sigil).unwrap());
        assert_eq!(rollback_sigil.provenance.parents, vec![sigil.id]);
        assert_ne!(rollback_sigil.id, sigil.id);
    }

    #[test]
    fn test_rollback_action_and_memory_signed() {
        let device_id = Uuid::new_v4();
        let actor_id = Uuid::new_v4();
        let manager = SigilManager::new(device_id, actor_id);

        let action = manager
            .create_action_sigil(
                "file_write".to_string(),
                Some(Uuid::new_v4()),
                "user_authorized".to_string(),
                Utc::now() + chrono::Duration::hours(1),
                "file_written".to_string(),
                0.95,
                vec![],
                vec![],
                vec![],
            )
            .unwrap();
        assert!(SigilVerifier::verify(&manager.rollback(&action).unwrap()).unwrap());

        let memory = manager
            .create_memory_sigil(0.1, Some((1.0, 2.0, 3.0)), vec![], vec![], vec![], vec![])
            .unwrap();
        assert!(SigilVerifier::verify(&manager.rollback(&memory).unwrap()).unwrap());
    }

    #[test]
    fn test_create_inference_sigil() {
        let manager = SigilManager::new(Uuid::new_v4(), Uuid::new_v4());

        let sigil = manager
            .create_inference_sigil(
                crate::sigil::ModelTier::OnDeviceSmall,
                "answer_quality".to_string(),
                vec![(
                    "retrieve".to_string(),
                    "query".to_string(),
                    "context".to_string(),
                )],
                vec![],
                vec![],
                vec!["test".to_string()],
            )
            .unwrap();

        assert!(matches!(sigil.kind, SigilKind::Inference { .. }));
        assert!(SigilVerifier::verify(&sigil).unwrap());
        assert!(SigilVerifier::verify_attestation(&sigil).unwrap());
    }

    #[test]
    fn test_create_improvement_sigil() {
        let manager = SigilManager::new(Uuid::new_v4(), Uuid::new_v4());

        let sigil = manager
            .create_improvement_sigil(
                "better_router".to_string(),
                b"descent".to_vec(),
                5,
                vec![],
                vec![],
                vec![],
            )
            .unwrap();

        assert!(matches!(sigil.kind, SigilKind::Improvement { .. }));
        assert!(SigilVerifier::verify(&sigil).unwrap());
        assert!(SigilVerifier::verify_attestation(&sigil).unwrap());
    }
}
