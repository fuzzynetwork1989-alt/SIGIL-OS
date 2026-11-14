# NEXORA Omega API Documentation

## Base URL

**Production**: `https://api.nexora.omega`
**Staging**: `https://api.staging.nexora.omega`
**Development**: `http://localhost:3000`

## Authentication

All API requests require authentication using JWT tokens.

### Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

### Authentication Endpoints

#### Register

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "User Name"
}
```

**Response**: `204 No Content`

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response**:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "tenant_id": "tenant_id"
  }
}
```

#### Logout

```http
POST /auth/logout
Authorization: Bearer <token>
```

**Response**: `204 No Content`

## Health Check

```http
GET /health
```

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0",
  "services": {
    "database": "healthy",
    "redis": "healthy",
    "model_gateway": "healthy"
  }
}
```

## Cognitive Processes

### Get All Cognitive Processes

```http
GET /cognitive-processes
Authorization: Bearer <token>
```

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `state`: Filter by state
- `workspace_id`: Filter by workspace

**Response**:
```json
{
  "data": [
    {
      "id": "process_id",
      "intent": "Process intent",
      "state": "running",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

### Create Cognitive Process

```http
POST /cognitive-processes
Authorization: Bearer <token>
Content-Type: application/json

{
  "intent": "Process intent",
  "goals": [
    {
      "description": "Goal description",
      "priority": 1
    }
  ],
  "workspace_id": "workspace_id",
  "constraints": ["constraint1", "constraint2"]
}
```

**Response**:
```json
{
  "id": "process_id",
  "intent": "Process intent",
  "state": "dormant",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Get Cognitive Process

```http
GET /cognitive-processes/{process_id}
Authorization: Bearer <token>
```

**Response**:
```json
{
  "id": "process_id",
  "intent": "Process intent",
  "state": "running",
  "goals": [...],
  "beliefs": [...],
  "working_memory_refs": [...],
  "long_term_memory_refs": [...],
  "world_state_refs": [...],
  "self_state": {...},
  "reasoning_budget": {...},
  "model_binding": {...},
  "capability_set": [...],
  "taint_context": [...],
  "execution_plan": {...},
  "provenance_chain": [...],
  "checkpoints": [...],
  "recovery_policy": {...},
  "operator_controls": {...},
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Update Cognitive Process

```http
PUT /cognitive-processes/{process_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "intent": "Updated intent",
  "state": "running"
}
```

**Response**: Updated cognitive process object

### Delete Cognitive Process

```http
DELETE /cognitive-processes/{process_id}
Authorization: Bearer <token>
```

**Response**: `204 No Content`

### Pause Cognitive Process

```http
POST /cognitive-processes/{process_id}/pause
Authorization: Bearer <token>
```

**Response**: `204 No Content`

### Resume Cognitive Process

```http
POST /cognitive-processes/{process_id}/resume
Authorization: Bearer <token>
```

**Response**: `204 No Content`

### Cancel Cognitive Process

```http
POST /cognitive-processes/{process_id}/cancel
Authorization: Bearer <token>
```

**Response**: `204 No Content`

## Memory

### Get All Memories

```http
GET /memory
Authorization: Bearer <token>
```

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `type`: Filter by memory type
- `workspace_id`: Filter by workspace

**Response**:
```json
{
  "data": [
    {
      "id": "memory_id",
      "type": "episodic",
      "content": "Memory content",
      "confidence": 0.95,
      "tags": ["tag1", "tag2"],
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

### Create Memory

```http
POST /memory
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "episodic",
  "content": "Memory content",
  "workspace_id": "workspace_id",
  "tags": ["tag1", "tag2"],
  "confidence": 0.95
}
```

**Response**:
```json
{
  "id": "memory_id",
  "type": "episodic",
  "content": "Memory content",
  "confidence": 0.95,
  "tags": ["tag1", "tag2"],
  "provenance": {...},
  "access_policy": {...},
  "retention": {...},
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Get Memory

```http
GET /memory/{memory_id}
Authorization: Bearer <token>
```

**Response**: Memory object with full details

### Update Memory

```http
PUT /memory/{memory_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Updated content",
  "confidence": 0.98
}
```

**Response**: Updated memory object

### Delete Memory

```http
DELETE /memory/{memory_id}
Authorization: Bearer <token>
```

**Response**: `204 No Content`

### Search Memory

```http
POST /memory/search
Authorization: Bearer <token>
Content-Type: application/json

{
  "query": "search query",
  "type": "episodic",
  "workspace_id": "workspace_id",
  "limit": 10
}
```

**Response**:
```json
{
  "results": [
    {
      "id": "memory_id",
      "content": "Memory content",
      "score": 0.95,
      "metadata": {...}
    }
  ]
}
```

## Capabilities

### Get All Capabilities

```http
GET /capabilities
Authorization: Bearer <token>
```

**Query Parameters**:
- `principal`: Filter by principal
- `resource`: Filter by resource
- `action`: Filter by action

**Response**:
```json
{
  "data": [
    {
      "id": "capability_id",
      "principal": "user_id",
      "resource": "workspace:*",
      "action": "read",
      "conditions": {...},
      "granted_by": "granter_id",
      "granted_at": "2024-01-01T00:00:00Z",
      "expires_at": "2024-12-31T23:59:59Z"
    }
  ]
}
```

### Grant Capability

```http
POST /capabilities
Authorization: Bearer <token>
Content-Type: application/json

{
  "principal": "user_id",
  "resource": "workspace:*",
  "action": "read",
  "conditions": {
    "time_range": {
      "start": "2024-01-01T00:00:00Z",
      "end": "2024-12-31T23:59:59Z"
    }
  },
  "expires_at": "2024-12-31T23:59:59Z"
}
```

**Response**:
```json
{
  "id": "capability_id",
  "principal": "user_id",
  "resource": "workspace:*",
  "action": "read",
  "conditions": {...},
  "granted_by": "granter_id",
  "granted_at": "2024-01-01T00:00:00Z",
  "expires_at": "2024-12-31T23:59:59Z"
}
```

### Revoke Capability

```http
DELETE /capabilities/{capability_id}
Authorization: Bearer <token>
```

**Response**: `204 No Content`

### Check Capability

```http
POST /capabilities/check
Authorization: Bearer <token>
Content-Type: application/json

{
  "principal": "user_id",
  "resource": "workspace:123",
  "action": "write"
}
```

**Response**:
```json
{
  "allowed": true,
  "capability_id": "capability_id",
  "conditions": {...}
}
```

## Workspaces

### Get All Workspaces

```http
GET /workspaces
Authorization: Bearer <token>
```

**Response**:
```json
{
  "data": [
    {
      "id": "workspace_id",
      "name": "Workspace Name",
      "tenant_id": "tenant_id",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Create Workspace

```http
POST /workspaces
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Workspace Name",
  "tenant_id": "tenant_id"
}
```

**Response**: Created workspace object

### Get Workspace

```http
GET /workspaces/{workspace_id}
Authorization: Bearer <token>
```

**Response**: Workspace object with full details

### Update Workspace

```http
PUT /workspaces/{workspace_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name"
}
```

**Response**: Updated workspace object

### Delete Workspace

```http
DELETE /workspaces/{workspace_id}
Authorization: Bearer <token>
```

**Response**: `204 No Content`

## Model Gateway

### Generate Text

```http
POST /model/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "model": "Qwen/Qwen3-30B-A3B-Instruct-2507",
  "prompt": "Generate text about...",
  "max_tokens": 1000,
  "temperature": 0.7,
  "stream": false
}
```

**Response**:
```json
{
  "id": "generation_id",
  "model": "Qwen/Qwen3-30B-A3B-Instruct-2507",
  "choices": [
    {
      "text": "Generated text...",
      "finish_reason": "stop",
      "index": 0
    }
  ],
  "usage": {
    "prompt_tokens": 50,
    "completion_tokens": 100,
    "total_tokens": 150
  },
  "created": 1704067200
}
```

### Stream Generation

```http
POST /model/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "model": "Qwen/Qwen3-30B-A3B-Instruct-2507",
  "prompt": "Generate text about...",
  "max_tokens": 1000,
  "temperature": 0.7,
  "stream": true
}
```

**Response**: Server-Sent Events (SSE) stream

### Get Model Info

```http
GET /model/info
Authorization: Bearer <token>
```

**Response**:
```json
{
  "models": [
    {
      "id": "Qwen/Qwen3-30B-A3B-Instruct-2507",
      "name": "Qwen3-30B-A3B-Instruct-2507",
      "context_length": 262144,
      "capabilities": ["text", "code", "reasoning"]
    }
  ]
}
```

## Tools

### Execute Tool

```http
POST /tools/execute
Authorization: Bearer <token>
Content-Type: application/json

{
  "tool_id": "tool_id",
  "parameters": {
    "param1": "value1",
    "param2": "value2"
  },
  "cognitive_process_id": "process_id"
}
```

**Response**:
```json
{
  "id": "execution_id",
  "tool_id": "tool_id",
  "status": "success",
  "result": {...},
  "error": null,
  "started_at": "2024-01-01T00:00:00Z",
  "completed_at": "2024-01-01T00:00:05Z"
}
```

### Get Available Tools

```http
GET /tools
Authorization: Bearer <token>
```

**Response**:
```json
{
  "tools": [
    {
      "id": "tool_id",
      "name": "Tool Name",
      "description": "Tool description",
      "parameters": {...},
      "required_capabilities": ["capability1"]
    }
  ]
}
```

## Approvals

### Get Pending Approvals

```http
GET /approvals
Authorization: Bearer <token>
```

**Query Parameters**:
- `status`: Filter by status (pending, approved, denied)
- `risk_class`: Filter by risk class

**Response**:
```json
{
  "data": [
    {
      "id": "approval_id",
      "type": "tool_execution",
      "description": "Approval description",
      "risk_class": "C",
      "requested_by": "user_id",
      "requested_at": "2024-01-01T00:00:00Z",
      "expires_at": "2024-01-02T00:00:00Z",
      "status": "pending"
    }
  ]
}
```

### Approve Request

```http
POST /approvals/{approval_id}/approve
Authorization: Bearer <token>
```

**Response**: `204 No Content`

### Deny Request

```http
POST /approvals/{approval_id}/deny
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Denial reason"
}
```

**Response**: `204 No Content`

## Error Responses

All endpoints may return error responses:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {...}
  }
}
```

### Common Error Codes

- `UNAUTHORIZED`: Invalid or missing authentication
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid request data
- `INTERNAL_ERROR`: Server error
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `SERVICE_UNAVAILABLE`: Service temporarily unavailable

## Rate Limiting

- **Default**: 100 requests per minute per user
- **Burst**: 200 requests per minute per user
- **Headers**:
  - `X-RateLimit-Limit`: Rate limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset time

## Webhooks

### Create Webhook

```http
POST /webhooks
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://your-webhook-url.com",
  "events": ["cognitive.process.completed", "memory.created"],
  "secret": "webhook_secret"
}
```

**Response**: Created webhook object

### Delete Webhook

```http
DELETE /webhooks/{webhook_id}
Authorization: Bearer <token>
```

**Response**: `204 No Content`

## SDK Integration

### TypeScript/JavaScript

```typescript
import { NexoraAPI } from '@nexora/sdk'

const api = new NexoraAPI({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.nexora.omega'
})

// Create cognitive process
const process = await api.cognitiveProcesses.create({
  intent: 'Analyze data',
  workspaceId: 'workspace_id'
})

// Generate text
const response = await api.model.generate({
  model: 'Qwen/Qwen3-30B-A3B-Instruct-2507',
  prompt: 'Explain quantum computing'
})
```

### Python

```python
from nexora_sdk import NexoraAPI

api = NexoraAPI(
    api_key='your-api-key',
    base_url='https://api.nexora.omega'
)

# Create cognitive process
process = api.cognitive_processes.create(
    intent='Analyze data',
    workspace_id='workspace_id'
)

# Generate text
response = api.model.generate(
    model='Qwen/Qwen3-30B-A3B-Instruct-2507',
    prompt='Explain quantum computing'
)
```

## Testing

### Sandbox Environment

Use the sandbox environment for testing:

**Base URL**: `https://api.sandbox.nexora.omega`

### Test Credentials

- **Email**: test@nexora.omega
- **Password**: testpassword123

## Support

- **Documentation**: https://docs.nexora.omega
- **API Status**: https://status.nexora.omega
- **Support**: api-support@nexora.omega
- **GitHub Issues**: https://github.com/fuzzynetwork1989-alt/nexora-omega/issues