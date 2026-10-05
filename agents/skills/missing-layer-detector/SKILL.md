---
name: missing-layer-detector
description: Use for detecting missing layers, incomplete implementations, broken dependencies, missing tests, weak security controls, incomplete documentation, missing operational essentials, and UX surface gaps throughout the SIGIL OS project.
user-invocable: true
---

# Missing Layer Detector Skill

Use this skill for detecting and reporting missing components throughout the SIGIL OS project.

## When to Use

Use this skill for:
- Detecting missing architectural layers
- Finding incomplete implementations
- Identifying broken dependencies
- Discovering missing tests
- Finding weak security controls
- Identifying incomplete documentation
- Discovering missing operational essentials
- Finding UX surface gaps
- Validating completeness before release

## Detection Categories

### 1. Architectural Layers

**Check for:**
- Experience Surfaces (Phone, Headset, Desktop, Web, Voice)
- Cognitive Applications (Chat, Memory, Missions, Tools, Spatial Scenes, XR Presence)
- SIGIL Runtime (World Model, Cognitive OS, Agentic Foundation)
- Noetic Substrate (Delta-state, Half-life, Pressure, Quarantine, Immune)
- Anchor Governance (Consensus, Derivation DAG, Alignment Oracle)
- Inference Kernel (Grammar-constrained, Speculative Decoding, CaMeL IPC)
- System Kernel (Processes, Memory, Storage, Networking, Identity)
- Hardware Integration (CPU, GPU, NPU, RAM, SSD, Network, Sensors, XR)

### 2. Implementation Completeness

**Check for:**
- Stub implementations
- TODO comments
- Placeholder code
- Unimplemented functions
- Missing error handling
- Incomplete features

### 3. Dependencies

**Check for:**
- Outdated dependencies
- Vulnerable dependencies
- Unpinned versions
- Missing dependencies
- Circular dependencies
- Unused dependencies

### 4. Tests

**Check for:**
- Missing unit tests
- Missing integration tests
- Missing E2E tests
- Low test coverage
- Failing tests
- Flaky tests

### 5. Security

**Check for:**
- Missing authentication
- Missing authorization
- Missing encryption
- Missing input validation
- Missing output encoding
- Missing CSRF protection
- Missing rate limiting
- Missing audit logging

### 6. Documentation

**Check for:**
- Missing README
- Missing API documentation
- Missing architecture documentation
- Missing installation instructions
- Missing contributor guidelines
- Missing license
- Missing changelog

### 7. Operational Essentials

**Check for:**
- Missing monitoring
- Missing logging
- Missing error tracking
- Missing backup strategy
- Missing disaster recovery
- Missing health checks
- Missing metrics

### 8. UX Surfaces

**Check for:**
- Missing mobile app
- Missing desktop app
- Missing web app
- Missing CLI
- Missing accessibility features
- Missing i18n support
- Missing responsive design

## Detection Process

1. **Inventory** - Scan all files and directories
2. **Analyze** - Analyze code structure and dependencies
3. **Compare** - Compare against architecture specification
4. **Report** - Generate comprehensive missing layer report
5. **Prioritize** - Prioritize missing items by criticality

## Report Format

```yaml
missing_layers_report:
  architectural_layers:
    missing: []
    incomplete: []
  implementations:
    stubs: []
    todos: []
    placeholders: []
  dependencies:
    outdated: []
    vulnerable: []
    missing: []
  tests:
    missing_unit: []
    missing_integration: []
    missing_e2e: []
    coverage_gaps: []
  security:
    missing_auth: []
    missing_encryption: []
    missing_validation: []
  documentation:
    missing_readme: false
    missing_api_docs: []
    missing_arch_docs: []
  operational:
    missing_monitoring: []
    missing_logging: []
    missing_backups: []
  ux_surfaces:
    missing_mobile: false
    missing_desktop: false
    missing_web: false
  prioritized_gaps:
    - item: ""
      criticality: critical | high | medium | low
      effort: high | medium | low
      impact: high | medium | low
```

## Required Evidence

For every detection run, produce:
- Missing layer report
- Analysis artifacts
- Priority recommendations
- Sigil ledger entry

## Integration with SIGIL OS

- Every detection run emits a sigil
- Missing items are tracked as beliefs with epistemic status
- Resolutions emit sigils
- Rollback keys enable undo of false positives

## Stop Conditions

- Do not skip detection for any phase
- Do not ignore critical gaps
- Do not proceed without addressing critical security gaps
- Do not proceed without addressing critical missing layers

## Forbidden Actions

- Do not mark items as complete without verification
- Do not downplay critical gaps
- Do not ignore architectural violations
