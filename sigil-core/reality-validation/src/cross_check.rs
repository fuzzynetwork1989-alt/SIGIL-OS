//! Cross Checker - Stage 3 of validation pipeline

use crate::{CrossCheckResult, ValidatedKnowledge};
use anyhow::Result;
use tracing::debug;

pub struct CrossChecker {
    // In a real implementation, this would connect to memory, world model, etc.
}

impl CrossChecker {
    pub fn new() -> Self {
        Self {}
    }

    /// Stage 3: Cross-check against memory, world model, knowledge graph
    pub async fn cross_check(&self, knowledge: &ValidatedKnowledge) -> Result<Vec<CrossCheckResult>> {
        let mut results = Vec::new();

        // Simulate memory graph check
        results.push(CrossCheckResult {
            check_type: "memory_graph".to_string(),
            matched: true,
            confidence: 0.85,
            details: "No contradictions found in memory".to_string(),
        });

        // Simulate world model check
        results.push(CrossCheckResult {
            check_type: "world_model".to_string(),
            matched: true,
            confidence: 0.90,
            details: "Consistent with world model".to_string(),
        });

        // Simulate knowledge graph check
        results.push(CrossCheckResult {
            check_type: "knowledge_graph".to_string(),
            matched: true,
            confidence: 0.88,
            details: "Supported by existing knowledge".to_string(),
        });

        debug!("Cross-check completed with {} results", results.len());
        Ok(results)
    }

    pub fn calculate_cross_check_confidence(&self, results: &[CrossCheckResult]) -> f64 {
        if results.is_empty() {
            return 0.0;
        }

        let total_confidence: f64 = results.iter().map(|r| r.confidence).sum();
        total_confidence / results.len() as f64
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{SourceInfo, StorageTier, TrustLevel, ValidationStatus};

    #[tokio::test]
    async fn test_cross_check() {
        let checker = CrossChecker::new();
        let mut knowledge = ValidatedKnowledge::new(
            "Test knowledge".to_string(),
            SourceInfo {
                source_type: crate::KnowledgeSource::UserInput,
                trust_level: TrustLevel::Trusted,
                source_id: None,
                metadata: Default::default(),
            },
        );

        let results = checker.cross_check(&knowledge).await.unwrap();
        assert_eq!(results.len(), 3);
        assert!(results.iter().all(|r| r.matched));
    }

    #[test]
    fn test_confidence_calculation() {
        let checker = CrossChecker::new();
        let results = vec![
            CrossCheckResult {
                check_type: "test1".to_string(),
                matched: true,
                confidence: 0.8,
                details: "".to_string(),
            },
            CrossCheckResult {
                check_type: "test2".to_string(),
                matched: true,
                confidence: 0.9,
                details: "".to_string(),
            },
        ];

        let confidence = checker.calculate_cross_check_confidence(&results);
        assert!((confidence - 0.85).abs() < 0.001);
    }
}
