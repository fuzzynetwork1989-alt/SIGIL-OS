//! Confidence Scorer - Stage 4 of validation pipeline

use crate::{CrossCheckResult, ValidatedKnowledge, ValidationStatus};
use anyhow::Result;

pub struct ConfidenceScorer;

impl ConfidenceScorer {
    /// Stage 4: Calculate confidence score from multiple factors
    pub fn calculate_confidence(
        source_trusted: bool,
        cross_check_results: &[CrossCheckResult],
        has_contradictions: bool,
    ) -> f64 {
        let mut confidence = 0.0;

        // Source trust contributes 30%
        if source_trusted {
            confidence += 30.0;
        } else {
            confidence += 10.0;
        }

        // Cross-check contributes 50%
        if !cross_check_results.is_empty() {
            let avg_cross_check: f64 = cross_check_results.iter().map(|r| r.confidence).sum::<f64>() / cross_check_results.len() as f64;
            confidence += avg_cross_check * 50.0;
        } else {
            confidence += 25.0; // Default if no cross-checks
        }

        // Contradictions penalize 20%
        if has_contradictions {
            confidence -= 20.0;
        } else {
            confidence += 20.0;
        }

        // Clamp to 0-100
        confidence.clamp(0.0, 100.0)
    }

    pub fn determine_storage_tier(confidence: f64) -> crate::StorageTier {
        match confidence {
            95.0..=100.0 => crate::StorageTier::Permanent,
            80.0..=94.9 => crate::StorageTier::Monitored,
            60.0..=79.9 => crate::StorageTier::Temporary,
            _ => crate::StorageTier::Cache,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::CrossCheckResult;

    #[test]
    fn test_confidence_trusted_source() {
        let cross_checks = vec![CrossCheckResult {
            check_type: "test".to_string(),
            matched: true,
            confidence: 0.9,
            details: "".to_string(),
        }];

        let confidence = ConfidenceScorer::calculate_confidence(true, &cross_checks, false);
        assert_eq!(confidence, 95.0);
    }

    #[test]
    fn test_confidence_untrusted_source() {
        let cross_checks = vec![CrossCheckResult {
            check_type: "test".to_string(),
            matched: true,
            confidence: 0.9,
            details: "".to_string(),
        }];

        let confidence = ConfidenceScorer::calculate_confidence(false, &cross_checks, false);
        assert_eq!(confidence, 75.0);
    }

    #[test]
    fn test_confidence_with_contradictions() {
        let cross_checks = vec![CrossCheckResult {
            check_type: "test".to_string(),
            matched: true,
            confidence: 0.9,
            details: "".to_string(),
        }];

        let confidence = ConfidenceScorer::calculate_confidence(true, &cross_checks, true);
        assert!(confidence < 95.0);
    }

    #[test]
    fn test_storage_tier_permanent() {
        let tier = ConfidenceScorer::determine_storage_tier(95.0);
        assert_eq!(tier, crate::StorageTier::Permanent);
    }

    #[test]
    fn test_storage_tier_monitored() {
        let tier = ConfidenceScorer::determine_storage_tier(85.0);
        assert_eq!(tier, crate::StorageTier::Monitored);
    }

    #[test]
    fn test_storage_tier_temporary() {
        let tier = ConfidenceScorer::determine_storage_tier(70.0);
        assert_eq!(tier, crate::StorageTier::Temporary);
    }

    #[test]
    fn test_storage_tier_cache() {
        let tier = ConfidenceScorer::determine_storage_tier(50.0);
        assert_eq!(tier, crate::StorageTier::Cache);
    }
}
