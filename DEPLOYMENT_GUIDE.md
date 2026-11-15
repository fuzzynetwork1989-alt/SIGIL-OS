# SIGIL OS Deployment Guide - PVCE-1 Architecture

This guide covers the complete deployment pipeline for SIGIL OS implementing the Planetary Vital-Will Cognitive Engine (PVCE-1) architecture.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Local Development](#local-development)
4. [Staging Deployment](#staging-deployment)
5. [Production Deployment](#production-deployment)
6. [Planetary Federation](#planetary-federation)
7. [Monitoring and Observability](#monitoring-and-observability)
8. [Verification Mesh Deployment](#verification-mesh-deployment)
9. [Rollback Procedures](#rollback-procedures)
10. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

SIGIL OS implements the PVCE-1 architecture with three integrated strata:

### Stratum I: Planetary Cognitive OS (PCOS)
- Federated cognition across nodes
- Seven planetary world models (human, organization, technology, economic, scientific, environmental, project)
- CAP and CEP protocols for cognitive applications and events
- Collaborative governance and stakeholder gates

### Stratum II: Vital Will Substrate (VWS)
- Value constitution with hard constraints and soft preferences
- Goal arbitration using expected free energy minimization
- RLAIF value alignment
- Active-inference policy scoring

### Stratum III: Monolithic Cognitive Engine (MCE)
- Cognitive kernel with full state machine
- Concept-state transition core
- MoE compositional routing over disentangled experts
- Memory fabric (PostgreSQL + pgvector, Neo4j, Redis)
- Simulation engine
- Verification Mesh 2.0
- Dream learning loop

### Infrastructure Components

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Cognitive Kernel | Python + FastAPI | Core cognitive runtime |
| Web Console | Next.js + React | User interface |
| PostgreSQL | PostgreSQL 16 + pgvector | Relational data + vector storage |
| Neo4j | Neo4j 5.15 | Causal graph for world models |
| Qdrant | Qdrant 1.7.4 | Vector memory for embeddings |
| Redis | Redis 7 | Caching and event bus |
| NATS | NATS 2.10 | Cognitive event protocol (CEP) |
| Prometheus | Prometheus 2.48 | Metrics collection |
| Grafana | Grafana 10.2 | Dashboards and visualization |
| Jaeger | Jaeger 1.50 | Distributed tracing |

---

## Prerequisites

### Required Tools

```bash
# Version requirements
Docker >= 24.0
Docker Compose >= 2.20
Kubectl >= 1.28
Terraform >= 1.5
Helm >= 3.12
Node.js >= 20
Python >= 3.11
```

### AWS Credentials (for Terraform)

```bash
# Configure AWS CLI
aws configure

# Verify
aws sts get-caller-identity
```

### Kubernetes Cluster Access

```bash
# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# Configure kubeconfig
export KUBECONFIG=~/.kube/config
kubectl cluster-info
```

---

## Local Development

### 1. Clone Repository

```bash
git clone https://github.com/your-org/sigil-os.git
cd sigil-os
```

### 2. Start Services with Docker Compose

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f cognitive-kernel
docker-compose logs -f web-console
```

### 3. Access Services

- **Web Console**: http://localhost:3000
- **Cognitive Kernel API**: http://localhost:8000
- **Neo4j Browser**: http://localhost:7474
- **Grafana**: http://localhost:3001 (admin/sigil_admin)
- **Prometheus**: http://localhost:9090
- **Jaeger UI**: http://localhost:16686

### 4. Initialize Databases

```bash
# Run PostgreSQL migrations
docker-compose exec postgres psql -U sigil -d sigil_db -f /docker-entrypoint-initdb.d/01_init.sql

# Initialize Neo4j
docker-compose exec neo4j cypher-shell -u neo4j -p sigil_password -f /docker-entrypoint-initdb.d/01_init.cypher

# Create Qdrant collections
curl -X PUT http://localhost:6333/collections/episodic_memories \
  -H 'Content-Type: application/json' \
  -d '{
    "vectors": {
      "size": 1536,
      "distance": "Cosine"
    }
  }'
```

### 5. Run Development Tests

```bash
# Web console tests
cd web-console
npm test

# Cognitive kernel tests
cd sigil-core
pytest --cov=sigil --cov-report=html
```

---

## Staging Deployment

### 1. Set Up Kubernetes Context

```bash
# Add staging cluster
kubectl config use-context staging-cluster

# Verify
kubectl get nodes
```

### 2. Apply Kubernetes Configurations

```bash
# Create namespace
kubectl apply -f kubernetes/deployment.yml

# Apply ConfigMap
kubectl apply -f kubernetes/configmap.yml

# Create secrets (template from secrets.yml)
kubectl apply -f kubernetes/secrets.yml
```

### 3. Deploy Services

```bash
# Deploy all components
kubectl apply -f kubernetes/deployment.yml

# Wait for deployments
kubectl rollout status deployment/sigil-cognitive-kernel -n sigil-staging
kubectl rollout status deployment/sigil-web-console -n sigil-staging
```

### 4. Verify Deployment

```bash
# Check pods
kubectl get pods -n sigil-staging

# Check services
kubectl get svc -n sigil-staging

# Port forward for local testing
kubectl port-forward svc/sigil-web-console 3000:80 -n sigil-staging
```

### 5. Run Smoke Tests

```bash
# Health check
curl http://staging.sigil-os.io/health

# Verification mesh check
kubectl exec -n sigil-staging deployment/sigil-cognitive-kernel -- \
  python -c "from sigil.verification import VerificationMesh; vm = VerificationMesh(); assert vm.check_health()"
```

---

## Production Deployment

### 1. Infrastructure Provisioning with Terraform

```bash
cd terraform

# Initialize Terraform
terraform init

# Plan deployment
terraform plan -out=tfplan

# Apply changes
terraform apply tfplan

# Verify outputs
terraform output
```

### 2. Configure Production Secrets

```bash
# Generate secure secrets
export POSTGRES_PASSWORD=$(openssl rand -base64 32)
export NEO4J_PASSWORD=$(openssl rand -base64 32)
export JWT_SECRET=$(openssl rand -base64 32)
export ENCRYPTION_KEY=$(openssl rand -base64 32)

# Update secrets.yml with actual values
kubectl apply -f kubernetes/secrets.yml
```

### 3. Deploy with CI/CD Pipeline

The CI/CD pipeline automatically:

1. **Build and Test** - Runs all tests and linting
2. **Security Scan** - Trivy vulnerability scanning
3. **Build Docker Images** - Multi-stage Docker builds
4. **Deploy Canary** - 10% traffic to canary
5. **Run Validation** - Verification mesh tests
6. **Full Rollout** - Gradual traffic shift
7. **Post-Deployment Verification** - Full test suite

### 4. Manual Deployment (if needed)

```bash
# Set context to production
kubectl config use-context production-cluster

# Deploy with canary strategy
kubectl apply -f kubernetes/deployment.yml

# Monitor rollout
kubectl rollout status deployment/sigil-cognitive-kernel -n sigil-production -w

# Check canary
kubectl get pods -n sigil-production -l app=sigil-cognitive-kernel-canary
```

### 5. Run Production Verification

```bash
# Full verification suite
kubectl exec -n sigil-production deployment/sigil-cognitive-kernel -- \
  python -m pytest tests/production/ -v

# Check verification pass rate
kubectl exec -n sigil-production deployment/sigil-cognitive-kernel -- \
  curl -s http://localhost:9090/metrics | grep verification_pass_rate

# Validate constitution compliance
kubectl exec -n sigil-production deployment/sigil-cognitive-kernel -- \
  python -c "from sigil.vital_will import Constitution; c = Constitution(); assert c.validate()"
```

---

## Planetary Federation

### 1. Multi-Region Deployment

Deploy to multiple regions following the same production process:

```bash
# Deploy to US East
terraform apply -var="region=us-east-1"

# Deploy to US West
terraform apply -var="region=us-west-2"

# Deploy to EU West
terraform apply -var="region=eu-west-1"
```

### 2. Federation Configuration

```yaml
# Update configmap.yml with federation settings
federation-mode: "active-active"
federation-regions: "us-east-1,us-west-2,eu-west-1"
federation-sync-interval: "60"
planetary-models-enabled: "true"
```

### 3. Verify Federation Consistency

```bash
# Run federation verification script
python scripts/verify_federation.py \
  --regions us-east-1,us-west-2,eu-west-1 \
  --consistency-check

# Check federation metrics
kubectl exec -n sigil-production deployment/sigil-cognitive-kernel -- \
  curl -s http://localhost:9090/metrics | grep federation
```

### 4. CAP Protocol Registration

```bash
# Register cognitive applications
curl -X POST http://api.sigil-os.io/cap/register \
  -H 'Content-Type: application/json' \
  -d '{
    "app_id": "sigil-cognitive-kernel",
    "version": "1.0.0",
    "skills": ["reasoning", "planning", "verification"]
  }'
```

### 5. CEP Event Publishing

```bash
# Publish cognitive events
curl -X POST http://api.sigil-os.io/cep/publish \
  -H 'Content-Type: application/json' \
  -d '{
    "event_id": "evt_123",
    "type": "memory_update",
    "source": "cognitive-kernel",
    "target": "memory-fabric",
    "payload": {"memory_id": "mem_456"}
  }'
```

---

## Monitoring and Observability

### 1. Prometheus Metrics

Access Prometheus at: http://prometheus:9090

Key metrics to monitor:

```promql
# Verification mesh pass rate
rate(sigil_verification_mesh_passes_total[5m]) / rate(sigil_verification_mesh_attempts_total[5m])

# Cognitive cycle latency (P95)
histogram_quantile(0.95, sigil_cognitive_cycle_duration_seconds)

# Constitution violations
rate(sigil_constitution_violations_total[1m])

# Memory retrieval confidence
avg(sigil_memory_retrieval_confidence)

# Federation sync lag
sigil_federation_sync_lag_seconds
```

### 2. Grafana Dashboards

Access Grafana at: http://grafana:3000

Pre-configured dashboards:
- Cognitive Kernel Overview
- Verification Mesh Status
- Memory Fabric Health
- World Model Sync
- Federation Consistency
- Constitution Compliance

### 3. Distributed Tracing with Jaeger

Access Jaeger at: http://jaeger:16686

Trace cognitive cycles to identify bottlenecks.

### 4. Alerting

Alerts are configured in `infra/monitoring/alerts/sigil-alerts.yml`:

Critical alerts:
- Verification mesh failure rate > 5%
- Constitution violations detected
- Memory retrieval failure rate > 10%
- Federation data divergence

Warning alerts:
- Cognitive cycle P95 latency > 5s
- Dream learning bias detected
- Database high CPU/memory

---

## Verification Mesh Deployment

The Verification Mesh 2.0 is a critical component that must pass all stages before any output is released.

### 1. Verification Stages

The mesh has 8 stages (no bypass allowed):

1. **GENERATION** - Validate output format
2. **CRITIQUE** - Self-critique and improvement
3. **EVIDENCE_CHECK** - Verify evidence chain
4. **SIMULATION** - Simulate execution
5. **CONSISTENCY_SCAN** - Check for contradictions
6. **RISK_SCAN** - Assess risks
7. **CONFIDENCE_SCORING** - Score confidence
8. **RELEASE** - Final release gate

### 2. Configure Verification Mesh

```yaml
# In configmap.yml
verification-stages: "GENERATION,CRITIQUE,EVIDENCE_CHECK,SIMULATION,CONSISTENCY_SCAN,RISK_SCAN,CONFIDENCE_SCORING,RELEASE"
verification-bypass-allowed: "false"
```

### 3. Test Verification Mesh

```bash
# Run verification test
kubectl exec -n sigil-production deployment/sigil-cognitive-kernel -- \
  python -c "
from sigil.verification import VerificationMesh
vm = VerificationMesh()
result = vm.run('test_output', evidence={})
print(f'Passed: {result.passed}, Confidence: {result.confidence}')
"
```

### 4. Monitor Verification Metrics

```bash
# Check pass rate
curl -s http://localhost:9090/metrics | grep verification_pass_rate

# Check stage failures
curl -s http://localhost:9090/metrics | grep verification_stage_failure
```

---

## Rollback Procedures

### 1. Kubernetes Rollback

```bash
# Rollback to previous revision
kubectl rollout undo deployment/sigil-cognitive-kernel -n sigil-production

# Rollback to specific revision
kubectl rollout undo deployment/sigil-cognitive-kernel -n sigil-production --to-revision=3

# Check rollback status
kubectl rollout status deployment/sigil-cognitive-kernel -n sigil-production
```

### 2. Database Rollback

```bash
# PostgreSQL
kubectl exec -n sigil-production deployment/postgres -- \
  pg_restore -d sigil_db /backup/backup_YYYYMMDD_HHMMSS.sql

# Neo4j
kubectl exec -n sigil-production deployment/neo4j -- \
  neo4j-admin load --from=/backup/neo4j_YYYYMMDD_HHMMSS
```

### 3. Terraform Rollback

```bash
# Rollback infrastructure changes
terraform apply -var="region=us-east-1" -target=null.aws_db_instance.sigil_postgres
```

### 4. Service Restoration

```bash
# Scale up to previous stable version
kubectl scale deployment/sigil-cognitive-kernel --replicas=3 -n sigil-production

# Verify health
kubectl get pods -n sigil-production
kubectl top pods -n sigil-production
```

---

## Troubleshooting

### Common Issues

#### 1. Pod Not Starting

```bash
# Check pod status
kubectl describe pod <pod-name> -n sigil-production

# Check logs
kubectl logs <pod-name> -n sigil-production --previous

# Check events
kubectl get events -n sigil-production --sort-by='.lastTimestamp'
```

#### 2. Database Connection Issues

```bash
# Test PostgreSQL connection
kubectl exec -n sigil-production deployment/sigil-cognitive-kernel -- \
  psql $POSTGRES_URL -c "SELECT 1"

# Test Neo4j connection
kubectl exec -n sigil-production deployment/sigil-cognitive-kernel -- \
  cypher-shell "MATCH (n) RETURN count(n)"
```

#### 3. High Memory Usage

```bash
# Check resource usage
kubectl top pods -n sigil-production
kubectl top nodes

# Check memory limits
kubectl describe deployment sigil-cognitive-kernel -n sigil-production | grep -A 10 resources
```

#### 4. Verification Mesh Failures

```bash
# Check verification logs
kubectl logs deployment/sigil-cognitive-kernel -n sigil-production | grep "verification"

# Check which stage is failing
kubectl exec -n sigil-production deployment/sigil-cognitive-kernel -- \
  curl -s http://localhost:9090/metrics | grep verification_stage
```

#### 5. Federation Sync Issues

```bash
# Check federation status
kubectl exec -n sigil-production deployment/sigil-cognitive-kernel -- \
  python -c "from sigil.federation import Federation; f = Federation(); print(f.status())"

# Check sync lag
curl -s http://localhost:9090/metrics | grep federation_sync_lag
```

### Debug Mode

Enable debug logging:

```yaml
# In configmap.yml
log-level: "DEBUG"
tracing-enabled: "true"
tracing-sampler: "1.0"
```

### Emergency Procedures

#### 1. System-Wide Failure

```bash
# Scale down all services
kubectl scale deployment --all --replicas=0 -n sigil-production

# Restore from backup
kubectl exec -n sigil-production deployment/postgres -- \
  pg_restore -d sigil_db /backup/latest.sql

# Scale up services
kubectl scale deployment sigil-cognitive-kernel --replicas=3 -n sigil-production
```

#### 2. Constitution Violation Cascade

```bash
# Emergency constitution override
kubectl patch configmap sigil-constitution -n sigil-production -p '{"data":{"emergency_override":"true"}}'

# Restart cognitive kernel
kubectl rollout restart deployment/sigil-cognitive-kernel -n sigil-production
```

---

## Release Gates

Before any phase transition, ensure:

1. ✅ Verification pass rate ≥ 95%
2. ✅ Adversarial red-team suite clean or with documented mitigations
3. ✅ Rollback demonstrated in live drill
4. ✅ Observability coverage of every state transition
5. ✅ Governance sign-off on constitution-relevant changes

---

## Additional Resources

- [PVCE-1 Architecture Document](../Downloads/post-world-model-architecture-the-planetary-vital-will-cognitive-engine-pvce-1.md)
- [AGENTS.md](../AGENTS.md)
- [BUILD.md](../BUILD.md)
- [FEATURES.md](../FEATURES.md)

---

## Support

For deployment issues:
1. Check this guide first
2. Review logs and metrics
3. Consult troubleshooting section
4. Create GitHub issue with:
   - Environment details
   - Error messages
   - Logs
   - Steps to reproduce
