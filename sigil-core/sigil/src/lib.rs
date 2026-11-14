//! SIGIL OS Core Sigil Library
//!
//! This library provides the core Sigil type and related cryptographic infrastructure
//! for SIGIL OS. Every cognitive act in SIGIL OS produces a sigil — a cryptographically
//! verifiable mark of provenance, authorization, and reversibility.

pub mod identity;
pub mod sigil;
pub mod signing;
pub mod verification;
pub mod manager;
pub mod rollback;

pub use sigil::{Sigil, SigilKind, Ed25519Signature, AttestedIdentity, Provenance, RollbackKey, HalfLife, EpistemicStatus, Prediction, Decay, Anchor, ModelTier, AnchoredCriterion, ReasoningTrace, TraceStep, CapabilityLease, CapabilityScope, Warrant, WarrantScope, Variant, DescentProof};
pub use signing::{KeyPair, SigilSigner};
pub use verification::SigilVerifier;
pub use identity::DeviceIdentity;
pub use manager::SigilManager;
pub use rollback::RollbackManager;
