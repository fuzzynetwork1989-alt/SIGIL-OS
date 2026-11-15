# Build Packet: Fix Phase 0 Build Errors

**Mission ID:** phase0-completion
**Work Item ID:** fix-memory-compilation
**Status:** Pending Authorization
**Date:** 2026-10-19
**Autopilot Mode:** SIGIL OS Autopilot Mode v1.0

## 1. Goal and Non-Goals

### Goal
Fix compilation errors in sigil-core/memory crate to enable Phase 0 completion with `cargo test` passing and `/health` endpoint responding.

### Non-Goals
- Do not implement new features
- Do not add new dependencies
- Do not change Phase 0 exit criteria
- Do not expand scope beyond memory crate fixes
- Do not modify architecture documents
- Do not change release gates

## 2. Current Baseline and Gaps

### Baseline
- Cargo workspace: 16 members defined
- sigil-core/sigil: Compiles ✅
- sigil-core/persistence: Compiles ✅
- sigil-core/api: Compiles ✅
- sigil-core/memory: Fails to compile ❌
- Other crates: Compiling or skipped in error output

### Gaps
1. Import error: `qdrant_client::prelude` does not exist
2. Naming error: `MemoryStore` should be `InMemoryStore`
3. Type mismatch: `MemoryError` vs `anyhow::Error` in return types
4. 17 warnings: unused imports, overlapping ranges, unused variables

### Evidence
- Compilation error output captured from cargo build
- Error details documented in Autopilot Intake Report

## 3. Dependencies and Smallest Vertical Slice

### Dependencies
- None (only internal fix to existing code)

### Smallest Vertical Slice
1. Fix sigil-core/memory/src/vector_db.rs import
2. Fix sigil-core/memory/src/lib.rs import naming
3. Fix sigil-core/memory/src/lib.rs type mismatches
4. Clean up warnings
5. Verify build passes
6. Verify tests pass
7. Verify /health endpoint works

## 4. Exact File and Command Scope

### Allowed Paths
- sigil-core/memory/src/*.rs
- sigil-core/memory/Cargo.toml (if dependency version needs adjustment)

### Forbidden Paths
- All other crates
- Architecture documents
- Configuration files
- Build scripts
- CI/CD workflows

### Commands
```bash
cargo build                    # Verify compilation
cargo test                     # Verify tests pass
cargo clippy                   # Verify linting
cargo fmt                      # Format code
cargo run --bin sigil-api      # Test /health endpoint
curl http://localhost:3000/health  # Verify /health responds
```

## 5. Contract/Schema Impact

### Impact
- No contract changes
- No schema changes
- No API changes
- No breaking changes to existing code

### Internal Changes
- Fix import paths in memory crate
- Fix type signatures to match error handling pattern
- Clean up unused code

## 6. Positive and Negative Test Plan

### Positive Tests
1. `cargo build` completes without errors
2. `cargo test` passes all tests in memory crate
3. `cargo test` passes all tests in workspace
4. `cargo clippy` produces no errors
5. `/health` endpoint returns 200 OK
6. `/health` response includes version and status

### Negative Tests
1. No new compilation errors introduced
2. No test regressions in other crates
3. No warnings related to the fixes
4. No breaking changes to API signatures

## 7. Security/Privacy Impact

### Impact
- None (internal code fix only)
- No new dependencies
- No network calls
- No data access
- No secret handling

### Risk Tier
- Availability-critical (blocks build)
- No security or privacy impact

## 8. Data-Zone and Model Route

### Data Zone
- Local only (no external data access)
- No model inference
- No network communication

### Model Route
- None (no model usage in this fix)

## 9. Cost/Time/Compute Budget

### Time Budget
- Max elapsed minutes: 30
- Estimated time: 15 minutes

### Compute Budget
- Max local GPU minutes: 0 (no GPU needed)
- Max external cost USD: 0 (no external services)

### Resource Usage
- CPU: Compilation only
- Memory: Standard Rust compilation
- Disk: Build artifacts

## 10. Evidence Outputs

### Required Evidence
1. `cargo build` output showing successful compilation
2. `cargo test` output showing all tests passing
3. `cargo clippy` output showing no errors
4. `/health` endpoint response
5. Git diff showing changes made

### Evidence Status Tracking
| Evidence | Required | Status |
|----------|----------|--------|
| cargo build success | Yes | Pending |
| cargo test success | Yes | Pending |
| cargo clippy success | Yes | Pending |
| /health response | Yes | Pending |
| Git diff | Yes | Pending |

## 11. Rollback/Compensation Plan

### Rollback Strategy
- Reversible: Git revert of changes
- No migrations involved
- No data changes
- No irreversible operations

### Rollback Commands
```bash
git checkout sigil-core/memory/src/
cargo build  # Verify rollback works
```

### Compensation
- Not applicable (changes are reversible)

## 12. Stop Conditions and Approvals

### Stop Conditions
- Stop if fix requires changing Cargo.toml dependencies
- Stop if fix requires changing other crates
- Stop if fix breaks existing passing tests
- Stop if fix introduces new compilation errors
- Stop if /health endpoint does not work after fix

### Approval Class
- **Routine Class** (already permitted by current policy)
  - Fix compilation errors
  - Run build and test commands
  - Clean up warnings
  - Update .gitignore (if needed)

### Required Approvals
- None (Routine Class)
- Proceeding with implementation

## 13. Implementation Steps

### Step 1: Fix qdrant_client import
**File:** sigil-core/memory/src/vector_db.rs
**Change:** Replace `qdrant_client::prelude::*` with correct import path

### Step 2: Fix MemoryStore import
**File:** sigil-core/memory/src/lib.rs
**Change:** Replace `MemoryStore` with `InMemoryStore`

### Step 3: Fix type mismatches
**File:** sigil-core/memory/src/lib.rs
**Change:** Convert `MemoryError` to `anyhow::Error` using `.map_err(|e| anyhow::anyhow!(e.to_string()))?`

### Step 4: Clean up warnings
**File:** sigil-core/memory/src/*.rs
**Change:** Remove unused imports, fix overlapping ranges, prefix unused variables with underscore

### Step 5: Verify build
**Command:** `cargo build`
**Expected:** Successful compilation

### Step 6: Verify tests
**Command:** `cargo test`
**Expected:** All tests pass

### Step 7: Verify /health
**Command:** `cargo run --bin sigil-api` then `curl http://localhost:3000/health`
**Expected:** 200 OK with version and status

## 14. Risk Assessment

### Risks
- **Low Risk:** Internal code fix only
- **No breaking changes:** Only fixing errors
- **No scope growth:** Limited to memory crate
- **No new dependencies:** Using existing crates

### Mitigations
- Small, focused changes
- Immediate verification after each step
- Git version control for rollback
- Stop conditions defined

## 15. Completion Criteria

### Definition of Done
- [ ] cargo build completes without errors
- [ ] cargo test passes all tests
- [ ] cargo clippy produces no errors
- [ ] /health endpoint responds with 200 OK
- [ ] All warnings in memory crate resolved
- [ ] Git diff reviewed and committed
- [ ] Evidence receipts collected

### Phase 0 Exit Criteria (after this fix)
- [x] Workspace initialized with Cargo workspace
- [x] noetic-core crate compiles
- [x] Persistence layer with SQLite
- [x] HTTP API with /health endpoint
- [x] CLI interface
- [ ] cargo test passes (pending this fix)
- [x] Basic sigil type defined
- [x] Append-only event log

## 16. Post-Implementation Tasks

### Immediate
- Collect evidence receipts
- Update Autopilot Intake Report
- Create session summary

### Short-term
- Create docs/DELIVERY_PHASES.md
- Add target/ to .gitignore
- Verify CI/CD workflows

### Long-term
- Implement missing core layers
- Address scope creep
- Complete Phase 1 (Warrant)

## 17. Sign-off

**Prepared by:** Autopilot Agent (Devin)
**Date:** 2026-10-19
**Status:** Ready for Implementation
**Approval Class:** Routine (proceeding without additional approval)

---

**Build Packet Version:** 1.0
**Last Updated:** 2026-10-19
