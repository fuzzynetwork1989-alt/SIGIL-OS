//! Cognitive Pathway Mutation
//!
//! This module enables controlled evolution of SIGIL OS's cognitive pathways.

use std::collections::HashMap;
use uuid::Uuid;

use crate::Result;

/// Cognitive pathway
#[derive(Debug, Clone)]
pub struct CognitivePathway {
    /// Pathway ID
    pub id: Uuid,

    /// Pathway name
    pub name: String,

    /// Pathway weight
    pub weight: f32,

    /// Pathway connections
    pub connections: Vec<Uuid>,

    /// Pathway metadata
    pub metadata: HashMap<String, String>,
}

/// Pathway mutation
#[derive(Debug, Clone)]
pub struct PathwayMutation {
    /// Mutation ID
    pub id: Uuid,

    /// Mutation type
    pub mutation_type: MutationType,

    /// Source pathway
    pub source: Uuid,

    /// Target pathway
    pub target: Uuid,

    /// Mutation magnitude (0.0 - 1.0)
    pub magnitude: f32,

    /// Approved for application
    pub approved: bool,
}

/// Mutation type
#[derive(Debug, Clone, Copy)]
pub enum MutationType {
    /// Weight adjustment
    WeightAdjustment,

    /// Connection addition
    ConnectionAddition,

    /// Connection removal
    ConnectionRemoval,

    /// Pathway creation
    PathwayCreation,
}

/// Mutation strategy
#[derive(Debug, Clone)]
pub struct MutationStrategy {
    /// Strategy name
    pub name: String,

    /// Strategy description
    pub description: String,

    /// Mutation parameters
    pub parameters: HashMap<String, f32>,
}

/// Mutation Engine
pub struct MutationEngine {
    /// Cognitive pathways
    pathways: HashMap<Uuid, CognitivePathway>,

    /// Pending mutations
    pending_mutations: Vec<PathwayMutation>,

    /// Applied mutations
    applied_mutations: Vec<PathwayMutation>,
}

impl MutationEngine {
    /// Create a new mutation engine
    pub fn new() -> Self {
        Self {
            pathways: HashMap::new(),
            pending_mutations: Vec::new(),
            applied_mutations: Vec::new(),
        }
    }

    /// Add a cognitive pathway
    pub fn add_pathway(&mut self, pathway: CognitivePathway) {
        self.pathways.insert(pathway.id, pathway);
    }

    /// Propose a mutation
    pub fn propose_mutation(&mut self, mutation: PathwayMutation) {
        self.pending_mutations.push(mutation);
    }

    /// Apply approved mutations
    pub fn apply_mutations(&mut self) -> Result<()> {
        let approved_indices: Vec<usize> = self
            .pending_mutations
            .iter()
            .enumerate()
            .filter(|(_, m)| m.approved)
            .map(|(i, _)| i)
            .collect();

        for i in approved_indices {
            let mutation = self.pending_mutations.remove(i);
            self.apply_mutation(&mutation)?;
            self.applied_mutations.push(mutation);
        }

        Ok(())
    }

    /// Apply a single mutation
    fn apply_mutation(&mut self, mutation: &PathwayMutation) -> Result<()> {
        match mutation.mutation_type {
            MutationType::WeightAdjustment => {
                if let Some(pathway) = self.pathways.get_mut(&mutation.source) {
                    pathway.weight += mutation.magnitude;
                }
            }
            MutationType::ConnectionAddition => {
                if let Some(pathway) = self.pathways.get_mut(&mutation.source) {
                    pathway.connections.push(mutation.target);
                }
            }
            MutationType::ConnectionRemoval => {
                if let Some(pathway) = self.pathways.get_mut(&mutation.source) {
                    pathway.connections.retain(|&id| id != mutation.target);
                }
            }
            MutationType::PathwayCreation => {
                // New pathway creation would require more parameters
            }
        }
        Ok(())
    }

    /// Get pathways
    pub fn get_pathways(&self) -> &HashMap<Uuid, CognitivePathway> {
        &self.pathways
    }

    /// Get pending mutations
    pub fn get_pending_mutations(&self) -> &[PathwayMutation] {
        &self.pending_mutations
    }
}

impl Default for MutationEngine {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_mutation_engine() {
        let mut engine = MutationEngine::new();

        let pathway = CognitivePathway {
            id: Uuid::new_v4(),
            name: "test_pathway".to_string(),
            weight: 0.5,
            connections: vec![],
            metadata: HashMap::new(),
        };

        engine.add_pathway(pathway.clone());
        assert_eq!(engine.get_pathways().len(), 1);
    }

    #[test]
    fn test_mutation_proposal() {
        let mut engine = MutationEngine::new();

        let mutation = PathwayMutation {
            id: Uuid::new_v4(),
            mutation_type: MutationType::WeightAdjustment,
            source: Uuid::new_v4(),
            target: Uuid::new_v4(),
            magnitude: 0.1,
            approved: false,
        };

        engine.propose_mutation(mutation);
        assert_eq!(engine.get_pending_mutations().len(), 1);
    }
}
