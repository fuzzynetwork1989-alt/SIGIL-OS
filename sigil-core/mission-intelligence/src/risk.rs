//! Risk - represents a mission risk

/// Risk - a potential issue that could impact mission success
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Risk {
    pub id: uuid::Uuid,
    pub mission_id: uuid::Uuid,
    pub description: String,
    pub probability: f64,
    pub impact: RiskImpact,
    pub mitigation: Option<String>,
    pub status: RiskStatus,
}

/// Risk impact level
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub enum RiskImpact {
    Low,
    Medium,
    High,
    Critical,
}

/// Risk status
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub enum RiskStatus {
    Open,
    Mitigating,
    Mitigated,
    Closed,
}
