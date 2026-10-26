//! Validation Pipeline - orchestrates the complete validation process

use errors::RealityValidationError;
use crate::{
    Observation, ValidatedKnowledge,
    validator::RealityValidator,
    cross_checker::CrossChecker,
    scorer::ConfidenceScorer,
    confidence::ConfidenceLevel,
    storage_rules::StorageDecision,
};

/// Validation Pipeline - Observe → Verify → Cross-Check → Score → Store
pub struct ValidationPipeline {
    validator: RealityValidator,
    cross_checker: CrossChecker,
    scorer: ConfidenceScorer,
}

impl ValidationPipeline {
    /// Create a new validation pipeline
    pub fn new() -> Result<Self, RealityValidationError> {
        Ok(Self {
            validator: RealityValidator::new()?,
            cross_checker: CrossChecker::new()?,
            scorer: ConfidenceScorer::new()?,
        })
    }

    /// Validate an observation through the complete pipeline
    ///
    /// # Pipeline Stages
    ///
    /// 1. **Observe** - Input observation
    /// 2. **Verify** - Check against known knowledge
    /// 3. **Cross-Check** - Validate against multiple sources
    /// 4. **Score** - Calculate confidence score
    /// 5. **Store** - Determine storage location based on confidence
    pub async fn validate(&self, observation: Observation) -> Result<ValidatedKnowledge, RealityValidationError> {
        // Stage 1: Verify
        let verification = self.validator.verify(&observation).await?;

        // Stage 2: Cross-Check
        let cross_check = self.cross_checker.cross_check(&observation).await?;

        // Stage 3: Score
        let confidence = self.scorer.calculate_confidence(&verification, &cross_check)?;

        // Stage 4: Determine confidence level
        let level = ConfidenceLevel::from_score(confidence);

        // Stage 5: Determine storage decision
        let storage_decision = StorageDecision::from_confidence(level);

        // Collect verification sources
        let mut verification_sources = vec![];
        if cross_check.memory_graph_match {
            verification_sources.push("Memory Graph".to_string());
        }
        if cross_check.world_model_match {
            verification_sources.push("World Model".to_string());
        }
        if cross_check.mission_graph_match {
            verification_sources.push("Mission Graph".to_string());
        }
        if cross_check.document_corroboration {
            verification_sources.push("Documents".to_string());
        }
        if cross_check.user_confirmed {
            verification_sources.push("User Confirmation".to_string());
        }
        verification_sources.extend(cross_check.external_sources.clone());

        Ok(ValidatedKnowledge {
            id: uuid::Uuid::new_v4(),
            original_observation: observation,
            confidence,
            level,
            storage_decision,
            verification_sources,
            contradictions: cross_check.contradictions,
            validated_at: chrono::Utc::now(),
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_pipeline_creation() {
        let pipeline = ValidationPipeline::new();
        assert!(pipeline.is_ok());
    }

    #[tokio::test]
    async fn test_pipeline_validation() {
        let pipeline = ValidationPipeline::new().unwrap();

        let observation = Observation {
            id: uuid::Uuid::new_v4(),
            source: crate::ObservationSource::UserInput,
            content: "Test observation".to_string(),
            metadata: serde_json::json!({}),
            timestamp: chrono::Utc::now(),
        };

        let result = pipeline.validate(observation).await;
        assert!(result.is_ok());

        let validated = result.unwrap();
        assert!(validated.confidence >= 0.0 && validated.confidence <= 1.0);
        assert!(validated.storage_decision.allows_storage());
    }
}
