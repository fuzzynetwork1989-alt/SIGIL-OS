//! Confidence levels and scoring

/// Confidence score (0.0 to 1.0)
pub type ConfidenceScore = f64;

/// Confidence level based on score
#[derive(Debug, Clone, Copy, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub enum ConfidenceLevel {
    /// VERIFIED (95-100): Permanent Memory
    Verified,
    /// LIKELY_TRUE (80-94): Monitored Memory
    LikelyTrue,
    /// TENTATIVE (60-79): Temporary Memory
    Tentative,
    /// UNVERIFIED (0-59): Observation Cache
    Unverified,
}

impl ConfidenceLevel {
    /// Convert a confidence score to a confidence level
    pub fn from_score(score: ConfidenceScore) -> Self {
        match score {
            s if s >= 0.95 => ConfidenceLevel::Verified,
            s if s >= 0.80 => ConfidenceLevel::LikelyTrue,
            s if s >= 0.60 => ConfidenceLevel::Tentative,
            _ => ConfidenceLevel::Unverified,
        }
    }

    /// Get the minimum score for this level
    pub fn min_score(&self) -> ConfidenceScore {
        match self {
            ConfidenceLevel::Verified => 0.95,
            ConfidenceLevel::LikelyTrue => 0.80,
            ConfidenceLevel::Tentative => 0.60,
            ConfidenceLevel::Unverified => 0.0,
        }
    }

    /// Get the storage type for this level
    pub fn storage_type(&self) -> &'static str {
        match self {
            ConfidenceLevel::Verified => "Permanent Memory",
            ConfidenceLevel::LikelyTrue => "Monitored Memory",
            ConfidenceLevel::Tentative => "Temporary Memory",
            ConfidenceLevel::Unverified => "Observation Cache",
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_confidence_level_from_score() {
        assert_eq!(ConfidenceLevel::from_score(0.98), ConfidenceLevel::Verified);
        assert_eq!(ConfidenceLevel::from_score(0.85), ConfidenceLevel::LikelyTrue);
        assert_eq!(ConfidenceLevel::from_score(0.70), ConfidenceLevel::Tentative);
        assert_eq!(ConfidenceLevel::from_score(0.40), ConfidenceLevel::Unverified);
    }

    #[test]
    fn test_boundary_conditions() {
        assert_eq!(ConfidenceLevel::from_score(0.95), ConfidenceLevel::Verified);
        assert_eq!(ConfidenceLevel::from_score(0.94), ConfidenceLevel::LikelyTrue);
        assert_eq!(ConfidenceLevel::from_score(0.80), ConfidenceLevel::LikelyTrue);
        assert_eq!(ConfidenceLevel::from_score(0.79), ConfidenceLevel::Tentative);
        assert_eq!(ConfidenceLevel::from_score(0.60), ConfidenceLevel::Tentative);
        assert_eq!(ConfidenceLevel::from_score(0.59), ConfidenceLevel::Unverified);
    }
}
