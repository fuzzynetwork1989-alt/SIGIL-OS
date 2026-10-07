//! Evolutionary History Ledger
//!
//! This module tracks every evolutionary step with full provenance.

use std::collections::HashMap;
use uuid::Uuid;

use crate::Result;

/// Evolutionary history
#[derive(Debug, Clone)]
pub struct EvolutionaryHistory {
    /// History ID
    pub id: Uuid,

    /// Generations
    pub generations: Vec<Generation>,

    /// Current generation number
    pub current_generation: u32,
}

/// Generation
#[derive(Debug, Clone)]
pub struct Generation {
    /// Generation number
    pub number: u32,

    /// Timestamp
    pub timestamp: chrono::DateTime<chrono::Utc>,

    /// Mutations applied
    pub mutations: Vec<Uuid>,

    /// Insights from dreams
    pub insights: Vec<Uuid>,

    /// Provenance chain
    pub provenance: ProvenanceChain,
}

/// Provenance chain
#[derive(Debug, Clone)]
pub struct ProvenanceChain {
    /// Chain ID
    pub id: Uuid,

    /// Parent generation IDs
    pub parents: Vec<Uuid>,

    /// Sigil IDs authorizing the evolution
    pub sigils: Vec<Uuid>,

    /// Approval status
    pub approved: bool,
}

/// Evolutionary Ledger
pub struct EvolutionaryLedger {
    /// History
    history: EvolutionaryHistory,
}

impl EvolutionaryLedger {
    /// Create a new ledger
    pub fn new() -> Self {
        Self {
            history: EvolutionaryHistory {
                id: Uuid::new_v4(),
                generations: Vec::new(),
                current_generation: 0,
            },
        }
    }

    /// Record a new generation
    pub fn record_generation(&mut self, generation: Generation) -> Result<()> {
        self.history.generations.push(generation);
        self.history.current_generation += 1;
        Ok(())
    }

    /// Get current generation
    pub fn get_current_generation(&self) -> u32 {
        self.history.current_generation
    }

    /// Get generation by number
    pub fn get_generation(&self, number: u32) -> Option<&Generation> {
        self.history.generations.iter().find(|g| g.number == number)
    }

    /// Get all generations
    pub fn get_generations(&self) -> &[Generation] {
        &self.history.generations
    }
}

impl Default for EvolutionaryLedger {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_ledger_creation() {
        let ledger = EvolutionaryLedger::new();
        assert_eq!(ledger.get_current_generation(), 0);
    }

    #[test]
    fn test_generation_recording() {
        let mut ledger = EvolutionaryLedger::new();

        let generation = Generation {
            number: 1,
            timestamp: chrono::Utc::now(),
            mutations: vec![],
            insights: vec![],
            provenance: ProvenanceChain {
                id: Uuid::new_v4(),
                parents: vec![],
                sigils: vec![],
                approved: true,
            },
        };

        ledger.record_generation(generation).unwrap();
        assert_eq!(ledger.get_current_generation(), 1);
    }
}
