//! Conversation history persistence

use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Message {
    pub id: String,
    pub role: String, // "user" or "assistant"
    pub content: String,
    pub timestamp: DateTime<Utc>,
    pub tokens: Option<u32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Conversation {
    pub id: String,
    pub user_id: String,
    pub title: String,
    pub messages: Vec<Message>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub model: String,
    pub superbrain_enabled: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConversationSummary {
    pub id: String,
    pub title: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub message_count: usize,
}

pub struct ConversationStore {
    conversations: Arc<Mutex<HashMap<String, Conversation>>>,
}

impl ConversationStore {
    pub fn new() -> Self {
        Self {
            conversations: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub fn create_conversation(
        &self,
        user_id: String,
        title: String,
        model: String,
        superbrain_enabled: bool,
    ) -> Conversation {
        let conversation = Conversation {
            id: Uuid::new_v4().to_string(),
            user_id,
            title,
            messages: vec![],
            created_at: Utc::now(),
            updated_at: Utc::now(),
            model,
            superbrain_enabled,
        };

        let mut conversations = self.conversations.lock().unwrap();
        conversations.insert(conversation.id.clone(), conversation.clone());
        conversation
    }

    pub fn get_conversation(&self, id: &str) -> Option<Conversation> {
        let conversations = self.conversations.lock().unwrap();
        conversations.get(id).cloned()
    }

    pub fn add_message(&self, conversation_id: &str, message: Message) -> Result<(), String> {
        let mut conversations = self.conversations.lock().unwrap();
        if let Some(conversation) = conversations.get_mut(conversation_id) {
            conversation.messages.push(message);
            conversation.updated_at = Utc::now();
            Ok(())
        } else {
            Err("Conversation not found".to_string())
        }
    }

    pub fn list_conversations(&self, user_id: &str) -> Vec<ConversationSummary> {
        let conversations = self.conversations.lock().unwrap();
        conversations
            .values()
            .filter(|c| c.user_id == user_id)
            .map(|c| ConversationSummary {
                id: c.id.clone(),
                title: c.title.clone(),
                created_at: c.created_at,
                updated_at: c.updated_at,
                message_count: c.messages.len(),
            })
            .collect()
    }

    pub fn delete_conversation(&self, id: &str) -> bool {
        let mut conversations = self.conversations.lock().unwrap();
        conversations.remove(id).is_some()
    }

    pub fn export_conversation(&self, id: &str) -> Result<String, String> {
        let conversation = self.get_conversation(id).ok_or("Conversation not found")?;

        let mut markdown = format!("# {}\n\n", conversation.title);
        markdown.push_str(&format!("**Created:** {}\n\n", conversation.created_at.format("%Y-%m-%d %H:%M:%S")));
        markdown.push_str(&format!("**Model:** {}\n\n", conversation.model));
        if conversation.superbrain_enabled {
            markdown.push_str("**Super Brain:** Enabled\n\n");
        }

        for message in &conversation.messages {
            markdown.push_str(&format!("## {}\n\n", message.role));
            markdown.push_str(&format!("{}\n\n", message.content));
        }

        Ok(markdown)
    }
}

impl Default for ConversationStore {
    fn default() -> Self {
        Self::new()
    }
}
