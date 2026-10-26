//! Reality Validation Intelligence - Pillar 08 of SCA-1R Cognitive Architecture
//!
//! This module implements the reality validation pipeline that prevents memory pollution
//! and hallucination persistence by validating knowledge before storage.
//!
//! # Validation Pipeline
//!
//! ```text
//! Observe → Verify → Cross-Check → Score → Store
//! ```
//!
//! # Confidence Levels
//!
//! - VERIFIED (95-100): Permanent Memory
//! - LIKELY_TRUE (80-94): Monitored Memory
//! - TENTATIVE (60-79): Temporary Memory
//! - UNVERIFIED (0-59): Observation Cache
//!
//! # Verification Sources
//!
//! - Memory Graph
//! - World Model
//! - Mission Graph
//! - Documents
//! - User Confirmation
//! - External Sources

pub mod validator;
pub mod cross_checker;
pub mod scorer;
pub mod pipeline;
pub mod confidence;
pub mod storage_rules;

pub use validator::RealityValidator;
pub use cross_checker::CrossChecker;
pub use scorer::ConfidenceScorer;
pub use pipeline::ValidationPipeline;
pub use confidence::{ConfidenceLevel, ConfidenceScore};
pub use storage_rules::StorageDecision;

use errors::RealityValidationError;

/// Main entry point for reality validation
pub struct RealityValidationEngine {
    validator: RealityValidator,
    cross_checker: CrossChecker,
    scorer: ConfidenceScorer,
    pipeline: ValidationPipeline,
}

impl RealityValidationEngine {
    /// Create a new reality validation engine
    pub fn new() -> Result<Self, RealityValidationError> {
        Ok(Self {
            validator: RealityValidator::new()?,
            cross_checker: CrossChecker::new()?,
            scorer: ConfidenceScorer::new()?,
            pipeline: ValidationPipeline::new()?,
        })
    }

    /// Validate an observation through the complete pipeline
    pub async fn validate_observation(
        &self,
        observation: Observation,
    ) -> Result<ValidatedKnowledge, RealityValidationError> {
        self.pipeline.validate(observation).await
    }
}

/// Input observation to be validated
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Observation {
    pub id: uuid::Uuid,
    pub source: ObservationSource,
    pub content: String,
    pub metadata: serde_json::Value,
    pub timestamp: chrono::DateTime<chrono::Utc>,
}

/// Source of the observation
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub enum ObservationSource {
    Conversation,
    Voice,
    Document,
    Website,
    QuestVision,
    UserInput,
    AgentOutput,
    External(String),
}

/// Validated knowledge ready for storage
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct ValidatedKnowledge {
    pub id: uuid::Uuid,
    pub original_observation: Observation,
    pub confidence: ConfidenceScore,
    pub level: ConfidenceLevel,
    pub storage_decision: StorageDecision,
    pub verification_sources: Vec<String>,
    pub contradictions: Vec<String>,
    pub validated_at: chrono::DateTime<chrono::Utc>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_engine_creation() {
        let engine = RealityValidationEngine::new();
        assert!(engine.is_ok());
    }
}
