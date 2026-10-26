//! Centralized error handling for SIGIL OS
//!
//! This module provides a unified error type for all SIGIL OS components.

use thiserror::Error;

/// SIGIL OS unified error type
#[derive(Error, Debug)]
pub enum SigilError {
    /// Configuration error
    #[error("Configuration error: {0}")]
    Config(String),

    /// Database error
    #[error("Database error: {0}")]
    Database(String),

    /// Cryptographic error
    #[error("Cryptographic error: {0}")]
    Crypto(String),

    /// Warrant error
    #[error("Warrant error: {0}")]
    Warrant(String),

    /// Sigil error
    #[error("Sigil error: {0}")]
    Sigil(String),

    /// Ledger error
    #[error("Ledger error: {0}")]
    Ledger(String),

    /// Network error
    #[error("Network error: {0}")]
    Network(String),

    /// Validation error
    #[error("Validation error: {0}")]
    Validation(String),

    /// Not found error
    #[error("Not found: {0}")]
    NotFound(String),

    /// Permission denied error
    #[error("Permission denied: {0}")]
    PermissionDenied(String),

    /// Reality validation error
    #[error("Reality validation error: {0}")]
    RealityValidation(String),

    /// Cognitive assembly error
    #[error("Cognitive assembly error: {0}")]
    CognitiveAssembly(String),

    /// Mission error
    #[error("Mission error: {0}")]
    Mission(String),

    /// Action error
    #[error("Action error: {0}")]
    Action(String),

    /// Presence error
    #[error("Presence error: {0}")]
    Presence(String),

    /// Internal error
    #[error("Internal error: {0}")]
    Internal(String),

    /// IO error
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    /// Serialization error
    #[error("Serialization error: {0}")]
    Serialization(#[from] serde_json::Error),

    /// TOML parsing error
    #[error("TOML parsing error: {0}")]
    Toml(#[from] toml::de::Error),

    /// Anyhow error (for compatibility)
    #[error("Error: {0}")]
    Anyhow(#[from] anyhow::Error),
}

impl SigilError {
    /// Create a configuration error
    pub fn config(msg: impl Into<String>) -> Self {
        Self::Config(msg.into())
    }

    /// Create a database error
    pub fn database(msg: impl Into<String>) -> Self {
        Self::Database(msg.into())
    }

    /// Create a cryptographic error
    pub fn crypto(msg: impl Into<String>) -> Self {
        Self::Crypto(msg.into())
    }

    /// Create a warrant error
    pub fn warrant(msg: impl Into<String>) -> Self {
        Self::Warrant(msg.into())
    }

    /// Create a sigil error
    pub fn sigil(msg: impl Into<String>) -> Self {
        Self::Sigil(msg.into())
    }

    /// Create a ledger error
    pub fn ledger(msg: impl Into<String>) -> Self {
        Self::Ledger(msg.into())
    }

    /// Create a network error
    pub fn network(msg: impl Into<String>) -> Self {
        Self::Network(msg.into())
    }

    /// Create a validation error
    pub fn validation(msg: impl Into<String>) -> Self {
        Self::Validation(msg.into())
    }

    /// Create a not found error
    pub fn not_found(msg: impl Into<String>) -> Self {
        Self::NotFound(msg.into())
    }

    /// Create a permission denied error
    pub fn permission_denied(msg: impl Into<String>) -> Self {
        Self::PermissionDenied(msg.into())
    }

    /// Create a reality validation error
    pub fn reality_validation(msg: impl Into<String>) -> Self {
        Self::RealityValidation(msg.into())
    }

    /// Create a cognitive assembly error
    pub fn cognitive_assembly(msg: impl Into<String>) -> Self {
        Self::CognitiveAssembly(msg.into())
    }

    /// Create a mission error
    pub fn mission(msg: impl Into<String>) -> Self {
        Self::Mission(msg.into())
    }

    /// Create an action error
    pub fn action(msg: impl Into<String>) -> Self {
        Self::Action(msg.into())
    }

    /// Create a presence error
    pub fn presence(msg: impl Into<String>) -> Self {
        Self::Presence(msg.into())
    }

    /// Create an internal error
    pub fn internal(msg: impl Into<String>) -> Self {
        Self::Internal(msg.into())
    }

    /// Check if this is a recoverable error
    pub fn is_recoverable(&self) -> bool {
        matches!(
            self,
            Self::Network(_) | Self::Io(_) | Self::Validation(_)
        )
    }

    /// Check if this is a fatal error
    pub fn is_fatal(&self) -> bool {
        matches!(
            self,
            Self::Crypto(_) | Self::Warrant(_) | Self::Sigil(_) | Self::Ledger(_)
        )
    }
}

/// Result type alias for SIGIL OS
pub type Result<T> = std::result::Result<T, SigilError>;

/// Reality validation result type alias
pub type RealityValidationResult<T> = std::result::Result<T, SigilError>;

/// Cognitive assembly result type alias
pub type CognitiveAssemblyResult<T> = std::result::Result<T, SigilError>;

/// Mission result type alias
pub type MissionResult<T> = std::result::Result<T, SigilError>;

/// Action result type alias
pub type ActionResult<T> = std::result::Result<T, SigilError>;

/// Presence result type alias
pub type PresenceResult<T> = std::result::Result<T, SigilError>;

/// Type alias for RealityValidationError for convenience
pub type RealityValidationError = SigilError;

/// Type alias for CognitiveAssemblyError for convenience
pub type CognitiveAssemblyError = SigilError;

/// Type alias for MissionError for convenience
pub type MissionError = SigilError;

/// Type alias for ActionError for convenience
pub type ActionError = SigilError;

/// Type alias for PresenceError for convenience
pub type PresenceError = SigilError;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_error_creation() {
        let err = SigilError::config("test config error");
        assert!(matches!(err, SigilError::Config(_)));
    }

    #[test]
    fn test_error_recoverable() {
        let err = SigilError::network("connection failed");
        assert!(err.is_recoverable());
        assert!(!err.is_fatal());
    }

    #[test]
    fn test_error_fatal() {
        let err = SigilError::crypto("signature verification failed");
        assert!(!err.is_recoverable());
        assert!(err.is_fatal());
    }
}
