---
name: ci-cd-manager
description: Use for managing CI/CD pipelines for SIGIL OS, including automated testing, security scanning, performance benchmarking, integration testing, canary deployments, and rollback mechanisms. This is critical for the 35-40% final phase.
user-invocable: true
---

# CI/CD Manager Skill

Use this skill for managing CI/CD pipelines throughout the SIGIL OS development lifecycle.

## When to Use

Use this skill for:
- Setting up GitHub Actions workflows
- Configuring automated testing pipelines
- Implementing security scanning (SAST, DAST, dependency scanning)
- Setting up performance benchmarking
- Configuring integration and E2E testing
- Implementing canary deployments
- Setting up rollback mechanisms
- Managing build artifacts and provenance
- Configuring automated signing
- Setting up monitoring and alerting

## CI/CD Pipeline Components

### 1. Automated Testing

**Unit Tests:**
- Run on every push and PR
- Coverage reporting
- Parallel execution
- Test result aggregation

**Integration Tests:**
- Run on merge to main
- Test component interactions
- Database integration
- API integration

**E2E Tests:**
- Run on staging deployment
- Full user journey testing
- Cross-platform testing

### 2. Security Scanning

**SAST (Static Application Security Testing):**
- Code vulnerability scanning
- Secret detection
- Dependency vulnerability scanning
- License compliance checking

**DAST (Dynamic Application Security Testing):**
- Runtime vulnerability scanning
- API security testing
- Authentication/authorization testing

**Container Scanning:**
- Image vulnerability scanning
- Runtime security
- Supply chain security

### 3. Performance Benchmarking

**Load Testing:**
- API endpoint performance
- Database query performance
- Memory usage profiling
- CPU usage profiling

**Regression Testing:**
- Performance baseline comparison
- Detect performance degradation
- Alert on threshold violations

### 4. Build Artifacts

**Provenance:**
- SBOM (Software Bill of Materials)
- Build attestations
- Signature verification
- Reproducible builds

**Signing:**
- Code signing
- Artifact signing
- Key management

### 5. Deployment Strategies

**Canary Deployments:**
- Gradual rollout
- A/B testing
- Feature flags
- Traffic splitting

**Rollback Mechanisms:**
- Automated rollback on failure
- Manual rollback triggers
- Rollback verification
- Rollback audit trail

## GitHub Actions Workflow Structure

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - Checkout
      - Install Rust
      - Cache dependencies
      - Check formatting
      - Run clippy
      - Build
      - Run tests
      - Generate coverage

  security:
    runs-on: ubuntu-latest
    steps:
      - Checkout
      - Run SAST scan
      - Run dependency scan
      - Run secret scan
      - Generate security report

  performance:
    runs-on: ubuntu-latest
    steps:
      - Checkout
      - Build
      - Run benchmarks
      - Compare with baseline
      - Generate performance report

  build:
    runs-on: ubuntu-latest
    needs: [test, security, performance]
    steps:
      - Checkout
      - Build release
      - Generate SBOM
      - Sign artifacts
      - Upload artifacts
```

## Required Evidence

For every CI/CD run, produce:
- Test results (junit.xml)
- Security scan results (SARIF)
- Performance metrics (JSON)
- Build logs
- Artifact digests
- SBOM
- Sigil ledger entry

## Critical Path (35-40% Final Phase)

The CI/CD pipeline is critical for the final phase:

1. **Automated Testing** - Ensure quality before release
2. **Security Scanning** - Ensure no vulnerabilities ship
3. **Performance Benchmarking** - Ensure performance doesn't degrade
4. **Canary Deployments** - Safe rollout to production
5. **Rollback Mechanisms** - Quick recovery from failures

## Stop Conditions

- Test failures block deployment
- Security vulnerabilities block deployment
- Performance degradation blocks deployment
- Build failures block deployment
- Missing artifacts block deployment

## Integration with SIGIL OS

- Every CI/CD run emits a sigil
- Build artifacts are signed with sigil warrants
- Rollback operations use sigil rollback keys
- Security scans are attested in sigils
- Performance metrics are stored as sigils

## Forbidden Actions

- Do not skip security scans
- Do not deploy without passing tests
- Do not bypass rollback mechanisms
- Do not deploy with known vulnerabilities
- Do not modify CI/CD without authorization
