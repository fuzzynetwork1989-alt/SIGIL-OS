//! Mixed Reality Interface
//!
//! This module provides MR interface with passthrough and spatial anchors.

use uuid::Uuid;

use crate::QuestError;

/// MR interface
#[derive(Debug, Clone)]
pub struct MRInterface {
    /// Interface ID
    pub id: Uuid,

    /// Is passthrough enabled
    pub passthrough_enabled: bool,

    /// Spatial anchors
    pub anchors: Vec<SpatialAnchor>,
}

/// Passthrough
#[derive(Debug, Clone)]
pub struct Passthrough {
    /// Is enabled
    pub enabled: bool,

    /// Passthrough quality
    pub quality: String,
}

/// Spatial anchor
#[derive(Debug, Clone)]
pub struct SpatialAnchor {
    /// Anchor ID
    pub id: Uuid,

    /// Anchor position
    pub position: (f32, f32, f32),

    /// Anchor rotation
    pub rotation: (f32, f32, f32, f32),
}

impl MRInterface {
    /// Create a new MR interface
    pub fn new() -> Self {
        Self {
            id: Uuid::new_v4(),
            passthrough_enabled: false,
            anchors: Vec::new(),
        }
    }

    /// Enable passthrough
    pub fn enable_passthrough(&mut self) {
        self.passthrough_enabled = true;
    }

    /// Disable passthrough
    pub fn disable_passthrough(&mut self) {
        self.passthrough_enabled = false;
    }

    /// Add spatial anchor
    pub fn add_anchor(&mut self, anchor: SpatialAnchor) {
        self.anchors.push(anchor);
    }
}

impl Default for MRInterface {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_mr_interface() {
        let mut mr = MRInterface::new();
        mr.enable_passthrough();
        assert!(mr.passthrough_enabled);
    }
}
