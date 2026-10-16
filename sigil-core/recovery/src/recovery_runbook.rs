/// Recovery runbook with procedures
pub struct RecoveryRunbook {
    procedures: Vec<RecoveryProcedure>,
}

/// Recovery procedure
#[derive(Debug, Clone)]
pub struct RecoveryProcedure {
    pub name: String,
    pub description: String,
    pub steps: Vec<String>,
    pub estimated_time_minutes: u32,
    pub criticality: Criticality,
}

/// Criticality level
#[derive(Debug, Clone, PartialEq)]
pub enum Criticality {
    Low,
    Medium,
    High,
    Critical,
}

impl RecoveryRunbook {
    /// Create a new recovery runbook
    pub fn new() -> Self {
        let procedures = vec![
            RecoveryProcedure {
                name: "Database Recovery".to_string(),
                description: "Restore database from backup".to_string(),
                steps: vec![
                    "Stop database service".to_string(),
                    "Restore from backup".to_string(),
                    "Start database service".to_string(),
                    "Verify data integrity".to_string(),
                ],
                estimated_time_minutes: 30,
                criticality: Criticality::Critical,
            },
            RecoveryProcedure {
                name: "Memory System Recovery".to_string(),
                description: "Restore memory from backup".to_string(),
                steps: vec![
                    "Stop memory service".to_string(),
                    "Restore vector database".to_string(),
                    "Restore memory store".to_string(),
                    "Start memory service".to_string(),
                ],
                estimated_time_minutes: 15,
                criticality: Criticality::High,
            },
            RecoveryProcedure {
                name: "Knowledge Graph Recovery".to_string(),
                description: "Restore knowledge graph from backup".to_string(),
                steps: vec![
                    "Stop world model service".to_string(),
                    "Restore knowledge graph".to_string(),
                    "Start world model service".to_string(),
                ],
                estimated_time_minutes: 10,
                criticality: Criticality::Medium,
            },
        ];
        
        Self { procedures }
    }
    
    /// Get all procedures
    pub fn get_procedures(&self) -> &[RecoveryProcedure] {
        &self.procedures
    }
    
    /// Get procedure by name
    pub fn get_procedure(&self, name: &str) -> Option<&RecoveryProcedure> {
        self.procedures.iter().find(|p| p.name == name)
    }
    
    /// Get procedures by criticality
    pub fn get_by_criticality(&self, criticality: Criticality) -> Vec<&RecoveryProcedure> {
        self.procedures
            .iter()
            .filter(|p| p.criticality == criticality)
            .collect()
    }
}

impl Default for RecoveryRunbook {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_recovery_runbook() {
        let runbook = RecoveryRunbook::new();
        let procedures = runbook.get_procedures();
        assert!(!procedures.is_empty());
    }
}
