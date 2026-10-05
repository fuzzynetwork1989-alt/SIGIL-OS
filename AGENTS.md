# AGENTS.md

Instructions for Devin and autonomous agents working on SIGIL OS.

## Project Overview

SIGIL OS is a Post-AI Operating System with Cryptographic Warrant. It combines MERIDIAN's governed cognitive runtime with AETHER OS's inference-native substrate to create a system where every cognitive act is warranted, reversible, and auditable.

## Build Mode: SIGIL OS Autopilot Mode v1.0

This project uses **SIGIL OS Autopilot Mode v1.0** for governed software delivery with warranted cognition. When activated, Autopilot enters:

```
Configured -> Inventorying -> Planning
```

### Autopilot Activation

Autopilot Mode is activated when this specification or its Master Autopilot Orchestrator Prompt is pasted into a supported Autopilot workspace, agent runtime, development environment, repository workspace, or project-control interface.

### Immediate Behavior on Activation

1. Identify the active repository, project workspace, available files, instructions, tool access, and current working state.
2. Preserve all unrelated user work; never reset, overwrite, clean, rebase, stash, or delete existing work without explicit authorization.
3. Inventory architecture documents, requirements, contracts, policies, CI workflows, toolchains, dependencies, licenses, environment configuration, and existing implementation status.
4. Detect missing layers, missing contracts, missing tests, broken dependencies, missing documentation, weak security controls, untracked risks, incomplete CI/CD, incomplete UX surfaces, and missing operational essentials.
5. Compile the discovered requirements into a dependency-ordered Autopilot work graph.
6. Select the smallest safe end-to-end vertical slice.
7. Generate the first Build Packet, including scope, files, tests, risks, evidence, rollback, model route, budget, stop conditions, and required approvals.
8. Begin only actions already permitted by the current policy, workspace permissions, tool boundaries, and approved task scope.
9. Pause and request authorization before any action that crosses a protected authority boundary.

### Default First-Run Output

Autopilot must produce an `Autopilot Intake Report` and `Build Packet` before claiming implementation progress.

## Governing Invariants

1. **No authority from model text.** Models propose; they do not grant capability leases, approvals, warrants, or exceptions.
2. **No material effect without a warrant.** Actions require exact, scoped, expiring, non-replayable authorization checked at the executor boundary.
3. **No self-certification.** Builders are not their only verifiers.
4. **No unbounded delegation.** Delegation only attenuates scope, time, budget, data zone, and action class.
5. **No hidden data transfer.** Data-zone routing, provider selection, retention, and external transfer are explicit and ledgered.
6. **No hidden scope growth.** New repository, path, tool, connector, provider, cloud, privilege, spend, or deployment scope requires approval.
7. **No fake completion.** Missing evidence remains missing.
8. **No trust-root self-modification.** Autopilot cannot change identity roots, authorization rules, audit integrity, signing trust, release gates, or approval requirements.
9. **No unrecoverable release by default.** Material changes identify rollback or classify irreversibility and require explicit human approval.
10. **No cross-tenant leakage.** Tenant scope reaches requests, caches, retrieval, storage, execution, telemetry, and tests.
11. **No secret exposure.** Secrets never enter prompts, source history, generated clients, logs, screenshots, or evaluation fixtures.
12. **No silent fallback.** Missing required identity, verification, or policy infrastructure blocks the action rather than weakening controls.

## Operating Loop

### Inventory

Non-destructively inspect repository instructions, architecture/ADR files, licenses, Git status, worktrees, lockfiles, toolchains, CI, deployment manifests, contracts, migrations, tests, telemetry, dependencies, local model/runtime capability, and missing prerequisites. Preserve user work; do not reset, clean, stash, overwrite, or rebase unrelated changes.

### Compile

Turn approved requirements into ordered work items with scope, dependencies, threat impact, data zone, model route, tests, evidence, budgets, rollback, and stop conditions.

### Plan

Create a **Build Packet** before editing:

1. Goal and non-goals
2. Current baseline and gaps
3. Dependencies and smallest vertical slice
4. Exact file and command scope
5. Contract/schema impact
6. Positive and negative test plan
7. Security/privacy impact
8. Data-zone and model route
9. Cost/time/compute budget
10. Evidence outputs
11. Rollback/compensation plan
12. Stop conditions and approvals

### Implement

Use a dedicated branch/worktree:

```
autopilot/<mission-id>/<work-item-id>
```

Order: contracts first, tests second, smallest compliant code third, focused verification after each change. Avoid unrelated refactors, fake services, no-op tests, fake output, and secret exposure.

### Verify

Run relevant formatting, lint/type/compile, unit/integration/contract/e2e, property/fuzz, migration, isolation, policy, sandbox, secret, SAST, dependency/license, IaC/container, accessibility, model evaluation, artifact, SBOM, provenance, and signature checks.

### Review

Prepare a review packet or draft PR. Autopilot cannot approve or merge its own work.

### Deploy, activate, learn

Deploy exact verified artifacts only under appropriate authorization; activation requires health, postcondition, rollback, monitoring, and owner checks. Compare predicted vs actual engineering outcomes and propose improvements only through offline replay, adversarial fixtures, regression checks, and governed promotion.

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

## Evidence and Epistemic Model

Every engineering claim carries one status:

- `observed`: backed by direct captured evidence.
- `inferred`: reasoned from evidence, not directly measured.
- `assumed`: explicit approved premise.
- `simulated`: forecast or counterfactual.
- `contested`: conflicting evidence exists.
- `refuted`: invalidated by stronger evidence.
- `superseded`: replaced by a newer valid record.

Predictions do not become observations without new external evidence.

## Reference Documents

Before starting work, read these documents in order:

1. `AGENTS.md` (this file)
2. `docs/PROJECT_CONTRACT.md`
3. `docs/ARCHITECTURE.md`
4. `docs/SIGIL_AUTOPILOT_MODE.md`
5. `docs/RELEASE_GATES.md`
6. `docs/DELIVERY_PHASES.md`
7. `agents/skills/sigil-builder/SKILL.md`
8. `agents/skills/sigil-autopilot/SKILL.md`

## Repository Structure

```
sigil-os/
├── AGENTS.md
├── README.md
├── LICENSE
├── .agents/
│   └── skills/
│       ├── sigil-builder/
│       │   └── SKILL.md
│       └── sigil-autopilot/
│           └── SKILL.md
├── docs/
│   ├── PROJECT_CONTRACT.md
│   ├── ARCHITECTURE.md
│   ├── AUTOPILOT_MODE.md
│   ├── RELEASE_GATES.md
│   ├── DELIVERY_PHASES.md
│   ├── SIGIL_PRIMITIVES.md
│   ├── SECURITY_MODEL.md
│   └── notes/
├── sigil-core/
│   ├── sigil/
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── lib.rs
│   │       ├── sigil.rs
│   │       ├── signing.rs
│   │       └── verification.rs
│   ├── persistence/
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── lib.rs
│   │       ├── ledger.rs
│   │       └── store.rs
│   └── api/
│       ├── Cargo.toml
│       └── src/
│           ├── lib.rs
│           └── http.rs
├── noetic-substrate/
│   ├── delta-state/
│   ├── half-life/
│   ├── pressure/
│   ├── quarantine/
│   └── immune/
├── anchor-governance/
│   ├── consensus/
│   ├── derivation-dag/
│   └── alignment-oracle/
├── inference-kernel/
│   ├── grammar-constrained/
│   ├── speculative-decoding/
│   └── camel-ipc/
├── system-kernel/
│   ├── processes/
│   ├── memory/
│   ├── storage/
│   ├── networking/
│   └── identity/
├── experience-surfaces/
│   ├── phone/
│   ├── headset/
│   ├── desktop/
│   └── web/
├── cognitive-apps/
│   ├── chat/
│   ├── memory/
│   ├── missions/
│   └── tools/
├── configs/
│   ├── phase0.yaml
│   ├── phase1.yaml
│   └── ...
├── tests/
│   ├── integration/
│   ├── unit/
│   └── e2e/
└── Cargo.toml
```

## Current Phase

**Phase 0 — Foundations**

Goal: Workspace, noetic-core, persistence, HTTP API, CLI

Exit criteria: cargo test passes; /health responds

## Forbidden Actions

- Do not invent benchmark results
- Do not call placeholder code "production-ready"
- Do not change protected gates, approval rules, or audit logs
- Do not delete failed experiment history unless explicitly instructed
- Do not claim implementation without evidence
- Do not merge or deploy without explicit approval

## Required Deliverables

At the end of each session, provide:

- Summary of progress
- List of changed files
- Tests and results
- Unresolved risks
- Proposed next task
- Evidence receipts for all material claims
