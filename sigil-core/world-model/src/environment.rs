use crate::{Entity, EntityType};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use uuid::Uuid;

/// Environment model for world modeling
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EnvironmentModel {
    pub id: Uuid,
    pub name: String,
    pub environment_type: EnvironmentType,
    pub entities: Vec<Uuid>,
    pub spatial_layout: SpatialLayout,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
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

/// Spatial layout information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SpatialLayout {
    pub dimensions: Dimensions,
    pub zones: Vec<Zone>,
    pub connections: Vec<SpatialConnection>,
}

/// Dimensions
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Dimensions {
    pub width: f32,
    pub height: f32,
    pub depth: f32,
}

/// Zone within environment
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Zone {
    pub id: Uuid,
    pub name: String,
    pub area: Area,
    pub zone_type: ZoneType,
}

/// Area definition
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Area {
    pub x: f32,
    pub y: f32,
    pub width: f32,
    pub height: f32,
}

/// Zone types
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum ZoneType {
    Workspace,
    Storage,
    Passage,
    Seating,
    Custom(String),
}

/// Spatial connection between zones
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SpatialConnection {
    pub from_zone_id: Uuid,
    pub to_zone_id: Uuid,
    pub connection_type: ConnectionType,
}

/// Connection types
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum ConnectionType {
    Doorway,
    Hallway,
    Open,
    Virtual,
}

impl EnvironmentModel {
    pub fn new(name: String, environment_type: EnvironmentType) -> Self {
        let now = Utc::now();
        Self {
            id: Uuid::new_v4(),
            name,
            environment_type,
            entities: Vec::new(),
            spatial_layout: SpatialLayout {
                dimensions: Dimensions {
                    width: 0.0,
                    height: 0.0,
                    depth: 0.0,
                },
                zones: Vec::new(),
                connections: Vec::new(),
            },
            created_at: now,
            updated_at: now,
        }
    }
    
    pub fn add_entity(&mut self, entity_id: Uuid) {
        self.entities.push(entity_id);
        self.updated_at = Utc::now();
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
