# Build Packet — Phase 1 Warrant Slice 4 (WI-P1-004)

**Date:** 2026-11-14
**Scope:** Persistent device identity + ledger tamper evidence.

## Goal

Stable `device_id`/`actor_id`/signing key across restarts when configured,
and proof that `Ledger::verify_integrity` detects payload tampering.

## Changes

### `sigil-core/sigil/src/identity.rs` (new)
- `DeviceIdentity` — stable device/actor UUIDs + Ed25519 signing key.
- `load_or_create(path)` — reads JSON identity file
  (`{device_id, actor_id, secret_key_hex}`); creates + persists on first
  run. Corrupt file or bad hex → hard error (no silent fallback to
  ephemeral keys). Unix file mode 0600.
- `generate()`, `key_pair()`, `public_key_bytes()`.
- 3 unit tests (generate, roundtrip, corrupt-file error).

### `sigil-core/sigil/src/manager.rs`
- `SigilManager::load_or_create(identity_path)` — builds a manager from a
  persistent `DeviceIdentity`.

### `sigil-core/sigil/src/lib.rs`, `Cargo.toml`
- Export `DeviceIdentity`; `tempfile` dev-dep.

### `sigil-core/api/src/http.rs`
- `ApiState::new` gained `identity_path: Option<&Path>` — uses
  `SigilManager::load_or_create` when set, ephemeral otherwise.
  `with_ledger` (test path) unchanged.

### `sigil-core/api/src/main.rs`, `src/cli.rs`
- Pass `config.sigil.key_pair_path` (`SIGIL_KEY_PAIR_PATH` env) through.

### `sigil-core/persistence/src/ledger.rs`
- `tamper_tests::test_verify_integrity_detects_tampering` — appends a
  signed belief sigil, mutates the stored JSON via a second SQLite
  connection (simulating DB-write attacker), asserts
  `verify_integrity() == false`.

## Environment incident

- Disk hit 100% during this work; `ledger.rs` was truncated to 0 bytes by
  a failed write. Restored via `git checkout` (HEAD already contained the
  full file — no work lost). Freed ~900 MB by clearing old Temp files and
  the Gradle `modules-2` cache (re-downloadable).

## Evidence (observed)

- `cargo test -p sigil` — **23/23 pass** (incl. identity roundtrip,
  corrupt-file error).
- `cargo test -p api` — **10/10 lib + 1/1 integration pass**.
- `cargo test -p persistence` — **7/7 pass**, incl.
  `test_verify_integrity_detects_tampering` → `verify_integrity()` returns
  `false` after payload mutation. **Observed tamper detection.**

## Known limitations (honest)

- `verify_integrity` detects **content modification** but NOT row
  deletion (no hash chain / count commitment yet).
- Identity file is JSON with hex secret — adequate for dev; production
  should use OS keychain/TPM.
- `SIGIL_KEY_PAIR_PATH` unset → ephemeral per-process identity (unchanged
  default; explicit opt-in to persistence).

## Remaining Phase 1 gaps

- Warrant policy engine / revocation — not started (next).
- Ledger hash-chain / deletion detection.
- Hardware-rooted attestation.
- Ledger rotation/compaction.

## Rollback

Revert the listed files; `SIGIL_KEY_PAIR_PATH` unset restores prior
behavior. Identity files are additive artifacts.
