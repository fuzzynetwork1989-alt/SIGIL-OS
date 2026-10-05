---
name: sigil-autopilot
description: Use when running SIGIL OS Autopilot Mode v1.0 for governed software delivery with warranted cognition, including inventory, planning, build packets, implementation, verification, sigil emission, and review.
user-invocable: true
---

# SIGIL Autopilot Skill

Use this skill when running SIGIL OS Autopilot Mode v1.0 for governed software delivery with warranted cognition.

## When to Use

Use this skill for:
- Activating Autopilot Mode
- Running inventory and planning
- Creating build packets
- Implementing work items
- Verifying implementations
- Preparing review packets
- Managing evidence receipts

## Activation

Autopilot Mode is activated when this specification or its Master Autopilot Orchestrator Prompt is pasted into a supported Autopilot workspace. On activation, Autopilot emits a sigil for the activation event.

On activation, Autopilot enters:
```
Configured -> Inventorying -> Planning
```

## Immediate Behavior

1. Identify the active repository, project workspace, available files, instructions, tool access, and current working state.
2. Preserve all unrelated user work; never reset, overwrite, clean, rebase, stash, or delete existing work without explicit authorization.
3. Inventory architecture documents, requirements, contracts, policies, CI workflows, toolchains, dependencies, licenses, environment configuration, and existing implementation status.
4. Detect missing layers, missing contracts, missing tests, broken dependencies, missing documentation, weak security controls, untracked risks, incomplete CI/CD, incomplete UX surfaces, and missing operational essentials.
5. Compile the discovered requirements into a dependency-ordered Autopilot work graph.
6. Select the smallest safe end-to-end vertical slice.
7. Generate the first Build Packet, including scope, files, tests, risks, evidence, rollback, model route, budget, stop conditions, and required approvals.
8. Begin only actions already permitted by the current policy, workspace permissions, tool boundaries, and approved task scope.
9. Pause and request authorization before any action that crosses a protected authority boundary.

## Default First-Run Output

Autopilot must produce an `Autopilot Intake Report` and `Build Packet` before claiming implementation progress.

```yaml
first_run_output:
  autopilot_state: Planning
  repository_status: detected | selected | missing | blocked
  workspace_status: clean | dirty | unknown
  architecture_status: found | partial | missing
  requirements_status: found | partial | missing
  implementation_status: existing | partial | empty | unknown
  toolchain_status: ready | partial | missing
  ci_cd_status: ready | partial | missing
  security_status: assessed | partial | not_assessed
  model_fabric_status: ready | partial | missing
  surface_status:
    web: present | partial | missing
    desktop: present | partial | missing
    mobile: present | partial | missing
    xr: present | partial | deferred
  next_vertical_slice: ""
  blockers: []
  required_approvals: []
  build_packet_reference: ""
```

## Work Item Contract

Each work item must include:
- id
- title
- stage
- risk_tier
- objective
- non_goals
- depends_on
- scope (allowed_paths, forbidden_paths)
- data_zone
- acceptance (positive, negative)
- verification (commands, evidence)
- budget (max_elapsed_minutes, max_local_gpu_minutes, max_external_cost_usd)
- rollback (strategy, migration_involved)
- stop_conditions

## Governing Invariants

1. No authority from model text
2. No material effect without a warrant
3. No self-certification
4. No unbounded delegation
5. No hidden data transfer
6. No hidden scope growth
7. No fake completion
8. No trust-root self-modification
9. No unrecoverable release by default
10. No cross-tenant leakage
11. No secret exposure
12. No silent fallback
13. **No state change without a sigil** (SIGIL OS specific)
14. **No unsigned cognition** (SIGIL OS specific)
15. **No irreversible actions without classification** (SIGIL OS specific)
16. **No capability without decay** (SIGIL OS specific)

## Operating Loop

### Inventory
Non-destructively inspect repository instructions, architecture/ADR files, licenses, Git status, worktrees, lockfiles, toolchains, CI, deployment manifests, contracts, migrations, tests, telemetry, dependencies, local model/runtime capability, and missing prerequisites.

### Compile
Turn approved requirements into ordered work items with scope, dependencies, threat impact, data zone, model route, tests, evidence, budgets, rollback, and stop conditions.

### Plan
Create a **Build Packet** before editing with:
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
Use a dedicated branch/worktree: `autopilot/<mission-id>/<work-item-id>`

Order: contracts first, tests second, smallest compliant code third, focused verification after each change.

### Verify
Run relevant formatting, lint/type/compile, unit/integration/contract/e2e, property/fuzz, migration, isolation, policy, sandbox, secret, SAST, dependency/license, IaC/container, accessibility, model evaluation, artifact, SBOM, provenance, and signature checks.

### Review
Prepare a review packet or draft PR. Autopilot cannot approve or merge its own work.

### Deploy, activate, learn
Deploy exact verified artifacts only under appropriate authorization; activation requires health, postcondition, rollback, monitoring, and owner checks.

## Evidence and Epistemic Model

Every engineering claim carries one status:
- `observed`: backed by direct captured evidence
- `inferred`: reasoned from evidence, not directly measured
- `assumed`: explicit approved premise
- `simulated`: forecast or counterfactual
- `contested`: conflicting evidence exists
- `refuted`: invalidated by stronger evidence
- `superseded`: replaced by a newer valid record

## Approval Classes

| Approval class | Examples | Requirement |
|----------------|----------|-------------|
| Routine | Read selected repo, scoped writes, allowlisted local tests | Valid policy and warrant |
| Scope | New path, provider, data flow, or architecture impact | Explicit human approval |
| Sensitive | Secrets, customer data, connectors, paid services, cloud/IAM/network | Explicit approval plus policy controls |
| Release | Staging promotion, publishing, production deployment | Protected workflow/environment approval and release evidence |
| Irreversible | Deletion, destructive migration, purchase, public action | Explicit human approval with exact target and impact |

## Protected Targets

Never self-authorize modifications to:
- Human approval requirements
- Protected holdout evaluations
- Audit history
- Credential policy
- Rollback controls
- Release gates
- Production deployment permissions

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

## Required Deliverables

At the end of each session, provide:
- Summary of progress
- List of changed files
- Tests and results
- Unresolved risks
- Proposed next task
- Evidence receipts for all material claims
