# Build Packet — Phase 1 Warrant Slice 3 (WI-P1-003)

**Date:** 2026-11-14
**Scope:** Inference + improvement sigils, ledger verification endpoint,
real `cargo test` evidence for api/sigil/persistence.

## Goal

Every cognitive act kind (belief, action, memory, inference, improvement)
has a signed-sigil emission path, and the ledger is externally verifiable.

## Changes

### `sigil-core/sigil/src/manager.rs`
- `SigilManager::create_inference_sigil(model, criterion, trace_steps, parents, inputs, sources)`
  — builds `SigilKind::Inference` with `AnchoredCriterion` + `ReasoningTrace`,
  signs and self-verifies.
- `SigilManager::create_improvement_sigil(variant_description, descent_proof, probation_cycles, ...)`
  — builds `SigilKind::Improvement` with `Variant` + `DescentProof`,
  signs and self-verifies.
- 2 new unit tests.

### `sigil-core/api/src/http.rs`
- `emit_inference_sigil` / `emit_improvement_sigil` helpers — same
  no-silent-fallback contract as `emit_state_sigil` (500 on failure when
  warrants+ledger enabled).
- `POST /api/v1/chat` now emits an **inference sigil** per request
  (`OnDeviceSmall` normally, `CloudLarge` when `use_superbrain`), with a
  2-step reasoning trace.
- `POST /api/v1/superbrain/improve` now emits an **improvement sigil**
  (variant `superbrain_self_improvement_cycle`, probation_cycles=1).
- New `GET /api/v1/sigils/verify` → `{valid, total_count, verified_at}`
  backed by `Ledger::verify_integrity` (Ed25519 verification of every sigil).
- 2 new unit tests.

### Environment
- `.cargo/config.toml`: `jobs = 4` (was 1; cold-cache rebuild speed).

## Evidence (observed)

- `cargo check -p sigil -p api --tests` — clean (pre-existing dead-code warnings only).
- `cargo test -p api` — **10/10 lib tests pass**, incl.
  `test_emit_inference_sigil_appends_to_ledger`,
  `test_emit_improvement_sigil_appends_to_ledger`.
- `cargo test -p sigil` — **20/20 pass**, incl. new
  `test_create_inference_sigil`, `test_create_improvement_sigil`.
- `cargo test -p persistence` — **6/6 pass**.
- Toolchain: `stable-x86_64-pc-windows-gnu` + MSYS2 UCRT64 gcc linker.

## Remaining Phase 1 gaps

- Warrant policy engine / revocation — not started.
- Persistent device identity / key storage (per-process keys today).
- Hardware-rooted attestation.
- Ledger rotation/compaction.
- Tamper-evidence test that mutates a ledger row and expects
  `verify_integrity() == false` (verify path exists; negative test pending).

## Rollback

Revert the two source files; endpoints degrade to previous behavior.
Ledger rows already written remain valid sigils.
