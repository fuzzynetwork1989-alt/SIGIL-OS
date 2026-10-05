//! Core Sigil type and SigilKind enum
//!
//! The sigil is the unified object in SIGIL OS. Every cognitive act produces one.

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// A sigil is a cryptographically verifiable mark of provenance, authorization, and reversibility.
///
/// Every cognitive act in SIGIL OS produces a sigil. The sigil includes:
/// - Actor identity (device-attested, sender-constrained)
/// - Timestamp
/// - Provenance chain
/// - Warrant (authorization criteria)
/// - Rollback key
/// - Signature
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Sigil {
    /// Unique identifier for this sigil
    pub id: Uuid,
    /// Actor who produced this sigil (device-attested, sender-constrained)
    pub actor: AttestedIdentity,
    /// Kind of cognitive act this sigil represents
    pub kind: SigilKind,
    /// Provenance chain
    pub provenance: Provenance,
    /// Authorization warrant (if applicable)
    pub warrant: Option<Warrant>,
    /// Rollback key for reversing this cognitive act
    pub rollback: RollbackKey,
    /// Cryptographic signature
    pub signature: Ed25519Signature,
    /// When this sigil was issued
    pub issued_at: DateTime<Utc>,
    /// When this sigil expires (if applicable)
    pub expires_at: Option<DateTime<Utc>>,
}

/// Device-attested, sender-constrained identity
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct AttestedIdentity {
    /// Device identifier
    pub device_id: Uuid,
    /// Actor identifier
    pub actor_id: Uuid,
    /// Device attestation signature
    pub attestation: Vec<u8>,
}

/// The kind of cognitive act this sigil represents
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub enum SigilKind {
    /// A belief held by the system
    Belief {
        proposition: String,
        confidence: f64,
        half_life: HalfLife,
        epistemic_status: EpistemicStatus,
    },
    /// An action taken by the system
    Action {
        capability: CapabilityLease,
        warrant: Warrant,
        predicted_effect: Prediction,
    },
    /// A memory stored by the system
    Memory {
        decay: Decay,
        spatial_anchor: Option<Anchor>,
        consolidates: Vec<Uuid>,
    },
    /// An inference produced by a model
    Inference {
        model: ModelTier,
        criteria: AnchoredCriterion,
        trace: ReasoningTrace,
    },
    /// An improvement to the system
    Improvement {
        variant: Variant,
        descent_proof: DescentProof,
        probation_cycles: u32,
    },
}

/// Provenance chain for this sigil
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct Provenance {
    /// Parent sigils this sigil depends on
    pub parents: Vec<Uuid>,
    /// Inputs used to produce this sigil
    pub inputs: Vec<Uuid>,
    /// Data sources
    pub sources: Vec<String>,
}

/// Authorization warrant
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct Warrant {
    /// Criteria that must be satisfied
    pub criteria: String,
    /// When this warrant expires
    pub expires_at: DateTime<Utc>,
    /// Scope of this warrant
    pub scope: WarrantScope,
}

/// Scope of a warrant
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum WarrantScope {
    /// Specific resource
    Resource { resource_id: Uuid },
    /// Capability type
    Capability { capability_type: String },
    /// Global (rare, requires highest approval)
    Global,
}

/// Rollback key for reversing this cognitive act
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct RollbackKey {
    /// Unique rollback identifier
    pub id: Uuid,
    /// Encrypted rollback data
    pub data: Vec<u8>,
}

/// Ed25519 signature
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Ed25519Signature {
    /// Signature bytes
    pub bytes: Vec<u8>,
    /// Public key of signer
    pub public_key: Vec<u8>,
}

/// Half-life of a belief
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct HalfLife {
    /// Half-life duration in seconds
    pub seconds: u64,
}

/// Epistemic status of a belief
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum EpistemicStatus {
    /// Belief is active and trusted
    Active,
    /// Belief is decaying
    Decaying,
    /// Belief is quarantined
    Quarantined,
    /// Belief is contradicted
    Contradicted,
}

/// Capability lease
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct CapabilityLease {
    /// Capability type
    pub capability_type: String,
    /// When the lease expires
    pub expires_at: DateTime<Utc>,
    /// Scope of the lease
    pub scope: CapabilityScope,
}

/// Scope of a capability lease
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum CapabilityScope {
    /// Specific resource
    Resource { resource_id: Uuid },
    /// Resource type
    ResourceType { type_name: String },
}

/// Prediction of effect
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Prediction {
    /// Predicted outcome
    pub outcome: String,
    /// Confidence in prediction
    pub confidence: f64,
}

/// Decay rate for memory
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Decay {
    /// Decay rate
    pub rate: f64,
}

/// Spatial anchor
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Anchor {
    /// Anchor identifier
    pub id: Uuid,
    /// Spatial coordinates
    pub coordinates: (f64, f64, f64),
    /// When the anchor was created
    pub created_at: DateTime<Utc>,
}

/// Model tier
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum ModelTier {
    /// On-device small model
    OnDeviceSmall,
    /// On-device medium model
    OnDeviceMedium,
    /// Cloud large model
    CloudLarge,
}

/// Anchored criterion
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct AnchoredCriterion {
    /// Criterion identifier
    pub id: Uuid,
    /// Criterion definition
    pub definition: String,
    /// When this criterion was anchored
    pub anchored_at: DateTime<Utc>,
}

/// Reasoning trace
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct ReasoningTrace {
    /// Trace steps
    pub steps: Vec<TraceStep>,
}

/// Single step in a reasoning trace
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct TraceStep {
    /// Step identifier
    pub id: Uuid,
    /// Step description
    pub description: String,
    /// Input to this step
    pub input: String,
    /// Output from this step
    pub output: String,
}

/// Variant for improvement
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct Variant {
    /// Variant identifier
    pub id: Uuid,
    /// Variant description
    pub description: String,
}

/// Descent proof for improvement
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct DescentProof {
    /// Proof data
    pub data: Vec<u8>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sigil_creation() {
        let sigil = Sigil {
            id: Uuid::new_v4(),
            actor: AttestedIdentity {
                device_id: Uuid::new_v4(),
                actor_id: Uuid::new_v4(),
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
                id: Uuid::new_v4(),
                data: vec![],
            },
            signature: Ed25519Signature {
                bytes: vec![0u8; 64],
                public_key: vec![0u8; 32],
            },
            issued_at: Utc::now(),
            expires_at: None,
        };

        assert_eq!(sigil.provenance.parents.len(), 0);
    }

    #[test]
    fn test_sigil_serialization() {
        let sigil = Sigil {
            id: Uuid::new_v4(),
            actor: AttestedIdentity {
                device_id: Uuid::new_v4(),
                actor_id: Uuid::new_v4(),
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
                id: Uuid::new_v4(),
                data: vec![],
            },
            signature: Ed25519Signature {
                bytes: vec![0u8; 64],
                public_key: vec![0u8; 32],
            },
            issued_at: Utc::now(),
            expires_at: None,
        };

        let serialized = serde_json::to_string(&sigil).unwrap();
        let deserialized: Sigil = serde_json::from_str(&serialized).unwrap();

        assert_eq!(sigil.id, deserialized.id);
    }
}
