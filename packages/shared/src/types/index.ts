// NEXORA Omega Shared Types
// These types are used across all NEXORA Omega services

export type UUID = string;

export interface Timestamp {
  created: Date;
  updated: Date;
}

export interface AuditMetadata {
  id: UUID;
  createdAt: Date;
  createdBy: UUID;
  tenantId: UUID;
  correlationId: UUID;
}

export interface EntityId {
  id: UUID;
  type: string;
  version: number;
}

export interface TenantId {
  id: UUID;
  type: 'organization' | 'personal';
}

export interface WorkspaceId {
  id: UUID;
  tenantId: UUID;
  name: string;
}

export interface UserId {
  id: UUID;
  email: string;
  tenantId: UUID;
}

export interface Capability {
  id: UUID;
  principal: UUID;
  resource: string;
  action: string;
  conditions: Record<string, any>;
  expiresAt?: Date;
  grantedBy: UUID;
  grantedAt: Date;
  revokedAt?: Date;
}

export interface Policy {
  id: UUID;
  name: string;
  version: string;
  rules: PolicyRule[];
  effectiveAt: Date;
  expiresAt?: Date;
}

export interface PolicyRule {
  id: UUID;
  condition: string;
  effect: 'allow' | 'deny';
  resources: string[];
  actions: string[];
}

export interface CognitiveProcessId {
  id: UUID;
  workspaceId: UUID;
  userId: UUID;
  state: CognitiveProcessState;
}

export type CognitiveProcessState =
  | 'dormant'
  | 'observing'
  | 'estimating'
  | 'allocating'
  | 'retrieving'
  | 'hypothesizing'
  | 'planning'
  | 'simulating'
  | 'requesting_approval'
  | 'acting'
  | 'verifying'
  | 'learning'
  | 'consolidating'
  | 'ready'
  | 'paused'
  | 'cancelled'
  | 'snapshotted'
  | 'terminated';

export interface EventEnvelope {
  id: UUID;
  type: string;
  timestamp: Date;
  causationId?: UUID;
  correlationId: UUID;
  tenantId: UUID;
  userId?: UUID;
  data: Record<string, any>;
  metadata: EventMetadata;
}

export interface EventMetadata {
  source: string;
  version: string;
  schemaVersion: string;
  trustClass: 'trusted' | 'untrusted' | 'verified';
}

export interface Memory {
  id: UUID;
  type: MemoryType;
  content: string;
  embedding?: number[];
  provenance: MemoryProvenance;
  accessPolicy: AccessPolicy;
  retention: RetentionPolicy;
  confidence: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type MemoryType =
  | 'episodic'
  | 'semantic'
  | 'procedural'
  | 'temporal'
  | 'preference'
  | 'project'
  | 'policy'
  | 'experience';

export interface MemoryProvenance {
  source: string;
  sourceId?: UUID;
  sourceType: string;
  confidence: number;
  timestamp: Date;
  chain: ProvenanceChain[];
}

export interface ProvenanceChain {
  source: string;
  transformation: string;
  timestamp: Date;
}

export interface AccessPolicy {
  owner: UUID;
  readers: UUID[];
  writers: UUID[];
  public: boolean;
}

export interface RetentionPolicy {
  expiresAt?: Date;
  deleteAfter?: Date;
  archiveAfter?: Date;
}

export interface WorldStateEntity {
  id: UUID;
  type: string;
  attributes: Record<string, any>;
  beliefs: Belief[];
  confidence: number;
  temporalStates: TemporalState[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Belief {
  id: UUID;
  claim: string;
  confidence: number;
  evidence: Evidence[];
  source: UUID;
  timestamp: Date;
}

export interface Evidence {
  id: UUID;
  source: string;
  type: string;
  content: string;
  confidence: number;
  timestamp: Date;
}

export interface TemporalState {
  timestamp: Date;
  attributes: Record<string, any>;
  confidence: number;
  source: string;
}

export interface ModelInvocation {
  id: UUID;
  modelId: string;
  modelVersion: string;
  prompt: string;
  response: string;
  tokensUsed: number;
  latency: number;
  cost: number;
  timestamp: Date;
  cognitiveProcessId?: UUID;
  trustClass: 'trusted' | 'untrusted' | 'verified';
}

export interface ToolCall {
  id: UUID;
  toolId: string;
  toolVersion: string;
  parameters: Record<string, any>;
  result: any;
  status: 'success' | 'failure' | 'timeout';
  timestamp: Date;
  cognitiveProcessId?: UUID;
  capabilityId: UUID;
}

export interface ApprovalRequest {
  id: UUID;
  type: string;
  description: string;
  riskClass: 'A' | 'B' | 'C' | 'D' | 'E';
  requestedBy: UUID;
  requestedAt: Date;
  expiresAt: Date;
  status: 'pending' | 'approved' | 'denied' | 'expired';
  approvedBy?: UUID;
  approvedAt?: Date;
  denialReason?: string;
  cognitiveProcessId?: UUID;
}

export interface Budget {
  id: UUID;
  cognitiveProcessId: UUID;
  type: BudgetType;
  limit: number;
  used: number;
  resetAt?: Date;
}

export type BudgetType =
  | 'wall_clock_time'
  | 'token_count'
  | 'model_call_count'
  | 'tool_call_count'
  | 'memory_retrieval_size'
  | 'cpu'
  | 'gpu'
  | 'ram'
  | 'storage'
  | 'network_egress'
  | 'file_write_volume'
  | 'monetary_cost'
  | 'risk_class'
  | 'approval_count';

export interface Skill {
  id: string;
  version: string;
  owner: UUID;
  purpose: string;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  capabilities: string[];
  riskClass: 'A' | 'B' | 'C' | 'D' | 'E';
  preconditions: string[];
  steps: SkillStep[];
  tests: SkillTest[];
  telemetry: SkillTelemetry;
  rollback: SkillRollback;
  retirementPolicy: SkillRetirementPolicy;
}

export interface SkillStep {
  id: string;
  description: string;
  action: string;
  parameters: Record<string, any>;
  timeout: number;
}

export interface SkillTest {
  id: string;
  name: string;
  type: 'unit' | 'integration' | 'e2e' | 'security';
  input: Record<string, any>;
  expectedOutput: Record<string, any>;
}

export interface SkillTelemetry {
  events: string[];
  metrics: string[];
  logs: boolean;
}

export interface SkillRollback {
  enabled: boolean;
  steps: SkillStep[];
}

export interface SkillRetirementPolicy {
  maxAge: number;
  deprecatedVersions: number;
}