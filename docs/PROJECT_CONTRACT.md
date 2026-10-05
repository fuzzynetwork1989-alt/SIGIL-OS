# SIGIL OS Project Contract

## Purpose

This document defines the contract between stakeholders, developers, and autonomous agents for the SIGIL OS project. It establishes the non-negotiable requirements, success criteria, and governance boundaries.

## Project Identity

**Name:** SIGIL OS
**Full Name:** SIGIL OS - The Post-AI Operating System with Cryptographic Warrant
**Classification:** Operating System / Cognitive Runtime / Inference Substrate
**License:** [To be determined]

## Core Thesis

SIGIL OS is a new category of computing where intelligence is the substrate and every act of cognition bears a sigil — a verifiable mark of provenance, authorization, and reversibility.

## Non-Negotiable Requirements

### 1. Warranted Cognition

Every cognitive act (belief, action, memory, inference, improvement) must carry a cryptographic sigil that includes:
- Actor identity (device-attested, sender-constrained)
- Timestamp
- Provenance chain
- Warrant (authorization criteria)
- Rollback key
- Signature

**Evidence Required:** All state changes must emit signed sigils verifiable by third parties.

### 2. Reversible State

Every material change must be reversible through a single signed command that:
- Rolls back the belief
- Rolls back the delta
- Rolls back dependent actions
- Records the rollback in the ledger

**Evidence Required:** Demonstrate rollback of a belief cascade.

### 3. Epistemic Decay

Beliefs must decay at learned rates (epistemic half-life). Unused beliefs become inert and cannot influence action without refresh.

**Evidence Required:** Show belief decay affecting action authorization.

### 4. Capability Leases

All capabilities (file access, network calls, tool use) must be time-bounded leases that decay unless renewed.

**Evidence Required:** Demonstrate capability expiration blocking action.

### 5. Governance at Syscall Boundary

The kernel must refuse to execute unaligned inference proposals. No model output becomes action without passing through ANCHOR-II governance.

**Evidence Required:** Show kernel rejection of unaligned completion.

### 6. Attested Provenance

Every reasoning trace must be signed by the model that produced it, timestamped, and hash-chained to inputs.

**Evidence Required:** Export a trace and verify signature independently.

### 7. Frame-Aware Ethics

Under thermal pressure, the system must reduce cognitive tier before reducing safety enforcement. Ethics are the last thing to go.

**Evidence Required:** Demonstrate ethics enforcement under load.

## Success Criteria

### Phase 0 (Foundations)
- [ ] Workspace initialized with Cargo workspace
- [ ] noetic-core crate compiles
- [ ] Persistence layer with SQLite
- [ ] HTTP API with /health endpoint
- [ ] CLI interface
- [ ] cargo test passes
- [ ] Basic sigil type defined
- [ ] Append-only event log

### Phase 1 (Warrant)
- [ ] Sigil signing and verification
- [ ] Cryptographic signatures (Ed25519)
- [ ] Append-only ledger
- [ ] Every state change emits signed sigil
- [ ] Rollback mechanism
- [ ] Device attestation integration

### Phase 2 (Substrate)
- [ ] Delta-state reasoning implementation
- [ ] Epistemic half-life on beliefs
- [ ] Cognitive pressure system
- [ ] Belief quarantine
- [ ] Immune response
- [ ] Temporal attention windows
- [ ] Counterfactual persistence

### Phase 3 (Anchor)
- [ ] Distributed criterion consensus
- [ ] Derivation DAG
- [ ] Alignment oracle separation
- [ ] Defense in depth (6 layers)
- [ ] Meta-anchor support

### Phase 4 (Inference)
- [ ] Grammar-constrained decoding
- [ ] Speculative decoding per channel
- [ ] CaMeL capability-typed IPC
- [ ] Dual-LLM privilege separation
- [ ] Kernel refuses unaligned completions

### Phase 5 (Runtime)
- [ ] Semantic router
- [ ] Three-layer cache (prompt + semantic + KV prefix)
- [ ] Adaptive reasoning budget
- [ ] Cortex: CognitiveOp interpreter
- [ ] Multimodal support (text/vision/audio)

### Phase 6 (Experience)
- [ ] Chat application
- [ ] Memory application
- [ ] Missions application
- [ ] Tools application
- [ ] Spatial scenes
- [ ] XR presence (The Presence)
- [ ] Phone, headset, desktop, web surfaces

## Anti-Requirements

What SIGIL OS is NOT:

- NOT a chatbot wrapper
- NOT an AI assistant app
- NOT a simple agent framework
- NOT compatible with existing OS kernels
- NOT a cloud-only service
- NOT dependent on external model APIs for core operation
- NOT without human approval for material changes
- NOT self-authorizing for deployment or release

## Governance Boundaries

### Autopilot Mode
Uses Continuity OS Autopilot Mode v2.2 for governed software delivery. See `docs/AUTOPILOT_MODE.md`.

### Approval Classes

| Class | Examples | Requirement |
|-------|----------|-------------|
| Routine | Read selected repo, scoped writes, allowlisted local tests | Valid policy and warrant |
| Scope | New path, provider, data flow, or architecture impact | Explicit human approval |
| Sensitive | Secrets, customer data, connectors, paid services, cloud/IAM/network | Explicit approval plus policy controls |
| Release | Staging promotion, publishing, production deployment | Protected workflow/environment approval and release evidence |
| Irreversible | Deletion, destructive migration, purchase, public action | Explicit human approval with exact target and impact |

### Protected Targets

Autopilot may never self-authorize modifications to:
- Human approval requirements
- Protected holdout evaluations
- Audit history
- Credential policy
- Rollback controls
- Release gates
- Production deployment permissions

## Evidence Requirements

Every material claim must be backed by evidence with one of these statuses:

- `observed`: backed by direct captured evidence
- `inferred`: reasoned from evidence, not directly measured
- `assumed`: explicit approved premise
- `simulated`: forecast or counterfactual
- `contested`: conflicting evidence exists
- `refuted`: invalidated by stronger evidence
- `superseded`: replaced by a newer valid record

Predictions do not become observations without new external evidence.

## Risk Classification

| Risk Tier | Example | Mitigation |
|-----------|---------|------------|
| Trust-critical | Authorization bypass, privilege escalation | Formal verification, property tests, security review |
| Safety-critical | Unaligned inference, ethics bypass | Alignment oracle, defense in depth, human oversight |
| Availability-critical | Deadlock, resource exhaustion | Timeout, backpressure, graceful degradation |
| Privacy-critical | Data leakage, secret exposure | Zero-knowledge proofs, hardware attestation, audit logs |

## Rollback Strategy

All changes must have a rollback strategy:

- **Reversible**: revert commit, restore previous state
- **Compensating**: run compensation transaction
- **Irreversible**: explicitly classified and requires highest approval

## Completion Language

| Term | Required proof |
|------|-----------------|
| Implemented | Scoped code/config changed |
| Built | Build command completed successfully |
| Tested | Named test commands executed with current recorded output |
| Verified | Independent evidence supports defined postcondition |
| Reviewed | Qualified independent reviewer accepted change |
| Staged | Exact verified artifact is running in isolated staging |
| Activated | Approved capability is enabled in declared environment |

## Current Status

**Phase:** Phase 0 — Foundations
**Status:** In Progress
**Next Milestone:** cargo test passes; /health responds

## References

- SIGIL OS specification
- Continuity OS Autopilot Mode v2.2 specification
- MERIDIAN architecture
- AETHER OS architecture
- Rillmark guidebook (for training methodology)
