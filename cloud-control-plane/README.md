# NEXORA Omega Cloud Control Plane

TypeScript/Python-based cloud services for NEXORA Omega.

## Services

- **Identity Service** - Authentication, authorization, sessions, device management
- **Workspace Service** - Organizations, members, roles, projects, environments
- **Cognitive Kernel Service** - Cognitive process orchestration, attention, budgets
- **Capability Service** - Scoped grants, delegation, attenuation, revocation
- **Model Gateway Service** - Model routing, provider abstraction, cost controls
- **Memory Service** - Governed memory tiers, provenance, access controls
- **World-State Service** - Entities, evidence, beliefs, confidence, causal links
- **Tool Gateway Service** - Typed contracts, allowlists, worker sandboxes
- **Workflow Service** - Durable jobs, queues, checkpoints, retries, approvals
- **Evaluation Service** - Golden tests, adversarial tests, model benchmarks
- **Notification Service** - In-app, push, email, webhook delivery
- **API Gateway** - Edge delivery, TLS, DDoS protection, WAF, rate limits
- **Billing Service** - Usage metering, entitlements, subscriptions

## Architecture

All services:
- Use canonical contracts from the `contracts` repository
- Implement capability-first security
- Emit audit events for all consequential actions
- Support tenant isolation
- Include observability (traces, metrics, logs)
- Have rollback plans for all mutations

## Tech Stack

- **Backend**: TypeScript (Node.js), Python (model services)
- **Database**: PostgreSQL with pgvector
- **Cache**: Redis-compatible
- **Queue**: Redis-compatible or dedicated queue service
- **Storage**: Object storage (S3-compatible)
- **Deployment**: Railway for backend services

## Environment Variables

Each service requires environment-specific configuration. See individual service READMEs.

## Local Development

```bash
pnpm install
pnpm dev
```

## Production Deployment

Deployed via Railway with environment-specific configuration.