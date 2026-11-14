//! Rollback mechanism for reversing cognitive acts
//!
//! This module provides the rollback infrastructure that allows reversing
//! any cognitive act using the rollback key stored in the sigil.

use crate::sigil::{Sigil, SigilKind};
use crate::verification::SigilVerifier;
use chrono::Utc;
use uuid::Uuid;

/// Rollback manager for reversing cognitive acts
pub struct RollbackManager;

impl RollbackManager {
    /// Rollback a belief sigil
    ///
    /// This creates a rollback sigil that marks the belief as inactive
    pub fn rollback_belief(sigil: &Sigil) -> anyhow::Result<Sigil> {
        // Verify the original sigil
        if !SigilVerifier::verify(sigil)? {
            return Err(anyhow::anyhow!("Cannot rollback sigil with invalid signature"));
        }

        // Extract the belief kind
        let belief = match &sigil.kind {
            SigilKind::Belief { .. } => {
                // Clone the belief and mark as rolled back
                if let SigilKind::Belief {
                    proposition,
                    confidence,
                    half_life,
                    ..
                } = &sigil.kind
                {
                    SigilKind::Belief {
                        proposition: proposition.clone(),
                        confidence: *confidence,
                        half_life: half_life.clone(),
                        epistemic_status: crate::sigil::EpistemicStatus::Quarantined,
                    }
                } else {
                    return Err(anyhow::anyhow!("Invalid sigil kind"));
                }
            }
            _ => return Err(anyhow::anyhow!("Not a belief sigil")),
        };

        // Create rollback sigil
        let rollback_sigil = Sigil {
            id: Uuid::new_v4(),
            actor: sigil.actor.clone(),
            kind: belief,
            provenance: crate::sigil::Provenance {
                parents: vec![sigil.id],
                inputs: vec![],
                sources: vec!["rollback".to_string()],
            },
            warrant: None,
            rollback: sigil.rollback.clone(),
            signature: crate::sigil::Ed25519Signature {
                bytes: vec![0u8; 64],
                public_key: vec![0u8; 32],
            },
            issued_at: Utc::now(),
            expires_at: None,
        };

        Ok(rollback_sigil)
    }

    /// Rollback an action sigil
    ///
    /// This creates a rollback sigil that reverses the action
    pub fn rollback_action(sigil: &Sigil) -> anyhow::Result<Sigil> {
        // Verify the original sigil
        if !SigilVerifier::verify(sigil)? {
            return Err(anyhow::anyhow!("Cannot rollback sigil with invalid signature"));
        }

        // Extract the action kind
        let action = match &sigil.kind {
            SigilKind::Action { .. } => {
                if let SigilKind::Action {
                    capability,
                    warrant,
                    predicted_effect,
                } = &sigil.kind
                {
                    SigilKind::Action {
                        capability: capability.clone(),
                        warrant: warrant.clone(),
                        predicted_effect: crate::sigil::Prediction {
                            outcome: format!("REVERSED: {}", predicted_effect.outcome),
                            confidence: 1.0, // Rollback is certain
                        },
                    }
                } else {
                    return Err(anyhow::anyhow!("Invalid sigil kind"));
                }
            }
            _ => return Err(anyhow::anyhow!("Not an action sigil")),
        };

        // Create rollback sigil
        let rollback_sigil = Sigil {
            id: Uuid::new_v4(),
            actor: sigil.actor.clone(),
            kind: action,
            provenance: crate::sigil::Provenance {
                parents: vec![sigil.id],
                inputs: vec![],
                sources: vec!["rollback".to_string()],
            },
            warrant: None,
            rollback: sigil.rollback.clone(),
            signature: crate::sigil::Ed25519Signature {
                bytes: vec![0u8; 64],
                public_key: vec![0u8; 32],
            },
            issued_at: Utc::now(),
            expires_at: None,
        };

        Ok(rollback_sigil)
    }

    /// Rollback a memory sigil
    ///
    /// This creates a rollback sigil that marks the memory as deleted
    pub fn rollback_memory(sigil: &Sigil) -> anyhow::Result<Sigil> {
        // Verify the original sigil
        if !SigilVerifier::verify(sigil)? {
            return Err(anyhow::anyhow!("Cannot rollback sigil with invalid signature"));
        }

        // Extract the memory kind
        let memory = match &sigil.kind {
            SigilKind::Memory { .. } => {
                if let SigilKind::Memory {
                    spatial_anchor,
                    consolidates,
                    ..
                } = &sigil.kind
                {
                    SigilKind::Memory {
                        decay: crate::sigil::Decay { rate: 1.0 }, // Immediate decay
                        spatial_anchor: spatial_anchor.clone(),
                        consolidates: consolidates.clone(),
                    }
                } else {
                    return Err(anyhow::anyhow!("Invalid sigil kind"));
                }
            }
            _ => return Err(anyhow::anyhow!("Not a memory sigil")),
        };

        // Create rollback sigil
        let rollback_sigil = Sigil {
            id: Uuid::new_v4(),
            actor: sigil.actor.clone(),
            kind: memory,
            provenance: crate::sigil::Provenance {
                parents: vec![sigil.id],
                inputs: vec![],
                sources: vec!["rollback".to_string()],
            },
            warrant: None,
            rollback: sigil.rollback.clone(),
            signature: crate::sigil::Ed25519Signature {
                bytes: vec![0u8; 64],
                public_key: vec![0u8; 32],
            },
            issued_at: Utc::now(),
            expires_at: None,
        };

        Ok(rollback_sigil)
    }

    /// Generic rollback method
    ///
    /// This routes to the appropriate rollback method based on sigil kind
    pub fn rollback(sigil: &Sigil) -> anyhow::Result<Sigil> {
        match &sigil.kind {
            SigilKind::Belief { .. } => Self::rollback_belief(sigil),
            SigilKind::Action { .. } => Self::rollback_action(sigil),
            SigilKind::Memory { .. } => Self::rollback_memory(sigil),
            SigilKind::Inference { .. } => {
                Err(anyhow::anyhow!("Rollback for inference not yet implemented"))
            }
            SigilKind::Improvement { .. } => {
                Err(anyhow::anyhow!("Rollback for improvement not yet implemented"))
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::manager::SigilManager;
    use crate::sigil::SigilKind;

    fn create_test_belief_sigil() -> Sigil {
        let device_id = Uuid::new_v4();
        let actor_id = Uuid::new_v4();
        let manager = SigilManager::new(device_id, actor_id);

        manager
            .create_belief_sigil(
                "test proposition".to_string(),
                0.9,
                3600,
                vec![],
                vec![],
                vec![],
            )
            .unwrap()
    }

    #[test]
    fn test_rollback_belief() {
        let sigil = create_test_belief_sigil();
        let rollback_sigil = RollbackManager::rollback_belief(&sigil).unwrap();

        // Verify the rollback sigil references the original
        assert_eq!(rollback_sigil.provenance.parents.len(), 1);
        assert_eq!(rollback_sigil.provenance.parents[0], sigil.id);

        // Verify the belief is marked as quarantined
        if let SigilKind::Belief { epistemic_status, .. } = rollback_sigil.kind {
            assert_eq!(epistemic_status, crate::sigil::EpistemicStatus::Quarantined);
        } else {
            panic!("Expected Belief kind");
        }
    }

    #[test]
    fn test_rollback_invalid_signature() {
        let mut sigil = create_test_belief_sigil();
        // Tamper with the signature
        sigil.signature.bytes[0] = 255;

        let result = RollbackManager::rollback_belief(&sigil);
        assert!(result.is_err());
    }

    #[test]
    fn test_rollback_wrong_kind() {
        let sigil = Sigil {
            id: Uuid::new_v4(),
            actor: crate::sigil::AttestedIdentity {
                device_id: Uuid::new_v4(),
                actor_id: Uuid::new_v4(),
                attestation: vec![],
            },
            kind: SigilKind::Inference {
                model: crate::sigil::ModelTier::OnDeviceSmall,
                criteria: crate::sigil::AnchoredCriterion {
                    id: Uuid::new_v4(),
                    definition: "test".to_string(),
                    anchored_at: Utc::now(),
                },
                trace: crate::sigil::ReasoningTrace { steps: vec![] },
            },
            provenance: crate::sigil::Provenance {
                parents: vec![],
                inputs: vec![],
                sources: vec![],
            },
            warrant: None,
            rollback: crate::sigil::RollbackKey {
                id: Uuid::new_v4(),
                data: vec![],
            },
            signature: crate::sigil::Ed25519Signature {
                bytes: vec![0u8; 64],
                public_key: vec![0u8; 32],
            },
            issued_at: Utc::now(),
            expires_at: None,
        };

        let result = RollbackManager::rollback_belief(&sigil);
        assert!(result.is_err());
    }
}
