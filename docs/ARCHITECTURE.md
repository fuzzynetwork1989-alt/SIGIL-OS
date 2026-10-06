# SIGIL OS Architecture

## Overview

SIGIL OS is a Post-AI Operating System where intelligence is the substrate and every cognitive act bears a sigil — a cryptographically verifiable mark of provenance, authorization, and reversibility.

## System Layers

```
┌────────────────────────────────────────────────────────────────────┐
│  EXPERIENCE SURFACES                                               │
│  Phone · Headset · Desktop · Terminal · Web · Voice                │
│  Meta Quest 3 · Apple Vision Pro · HoloLens · Generic XR            │
│  The Presence — a scene-anchored, warrant-bearing companion        │
│  UI/UX Layer: Icons · Themes · Buttons · Interactive Interface     │
│  Mixed Reality Avatar/Digital Model Morphing System                │
├────────────────────────────────────────────────────────────────────┤
│  COGNITIVE APPLICATIONS                                            │
│  Chat · Memory · Missions · Tools · Spatial scenes · XR presence   │
│  Interactive Chatbot with Mixed Reality Integration                │
├────────────────────────────────────────────────────────────────────┤
│  DREAM WEAVING RECURSIVE SELF-EVOLVING REMEMBRANCE (NEW)            │
│  Dream State Engine · Recursive Self-Reflection                    │
│  Cognitive Pathway Mutation · Evolutionary History Ledger          │
│  Insight Generation · Warranted Self-Modification                 │
│  Safeguard Constraints · Rollback Protection                       │
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
│  MODEL FABRIC (NEW)                                                │
│  Base Model Selection · Modelfile Management · Model Family        │
│  Enhanced Next-Generation Brain/Engine · Model Integrations        │
│  Model Routing · Capability Typing · Performance Monitoring        │
│  Local/Cloud Hybrid · Multi-Provider Support                        │
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
│  OPERATIONAL INFRASTRUCTURE (NEW)                                  │
│  CI/CD Pipelines · Multi-Platform Builds                           │
│  Automated Testing · Security Scanning · Dependency Scanning      │
│  Sigil Verification in CI · Artifact Management                     │
├────────────────────────────────────────────────────────────────────┤
│  HARDWARE                                                          │
│  CPU · GPU · NPU · RAM · SSD · Network · Sensors · XR displays     │
│  TEE (GPU confidential computing for sensitive workloads)          │
└────────────────────────────────────────────────────────────────────┘
```

## The Sigil Object

The unified object in SIGIL OS is the sigil. Every cognitive act produces one.

```rust
pub struct Sigil {
    pub id: Uuid,
    pub actor: AttestedIdentity,
    pub kind: SigilKind,
    pub provenance: Provenance,
    pub warrant: Option<Warrant>,
    pub rollback: RollbackKey,
    pub signature: Ed25519Signature,
    pub issued_at: DateTime<Utc>,
    pub expires_at: Option<DateTime<Utc>>,
}

pub enum SigilKind {
    Belief {
        proposition: String,
        confidence: f64,
        half_life: HalfLife,
        epistemic_status: EpistemicStatus,
    },
    Action {
        capability: CapabilityLease,
        warrant: Warrant,
        predicted_effect: Prediction,
    },
    Memory {
        decay: Decay,
        spatial_anchor: Option<Anchor>,
        consolidates: Vec<Uuid>,
    },
    Inference {
        model: ModelTier,
        criteria: AnchoredCriterion,
        trace: ReasoningTrace,
    },
    Improvement {
        variant: Variant,
        descent_proof: DescentProof,
        probation_cycles: u32,
    },
}
```

## Novel Primitives

### Inherited from MERIDIAN

1. **Delta-State Reasoning** — Stores changes, not states
2. **Epistemic Half-Life** — Every belief decays at a learned rate
3. **Cognitive Pressure** — Accumulated uncertainty forces action
4. **Executable Reasoning** — Traces compile to runnable functions
5. **Belief Quarantine** — Changes cascade to dependents, isolating errors
6. **Temporal Attention Windows** — Attention allocated by temporal relevance
7. **Counterfactual Persistence** — Stores rejected paths and why
8. **Immune Response** — Architectural defense against manipulation

### New in SIGIL (Merger Capabilities)

1. **Warranted Inference** — Every model output passes through the anchor before being surfaced
2. **Ephemeral Capability** — Capability leases decay; unused privileges expire
3. **Signed Memory** — Every belief carries a cryptographic sigil from its producer
4. **Spatial Governance** — Scene anchors decay like beliefs
5. **Frame-Aware Ethics** — Ethics enforcement survives thermal throttling
6. **Attested Reasoning** — Traces are signed, timestamped, hash-chained
7. **Reversible Inference** — Every model output carries a rollback key
8. **Capability-Scoped Memory** — Reading a belief requires a capability lease
9. **Spatial Presence Persistence** — The companion's location is a first-class cognitive object

### Dream Weaving Recursive Self-Evolving Remembrance (NEW)

A revolutionary cognitive system that enables the OS to evolve its own intelligence:

1. **Dream State Engine** — Simulates dream-like cognitive states for unconstrained association
2. **Recursive Self-Reflection** — The system reflects on its own reasoning patterns and biases
3. **Cognitive Pathway Mutation** — Applies evolutionary operators to neural pathways
4. **Evolutionary History Ledger** — Records every cognitive evolution with full provenance
5. **Insight Generation** — Cross-pollinates cognitive states to generate novel insights
6. **Warranted Self-Modification** — Every evolutionary change requires a sigil and warrant
7. **Safeguard Constraints** — Hard constraints prevent runaway self-modification
8. **Rollback Protection** — Every evolutionary step can be rolled back
9. **Remembrance System** — Preserves evolutionary history for learning and analysis

**Key Properties:**
- Every mutation is warranted, reversible, and auditable
- Evolution is bounded by safety constraints
- Insights are generated through controlled randomness
- Self-improvement is measurable and verifiable
- No modification can break core invariants

## Component Architecture

### Sigil Core (sigil-core/)

**sigil/**: Core sigil type, signing, verification
- `sigil.rs`: Sigil struct and SigilKind enum
- `signing.rs`: Ed25519 signing infrastructure
- `verification.rs`: Signature verification with device attestation

**persistence/**: Storage and ledger
- `ledger.rs`: Append-only event log
- `store.rs`: SQLite-based persistent storage

**api/**: HTTP and CLI interfaces
- `http.rs`: HTTP API with /health endpoint
- `cli.rs`: Command-line interface

### Model Fabric (model-fabric/)

**base-model/**: Base model selection and integration
- `selector.rs`: Model selection logic (local vs cloud)
- `loader.rs`: Model loading and initialization
- `modelfile.rs`: Modelfile format and parsing
- `family.rs`: Model family management

**integrations/**: Model provider integrations
- `local/`: Local model integrations (LLaMA, Mistral, Phi, Qwen)
- `openai/`: OpenAI API integration
- `anthropic/`: Anthropic API integration
- `google/`: Google API integration
- `router.rs`: Model routing and load balancing

**engine/**: Enhanced next-generation brain/engine
- `runtime.rs`: Model execution runtime
- `capability.rs`: Model capability typing
- `monitor.rs`: Performance monitoring
- `optimization.rs`: Model optimization and caching

### Dream Weaving (dream-weaving/)

**dream-state/**: Dream state simulation
- `engine.rs`: Dream state simulation engine
- `association.rs`: Unconstrained association generation
- `entropy.rs`: Controlled randomness injection

**self-reflection/**: Recursive self-reflection
- `mirror.rs`: Self-reflection on reasoning patterns
- `bias_detector.rs`: Bias detection and correction
- `meta_cognition.rs`: Meta-cognitive analysis

**evolution/**: Cognitive pathway mutation
- `mutator.rs`: Cognitive pathway mutation operators
- `selector.rs`: Evolutionary selection mechanisms
- `crossover.rs`: Insight crossover and recombination

**ledger/**: Evolutionary history
- `history.rs`: Evolutionary history ledger
- `provenance.rs`: Evolution provenance tracking
- `rollback.rs`: Evolution rollback system

**safeguards/**: Safety constraints
- `constraints.rs`: Hard constraint enforcement
- `bounds.rs`: Evolutionary boundary enforcement
- `validator.rs`: Evolution validation before application

### Noetic Substrate (noetic-substrate/)

Cognitive primitives from MERIDIAN:
- `delta-state/`: Change tracking and state derivation
- `half-life/`: Epistemic decay on beliefs
- `pressure/`: Cognitive pressure accumulation
- `quarantine/`: Error isolation and cascading
- `immune/`: Architectural defense systems
- `temporal-attention/`: Time-aware attention allocation
- `counterfactual/`: Rejected path storage
- `executable/`: Trace compilation to functions

### Anchor Governance (anchor-governance/)

Governance layer from MERIDIAN:
- `consensus/`: Distributed criterion consensus
- `derivation-dag/`: Derivation tracking
- `alignment-oracle/`: Alignment oracle separation
- `defense/`: Defense in depth (6 layers)
- `meta-anchor/`: Meta-anchor support

### Inference Kernel (inference-kernel/)

Inference substrate from AETHER OS:
- `grammar-constrained/`: JSON Schema to CFG compilation
- `speculative-decoding/`: Per-channel speculative decoding
- `camel-ipc/`: Capability-typed IPC
- `dual-llm/`: Privilege separation
- `frame-scheduler/`: Frame-aware compute scheduling

### System Kernel (system-kernel/)

Traditional OS capabilities with SIGIL extensions:
- `processes/`: Process management with sigil tracking
- `memory/`: Memory management with capability scoping
- `storage/`: Semantic file system
- `networking/`: Networking with keyless identity
- `identity/`: Passkey, DPoP, CIBA, attestation
- `mcp-bus/`: MCP-native tool bus
- `telemetry/`: OpenTelemetry gen_ai.* spans
- `provenance/`: C2PA provenance

### Experience Surfaces (experience-surfaces/)

User-facing surfaces:
- `phone/`: Mobile application
- `headset/`: XR headset interface
- `desktop/`: Desktop application
- `web/`: Web interface
- `terminal/`: Terminal interface
- `voice/`: Voice interface

**Meta Quest 3 Integration (NEW):**
- `quest/`: Meta Quest 3 specific implementation
- `voice-assistant/`: 3rd party voice assistant with vision
- `vision/`: Camera/vision integration
- `spatial/`: Spatial mapping and anchors
- `hand-tracking/`: Hand tracking integration
- `passthrough/`: Passthrough API integration
- `spatial-audio/`: Spatial audio implementation

**XR Compatibility (NEW):**
- `openxr/`: OpenXR standard support
- `vision-pro/`: Apple Vision Pro support
- `hololens/`: HoloLens support
- `generic-xr/`: Generic XR glasses support

### UI/UX Layer (ui-ux/)

**icons/**: Icon system
- `packs/`: Icon pack management
- `renderer/`: Icon rendering (SVG, PNG, 3D)
- `library/`: Icon library and caching

**themes/**: Theme engine
- `engine.rs`: Theme engine core
- `presets/`: Light/dark/custom themes
- `customizer/`: Theme customization interface
- `storage/`: Theme persistence

**components/**: UI component library
- `buttons/`: Clickable buttons with states
- `interactive/`: Interactive components
- `animations/`: UI animations and transitions
- `layout/`: Layout system

**avatar/**: Digital model/avatar system
- `generator.rs`: Avatar generation
- `morpher.rs`: Real-time morphing/transformation
- `customizer/`: Avatar customization
- `presenter/`: Mixed reality avatar presentation

**chatbot/**: Interactive chatbot interface
- `interface.rs`: Chat UI
- `avatar-integration/`: Avatar + chat integration
- `mixed-reality/`: Mixed reality chat presentation
- `voice-sync/`: Voice synchronization

### Cognitive Applications (cognitive-apps/)

Built-in applications:
- `chat/`: Chat interface with The Presence
- `memory/`: Memory management
- `missions/`: Mission tracking
- `tools/`: Tool management
- `spatial-scenes/`: Spatial scene management
- `xr-presence/`: XR presence (The Presence)

### Operational Infrastructure (ops-infrastructure/)

**ci-cd/**: CI/CD pipelines
- `github-actions/`: GitHub Actions workflows
- `workflows/`: CI/CD workflow definitions
- `builders/`: Multi-platform build scripts
- `testers/`: Automated test runners
- `deployers/`: Automated deployment scripts

**security/**: Security scanning
- `sast/`: Static application security testing
- `dependency-scan/`: Dependency vulnerability scanning
- `secret-scan/`: Secret detection
- `license-scan/`: License compliance checking

**quality/**: Quality assurance
- `linters/`: Code linting
- `formatters/`: Code formatting
- `coverage/`: Test coverage tracking
- `metrics/`: Code metrics

**sigil-verification/**: Sigil verification in CI
- `verifier.rs`: Sigil signature verification
- `ledger-check/`: Ledger integrity verification
- `warrant-check/`: Warrant validation

## Data Flow

1. **Intent** enters through experience surface
2. Intent becomes a **CognitiveOp** in SIGIL Runtime
3. CognitiveOp routed to appropriate model tier via Semantic Router
4. Model produces **Inference Sigil** with reasoning trace
5. Inference passes through **ANCHOR-II** for validation
6. If valid, inference becomes **Belief Sigil** in Noetic Substrate
7. Belief may trigger **Action Sigil** via capability lease
8. Action executes through System Kernel with capability check
9. All state changes recorded in **Ledger** with sigils
10. Provenance chain maintained through all layers

## Security Model

1. **Every sigil is signed** by its actor with Ed25519
2. **Every signature is verified** on read
3. **Every capability is time-bounded** and decays
4. **Every inference is warranted** by frozen criteria
5. **Every action is scoped** to capability lease
6. **Every memory is attested** by device
7. **Every trace is hash-chained** to inputs
8. **Every rollback is single-command** with signed key

## Current Implementation Status

**Phase 0 — Foundations**: In Progress
- [x] Repository structure
- [x] Core documentation
- [x] sigil-core crate with Cargo.toml
- [x] Sigil type implementation
- [x] Signing infrastructure
- [x] Persistence layer
- [x] HTTP API scaffold
- [x] CLI interface scaffold
- [ ] Build verification (Rust not installed)
- [ ] Test execution (Rust not installed)

**Phase 1-6 (Original)**: Not Started
- [ ] Noetic Substrate
- [ ] Anchor Governance
- [ ] Inference Kernel
- [ ] System Kernel
- [ ] Experience Surfaces
- [ ] Cognitive Applications

**New Components (Scope Expansion)**: Not Started
- [ ] Model Fabric (base model, Modelfile, integrations)
- [ ] Dream Weaving Recursive Self-Evolving Remembrance
- [ ] Meta Quest 3 Integration
- [ ] UI/UX Layer (icons, themes, buttons)
- [ ] XR Compatibility (OpenXR, Vision Pro, HoloLens)
- [ ] Avatar/Digital Model Morphing System
- [ ] Interactive Chatbot with Mixed Reality
- [ ] CI/CD Pipelines
- [ ] Security Scanning
- [ ] Multi-Platform Builds (Windows, Linux, Android, Quest)
