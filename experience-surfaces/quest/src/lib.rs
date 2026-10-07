//! Meta Quest 3 Integration
//!
//! This module provides the structural foundation for Meta Quest 3 integration,
//! including TrueHD Avatar Voice Assistant, Real Personal Companion features,
//! Mixed Reality interface, Spatial mapping, and Hand Tracking.

pub mod voice_assistant;
pub mod companion;
pub mod mixed_reality;
pub mod spatial_mapping;
pub mod hand_tracking;

pub use voice_assistant::{VoiceAssistant, VoiceCommand, TTS};
pub use companion::{PersonalCompanion, CompanionState, InteractionMode};
pub use mixed_reality::{MRInterface, Passthrough, SpatialAnchor};
pub use spatial_mapping::{SpatialMapping, MeshGeneration, SceneUnderstanding};
pub use hand_tracking::{HandTracking, GestureRecognition, Gesture};

/// Error types for Quest integration
#[derive(Debug, thiserror::Error)]
pub enum QuestError {
    #[error("Quest device not connected")]
    DeviceNotConnected,

    #[error("Permission denied: {0}")]
    PermissionDenied(String),

    #[error("Voice recognition failed: {0}")]
    VoiceRecognitionFailed(String),

    #[error("Text-to-speech failed: {0}")]
    TTSFailed(String),

    #[error("Spatial mapping failed: {0}")]
    SpatialMappingFailed(String),

    #[error("Hand tracking failed: {0}")]
    HandTrackingFailed(String),

    #[error("MR rendering failed: {0}")]
    MRRenderingFailed(String),

    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Serialization error: {0}")]
    Serialization(#[from] serde_json::Error),
}

/// Result type for Quest operations
pub type Result<T> = std::result::Result<T, QuestError>;
