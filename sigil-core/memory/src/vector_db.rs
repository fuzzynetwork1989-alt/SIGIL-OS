use crate::{MemoryEntry, MemoryError, MemoryType};
use qdrant_client::qdrant::{
    vectors_config, CreateCollection, DeletePoints, Distance, GetPoints, PointStruct,
    PointsSelector, SearchPoints, UpsertPoints, VectorParams, VectorsConfig,
};
use qdrant_client::{Payload, Qdrant};
use std::time::Duration;
use uuid::Uuid;

/// Vector database integration with Qdrant
pub struct VectorDatabase {
    client: Qdrant,
}

impl VectorDatabase {
    /// Create a new vector database client
    pub async fn new(url: &str) -> Result<Self, MemoryError> {
        let client = Qdrant::from_url(url)
            .timeout(Duration::from_secs(30))
            .build()
            .map_err(|e| MemoryError::VectorDatabase(e.to_string()))?;

        Ok(Self { client })
    }

    /// Initialize collections for different memory types
    pub async fn initialize_collections(&self) -> Result<(), MemoryError> {
        let memory_types = vec![
            MemoryType::Working,
            MemoryType::Episodic,
            MemoryType::Semantic,
            MemoryType::LongTerm,
        ];

        for memory_type in memory_types {
            let collection_name = Self::collection_name(&memory_type);
            self.create_collection_if_not_exists(&collection_name).await?;
        }

        Ok(())
    }

    /// Store a memory in the vector database
    pub async fn store_memory(&self, memory: &MemoryEntry) -> Result<(), MemoryError> {
        let collection_name = Self::collection_name(&memory.memory_type);

        let embedding = memory.embedding.as_ref().ok_or_else(|| {
            MemoryError::InvalidOperation("Memory has no embedding".to_string())
        })?;

        let payload = Payload::try_from(
            serde_json::to_value(memory).map_err(|e| MemoryError::Storage(e.to_string()))?,
        )
        .map_err(|e| MemoryError::Storage(e.to_string()))?;

        let point = PointStruct {
            id: Some(memory.id.to_string().into()),
            payload: payload.into(),
            vectors: Some(embedding.clone().into()),
        };

        self.client
            .upsert_points(UpsertPoints {
                collection_name: collection_name.clone(),
                wait: Some(true),
                points: vec![point],
                ..Default::default()
            })
            .await
            .map_err(|e| MemoryError::VectorDatabase(e.to_string()))?;

        Ok(())
    }

    /// Retrieve a memory by ID
    pub async fn retrieve_memory(&self, id: Uuid) -> Result<MemoryEntry, MemoryError> {
        // Search all collections for the memory
        let memory_types = vec![
            MemoryType::Working,
            MemoryType::Episodic,
            MemoryType::Semantic,
            MemoryType::LongTerm,
        ];

        for memory_type in memory_types {
            let collection_name = Self::collection_name(&memory_type);

            if let Ok(result) = self
                .client
                .get_points(GetPoints {
                    collection_name,
                    ids: vec![id.to_string().into()],
                    with_payload: Some(true.into()),
                    with_vectors: Some(true.into()),
                    ..Default::default()
                })
                .await
            {
                if let Some(point) = result.result.first() {
                    let memory: MemoryEntry = serde_json::from_value(
                        serde_json::to_value(&point.payload)
                            .map_err(|e| MemoryError::Storage(e.to_string()))?,
                    )
                    .map_err(|e| MemoryError::Storage(e.to_string()))?;
                    return Ok(memory);
                }
            }
        }

        Err(MemoryError::NotFound(id))
    }

    /// Search memories by embedding similarity
    pub async fn search_by_embedding(
        &self,
        embedding: &[f32],
        memory_type: MemoryType,
        limit: usize,
    ) -> Result<Vec<MemoryEntry>, MemoryError> {
        let collection_name = Self::collection_name(&memory_type);

        let search_result = self
            .client
            .search_points(SearchPoints {
                collection_name,
                vector: embedding.to_vec(),
                limit: limit as u64,
                with_payload: Some(true.into()),
                with_vectors: Some(false.into()),
                ..Default::default()
            })
            .await
            .map_err(|e| MemoryError::VectorDatabase(e.to_string()))?;

        let memories: Result<Vec<MemoryEntry>, _> = search_result
            .result
            .into_iter()
            .map(|point| {
                let memory: MemoryEntry = serde_json::from_value(
                    serde_json::to_value(&point.payload)
                        .map_err(|e| MemoryError::Storage(e.to_string()))?,
                )
                .map_err(|e| MemoryError::Storage(e.to_string()))?;
                Ok(memory)
            })
            .collect();

        memories
    }

    /// Update a memory
    pub async fn update_memory(&self, memory: &MemoryEntry) -> Result<(), MemoryError> {
        self.store_memory(memory).await
    }

    /// Delete a memory
    pub async fn delete_memory(&self, id: Uuid) -> Result<(), MemoryError> {
        let memory_types = vec![
            MemoryType::Working,
            MemoryType::Episodic,
            MemoryType::Semantic,
            MemoryType::LongTerm,
        ];

        for memory_type in memory_types {
            let collection_name = Self::collection_name(&memory_type);

            let _ = self
                .client
                .delete_points(DeletePoints {
                    collection_name,
                    points: Some(PointsSelector::from(vec![id.to_string().into()])),
                    ..Default::default()
                })
                .await;
        }

        Ok(())
    }

    /// Create collection if it doesn't exist
    async fn create_collection_if_not_exists(&self, name: &str) -> Result<(), MemoryError> {
        let collections = self
            .client
            .list_collections()
            .await
            .map_err(|e| MemoryError::VectorDatabase(e.to_string()))?;

        let exists = collections
            .collections
            .iter()
            .any(|c| c.name.as_str() == name);

        if !exists {
            self.client
                .create_collection(CreateCollection {
                    collection_name: name.to_string(),
                    vectors_config: Some(VectorsConfig {
                        config: Some(vectors_config::Config::Params(VectorParams {
                            size: 1536, // OpenAI embedding dimension
                            distance: Distance::Cosine as i32,
                            ..Default::default()
                        })),
                    }),
                    ..Default::default()
                })
                .await
                .map_err(|e| MemoryError::VectorDatabase(e.to_string()))?;
        }

        Ok(())
    }

    /// Get collection name for memory type
    fn collection_name(memory_type: &MemoryType) -> String {
        match memory_type {
            MemoryType::Working => "working_memory".to_string(),
            MemoryType::Episodic => "episodic_memory".to_string(),
            MemoryType::Semantic => "semantic_memory".to_string(),
            MemoryType::LongTerm => "long_term_memory".to_string(),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_collection_name() {
        assert_eq!(
            VectorDatabase::collection_name(&MemoryType::Episodic),
            "episodic_memory"
        );
    }
}
