use crate::{MemoryError, MemorySource};
use chrono::{DateTime, Utc};

/// Confidence calculator for memory entries
pub struct ConfidenceCalculator {
    base_confidence: f32,
}

impl ConfidenceCalculator {
    pub fn new() -> Self {
        Self {
            base_confidence: 0.7,
        }
    }
    
    /// Calculate confidence based on source and other factors
    pub fn calculate(&self, source: &MemorySource) -> f32 {
        let source_reliability = match source {
            MemorySource::Conversation { .. } => 0.9,
            MemorySource::ManualEntry { .. } => 0.95,
            MemorySource::ObservedBehavior { .. } => 0.85,
            MemorySource::External { .. } => 0.6,
            MemorySource::Inference { .. } => 0.5,
        };
        
        let confidence = self.base_confidence * source_reliability;
        confidence.min(1.0).max(0.0)
    }
    
    /// Apply age decay to confidence
    pub fn apply_age_decay(&self, confidence: f32, timestamp: DateTime<Utc>) -> f32 {
        let now = Utc::now();
        let duration = now.signed_duration_since(timestamp);
        let hours = duration.num_hours();
        
        let age_factor = match hours {
            0..=1 => 1.0,
            1..=24 => 0.9,
            24..=168 => 0.8,  // 1 week
            168..=720 => 0.7, // 1 month
            _ => 0.6,
        };
        
        confidence * age_factor
    }
    
    /// Boost confidence on access
    pub fn boost_on_access(&self, confidence: f32) -> f32 {
        (confidence + 0.05).min(1.0)
    }
}

impl Default for ConfidenceCalculator {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use uuid::Uuid;
    
    #[test]
    fn test_confidence_calculation() {
        let calculator = ConfidenceCalculator::new();
        
        let manual_entry = MemorySource::ManualEntry {
            user_id: Uuid::new_v4(),
        };
        let confidence = calculator.calculate(&manual_entry);
        
        assert!(confidence > 0.0);
        assert!(confidence <= 1.0);
    }
    
    #[test]
    fn test_age_decay() {
        let calculator = ConfidenceCalculator::new();
        let now = Utc::now();
        
        let confidence = calculator.apply_age_decay(0.9, now);
        assert_eq!(confidence, 0.9);
    }
    
    #[test]
    fn test_boost_on_access() {
        let calculator = ConfidenceCalculator::new();
        let boosted = calculator.boost_on_access(0.8);
        assert_eq!(boosted, 0.85);
    }
}
