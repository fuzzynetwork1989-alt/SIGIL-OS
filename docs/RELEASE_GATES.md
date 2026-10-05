# SIGIL OS Release Gates

## Overview

This document defines the release gates for SIGIL OS. No phase is considered complete until all gates in that phase are satisfied with observed evidence.

## Evidence Requirements

Every gate requires one of the following evidence statuses:

- `observed`: backed by direct captured evidence
- `inferred`: reasoned from evidence, not directly measured
- `assumed`: explicit approved premise
- `simulated`: forecast or counterfactual
- `contested`: conflicting evidence exists
- `refuted`: invalidated by stronger evidence
- `superseded`: replaced by a newer valid record

## Phase 0 — Foundations

### Gate 0.1: Workspace Initialized
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- `cargo build` completes without errors
- `cargo test` passes all tests
- Repository structure matches ARCHITECTURE.md
- All required documentation files exist

### Gate 0.2: Sigil Type Defined
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- Sigil struct compiles with all fields
- SigilKind enum compiles with all variants
- Unit tests for sigil creation pass
- Unit tests for sigil serialization pass

### Gate 0.3: Persistence Layer
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- SQLite database initializes correctly
- Append-only ledger writes successfully
- Ledger reads return correct records
- Database schema documented

### Gate 0.4: HTTP API
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- HTTP server starts and listens
- `/health` endpoint returns 200 OK
- `/health` response includes version and status
- API documented in OpenAPI/Swagger

### Gate 0.5: CLI Interface
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- CLI binary compiles
- `sigil --help` displays usage
- `sigil health` command works
- CLI commands documented

## Phase 1 — Warrant

### Gate 1.1: Cryptographic Signing
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- Ed25519 key pair generation works
- Sigil signing produces valid signature
- Signature verification passes for valid sigils
- Signature verification fails for invalid sigils
- Key management documented

### Gate 1.2: Device Attestation
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- Device attestation integration compiles
- Attestation verification works for valid devices
- Attestation fails for invalid devices
- Attestation workflow documented

### Gate 1.3: Append-Only Ledger
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- Ledger rejects modifications to existing records
- Ledger appends new records successfully
- Ledger can be reconstructed from scratch
- Ledger integrity check passes

### Gate 1.4: Rollback Mechanism
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- Rollback key enables state reversion
- Rollback cascades to dependent sigils
- Rollback is recorded in ledger
- Rollback is itself signed and warranted

### Gate 1.5: Every State Change Emits Sigil
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- All state changes produce sigils
- Sigils are written to ledger
- Sigils are signed
- Sigils have rollback keys
- Evidence of 100% coverage from instrumentation

## Phase 2 — Substrate

### Gate 2.1: Delta-State Reasoning
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- Delta changes are stored correctly
- State derivation from deltas works
- Delta chain is unbroken
- Delta rollback works

### Gate 2.2: Epistemic Half-Life
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- Beliefs decay at learned rates
- Decay affects action authorization
- Belief refresh extends half-life
- Half-life learning works

### Gate 2.3: Cognitive Pressure
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- Uncertainty accumulates correctly
- Pressure threshold triggers verification
- Pressure relief reduces uncertainty
- Pressure affects routing

### Gate 2.4: Belief Quarantine
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- Changes cascade to dependents
- Errors are isolated in quarantine
- Quarantine affects dependent beliefs
- Quarantine release works

### Gate 2.5: Immune Response
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- Manipulation attempts are detected
- Manipulators are isolated
- Immune response is recorded
- Immune system evolves

## Phase 3 — Anchor

### Gate 3.1: Distributed Consensus
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- Consensus reaches agreement on criteria
- Consensus handles network partitions
- Consensus recovers from node failure
- Consensus is documented

### Gate 3.2: Derivation DAG
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- Derivation chains are tracked
- DAG cycles are detected and rejected
- Derivation rollback works
- DAG queries work

### Gate 3.3: Alignment Oracle
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- Alignment oracle validates inferences
- Oracle separation works
- Oracle update requires approval
- Oracle decisions are recorded

### Gate 3.4: Defense in Depth
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- All 6 defense layers are implemented
- Each layer can block independently
- Layer failure doesn't bypass others
- Defense effectiveness measured

## Phase 4 — Inference

### Gate 4.1: Grammar-Constrained Decoding
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- JSON Schema compiles to CFG
- Invalid tokens are masked pre-sampling
- Output always matches schema
- Grammar constraints are documented

### Gate 4.2: Speculative Decoding
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- Speculative decoding improves latency
- Accuracy is maintained
- Speculation failure fallback works
- Performance measured

### Gate 4.3: CaMeL IPC
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- Capability-typed IPC works
- Taint tracking on every byte
- Taint propagation works
- IPC security verified

### Gate 4.4: Dual-LLM Privilege Separation
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- Planner never sees untrusted text
- Reader has no tools
- Privilege separation enforced
- Security verified

### Gate 4.5: Kernel Refuses Unaligned Completions
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- Unaligned completions are rejected
- Rejection is logged
- Rejection is warranted
- Rejection rate measured

## Phase 5 — Runtime

### Gate 5.1: Semantic Router
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- Router routes by complexity
- Router routes by cost
- Router routes by latency
- Routing decisions are recorded

### Gate 5.2: Three-Layer Cache
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- Prompt cache works
- Semantic cache works
- KV prefix cache works
- Cache hit rate measured

### Gate 5.3: Adaptive Reasoning Budget
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- Budget allocated by router
- Budget respects constraints
- Budget affects quality
- Budget decisions recorded

### Gate 5.4: Cortex Interpreter
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- CognitiveOp interpreter works
- All CognitiveOp types supported
- Interpreter errors handled
- Performance measured

### Gate 5.5: Multimodal Support
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- Text modality works
- Vision modality works
- Audio modality works
- Modality fusion works

## Phase 6 — Experience

### Gate 6.1: Chat Application
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- Chat UI renders
- Chat sends messages
- Chat receives responses
- Chat shows sigils

### Gate 6.2: Memory Application
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- Memory UI renders
- Memory stores beliefs
- Memory retrieves beliefs
- Memory shows provenance

### Gate 6.3: Missions Application
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- Missions UI renders
- Missions track progress
- Missions complete
- Missions show evidence

### Gate 6.4: Tools Application
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- Tools UI renders
- Tools invoke capabilities
- Tools show results
- Tools show warrants

### Gate 6.5: Spatial Scenes
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- Spatial UI renders
- Scene anchors persist
- Spatial decay works
- Presence works

### Gate 6.6: XR Presence
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- Presence renders in XR
- Presence is scene-anchored
- Presence speaks
- Presence shows sigils

### Gate 6.7: Multi-Surface Continuity
**Status:** Required
**Evidence Type:** observed
**Required Evidence:**
- Phone surface works
- Headset surface works
- Desktop surface works
- Web surface works
- State syncs across surfaces

## Release Process

1. All gates in current phase must pass with `observed` evidence
2. Evidence must be captured and stored
3. Evidence must be verified by independent reviewer
4. Evidence must be archived
5. Release must be approved by human authority
6. Release must be signed and tagged
7. Release must be documented

## Rollback Policy

If a release fails post-deployment:
1. Identify failure scope
2. Execute rollback if reversible
3. Execute compensation if not reversible
4. Record failure in ledger
5. Update risk classification
6. Require re-approval for next release
