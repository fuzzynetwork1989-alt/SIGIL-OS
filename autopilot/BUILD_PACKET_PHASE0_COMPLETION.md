# Build Packet: Phase 0 - Foundations Completion

**Work Item ID:** SIGIL-001
**Title:** Complete Phase 0 Foundations with Build Verification and Sigil Emission
**Stage:** phase0-foundations
**Risk Tier:** trust-critical
**Generated:** 2024-10-01T14:30:00Z
**Autopilot Mode:** SIGIL OS Autopilot Mode v1.0

## Objective

Complete Phase 0 (Foundations) of SIGIL OS by verifying that the implemented code compiles, tests pass, the HTTP API health endpoint responds, and **every state change emits a signed sigil with warrant and rollback key**.

## Non-Goals

- Production deployment
- Connector execution
- Policy-root modification
- Noetic Substrate implementation
- Anchor Governance implementation
- Inference Kernel implementation
- Bypassing sigil emission for any state change

## Depends On

- None (this is the first work item)

## Scope

### Allowed Paths

- `sigil-core/sigil/`
- `sigil-core/persistence/`
- `sigil-core/api/`
- `Cargo.toml` (workspace)
- `tests/`

### Forbidden Paths

- `infrastructure/production/`
- `.github/workflows/deploy-production.yml`
- `.autopilot/policies/`
- `noetic-substrate/`
- `anchor-governance/`
- `inference-kernel/`
- `system-kernel/`
- `experience-surfaces/`
- `cognitive-apps/`

## Data Zone

local

## Acceptance Criteria

### Positive

- [ ] `cargo build` completes without errors
- [ ] `cargo test` passes all tests
- [ ] `cargo clippy` produces no warnings
- [ ] `cargo fmt --check` passes
- [ ] HTTP server starts and listens
- [ ] `/health` endpoint returns 200 OK
- [ ] `/health` response includes version and status
- [ ] CLI `--help` command works
- [ ] CLI `health` command works
- [ ] Every file change emits a sigil
- [ ] Sigil signatures verify correctly
- [ ] Rollback keys are generated for all changes
- [ ] Sigil ledger records all state changes

### Negative

- [ ] Build failure is detected and reported
- [ ] Test failure is detected and reported
- [ ] Linter warnings are detected and reported
- [ ] Format violations are detected and reported
- [ ] Server startup failure is detected and reported
- [ ] Health endpoint failure is detected and reported
- [ ] Sigil emission failure is detected and reported
- [ ] Sigil verification failure is detected and reported
- [ ] Rollback key generation failure is detected and reported

## Verification

### Commands

```bash
# Build
cargo build

# Test
cargo test

# Lint
cargo clippy --workspace --all-targets -- -D warnings

# Format check
cargo fmt --check

# Start server (manual verification)
cargo run -p api -- serve

# Test CLI
cargo run -p api -- --help
cargo run -p api -- health
```

### Evidence

- `cargo build` output
- `cargo test` output (junit.xml if available)
- `cargo clippy` output
- `cargo fmt --check` output
- HTTP health endpoint response
- CLI help output
- CLI health command output
- `changed-files.json`
- `work-item-receipt.json`
- `sigil-ledger-digest.json`
- `sigil-verification-report.json`
- `rollback-key-manifest.json`

## Budget

- max_elapsed_minutes: 30
- max_local_gpu_minutes: 0
- max_external_cost_usd: 0

## Rollback

- strategy: revert_commit_via_sigil_rollback
- migration_involved: false
- rollback_sigil_required: true

## Stop Conditions

- Build failure
- Test failure
- Linter warnings
- Format violations
- Server startup failure
- Health endpoint failure
- Unapproved scope expansion
- Request to weaken policy
- Secret detection
- Sigil emission failure
- Sigil verification failure
- Rollback key generation failure
- Capability lease expiration

## Implementation Plan

1. Install Rust and Cargo (if not available)
2. Run `cargo build` to verify compilation
3. Run `cargo test` to verify tests pass
4. Run `cargo clippy` to verify no warnings
5. Run `cargo fmt --check` to verify formatting
6. Start HTTP server and verify `/health` endpoint
7. Test CLI commands
8. Verify sigil emission for all state changes
9. Verify sigil signatures
10. Verify rollback key generation
11. Collect evidence receipts
12. Generate work-item receipt
13. Generate sigil ledger digest
14. Generate rollback key manifest

## Current Gaps

1. **Rust not installed** - Cannot build or test
2. **GitHub repository not created** - Cannot push to remote
3. **No CI/CD** - No automated verification
4. **Sigil emission not implemented** - Need to add sigil emission to all state changes

## Evidence Status

- Build: pending (requires Rust installation)
- Test: pending (requires Rust installation)
- Lint: pending (requires Rust installation)
- Format: pending (requires Rust installation)
- HTTP API: pending (requires Rust installation)
- CLI: pending (requires Rust installation)
- Sigil emission: pending (requires implementation)
- Sigil verification: pending (requires implementation)
- Rollback keys: pending (requires implementation)

## Required Approvals

None for Phase 0 foundations completion.

## Next Steps

After this work item:
- Phase 1 (Warrant) can begin
- CI/CD setup can be performed
- GitHub repository can be created and code pushed
- Sigil emission can be integrated into all state changes
