//! Presence Intelligence - Pillar 04 of SCA-1R Cognitive Architecture
//!
//! This module implements presence intelligence that controls avatar cognition
//! and behavioral expression. The avatar remains cognitively active in various states.

pub mod state_machine;
pub mod presence_state;

pub use state_machine::PresenceStateMachine;
pub use presence_state::PresenceState;

use errors::PresenceError;

/// Main entry point for presence intelligence
pub struct PresenceIntelligence {
    state_machine: PresenceStateMachine,
}

impl PresenceIntelligence {
    /// Create a new presence intelligence system
    pub fn new() -> Result<Self, PresenceError> {
        Ok(Self {
            state_machine: PresenceStateMachine::new()?,
        })
    }

    /// Get current presence state
    pub fn get_state(&self) -> PresenceState {
        self.state_machine.get_state()
    }

    /// Transition to a new presence state
    pub async fn transition_to(&self, new_state: PresenceState) -> Result<(), PresenceError> {
        self.state_machine.transition(new_state).await
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_intelligence_creation() {
        let intelligence = PresenceIntelligence::new();
        assert!(intelligence.is_ok());
    }
}
