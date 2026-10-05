---
name: sigil-builder
description: Use when building SIGIL OS core components, including sigil types, signing, verification, persistence, API, and foundational infrastructure.
user-invocable: true
---

# SIGIL Builder Skill

Use this skill when implementing SIGIL OS core components and infrastructure.

## When to Use

Use this skill for:
- Implementing sigil types and structures
- Building signing and verification infrastructure
- Creating persistence layer (ledger, store)
- Developing HTTP API and CLI interfaces
- Setting up workspace and crate structure
- Writing foundational tests
- Creating configuration files

## Phase 0 — Foundations

Current focus: Phase 0 (Foundations)

### Components to Build

1. **sigil-core/sigil**
   - Sigil struct with all fields
   - SigilKind enum with all variants
   - Serialization/deserialization
   - Basic unit tests

2. **sigil-core/persistence**
   - SQLite database initialization
   - Append-only ledger
   - Storage layer
   - Schema documentation

3. **sigil-core/api**
   - HTTP server setup
   - /health endpoint
   - Basic API structure
   - CLI interface

4. **Workspace Setup**
   - Cargo.toml workspace configuration
   - Individual crate Cargo.toml files
   - Shared dependencies

## Implementation Order

1. Create workspace Cargo.toml
2. Create sigil-core/sigil crate
3. Implement Sigil struct and SigilKind
4. Add basic tests
5. Create sigil-core/persistence crate
6. Implement SQLite ledger
7. Create sigil-core/api crate
8. Implement HTTP server with /health
9. Implement CLI
10. Run full test suite

## Required Evidence

For each component, provide:
- Compilation evidence (cargo build output)
- Test evidence (cargo test output)
- Documentation evidence (code comments, docs)
- Integration evidence (components work together)

## Forbidden Actions

- Do not skip tests
- Do not claim implementation without evidence
- Do not bypass signing/verification
- Do not make the ledger mutable
- Do not skip rollback implementation
- Do not claim production readiness

## Dependencies

- Rust (latest stable)
- Cargo
- SQLite (rusqlite crate)
- Ed25519 (ed25519-dalek crate)
- HTTP framework (axum or actix-web)
- CLI framework (clap)

## Verification Steps

After each component:
1. Run `cargo build`
2. Run `cargo test`
3. Run `cargo clippy`
4. Run `cargo fmt --check`
5. Document any issues
6. Provide evidence receipts

## Next Phase Reference

When Phase 0 is complete, reference Phase 1 (Warrant) for:
- Cryptographic signing implementation
- Device attestation integration
- Rollback mechanism
- Every state change emits sigil
