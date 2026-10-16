use anyhow::Result;
use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use uuid::Uuid;

pub mod registry;
pub mod mcp;
pub mod executor;

use registry::ToolRegistry;
use mcp::MCPClient;
use executor::ToolExecutor;

/// Tool definition
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Tool {
    pub id: Uuid,
    pub name: String,
    pub description: String,
    pub parameters: serde_json::Value,
    pub permissions: Vec<String>,
    pub enabled: bool,
}

/// Tool execution result
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ToolResult {
    pub tool_id: Uuid,
    pub success: bool,
    pub output: serde_json::Value,
    pub error: Option<String>,
    pub execution_time_ms: u64,
}

/// Tool system
pub struct ToolSystem {
    registry: Arc<ToolRegistry>,
    mcp_client: Arc<MCPClient>,
    executor: Arc<ToolExecutor>,
}

impl ToolSystem {
    /// Create a new tool system
    pub async fn new() -> Result<Self> {
        let registry = Arc::new(ToolRegistry::new().await?);
        let mcp_client = Arc::new(MCPClient::new().await?);
        let executor = Arc::new(ToolExecutor::new(registry.clone(), mcp_client.clone()));
        
        Ok(Self {
            registry,
            mcp_client,
            executor,
        })
    }
    
    /// Register a tool
    pub async fn register_tool(&self, tool: Tool) -> Result<Uuid> {
        self.registry.register(tool).await
    }
    
    /// Execute a tool
    pub async fn execute_tool(
        &self,
        tool_id: Uuid,
        parameters: serde_json::Value,
    ) -> Result<ToolResult> {
        self.executor.execute(tool_id, parameters).await
    }
    
    /// List available tools
    pub async fn list_tools(&self) -> Result<Vec<Tool>> {
        self.registry.list_all().await
    }
    
    /// Get tool by ID
    pub async fn get_tool(&self, id: Uuid) -> Result<Tool> {
        self.registry.get(id).await
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[tokio::test]
    async fn test_tool_system_creation() {
        let tool_system = ToolSystem::new().await.unwrap();
        assert!(true);
    }
}
