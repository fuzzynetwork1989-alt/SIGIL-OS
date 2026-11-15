# NEXORA Omega Skill Registry

Versioned operational skills, tests, and manifests for NEXORA Omega.

## What is a Skill?

A skill is a controlled operational playbook, not a vague prompt. Each skill must define:

- Inputs
- Preconditions
- Allowed tools
- Capability requirements
- Validation requirements
- Required artifacts
- Approval class
- Rollback or compensation behavior
- Telemetry
- Owner

## Skill Catalog

| Skill ID | Purpose | Default authority |
| :-- | :-- | :-- |
| `nexora.architecture@1` | Maintain boundaries, ADRs, contracts, and dependencies | Read + draft only |
| `nexora.kernel-slice@1` | Build a small vertical kernel feature with tests and telemetry | Sandbox writes |
| `nexora.capability-review@1` | Design or review identity, capabilities, taint, approvals | Read + policy draft |
| `nexora.memory-fabric@1` | Implement governed memory and provenance | Sandbox writes |
| `nexora.world-state@1` | Implement temporal entities, evidence, beliefs, and state diffs | Sandbox writes |
| `nexora.model-routing@1` | Implement adapters, routing, fallbacks, and model evals | Sandbox writes |
| `nexora.tool-governance@1` | Define typed tools, sandboxing, receipts, retries, compensation | Sandbox writes |
| `nexora.workflow-runtime@1` | Build durable workflows, checkpoints, approvals, recovery | Sandbox writes |
| `nexora.semantic-filesystem@1` | Build artifact semantics, history, provenance, and access control | Sandbox writes |
| `nexora.eval-harness@1` | Add benchmarks, regressions, and adversarial suites | Sandbox writes |
| `nexora.security-redteam@1` | Test injection, confused deputy, exfiltration, escalation, isolation | Isolated test environment |
| `nexora.observability@1` | Add traces, metrics, logs, SLOs, and replay views | Sandbox writes |
| `nexora.release-engineering@1` | Prepare CI/CD, migrations, signed releases, canary, rollback | Approval-gated |
| `nexora.operator-console@1` | Build inspect, pause, approve, revoke, replay, restore tools | Sandbox writes |
| `nexora.resilience@1` | Add chaos, backup/restore, degraded mode, and DR drills | Isolated test environment |
| `nexora.multitenancy@1` | Enforce isolation, quotas, exports, and deletion workflows | Sandbox writes |
| `nexora.research-to-adr@1` | Turn research into falsifiable design proposals | Read + draft only |
| `nexora.migration@1` | Execute compatible state and policy migrations | Approval-gated |
| `nexora.documentation@1` | Maintain contracts, docs, diagrams, runbooks, and changelogs | Documentation writes |

## Skill Execution Rule

Invoke the narrowest skill set capable of completing the task. Skills compose through typed artifacts and contracts; they must never transfer unrestricted natural-language authority.

## Skill Lifecycle

1. **Draft** - Initial skill definition
2. **Review** - Security and capability review
3. **Test** - Comprehensive testing including adversarial cases
4. **Promote** - Promotion to production use
5. **Monitor** - Continuous monitoring of skill performance
6. **Retire** - Deprecation and removal when obsolete