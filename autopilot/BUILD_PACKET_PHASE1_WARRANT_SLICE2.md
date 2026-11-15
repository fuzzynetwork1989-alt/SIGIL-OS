# Build Packet — Phase 1 Warrant (Slice 2)

**Date:** 2026-11-11
**Work item:** WI-P1-002 — Emit signed sigils to ledger on API state changes

## Goal

Close the Phase 1 gap "every state change emits signed sigil" for the
conversation API surface:

- `POST /api/v1/conversations` → signed action sigil (`conversation.create`)
- `POST /api/v1/conversations/:id/messages` → `conversation.message`
- `DELETE /api/v1/conversations/:id` → `conversation.delete`
- `GET /api/v1/sigils` returns real ledger contents (was hardcoded empty)

## Non-goals

- Chat inference sigils (chat does not mutate state; inference sigils are a
  later work item once `create_inference_sigil` exists).
- Warrant policy engine, revocation, approval flows.
- Key persistence across restarts (manager keys are per-process; sigils are
  self-contained via embedded public keys — noted limitation).

## Design

- `ApiState` gains `sigil_manager: Arc<SigilManager>`,
  `ledger: Arc<Mutex<Ledger>>` (rusqlite `Connection` is `Send` but not
  `Sync`), plus `warrants_enabled`/`ledger_enabled` flags sourced from
  `Config`.
- `ApiState::new(version, superbrain_enabled, warrants_enabled,
  ledger_enabled)` opens `Ledger` at `SIGIL_LEDGER_PATH` (default
  `sigil-ledger.db`).
- `emit_state_sigil()` builds an action sigil via `SigilManager`
  (capability = endpoint name, warrant criteria `api_state_change`,
  1h expiry) and appends to the ledger. Emission failure returns HTTP 500 —
  no silent fallback.
- Ordering: mutate store first, then emit sigil referencing the resource;
  emission failure surfaces as 500 (state changed but failure is explicit,
  not silent).

## Files

- `sigil-core/api/src/http.rs` — ApiState fields, emit helper, endpoint wiring,
  real `/api/v1/sigils`, unit tests
- `sigil-core/api/src/main.rs`, `src/cli.rs` — construct via `ApiState::new`
- `sigil-core/api/Cargo.toml` — `tempfile` dev-dependency
- `autopilot/BUILD_PACKET_PHASE1_WARRANT_SLICE2.md` — this packet

## Evidence

Observed 2026-11-11:

- `cargo check -p api --tests` → `Finished dev profile` (0 errors; only
  pre-existing dead-code warnings on unused request fields and
  `chat_stream_endpoint`, documented in PHASE0_COMPLETION_REPORT).
- New unit tests: `test_emit_state_sigil_appends_to_ledger`,
  `test_collect_sigils_returns_entries`,
  `test_emit_state_sigil_disabled_is_noop` — typechecked, **not executed**
  (`cargo test` cannot link: no MSVC `link.exe`/MinGW gcc on this host,
  same blocker as WI-P1-001).

## Status

**Implemented + compile-verified. Tested: pending toolchain.**

## Risks

- Ledger file grows unboundedly (no rotation) — later work item.
- Per-boot signing keys mean cross-restart signature chains are per-sigil
  self-contained only.

## Rollback

Revert commit; ledger file is additive and disposable.
