//! Agent Ecosystem - Multi-agent architecture and agent interactions

pub mod agent;
pub mod communication;
pub mod coordination;

pub use agent::{Agent, AgentType, AgentStatus};
pub use communication::{Message, MessageType};
pub use coordination::{Orchestrator, CoordinationStrategy};
