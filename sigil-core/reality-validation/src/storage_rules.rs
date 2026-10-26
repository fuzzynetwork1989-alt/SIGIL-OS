//! Storage rules based on confidence levels

use crate::ConfidenceLevel;

/// Storage decision based on confidence level
#[derive(Debug, Clone, Copy, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub enum StorageDecision {
    /// Store in permanent memory
    Permanent,
    /// Store in monitored memory
    Monitored,
    /// Store in temporary memory
    Temporary,
    /// Store in observation cache only
    Cached,
    /// Do not store
    Reject,
}

impl StorageDecision {
    /// Get storage decision from confidence level
    pub fn from_confidence(level: ConfidenceLevel) -> Self {
        match level {
            ConfidenceLevel::Verified => StorageDecision::Permanent,
            ConfidenceLevel::LikelyTrue => StorageDecision::Monitored,
            ConfidenceLevel::Tentative => StorageDecision::Temporary,
            ConfidenceLevel::Unverified => StorageDecision::Cached,
        }
    }

    /// Check if this decision allows storage
    pub fn allows_storage(&self) -> bool {
        !matches!(self, StorageDecision::Reject)
    }

    /// Get retention duration in seconds
    pub fn retention_duration(&self) -> Option<u64> {
        match self {
            StorageDecision::Permanent => None, // Indefinite
            StorageDecision::Monitored => Some(90 * 24 * 60 * 60), // 90 days
            StorageDecision::Temporary => Some(7 * 24 * 60 * 60), // 7 days
            StorageDecision::Cached => Some(24 * 60 * 60), // 1 day
            StorageDecision::Reject => Some(0),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_storage_decision_from_confidence() {
        assert_eq!(
            StorageDecision::from_confidence(ConfidenceLevel::Verified),
            StorageDecision::Permanent
        );
        assert_eq!(
            StorageDecision::from_confidence(ConfidenceLevel::LikelyTrue),
            StorageDecision::Monitored
        );
        assert_eq!(
            StorageDecision::from_confidence(ConfidenceLevel::Tentative),
            StorageDecision::Temporary
        );
        assert_eq!(
            StorageDecision::from_confidence(ConfidenceLevel::Unverified),
            StorageDecision::Cached
        );
    }

    #[test]
    fn test_allows_storage() {
        assert!(StorageDecision::Permanent.allows_storage());
        assert!(StorageDecision::Monitored.allows_storage());
        assert!(StorageDecision::Temporary.allows_storage());
        assert!(StorageDecision::Cached.allows_storage());
        assert!(!StorageDecision::Reject.allows_storage());
    }
}
