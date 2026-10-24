# SIGIL OS API Documentation

## Overview

SIGIL OS provides a RESTful HTTP API for interacting with the Post-AI Operating System with Cryptographic Warrant.

**Base URL:** `http://localhost:8080`

**Version:** 0.1.0

## Authentication

Currently, the API does not require authentication. In future phases, cryptographic warrants and device attestation will be required for all operations.

## Endpoints

### Health Check

Check the health status of the SIGIL OS API server.

**Endpoint:** `GET /health`

**Response:**

```json
{
  "status": "ok",
  "version": "0.1.0",
  "timestamp": "2026-10-24T14:29:28.935222200+00:00",
  "superbrain_enabled": true
}
```

**Status Codes:**
- `200 OK`: Server is healthy
- `503 Service Unavailable`: Server is unhealthy

### Chat Endpoint

Send a chat message to the SIGIL OS Super Brain.

**Endpoint:** `POST /api/v1/chat`

**Request Body:**

```json
{
  "message": "Hello, SIGIL OS!",
  "max_tokens": 1000,
  "temperature": 0.7,
  "signature": "optional_ed25519_signature",
  "conversation_id": "optional_conversation_id",
  "user_id": "optional_user_id"
}
```

**Response:**

```json
{
  "response": "Hello! I am SIGIL OS, the Post-AI Operating System with Cryptographic Warrant.",
  "sigil": {
    "id": "uuid",
    "signature": "ed25519_signature",
    "public_key": "ed25519_public_key"
  }
}
```

**Status Codes:**
- `200 OK`: Chat message processed successfully
- `400 Bad Request`: Invalid request
- `500 Internal Server Error`: Server error

### Super Brain Endpoint

Access the SIGIL OS Super Brain cognitive substrate.

**Endpoint:** `POST /api/v1/superbrain`

**Request Body:**

```json
{
  "prompt": "What is the meaning of existence?",
  "conversation_id": "conversation_uuid",
  "user_id": "user_uuid",
  "include_context": true,
  "use_personality": true,
  "enable_memory": true
}
```

**Response:**

```json
{
  "response": "AI-generated response",
  "reasoning_trace": ["step1", "step2", "step3"],
  "confidence": 0.95,
  "sigil": {
    "id": "uuid",
    "signature": "ed25519_signature",
    "public_key": "ed25519_public_key"
  }
}
```

**Status Codes:**
- `200 OK`: Super Brain query processed successfully
- `400 Bad Request`: Invalid request
- `500 Internal Server Error`: Server error

## Cryptographic Sigils

Every material response from the SIGIL OS API includes a cryptographic sigil that:

1. Identifies the actor (device-attested, sender-constrained)
2. Provides a timestamp
3. Includes the provenance chain
4. Contains the authorization warrant (if applicable)
5. Provides a rollback key for reversing the cognitive act
6. Includes an Ed25519 signature for verification

### Sigil Verification

To verify a sigil:

```bash
sigil sigil verify <data> <signature> <public_key>
```

## Configuration

The API can be configured via environment variables or a `sigil.toml` configuration file.

### Environment Variables

- `SIGIL_HOST`: Server host (default: `0.0.0.0`)
- `SIGIL_PORT`: Server port (default: `8080`)
- `SIGIL_CORS_ENABLED`: Enable CORS (default: `true`)
- `SIGIL_DB_PATH`: Database path (default: `sigil.db`)
- `SIGIL_DB_POOL_SIZE`: Database connection pool size (default: `10`)
- `SIGIL_LOG_LEVEL`: Log level (default: `info`)
- `SIGIL_LOG_FORMAT`: Log format (default: `pretty`)
- `SIGIL_WARRANTS_ENABLED`: Enable cryptographic warrants (default: `true`)
- `SIGIL_LEDGER_ENABLED`: Enable ledger (default: `true`)
- `SIGIL_KEY_PAIR_PATH`: Path to key pair file (optional)
- `SIGIL_CONFIG`: Path to configuration file (optional)

### Configuration File

Create a `sigil.toml` file:

```toml
[server]
host = "0.0.0.0"
port = 8080
cors_enabled = true

[database]
path = "sigil.db"
pool_size = 10

[logging]
level = "info"
format = "pretty"

[sigil]
warrants_enabled = true
ledger_enabled = true
# key_pair_path = "/path/to/keypair.json"
```

## CLI Usage

The SIGIL OS CLI provides command-line access to the system.

### Commands

```bash
# Check system health
sigil health

# Start API server
sigil serve

# Show system status
sigil status

# Show detailed status
sigil status --detailed

# Generate Ed25519 key pair
sigil sigil keygen

# Generate cryptographic sigil
sigil sigil generate "data to sign"

# Verify signature
sigil sigil verify <data> <signature> <public_key>

# Query ledger
sigil ledger list
sigil ledger show <id>
sigil ledger verify
```

## Error Handling

The API uses standard HTTP status codes and returns error details in the response body.

### Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional error details"
  }
}
```

### Common Error Codes

- `CONFIG_ERROR`: Configuration error
- `DATABASE_ERROR`: Database error
- `CRYPTO_ERROR`: Cryptographic error
- `WARRANT_ERROR`: Warrant error
- `SIGIL_ERROR`: Sigil error
- `LEDGER_ERROR`: Ledger error
- `NETWORK_ERROR`: Network error
- `VALIDATION_ERROR`: Validation error
- `NOT_FOUND`: Resource not found
- `PERMISSION_DENIED`: Permission denied
- `INTERNAL_ERROR`: Internal server error

## Rate Limiting

Currently, rate limiting is not implemented. In future phases, rate limiting will be enforced based on:

- Tenant scope
- Warrant budgets
- Resource quotas
- Time-based limits

## Future Endpoints

The following endpoints are planned for future phases:

### Phase 1: Warrant System

- `POST /api/v1/warrants`: Create a warrant
- `GET /api/v1/warrants/:id`: Get warrant details
- `POST /api/v1/warrants/:id/revoke`: Revoke a warrant
- `GET /api/v1/warrants`: List warrants

### Phase 2: Noetic Substrate

- `POST /api/v1/beliefs`: Create a belief
- `GET /api/v1/beliefs/:id`: Get belief details
- `POST /api/v1/beliefs/:id/update`: Update belief
- `GET /api/v1/beliefs`: List beliefs
- `POST /api/v1/quarantine`: Quarantine a belief

### Phase 3: Anchor Governance

- `POST /api/v1/criteria`: Create anchored criterion
- `GET /api/v1/criteria/:id`: Get criterion details
- `POST /api/v1/consensus`: Submit to consensus
- `GET /api/v1/derivation-dag`: Get derivation DAG

### Phase 4: Inference Kernel

- `POST /api/v1/inference`: Run inference
- `GET /api/v1/models`: List available models
- `POST /api/v1/models/:id/load`: Load a model
- `POST /api/v1/models/:id/unload`: Unload a model

### Phase 5: Cognitive Runtime

- `POST /api/v1/cognitive-ops`: Execute cognitive operation
- `GET /api/v1/cache/status`: Get cache status
- `POST /api/v1/cache/clear`: Clear cache

### Phase 6: Experience Surfaces

- `GET /api/v1/missions`: List missions
- `POST /api/v1/missions`: Create a mission
- `GET /api/v1/missions/:id`: Get mission details
- `POST /api/v1/missions/:id/cancel`: Cancel a mission
- `GET /api/v1/memory`: List memory entries
- `POST /api/v1/memory`: Store memory entry

## Security Considerations

### Current Security

- No authentication required (development mode)
- No encryption in transit (use HTTPS in production)
- No rate limiting
- No input validation beyond basic type checking

### Future Security

- Ed25519 cryptographic signatures for all operations
- Device attestation for all clients
- Warrant-based authorization
- Tenant isolation
- Ledger immutability
- Audit logging
- Secret management
- TLS encryption
- Rate limiting and quotas

## Support

For issues, questions, or contributions, please refer to the SIGIL OS repository.
