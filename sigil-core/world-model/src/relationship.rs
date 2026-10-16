use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use uuid::Uuid;

/// Relationship between entities
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Relationship {
    pub id: Uuid,
    pub from_entity_id: Uuid,
    pub to_entity_id: Uuid,
    pub relationship_type: RelationshipType,
    pub attributes: HashMap<String, String>,
    pub created_at: DateTime<Utc>,
    pub confidence: f32,
}

/// Relationship types
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum RelationshipType {
    RelatedTo,
    LocatedAt,
    OwnedBy,
    PartOf,
    ConnectedTo,
    AssociatedWith,
    Custom(String),
}

impl Relationship {
    /// Create a new relationship
    pub fn new(
        from_entity_id: Uuid,
        to_entity_id: Uuid,
        relationship_type: RelationshipType,
    ) -> Self {
        Self {
            id: Uuid::new_v4(),
            from_entity_id,
            to_entity_id,
            relationship_type,
            attributes: HashMap::new(),
            created_at: Utc::now(),
            confidence: 0.8,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_relationship_creation() {
        let rel = Relationship::new(
            Uuid::new_v4(),
            Uuid::new_v4(),
            RelationshipType::RelatedTo,
        );
        assert_eq!(rel.relationship_type, RelationshipType::RelatedTo);
    }
}
