//! Reality Validator - Stage 2 of validation pipeline

use crate::{Observation, SourceInfo};
use anyhow::Result;
use std::collections::HashMap;
use tracing::{debug, warn};

pub struct RealityValidator {
    trusted_sources: Vec<String>,
}

impl RealityValidator {
    pub fn new() -> Self {
        Self {
            trusted_sources: vec![
                "user_self".to_string(),
                "verified_document".to_string(),
            ],
        }
    }

    /// Stage 1: Observation capture
    pub fn capture_observation(&self, content: String, source: SourceInfo) -> Observation {
        Observation {
            content,
            source,
            timestamp: chrono::Utc::now(),
        }
    }

    /// Stage 2: Verification
    pub async fn verify(&self, observation: &Observation) -> Result<VerificationResult> {
        let mut result = VerificationResult::default();

        // Check if source is trusted
        if self.is_source_trusted(&observation.source) {
            result.trusted_source = true;
            debug!("Source is trusted");
        } else {
            result.trusted_source = false;
            warn!("Source is not trusted");
        }

        // Check for contradictions (simplified - would compare against memory/world model)
        result.has_contradictions = false;
        result.confidence_sufficient = result.trusted_source;

        Ok(result)
    }

    fn is_source_trusted(&self, source: &SourceInfo) -> bool {
        matches!(source.trust_level, crate::TrustLevel::Trusted)
    }
}

#[derive(Debug, Default)]
pub struct VerificationResult {
    pub trusted_source: bool,
    pub has_contradictions: bool,
    pub confidence_sufficient: bool,
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{KnowledgeSource, TrustLevel};

    #[test]
    fn test_observation_capture() {
        let validator = RealityValidator::new();
        let source = SourceInfo {
            source_type: KnowledgeSource::UserInput,
            trust_level: TrustLevel::Trusted,
            source_id: Some("user_self".to_string()),
            metadata: HashMap::new(),
        };

        let observation = validator.capture_observation("Test content".to_string(), source);
        assert_eq!(observation.content, "Test content");
    }

    #[tokio::test]
    async fn test_trusted_source_verification() {
        let validator = RealityValidator::new();
        let source = SourceInfo {
            source_type: KnowledgeSource::UserInput,
            trust_level: TrustLevel::Trusted,
            source_id: Some("user_self".to_string()),
            metadata: HashMap::new(),
        };

        let observation = validator.capture_observation("Test".to_string(), source);
        let result = validator.verify(&observation).await.unwrap();

        assert!(result.trusted_source);
        assert!(result.confidence_sufficient);
    }

    #[tokio::test]
    async fn test_untrusted_source_verification() {
        let validator = RealityValidator::new();
        let source = SourceInfo {
            source_type: KnowledgeSource::AgentOutput,
            trust_level: TrustLevel::Untrusted,
            source_id: None,
            metadata: HashMap::new(),
        };

        let observation = validator.capture_observation("Test".to_string(), source);
        let result = validator.verify(&observation).await.unwrap();

        assert!(!result.trusted_source);
        assert!(!result.confidence_sufficient);
    }
}
