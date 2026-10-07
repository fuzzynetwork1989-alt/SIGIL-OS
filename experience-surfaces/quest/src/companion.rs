//! Real Personal Companion
//!
//! This module provides personal companion features for the Meta Quest 3 avatar.

use uuid::Uuid;

use crate::QuestError;

/// Personal companion
#[derive(Debug, Clone)]
pub struct PersonalCompanion {
    /// Companion ID
    pub id: Uuid,

    /// Companion name
    pub name: String,

    /// Current state
    pub state: CompanionState,

    /// Interaction mode
    pub mode: InteractionMode,
}

/// Companion state
#[derive(Debug, Clone, Copy)]
pub enum CompanionState {
    Idle,
    Active,
    Sleep,
    Processing,
}

/// Interaction mode
#[derive(Debug, Clone, Copy)]
pub enum InteractionMode {
    Voice,
    Gesture,
    VoiceAndGesture,
    Autonomous,
}

impl PersonalCompanion {
    /// Create a new companion
    pub fn new(name: String) -> Self {
        Self {
            id: Uuid::new_v4(),
            name,
            state: CompanionState::Idle,
            mode: InteractionMode::VoiceAndGesture,
        }
    }

    /// Set state
    pub fn set_state(&mut self, state: CompanionState) {
        self.state = state;
    }

    /// Set interaction mode
    pub fn set_mode(&mut self, mode: InteractionMode) {
        self.mode = mode;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_companion_creation() {
        let companion = PersonalCompanion::new("SIGIL".to_string());
        assert_eq!(companion.name, "SIGIL");
    }
}
