//! Safeguard Constraints
//!
//! This module provides evolutionary bounds and rollback mechanisms to ensure
//! safe and controlled self-evolution.

use std::collections::HashMap;
use uuid::Uuid;

use crate::{DreamWeavingError, Result};

/// Safeguard constraints
#[derive(Debug, Clone)]
pub struct SafeguardConstraints {
    /// Constraints ID
    pub id: Uuid,

    /// Maximum mutation magnitude
    pub max_mutation_magnitude: f32,

    /// Maximum generations per session
    pub max_generations: u32,

    /// Required approvals
    pub required_approvals: Vec<String>,

    /// Forbidden mutations
    pub forbidden_mutations: Vec<String>,
}

/// Evolutionary bounds
#[derive(Debug, Clone)]
pub struct EvolutionaryBounds {
    /// Bounds ID
    pub id: Uuid,

    /// Minimum weight
    pub min_weight: f32,

    /// Maximum weight
    pub max_weight: f32,

    /// Maximum connections per pathway
    pub max_connections: u32,
}

/// Rollback mechanism
#[derive(Debug, Clone)]
pub struct RollbackMechanism {
    /// Rollback snapshots
    snapshots: HashMap<u32, Snapshot>,

    /// Current generation
    current_generation: u32,
}

/// Snapshot
#[derive(Debug, Clone)]
pub struct Snapshot {
    /// Generation number
    pub generation: u32,

    /// Snapshot data
    pub data: Vec<u8>,

    /// Timestamp
    pub timestamp: chrono::DateTime<chrono::Utc>,
}

/// Safeguard Engine
pub struct SafeguardEngine {
    /// Constraints
    constraints: SafeguardConstraints,

    /// Bounds
    bounds: EvolutionaryBounds,

    /// Rollback mechanism
    rollback: RollbackMechanism,
}

impl SafeguardEngine {
    /// Create a new safeguard engine
    pub fn new() -> Self {
        Self {
            constraints: SafeguardConstraints {
                id: Uuid::new_v4(),
                max_mutation_magnitude: 0.5,
                max_generations: 10,
                required_approvals: vec!["anchor_governance".to_string()],
                forbidden_mutations: vec![
                    "trust_root_modification".to_string(),
                    "audit_integrity_modification".to_string(),
                ],
            },
            bounds: EvolutionaryBounds {
                id: Uuid::new_v4(),
                min_weight: 0.0,
                max_weight: 1.0,
                max_connections: 100,
            },
            rollback: RollbackMechanism {
                snapshots: HashMap::new(),
                current_generation: 0,
            },
        }
    }

    /// Validate a mutation
    pub fn validate_mutation(&self, mutation: &crate::mutation::PathwayMutation) -> Result<()> {
        // Check mutation magnitude
        if mutation.magnitude > self.constraints.max_mutation_magnitude {
            return Err(DreamWeavingError::SafeguardViolation(
                "Mutation magnitude exceeds maximum".to_string(),
            ));
        }

        // Check forbidden mutations
        if let crate::mutation::MutationType::PathwayCreation = mutation.mutation_type {
            if self
                .constraints
                .forbidden_mutations
                .contains(&"pathway_creation".to_string())
            {
                return Err(DreamWeavingError::SafeguardViolation(
                    "Forbidden mutation type".to_string(),
                ));
            }
        }

        Ok(())
    }

    /// Create a snapshot
    pub fn create_snapshot(&mut self, data: Vec<u8>) {
        let snapshot = Snapshot {
            generation: self.rollback.current_generation,
            data,
            timestamp: chrono::Utc::now(),
        };
        self.rollback
            .snapshots
            .insert(self.rollback.current_generation, snapshot);
    }

    /// Rollback to a specific generation
    pub fn rollback(&mut self, generation: u32) -> Result<Snapshot> {
        self.rollback
            .snapshots
            .get(&generation)
            .cloned()
            .ok_or_else(|| DreamWeavingError::RollbackFailed("Snapshot not found".to_string()))
    }

    /// Increment generation
    pub fn increment_generation(&mut self) {
        self.rollback.current_generation += 1;
    }

    /// Get current generation
    pub fn get_current_generation(&self) -> u32 {
        self.rollback.current_generation
    }
}

impl Default for SafeguardEngine {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_safeguard_creation() {
        let engine = SafeguardEngine::new();
        assert_eq!(engine.get_current_generation(), 0);
    }

    #[test]
    fn test_mutation_validation() {
        let engine = SafeguardEngine::new();

        let valid_mutation = crate::mutation::PathwayMutation {
            id: Uuid::new_v4(),
            mutation_type: crate::mutation::MutationType::WeightAdjustment,
            source: Uuid::new_v4(),
            target: Uuid::new_v4(),
            magnitude: 0.3,
            approved: false,
        };

        assert!(engine.validate_mutation(&valid_mutation).is_ok());
    }

    #[test]
    fn test_mutation_rejection() {
        let engine = SafeguardEngine::new();

        let invalid_mutation = crate::mutation::PathwayMutation {
            id: Uuid::new_v4(),
            mutation_type: crate::mutation::MutationType::WeightAdjustment,
            source: Uuid::new_v4(),
            target: Uuid::new_v4(),
            magnitude: 0.8, // Exceeds max_mutation_magnitude
            approved: false,
        };

        assert!(engine.validate_mutation(&invalid_mutation).is_err());
    }

    #[test]
    fn test_snapshot_rollback() {
        let mut engine = SafeguardEngine::new();
        engine.create_snapshot(vec![1, 2, 3]);
        engine.increment_generation();

        let snapshot = engine.rollback(0).unwrap();
        assert_eq!(snapshot.data, vec![1, 2, 3]);
    }
}
