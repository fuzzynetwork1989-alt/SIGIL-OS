//! Model Fabric - AI/ML model management and inference for SIGIL OS
//!
//! This module provides the infrastructure for loading, managing, and running
//! AI models, with a focus on local inference using Qwen 7B as the base model.

pub mod base_model;
pub mod download;
pub mod engine;
pub mod family;
pub mod modelfile;
pub mod superbrain;

pub use base_model::{BaseModel, ModelSelector};
pub use download::ModelDownloader;
pub use engine::{InferenceEngine, InferenceRequest, InferenceResponse};
pub use family::{ModelFamily, ModelFamilyRegistry};
pub use modelfile::{Modelfile, ModelfileParser};
pub use superbrain::{
    ContextSystem, MemorySystem, PersonalitySystem, SelfImprovementSystem, SuperBrain,
    SuperBrainConfig, SuperBrainRequest, SuperBrainResponse,
};

/// Error types for Model Fabric
#[derive(Debug, thiserror::Error)]
pub enum ModelFabricError {
    #[error("Model not found: {0}")]
    ModelNotFound(String),

    #[error("Model loading failed: {0}")]
    LoadFailed(String),

    #[error("Model load error: {0}")]
    ModelLoad(String),

    #[error("Inference failed: {0}")]
    InferenceFailed(String),

    #[error("Invalid modelfile: {0}")]
    InvalidModelfile(String),

    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Serialization error: {0}")]
    Serialization(String),

    #[error("Configuration error: {0}")]
    Configuration(String),
}

/// Result type for Model Fabric operations
pub type Result<T> = std::result::Result<T, ModelFabricError>;
