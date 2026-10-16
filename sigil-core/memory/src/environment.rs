use crate::{MemoryEntry, MemoryError, MemorySource, MemoryType};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use uuid::Uuid;

/// Environment model for spatial and contextual memory
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EnvironmentModel {
    pub id: Uuid,
    pub name: String,
    pub environment_type: EnvironmentType,
    pub location: Location,
    pub objects: Vec<EnvironmentObject>,
    pub relationships: Vec<SpatialRelationship>,
    pub last_updated: DateTime<Utc>,
}

/// Environment types
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum EnvironmentType {
    Room,
    Building,
    Outdoor,
    Virtual,
    Custom(String),
}

/// Location information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Location {
    pub x: f32,
    pub y: f32,
    pub z: f32,
    pub description: String,
}

/// Objects in the environment
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EnvironmentObject {
    pub id: Uuid,
    pub name: String,
    pub object_type: ObjectType,
    pub location: Location,
    pub properties: HashMap<String, String>,
}

/// Object types
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum ObjectType {
    Furniture,
    Device,
    Display,
    Tool,
    Custom(String),
}

/// Spatial relationships between objects
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SpatialRelationship {
    pub from_object_id: Uuid,
    pub to_object_id: Uuid,
    pub relationship_type: SpatialRelation,
    pub distance: f32,
}

/// Spatial relationship types
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum SpatialRelation {
    NextTo,
    Above,
    Below,
    Inside,
    OnTopOf,
    Facing,
    Near,
}

impl EnvironmentModel {
    /// Create a new environment model
    pub fn new(name: String, environment_type: EnvironmentType) -> Self {
        Self {
            id: Uuid::new_v4(),
            name,
            environment_type,
            location: Location {
                x: 0.0,
                y: 0.0,
                z: 0.0,
                description: "Origin".to_string(),
            },
            objects: Vec::new(),
            relationships: Vec::new(),
            last_updated: Utc::now(),
        }
    }
    
    /// Add an object to the environment
    pub fn add_object(&mut self, object: EnvironmentObject) {
        self.objects.push(object);
        self.last_updated = Utc::now();
    }
    
    /// Add a spatial relationship
    pub fn add_relationship(&mut self, relationship: SpatialRelationship) {
        self.relationships.push(relationship);
        self.last_updated = Utc::now();
    }
    
    /// Find objects by type
    pub fn find_objects_by_type(&self, object_type: ObjectType) -> Vec<&EnvironmentObject> {
        self.objects
            .iter()
            .filter(|obj| obj.object_type == object_type)
            .collect()
    }
    
    /// Find objects near a location
    pub fn find_nearby_objects(&self, location: &Location, radius: f32) -> Vec<&EnvironmentObject> {
        self.objects
            .iter()
            .filter(|obj| {
                let dx = obj.location.x - location.x;
                let dy = obj.location.y - location.y;
                let dz = obj.location.z - location.z;
                (dx * dx + dy * dy + dz * dz).sqrt() < radius
            })
            .collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_environment_model() {
        let env = EnvironmentModel::new("Office".to_string(), EnvironmentType::Room);
        assert_eq!(env.environment_type, EnvironmentType::Room);
    }
}
