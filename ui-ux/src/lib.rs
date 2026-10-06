//! UI/UX Layer - User interface and experience for SIGIL OS
//!
//! This module provides the user interface infrastructure including:
//! - Slint framework integration
//! - Icon system
//! - Theme engine
//! - Avatar system
//! - Interactive components

pub mod avatar;
pub mod icon;
pub mod theme;
pub mod components;

pub use avatar::{Avatar, AvatarConfig, AvatarRenderer};
pub use icon::{Icon, IconPack, IconPackLoader};
pub use theme::{Theme, ThemeEngine, ThemePreset};
pub use components::{Button, ButtonState, ChatInterface};

/// Error types for UI/UX operations
#[derive(Debug, thiserror::Error)]
pub enum UiUxError {
    #[error("Icon not found: {0}")]
    IconNotFound(String),

    #[error("Theme not found: {0}")]
    ThemeNotFound(String),

    #[error("Avatar rendering failed: {0}")]
    AvatarRenderFailed(String),

    #[error("Component creation failed: {0}")]
    ComponentCreationFailed(String),

    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Serialization error: {0}")]
    Serialization(#[from] serde_json::Error),

    #[error("Image error: {0}")]
    Image(String),
}

/// Result type for UI/UX operations
pub type Result<T> = std::result::Result<T, UiUxError>;
