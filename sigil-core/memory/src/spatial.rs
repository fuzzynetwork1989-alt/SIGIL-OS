use crate::{MemoryEntry, MemoryError, MemorySource, MemoryType};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use uuid::Uuid;

/// Spatial memory for Quest 3 and embodied interfaces
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SpatialMemory {
    pub id: Uuid,
    pub room_id: Uuid,
    pub object_positions: HashMap<Uuid, SpatialPosition>,
    pub spatial_timestamps: HashMap<Uuid, DateTime<Utc>>,
    pub confidence_map: HashMap<Uuid, f32>,
}

/// Spatial position in 3D space
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SpatialPosition {
    pub x: f32,
    pub y: f32,
    pub z: f32,
    pub rotation: f32,
    pub confidence: f32,
}

impl SpatialMemory {
    /// Create new spatial memory
    pub fn new(room_id: Uuid) -> Self {
        Self {
            id: Uuid::new_v4(),
            room_id,
            object_positions: HashMap::new(),
            spatial_timestamps: HashMap::new(),
            confidence_map: HashMap::new(),
        }
    }

    /// Record object position
    pub fn record_position(&mut self, object_id: Uuid, position: SpatialPosition) {
        self.object_positions.insert(object_id, position.clone());
        self.spatial_timestamps.insert(object_id, Utc::now());
        self.confidence_map.insert(object_id, position.confidence);
    }

    /// Get object position
    pub fn get_position(&self, object_id: &Uuid) -> Option<&SpatialPosition> {
        self.object_positions.get(object_id)
    }

    /// Update confidence based on repeated observations
    pub fn update_confidence(&mut self, object_id: Uuid, confidence: f32) {
        let current = self.confidence_map.get(&object_id).unwrap_or(&0.5);
        let updated = (current + confidence) / 2.0;
        self.confidence_map.insert(object_id, updated.min(1.0));
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_spatial_memory() {
        let spatial = SpatialMemory::new(Uuid::new_v4());
        let position = SpatialPosition {
            x: 1.0,
            y: 2.0,
            z: 3.0,
            rotation: 0.0,
            confidence: 0.9,
        };
        spatial.record_position(Uuid::new_v4(), position);
        assert!(!spatial.object_positions.is_empty());
    }
}
