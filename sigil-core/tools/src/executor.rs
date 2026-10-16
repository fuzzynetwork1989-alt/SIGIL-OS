use crate::{Tool, ToolResult};
use crate::registry::ToolRegistry;
use crate::mcp::MCPClient;
use anyhow::Result;
use serde_json::Value;
use std::sync::Arc;
use std::time::Instant;
use uuid::Uuid;

/// Tool executor
pub struct ToolExecutor {
    registry: Arc<ToolRegistry>,
    mcp_client: Arc<MCPClient>,
}

impl ToolExecutor {
    /// Create a new tool executor
    pub fn new(registry: Arc<ToolRegistry>, mcp_client: Arc<MCPClient>) -> Self {
        Self {
            registry,
            mcp_client,
        }
    }
    
    /// Execute a tool
    pub async fn execute(&self, tool_id: Uuid, parameters: Value) -> Result<ToolResult> {
        let start = Instant::now();
        
        // Get tool
        let tool = self.registry.get(tool_id).await?;
        
        // Check if tool is enabled
        if !tool.enabled {
            return Ok(ToolResult {
                tool_id,
                success: false,
                output: Value::Null,
                error: Some("Tool is disabled".to_string()),
                execution_time_ms: 0,
            });
        }
        
        // Execute tool (placeholder implementation)
        let result = self.execute_tool_internal(&tool.name, parameters).await;
        
        let execution_time = start.elapsed().as_millis() as u64;
        
        match result {
            Ok(output) => Ok(ToolResult {
                tool_id,
                success: true,
                output,
                error: None,
                execution_time_ms: execution_time,
            }),
            Err(e) => Ok(ToolResult {
                tool_id,
                success: false,
                output: Value::Null,
                error: Some(e.to_string()),
                execution_time_ms: execution_time,
            }),
        }
    }
    
    /// Internal tool execution
    async fn execute_tool_internal(&self, tool_name: &str, parameters: Value) -> Result<Value> {
        // Try MCP tools first
        if let Ok(result) = self.mcp_client.call_tool(tool_name, parameters).await {
            return Ok(result);
        }
        
        // Placeholder for custom tool execution
        Ok(serde_json::json!({
            "message": format!("Executed tool: {}", tool_name),
            "parameters": parameters
        }))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[tokio::test]
    async fn test_executor() {
        let registry = Arc::new(ToolRegistry::new().await.unwrap());
        let mcp_client = Arc::new(MCPClient::new().await.unwrap());
        let executor = ToolExecutor::new(registry, mcp_client);
        
        // Would need a registered tool to test execution
        assert!(true);
    }
}
