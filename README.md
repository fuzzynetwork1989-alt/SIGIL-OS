# SIGIL OS

The Post-AI Operating System with Cryptographic Warrant

A new category of computing where intelligence is the substrate and every act of cognition bears a sigil — a verifiable mark of provenance, authorization, and reversibility.

## Manifesto

Every operating system you have ever used was designed for a world where intelligence was external. Windows, macOS, Linux, Android, iOS — they all treat AI as an application, a service, a feature bolted on top of a fundamentally non-intelligent substrate. You open an app to talk to an AI. You close it, and the intelligence goes away. The OS itself is inert.

The next generation does not just invert that. It goes further.

Intelligence becomes the substrate. And every act of intelligence — every belief, every action, every memory, every improvement — carries a sigil: a cryptographically verifiable mark that says who authorized this, when it was produced, what evidence supports it, what it predicts, and how to undo it.

SIGIL OS is not "AI-powered." It is not even "AI-native." It is warranted cognition as substrate. The kernel does not merely run inference; it governs inference against criteria the kernel itself cannot modify. The file system does not merely store knowledge; it makes every claim auditable by provenance. The identity layer does not merely authenticate; it binds every belief to a signed, device-attested, sender-constrained actor. The window manager does not merely render; it makes the companion's presence a warrant-bearing spatial anchor whose decay is itself an event.

## What SIGIL OS Combines

SIGIL OS is the composition of MERIDIAN (the governed cognitive runtime) and AETHER OS (the inference-native substrate), producing nine capabilities that neither system has alone:

1. **Warranted Inference** — Every model output is a governed cognitive act
2. **Ephemeral Capability** — Capability leases decay; unused privileges expire
3. **Signed Memory** — Every belief carries a cryptographic sigil from its producer
4. **Spatial Governance** — Scene anchors decay like beliefs
5. **Frame-Aware Ethics** — Ethics enforcement survives thermal throttling
6. **Attested Reasoning** — Traces are signed, timestamped, hash-chained
7. **Reversible Inference** — Every model output carries a rollback key
8. **Capability-Scoped Memory** — Reading a belief requires a capability lease
9. **Spatial Presence Persistence** — The companion's location is a first-class cognitive object

## Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│  EXPERIENCE SURFACES                                               │
│  Phone · Headset · Desktop · Terminal · Web · Voice                │
│  The Presence — a scene-anchored, warrant-bearing companion        │
├────────────────────────────────────────────────────────────────────┤
│  COGNITIVE APPLICATIONS                                            │
│  Chat · Memory · Missions · Tools · Spatial scenes · XR presence   │
├────────────────────────────────────────────────────────────────────┤
│  SIGIL RUNTIME                                                     │
│  ┌───────────────┬────────────────┬──────────────────────────────┐ │
│  │ World Model   │ Cognitive OS   │ Agentic Foundation           │ │
│  │ (predicts)    │ (believes,     │ (plans, calls tools,         │ │
│  │               │  remembers)    │  executes, verifies)         │ │
│  └───────────────┴────────────────┴──────────────────────────────┘ │
│  Cortex: CognitiveOp interpreter · Multimodal: text/vision/audio   │
│  Semantic Router · Three-layer cache · Adaptive reasoning budget   │
├────────────────────────────────────────────────────────────────────┤
│  NOETIC SUBSTRATE (from MERIDIAN)                                  │
│  Delta-state · Epistemic half-life · Pressure · Reasoning traces   │
│  Quarantine · Immune system · Executable reasoning · Temporal      │
│  attention · Counterfactual persistence                            │
├────────────────────────────────────────────────────────────────────┤
│  ANCHOR-II GOVERNANCE                                              │
│  Distributed criterion consensus · Derivation DAG · Meta-anchor    │
│  Alignment oracle separation · Defense in depth (6 layers)         │
├────────────────────────────────────────────────────────────────────┤
│  INFERENCE KERNEL (from AETHER OS)                                 │
│  Hybrid SSM-attention MoE (4:1, ~140B total / ~13B active)         │
│  Elastic on-device MatFormer (E2B/E4B, ~2–3 GB)                    │
│  Grammar-constrained decoding · Speculative decoding per channel   │
│  Frame-aware compute scheduler (render clock as first-class)       │
│  Capability-typed IPC (CaMeL) · Dual-LLM privilege separation      │
├────────────────────────────────────────────────────────────────────┤
│  SYSTEM KERNEL                                                     │
│  Processes · Memory · Storage · Networking · Devices · Timers      │
│  Keyless identity fabric (passkey · DPoP · CIBA · attestation)     │
│  MCP-native tool bus (2026-07-28 stateless)                        │
│  Unified OpenTelemetry gen_ai.* spans · C2PA provenance            │
├────────────────────────────────────────────────────────────────────┤
│  HARDWARE                                                          │
│  CPU · GPU · NPU · RAM · SSD · Network · Sensors · XR displays     │
│  TEE (GPU confidential computing for sensitive workloads)          │
└────────────────────────────────────────────────────────────────────┘
```

## Delivery Phases

SIGIL OS is built in seven phases. Each phase delivers a working, testable slice.

| Phase | Duration | Scope | Exit criteria |
|-------|----------|-------|----------------|
| 0 — Foundations | 4 weeks | Workspace, noetic-core, persistence, HTTP API, CLI | cargo test passes; /health responds |
| 1 — Warrant | 4 weeks | Sigil type, signing, verification, append-only ledger | Every state change emits a signed sigil |
| 2 — Substrate | 4 weeks | Delta-state, half-life, pressure, quarantine, immune | Epistemic primitives govern state transitions |
| 3 — Anchor | 4 weeks | Distributed consensus, derivation DAG, alignment oracle | Governance operates across workers |
| 4 — Inference | 4 weeks | Grammar-constrained decoder, speculative decoding, CaMeL IPC | Kernel refuses unaligned completions |
| 5 — Runtime | 4 weeks | Semantic router, three-layer cache, adaptive budget | Runtime routes by complexity, cost, latency |
| 6 — Experience | 4 weeks | Chat, memory, missions, tools, spatial scenes, XR presence | Full experience surfaces active |

## Build Status

**Current Phase:** Phase 0 — Foundations

## License

[To be determined]

## Contributing

This project uses Continuity OS Autopilot Mode for governed software delivery. See `docs/AUTOPILOT_MODE.md` for details on the build process.

## References

This project builds on concepts from:
- MERIDIAN: Governed cognitive runtime
- AETHER OS: Inference-native substrate
- Rillmark: Evidence-backed commitment fabric for model training
