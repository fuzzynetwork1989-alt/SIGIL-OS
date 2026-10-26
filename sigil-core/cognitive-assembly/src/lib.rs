//! Cognitive Assembly Intelligence - Pillar 09 of SCA-1R Cognitive Architecture
//!
//! This module implements the cognitive assembly engine that creates temporary minds
//! tailored to specific tasks by combining identity, memory, missions, world state,
//! spatial state, active goals, and user intent.
//!
//! # Purpose
//!
//! Every task receives a custom cognition package.
//!
//! # Inputs
//!
//! - Identity
//! - Memory
//! - Missions
//! - World State
//! - Spatial State
//! - Active Goals
//! - User Intent
//!
//! # Output
//!
//! Cognitive Assembly - a temporary mind state for the current task

pub mod assembler;
pub mod cognition_state;
pub mod task_context;
pub mod mind_factory;

pub use assembler::CognitiveAssembler;
pub use cognition_state::CognitionState;
pub use task_context::TaskContext;
pub use mind_factory::MindFactory;

use errors::CognitiveAssemblyError;

/// Main entry point for cognitive assembly
pub struct CognitiveAssemblyEngine {
    assembler: CognitiveAssembler,
    mind_factory: MindFactory,
}

impl CognitiveAssemblyEngine {
    /// Create a new cognitive assembly engine
    pub fn new() -> Result<Self, CognitiveAssemblyError> {
        Ok(Self {
            assembler: CognitiveAssembler::new()?,
            mind_factory: MindFactory::new()?,
        })
    }

    /// Assemble a cognitive state for a task
    pub async fn assemble_cognition(
        &self,
        task_context: TaskContext,
    ) -> Result<CognitionState, CognitiveAssemblyError> {
        self.assembler.assemble(task_context).await
    }

    /// Create a temporary mind for a task
    pub async fn create_mind(
        &self,
        task_context: TaskContext,
    ) -> Result<TemporaryMind, CognitiveAssemblyError> {
        self.mind_factory.create(task_context).await
    }
}

/// A temporary mind created for a specific task
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct TemporaryMind {
    pub id: uuid::Uuid,
    pub task_id: uuid::Uuid,
    pub cognition_state: CognitionState,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub expires_at: chrono::DateTime<chrono::Utc>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_engine_creation() {
        let engine = CognitiveAssemblyEngine::new();
        assert!(engine.is_ok());
    }
}
