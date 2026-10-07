//! Dream Weaving - Recursive Self-Evolving Remembrance
//!
//! This module provides the revolutionary cognitive system that enables SIGIL OS
//! to dream, reflect on its own reasoning, and evolve its cognitive pathways.

pub mod dream_state;
pub mod ledger;
pub mod mutation;
pub mod reflection;
pub mod safeguards;

pub use dream_state::{DreamCycle, DreamState, DreamTrigger};
pub use ledger::{EvolutionaryHistory, Generation, ProvenanceChain};
pub use mutation::{CognitivePathway, MutationStrategy, PathwayMutation};
pub use reflection::{BiasDetection, ReflectionPattern, SelfReflection};
pub use safeguards::{EvolutionaryBounds, RollbackMechanism, SafeguardConstraints};

// Export Result type for convenience (alias to DreamResult)
pub use DreamResult as Result;

/// Error types for Dream Weaving operations
#[derive(Debug, thiserror::Error)]
pub enum DreamWeavingError {
    #[error("Dream state not active")]
    DreamNotActive,

    #[error("Reflection failed: {0}")]
    ReflectionFailed(String),

    #[error("Mutation rejected: {0}")]
    MutationRejected(String),

    #[error("Safeguard violation: {0}")]
    SafeguardViolation(String),

    #[error("Rollback failed: {0}")]
    RollbackFailed(String),

    #[error("Ledger error: {0}")]
    LedgerError(String),

    #[error("Serialization error: {0}")]
    Serialization(#[from] serde_json::Error),

    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
}

/// Result type for Dream Weaving operations
pub type DreamResult<T> = std::result::Result<T, DreamWeavingError>;
