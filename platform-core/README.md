# NEXORA Omega Platform Core

Rust-based core kernels for NEXORA Omega cognitive operating system.

## Components

- **Capability Kernel** - Identity, authorization, grants, attenuation, revocation, taint, mediation
- **Cognitive Kernel** - Cognitive process lifecycle, goals, attention, budgets, planning, transitions
- **World-State Kernel** - Temporal entity/event/relation graph, beliefs, confidence, causal links
- **Memory Kernel** - Governed memory tiers, provenance, access controls, retention
- **Workflow Kernel** - Durable workflows, checkpoints, approvals, recovery
- **Event Kernel** - Append-only event journal, replay, causality

## Architecture

These kernels form the secure foundation that all other NEXORA Omega services build upon. They enforce:

- Model independence (models are replaceable components)
- Capability-first execution (no ambient permissions)
- State durability (all important transitions are evented)
- Human authority (operators can inspect, pause, revoke, rollback)

## Building

```bash
cargo build --release
```

## Testing

```bash
cargo test
cargo test --release
```

## Safety

All kernel code must pass:
- Formal verification where applicable
- Extensive unit and integration tests
- Security review
- Memory safety checks (Rust guarantees)
- Concurrent safety checks