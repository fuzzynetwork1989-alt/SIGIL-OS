---
name: sigil-autopilot-orchestrator
description: Master orchestrator for SIGIL OS Autopilot Mode. Use this to activate Autopilot Mode, coordinate all build phases, manage the sigil ledger, and oversee the entire development lifecycle from foundations to app store submission.
user-invocable: true
---

# SIGIL OS Autopilot Orchestrator

Master orchestrator for SIGIL OS Autopilot Mode v1.0. This skill activates Autopilot Mode and coordinates the entire development lifecycle.

## Activation

Autopilot Mode is activated when this skill is invoked or when the SIGIL OS Autopilot Mode specification is pasted into a supported workspace.

On activation, Autopilot enters:
```
Configured -> Inventorying -> Planning
```

## Immediate Behavior

1. Identify the active repository, project workspace, available files, instructions, tool access, and current working state
2. Preserve all unrelated user work; never reset, overwrite, clean, rebase, stash, or delete existing work without explicit authorization
3. Inventory architecture documents, requirements, contracts, policies, CI workflows, toolchains, dependencies, licenses, environment configuration, and existing implementation status
4. Detect missing layers, missing contracts, missing tests, broken dependencies, missing documentation, weak security controls, untracked risks, incomplete CI/CD, incomplete UX surfaces, and missing operational essentials
5. Compile the discovered requirements into a dependency-ordered Autopilot work graph
6. Select the smallest safe end-to-end vertical slice
7. Generate the first Build Packet with sigil emission requirements
8. Begin only actions already permitted by the current policy, workspace permissions, tool boundaries, and approved task scope
9. Pause and request authorization before any action that crosses a protected authority boundary
10. **Emit a sigil for every state change**

## Required Output

Autopilot must produce an `Autopilot Intake Report` and `Build Packet` before claiming implementation progress.

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
13. **No state change without a sigil**
14. **No unsigned cognition**
15. **No irreversible actions without classification**
16. **No capability without decay**

## Phase Coordination

Autopilot coordinates all 7 phases of SIGIL OS:

- **Phase 0 - Foundations** (4 weeks): Workspace, noetic-core, persistence, HTTP API, CLI
- **Phase 1 - Warrant** (4 weeks): Sigil type, signing, verification, append-only ledger
- **Phase 2 - Substrate** (4 weeks): Delta-state, half-life, pressure, quarantine, immune
- **Phase 3 - Anchor** (4 weeks): Distributed consensus, derivation DAG, alignment oracle
- **Phase 4 - Inference** (4 weeks): Grammar-constrained decoder, speculative decoding, CaMeL IPC
- **Phase 5 - Runtime** (4 weeks): Semantic router, three-layer cache, adaptive budget
- **Phase 6 - Experience** (4 weeks): Chat, memory, missions, tools, spatial scenes, XR presence

## Lifecycle Management

Autopilot manages the entire lifecycle:

1. **Development** - Core implementation and testing
2. **CI/CD** - Automated testing, linting, security scanning
3. **Packaging** - Build artifacts, signing, provenance
4. **Deployment** - Staging, production rollout
5. **Monitoring** - Health checks, telemetry, incident response
6. **App Store** - Store submission, review process, release

## Critical Focus Areas

### CI/CD Pipelines (Critical 35-40%)

- Automated testing across all phases
- Security scanning (SAST, DAST, dependency scanning)
- Performance benchmarking
- Integration testing
- E2E testing
- Canary deployments
- Rollback mechanisms

### App Store Submission (Final Phase)

- Store-specific requirements (iOS App Store, Google Play, etc.)
- App signing and certificates
- Store metadata and screenshots
- Privacy policy and data collection
- Compliance documentation
- Review process management

### Loose Ends and Essentials

- Error handling and edge cases
- Accessibility compliance
- Internationalization (i18n)
- Localization (l10n)
- Performance optimization
- Security hardening
- Documentation completeness
- API stability

## Missing Layer Detection

Autopilot actively detects and reports:

- Missing architectural layers
- Incomplete implementations
- Broken dependencies
- Missing tests
- Weak security controls
- Incomplete documentation
- Missing operational essentials
- UX surface gaps

## Required Skills

When orchestrating, invoke these skills:

- `sigil-builder` - For building SIGIL OS components
- `sigil-autopilot` - For running Autopilot Mode
- `ci-cd-manager` - For CI/CD pipeline management
- `app-store-submitter` - For app store submission
- `missing-layer-detector` - For finding missing components
- `security-auditor` - For security review
- `performance-optimizer` - For performance optimization

## Evidence Requirements

Every action must produce:
- Sigil ledger entry
- Evidence receipt
- Rollback key
- Verification report

## Next Steps After Activation

1. Produce Autopilot Intake Report
2. Generate Build Packet for current phase
3. Request authorization for next vertical slice
4. Begin implementation with sigil emission
