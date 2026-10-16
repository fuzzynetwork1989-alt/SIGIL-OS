//! Architecture Genome - Track and manage architectural evolution

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use chrono::{DateTime, Utc};
use uuid::Uuid;

/// Architectural component
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Component {
    pub id: String,
    pub name: String,
    pub version: String,
    pub parent_id: Option<String>,
    pub dependencies: Vec<String>,
    pub interfaces: Vec<Interface>,
    pub created_at: DateTime<Utc>,
}

/// Interface definition
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Interface {
    pub name: String,
    pub methods: Vec<Method>,
}

/// Method definition
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Method {
    pub name: String,
    pub signature: String,
    pub return_type: String,
}

/// Architecture mutation
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Mutation {
    pub id: String,
    pub component_id: String,
    pub mutation_type: MutationType,
    pub description: String,
    pub author: String,
    pub timestamp: DateTime<Utc>,
    pub approved: bool,
}

/// Mutation type
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum MutationType {
    AddComponent,
    RemoveComponent,
    ModifyComponent,
    AddDependency,
    RemoveDependency,
    ModifyInterface,
}

/// Architecture genome
pub struct ArchitectureGenome {
    components: HashMap<String, Component>,
    mutations: Vec<Mutation>,
}

impl ArchitectureGenome {
    pub fn new() -> Self {
        Self {
            components: HashMap::new(),
            mutations: Vec::new(),
        }
    }

    pub fn register_component(&mut self, component: Component) {
        self.components.insert(component.id.clone(), component);
    }

    pub fn get_component(&self, id: &str) -> Option<&Component> {
        self.components.get(id)
    }

    pub fn list_components(&self) -> Vec<&Component> {
        self.components.values().collect()
    }

    pub fn propose_mutation(&mut self, mutation: Mutation) {
        self.mutations.push(mutation);
    }

    pub fn approve_mutation(&mut self, mutation_id: &str) -> Result<(), String> {
        if let Some(mutation) = self.mutations.iter_mut().find(|m| m.id == mutation_id) {
            mutation.approved = true;
            // Apply mutation
            Ok(())
        } else {
            Err(format!("Mutation not found: {}", mutation_id))
        }
    }

    pub fn get_lineage(&self, component_id: &str) -> Vec<Component> {
        let mut lineage = Vec::new();
        let mut current_id = component_id.to_string();

        while let Some(component) = self.get_component(&current_id) {
            lineage.push(component.clone());
            if let Some(parent_id) = &component.parent_id {
                current_id = parent_id.clone();
            } else {
                break;
            }
        }

        lineage
    }
}

impl Default for ArchitectureGenome {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_genome() {
        let mut genome = ArchitectureGenome::new();
        
        let component = Component {
            id: "test-component".to_string(),
            name: "Test Component".to_string(),
            version: "1.0.0".to_string(),
            parent_id: None,
            dependencies: vec![],
            interfaces: vec![],
            created_at: Utc::now(),
        };

        genome.register_component(component);
        assert!(genome.get_component("test-component").is_some());
    }
}
