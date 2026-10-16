use crate::Tool;
use anyhow::Result;
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use uuid::Uuid;

/// Tool registry for managing available tools
pub struct ToolRegistry {
    tools: Arc<RwLock<HashMap<Uuid, Tool>>>,
    tools_by_name: Arc<RwLock<HashMap<String, Uuid>>>,
}

impl ToolRegistry {
    /// Create a new tool registry
    pub async fn new() -> Result<Self> {
        Ok(Self {
            tools: Arc::new(RwLock::new(HashMap::new())),
            tools_by_name: Arc::new(RwLock::new(HashMap::new())),
        })
    }
    
    /// Register a tool
    pub async fn register(&self, tool: Tool) -> Result<Uuid> {
        let id = tool.id;
        let name = tool.name.clone();
        
        {
            let mut tools = self.tools.write().await;
            tools.insert(id, tool);
        }
        
        {
            let mut tools_by_name = self.tools_by_name.write().await;
            tools_by_name.insert(name, id);
        }
        
        Ok(id)
    }
    
    /// Get a tool by ID
    pub async fn get(&self, id: Uuid) -> Result<Tool> {
        let tools = self.tools.read().await;
        tools
            .get(&id)
            .cloned()
            .ok_or_else(|| anyhow::anyhow!("Tool not found"))
    }
    
    /// Get a tool by name
    pub async fn get_by_name(&self, name: &str) -> Result<Tool> {
        let tools_by_name = self.tools_by_name.read().await;
        let id = tools_by_name
            .get(name)
            .ok_or_else(|| anyhow::anyhow!("Tool not found"))?;
        
        let tools = self.tools.read().await;
        tools
            .get(id)
            .cloned()
            .ok_or_else(|| anyhow::anyhow!("Tool not found"))
    }
    
    /// List all tools
    pub async fn list_all(&self) -> Result<Vec<Tool>> {
        let tools = self.tools.read().await;
        Ok(tools.values().cloned().collect())
    }
    
    /// Unregister a tool
    pub async fn unregister(&self, id: Uuid) -> Result<()> {
        let tool = {
            let mut tools = self.tools.write().await;
            tools.remove(&id)
        };
        
        if let Some(tool) = tool {
            let mut tools_by_name = self.tools_by_name.write().await;
            tools_by_name.remove(&tool.name);
        }
        
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[tokio::test]
    async fn test_tool_registry() {
        let registry = ToolRegistry::new().await.unwrap();
        
        let tool = Tool {
            id: Uuid::new_v4(),
            name: "test_tool".to_string(),
            description: "Test tool".to_string(),
            parameters: serde_json::json!({}),
            permissions: Vec::new(),
            enabled: true,
        };
        
        let id = registry.register(tool).await.unwrap();
        let retrieved = registry.get(id).await.unwrap();
        assert_eq!(retrieved.name, "test_tool");
    }
}
