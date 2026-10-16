use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// Entity in the world model
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Entity {
    pub id: Uuid,
    pub name: String,
    pub entity_type: EntityType,
    pub attributes: HashMap<String, String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub confidence: f32,
}

/// Entity types
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum EntityType {
    Person,
    Location,
    Object,
    Concept,
    Event,
    Organization,
    Device,
    Custom(String),
}

impl Entity {
    /// Create a new entity
    pub fn new(name: String, entity_type: EntityType) -> Self {
        let now = Utc::now();
        Self {
            id: Uuid::new_v4(),
            name,
            entity_type,
            attributes: HashMap::new(),
            created_at: now,
            updated_at: now,
            confidence: 0.8,
        }
    }
    
    /// Add an attribute
    pub fn add_attribute(&mut self, key: String, value: String) {
        self.attributes.insert(key, value);
        self.updated_at = Utc::now();
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_entity_creation() {
        let entity = Entity::new("Test Entity".to_string(), EntityType::Person);
        assert_eq!(entity.name, "Test Entity");
        assert_eq!(entity.entity_type, EntityType::Person);
    }
    
    #[test]
    fn test_add_attribute() {
        let mut entity = Entity::new("Test".to_string(), EntityType::Person);
        entity.add_attribute("age".to_string(), "25".to_string());
        assert_eq!(entity.attributes.get("age"), Some(&"25".to_string()));
    }
}
