use crate::{Entity, EntityType};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use uuid::Uuid;

/// Spatial system for Quest 3 and embodied interfaces
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SpatialSystem {
    pub id: Uuid,
    pub rooms: HashMap<Uuid, Room>,
    pub spatial_relationships: Vec<SpatialRelationship>,
    pub last_updated: DateTime<Utc>,
}

/// Room in spatial system
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Room {
    pub id: Uuid,
    pub name: String,
    pub dimensions: RoomDimensions,
    pub objects: Vec<SpatialObject>,
    pub entities: Vec<Uuid>,
}

/// Room dimensions
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RoomDimensions {
    pub width: f32,
    pub height: f32,
    pub depth: f32,
}

/// Spatial object
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SpatialObject {
    pub id: Uuid,
    pub name: String,
    pub position: Position3D,
    pub orientation: Orientation,
    pub size: ObjectSize,
}

/// 3D position
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Position3D {
    pub x: f32,
    pub y: f32,
    pub z: f32,
}

/// Orientation
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Orientation {
    pub yaw: f32,
    pub pitch: f32,
    pub roll: f32,
}

/// Object size
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ObjectSize {
    pub width: f32,
    pub height: f32,
    pub depth: f32,
}

/// Spatial relationship
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SpatialRelationship {
    pub from_id: Uuid,
    pub to_id: Uuid,
    pub relationship_type: SpatialRelationType,
    pub distance: f32,
}

/// Spatial relation types
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum SpatialRelationType {
    NextTo,
    Above,
    Below,
    Inside,
    OnTopOf,
    Facing,
    Near,
    ConnectedTo,
}

impl SpatialSystem {
    pub fn new() -> Self {
        Self {
            id: Uuid::new_v4(),
            rooms: HashMap::new(),
            spatial_relationships: Vec::new(),
            last_updated: Utc::now(),
        }
    }
    
    pub fn add_room(&mut self, room: Room) {
        self.rooms.insert(room.id, room);
        self.last_updated = Utc::now();
    }
    
    pub fn add_spatial_relationship(&mut self, relationship: SpatialRelationship) {
        self.spatial_relationships.push(relationship);
        self.last_updated = Utc::now();
    }
    
    pub fn find_objects_near(&self, position: &Position3D, radius: f32) -> Vec<&SpatialObject> {
        let mut nearby = Vec::new();
        
        for room in self.rooms.values() {
            for obj in &room.objects {
                let dx = obj.position.x - position.x;
                let dy = obj.position.y - position.y;
                let dz = obj.position.z - position.z;
                let distance = (dx * dx + dy * dy + dz * dz).sqrt();
                
                if distance < radius {
                    nearby.push(obj);
                }
            }
        }
        
        nearby
    }
}

impl Default for SpatialSystem {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_spatial_system() {
        let spatial = SpatialSystem::new();
        assert!(spatial.rooms.is_empty());
    }
}
