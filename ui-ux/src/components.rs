//! Interactive UI components for SIGIL OS
//!
//! This module provides buttons, chat interface, and other interactive components.

use uuid::Uuid;

/// Button state
#[derive(Debug, Clone, Copy)]
pub enum ButtonState {
    Normal,
    Hovered,
    Pressed,
    Disabled,
}

/// Button
#[derive(Debug, Clone)]
pub struct Button {
    /// Button ID
    pub id: Uuid,

    /// Button label
    pub label: String,

    /// Current state
    pub state: ButtonState,

    /// Button action
    pub action: Option<String>,

    /// Button style
    pub style: ButtonStyle,
}

/// Button style
#[derive(Debug, Clone)]
pub struct ButtonStyle {
    /// Background color
    pub background: String,

    /// Text color
    pub text_color: String,

    /// Border radius
    pub border_radius: u32,

    /// Padding
    pub padding: (u32, u32),
}

impl Button {
    /// Create a new button
    pub fn new(label: String) -> Self {
        Self {
            id: Uuid::new_v4(),
            label,
            state: ButtonState::Normal,
            action: None,
            style: ButtonStyle {
                background: "#007AFF".to_string(),
                text_color: "#FFFFFF".to_string(),
                border_radius: 8,
                padding: (12, 24),
            },
        }
    }

    /// Set the button action
    pub fn with_action(mut self, action: String) -> Self {
        self.action = Some(action);
        self
    }

    /// Set the button state
    pub fn set_state(&mut self, state: ButtonState) {
        self.state = state;
    }

    /// Check if button is clickable
    pub fn is_clickable(&self) -> bool {
        matches!(self.state, ButtonState::Normal | ButtonState::Hovered)
    }
}

/// Chat message
#[derive(Debug, Clone)]
pub struct ChatMessage {
    /// Message ID
    pub id: Uuid,

    /// Sender (user or avatar)
    pub sender: String,

    /// Message content
    pub content: String,

    /// Timestamp
    pub timestamp: chrono::DateTime<chrono::Utc>,

    /// Is avatar message
    pub is_avatar: bool,
}

/// Chat interface
#[derive(Debug, Clone)]
pub struct ChatInterface {
    /// Interface ID
    pub id: Uuid,

    /// Chat history
    pub messages: Vec<ChatMessage>,

    /// Current input
    pub input: String,

    /// Avatar name
    pub avatar_name: String,

    /// User name
    pub user_name: String,
}

impl ChatInterface {
    /// Create a new chat interface
    pub fn new(avatar_name: String, user_name: String) -> Self {
        Self {
            id: Uuid::new_v4(),
            messages: Vec::new(),
            input: String::new(),
            avatar_name,
            user_name,
        }
    }

    /// Send a message from the user
    pub fn send_user_message(&mut self, content: String) {
        let message = ChatMessage {
            id: Uuid::new_v4(),
            sender: self.user_name.clone(),
            content,
            timestamp: chrono::Utc::now(),
            is_avatar: false,
        };
        self.messages.push(message);
    }

    /// Send a message from the avatar
    pub fn send_avatar_message(&mut self, content: String) {
        let message = ChatMessage {
            id: Uuid::new_v4(),
            sender: self.avatar_name.clone(),
            content,
            timestamp: chrono::Utc::now(),
            is_avatar: true,
        };
        self.messages.push(message);
    }

    /// Get the last message
    pub fn get_last_message(&self) -> Option<&ChatMessage> {
        self.messages.last()
    }

    /// Get all messages
    pub fn get_messages(&self) -> &[ChatMessage] {
        &self.messages
    }

    /// Clear the chat history
    pub fn clear(&mut self) {
        self.messages.clear();
    }

    /// Set the current input
    pub fn set_input(&mut self, input: String) {
        self.input = input;
    }

    /// Get the current input
    pub fn get_input(&self) -> &str {
        &self.input
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_button_creation() {
        let button = Button::new("Click Me".to_string());
        assert_eq!(button.label, "Click Me");
        assert!(button.is_clickable());
    }

    #[test]
    fn test_button_with_action() {
        let button = Button::new("Submit".to_string()).with_action("submit".to_string());
        assert_eq!(button.action, Some("submit".to_string()));
    }

    #[test]
    fn test_button_disabled() {
        let mut button = Button::new("Disabled".to_string());
        button.set_state(ButtonState::Disabled);
        assert!(!button.is_clickable());
    }

    #[test]
    fn test_chat_interface() {
        let mut chat = ChatInterface::new("SIGIL".to_string(), "User".to_string());
        chat.send_user_message("Hello".to_string());
        chat.send_avatar_message("Hi there!".to_string());

        assert_eq!(chat.messages.len(), 2);
        assert_eq!(chat.messages[0].sender, "User");
        assert_eq!(chat.messages[1].sender, "SIGIL");
    }

    #[test]
    fn test_chat_clear() {
        let mut chat = ChatInterface::new("SIGIL".to_string(), "User".to_string());
        chat.send_user_message("Test".to_string());
        chat.clear();
        assert_eq!(chat.messages.len(), 0);
    }
}
