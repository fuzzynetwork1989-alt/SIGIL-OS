use crate::{Entity, EntityType, Relationship};
use anyhow::Result;
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;

/// Knowledge graph storing entities and relationships
pub struct KnowledgeGraph {
    entities: Arc<RwLock<HashMap<Uuid, Entity>>>,
    relationships: Arc<RwLock<HashMap<Uuid, Relationship>>>,
    entity_by_type: Arc<RwLock<HashMap<EntityType, Vec<Uuid>>>>,
}

impl KnowledgeGraph {
    /// Create a new knowledge graph
    pub async fn new() -> Result<Self> {
        Ok(Self {
            entities: Arc::new(RwLock::new(HashMap::new())),
            relationships: Arc::new(RwLock::new(HashMap::new())),
            entity_by_type: Arc::new(RwLock::new(HashMap::new())),
        })
    }
    
    /// Add an entity
    pub async fn add_entity(&self, entity: Entity) -> Result<Uuid> {
        let id = entity.id;
        let entity_type = entity.entity_type.clone();
        
        {
            let mut entities = self.entities.write().await;
            entities.insert(id, entity);
        }
        
        {
            let mut entity_by_type = self.entity_by_type.write().await;
            entity_by_type
                .entry(entity_type)
                .or_insert_with(Vec::new)
                .push(id);
        }
        
        Ok(id)
    }
    
    /// Get an entity
    pub async fn get_entity(&self, id: Uuid) -> Result<Entity> {
        let entities = self.entities.read().await;
        entities
            .get(&id)
            .cloned()
            .ok_or_else(|| anyhow::anyhow!("Entity not found"))
    }
    
    /// Add a relationship
    pub async fn add_relationship(&self, relationship: Relationship) -> Result<Uuid> {
        let id = relationship.id;
        
        let mut relationships = self.relationships.write().await;
        relationships.insert(id, relationship);
        
        Ok(id)
    }
    
    /// Query entities by type
    pub async fn query_by_type(&self, entity_type: EntityType) -> Result<Vec<Entity>> {
        let entity_by_type = self.entity_by_type.read().await;
        let entities = self.entities.read().await;
        
        let entity_ids = entity_by_type.get(&entity_type).cloned().unwrap_or_default();
        
        let result: Vec<Entity> = entity_ids
            .iter()
            .filter_map(|id| entities.get(id).cloned())
            .collect();
        
        Ok(result)
    }
    
    /// Find related entities
    pub async fn find_related(&self, entity_id: Uuid) -> Result<Vec<Entity>> {
        let relationships = self.relationships.read().await;
        let entities = self.entities.read().await;
        
        let related_ids: Vec<Uuid> = relationships
            .values()
            .filter(|r| r.from_entity_id == entity_id || r.to_entity_id == entity_id)
            .map(|r| {
                if r.from_entity_id == entity_id {
                    r.to_entity_id
                } else {
                    r.from_entity_id
                }
            })
            .collect();
        
        let result: Vec<Entity> = related_ids
            .iter()
            .filter_map(|id| entities.get(id).cloned())
            .collect();
        
        Ok(result)
    }
    
    /// Update an entity
    pub async fn update_entity(&self, entity: Entity) -> Result<()> {
        let mut entities = self.entities.write().await;
        entities.insert(entity.id, entity);
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[tokio::test]
    async fn test_knowledge_graph() {
        let kg = KnowledgeGraph::new().await.unwrap();
        
        let entity = Entity::new("Test".to_string(), EntityType::Person);
        let id = kg.add_entity(entity).await.unwrap();
        
        let retrieved = kg.get_entity(id).await.unwrap();
        assert_eq!(retrieved.name, "Test");
    }
}
