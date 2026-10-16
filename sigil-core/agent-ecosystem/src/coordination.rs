//! Agent coordination and orchestration

use crate::agent::{Agent, AgentStatus};
use std::collections::HashMap;

pub struct Orchestrator {
    agents: HashMap<String, Agent>,
    strategy: CoordinationStrategy,
}

#[derive(Debug, Clone)]
pub enum CoordinationStrategy {
    RoundRobin,
    Priority,
    LoadBalanced,
    Manual,
}

impl Orchestrator {
    pub fn new(strategy: CoordinationStrategy) -> Self {
        Self {
            agents: HashMap::new(),
            strategy,
        }
    }

    pub fn register_agent(&mut self, agent: Agent) {
        self.agents.insert(agent.id.clone(), agent);
    }

    pub fn get_available_agent(&self) -> Option<&Agent> {
        self.agents
            .values()
            .find(|a| matches!(a.status, AgentStatus::Idle))
    }

    pub fn get_agent_by_type(&self, agent_type: &crate::agent::AgentType) -> Option<&Agent> {
        self.agents.values().find(|a| &a.agent_type == agent_type)
    }
}
