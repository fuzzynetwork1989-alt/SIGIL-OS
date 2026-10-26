//! Presence State - represents avatar cognitive states

/// Presence State - avatar cognitive states
#[derive(Debug, Clone, Copy, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub enum PresenceState {
    Observe,
    Listen,
    Recall,
    Think,
    Research,
    Plan,
    Collaborate,
    Teach,
    Follow,
    Wait,
}

impl PresenceState {
    /// Check if state is active (not idle)
    pub fn is_active(&self) -> bool {
        !matches!(self, PresenceState::Wait)
    }

    /// Get state description
    pub fn description(&self) -> &'static str {
        match self {
            PresenceState::Observe => "Observing environment",
            PresenceState::Listen => "Listening to user",
            PresenceState::Recall => "Recalling memory",
            PresenceState::Think => "Thinking and reasoning",
            PresenceState::Research => "Researching information",
            PresenceState::Plan => "Planning actions",
            PresenceState::Collaborate => "Collaborating with user",
            PresenceState::Teach => "Teaching and explaining",
            PresenceState::Follow => "Following user",
            PresenceState::Wait => "Waiting for input",
        }
    }
}
