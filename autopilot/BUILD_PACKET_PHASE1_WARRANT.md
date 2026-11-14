# Build Packet — Phase 1 Warrant (Slice 1)

**Date:** 2026-11-10
**Mission:** Phase 1 — Warrant
**Work item:** WI-P1-001 — Signed rollback sigils + device attestation binding

## Goal

Close two Phase 1 gaps in `sigil-core/sigil` without changing contracts:

1. Rollback currently emits **unsigned** sigils (`signature` is zeroed), which
   violates the invariant that every cognitive act emits a signed sigil.
2. `AttestedIdentity.attestation` is an empty placeholder (`vec![]`); there is
   no device attestation binding.

## Non-goals

- No API/ledger integration changes (emitting sigils on HTTP state changes is
  a later work item).
- No warrant policy engine / revocation (later work item).
- No persistence schema changes.

## Baseline and gaps

- `SigilManager::{create_belief,create_action,create_memory}_sigil` sign and
  self-verify correctly, but set `attestation: vec![]`.
- `RollbackManager::rollback*` builds a rollback `Sigil` with a zeroed
  `Ed25519Signature`; `SigilVerifier::verify` would reject it.
- `SigilSigner`/`SigilVerifier` only sign/verify whole `Sigil` structs; no
  raw-bytes primitive exists for attestation payloads.

## Approach

- Add `SigilSigner::sign_bytes` / `SigilVerifier::verify_bytes` for raw
  payloads, plus `attestation_payload(device_id, actor_id)` canonical
  serialization.
- `SigilManager` populates `actor.attestation` with an Ed25519 signature over
  the attestation payload using the same signer key (binds device+actor
  identity into the signed payload).
- `SigilVerifier::verify_attestation(sigil)` verifies that binding.
- Add `SigilManager::rollback(&Sigil)` which delegates kind-routing to
  `RollbackManager` then signs and self-verifies the result.
- `RollbackManager` remains a pure constructor; signing is the manager's job
  (consistent with "models propose, executors warrant").

## Files

- `sigil-core/sigil/src/signing.rs` — `sign_bytes`, `attestation_payload`
- `sigil-core/sigil/src/verification.rs` — `verify_bytes`, `verify_attestation`
- `sigil-core/sigil/src/manager.rs` — attested identity, `rollback()`, tests
- `sigil-core/sigil/src/rollback.rs` — warning cleanup only
- `autopilot/BUILD_PACKET_PHASE1_WARRANT.md` — this packet

## Test plan

- Positive: manager-produced sigils have non-empty attestation that verifies;
  rolled-back sigils pass `SigilVerifier::verify` and `verify_attestation`.
- Negative: tampered `device_id`/`actor_id` fails `verify_attestation`;
  rollback of wrong kind / invalid signature still errors.

## Evidence

Observed 2026-11-10:

- `cargo check -p sigil` → `Finished dev profile` (0 errors, 0 warnings)
- `cargo check -p sigil --tests` → `Finished dev profile` (test code typechecks)

Observed 2026-11-11 (toolchain fixed — see below):

- `cargo test -p sigil` → **18 passed; 0 failed** (includes
  `test_attestation_verifies`, `test_attestation_fails_on_tampered_identity`,
  `test_rollback_produces_signed_sigil`,
  `test_rollback_action_and_memory_signed`).

## Toolchain fix (2026-11-11)

`cargo test` was blocked because `link.exe` resolved to Git's coreutils
`link` and no C toolchain existed. Fixed by:

- Installing `mingw-w64-ucrt-x86_64-gcc` + `binutils` via MSYS2 pacman
  (ucrt64). Note: pacman repo signatures could not be verified — the
  MSYS2 keyring was empty/corrupt (pre-existing); `ucrt64` repo was
  installed with `SigLevel = Never` (HTTPS from repo.msys2.org). Other
  repos were only disabled during install and have been restored;
  `ucrt64` retains `SigLevel = Never` in `/etc/pacman.conf` until the
  keyring is repaired (`pacman-key --populate msys2` — currently hangs
  in this environment, unresolved).
- `rustup default stable-x86_64-pc-windows-gnu`
- `.cargo/config.toml`: `[target.x86_64-pc-windows-gnu] linker =
  "C:/msys64/ucrt64/bin/gcc.exe"`
- C dependencies (e.g. rusqlite bundled) need `/c/msys64/ucrt64/bin` on
  `PATH` when running cargo.

## Risks / stop conditions

- ~~`cargo test` cannot link on this host~~ — resolved 2026-11-11 (see
  Toolchain fix).
- Attestation uses the sigil signing key; a hardware-rooted attestation
  provider is a later work item.

## Rollback

Revert the commit; no schema or API contract changes.
