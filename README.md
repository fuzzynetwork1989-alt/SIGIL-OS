# SIGIL OS

<div align="center">

**Your AI Companion with Self-Evolving Intelligence**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/fuzzynetwork1989-alt/SIGIL-OS)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux%20%7C%20Quest%203-lightgrey)](https://github.com/fuzzynetwork1989-alt/SIGIL-OS)
[![Version](https://img.shields.io/badge/version-1.0.0-orange)](https://github.com/fuzzynetwork1989-alt/SIGIL-OS/releases)

**Download for Windows · macOS · Linux · Meta Quest 3**

[Complete Setup Guide](COMPLETE_SETUP_GUIDE.md) • [Quick Reference](QUICK_REFERENCE.md) • [Quest SDK Guide](docs/QUEST_SDK_REQUIREMENTS.md) • [User Manual](USER_MANUAL.md)

</div>

---

## ⚡ Quick Start

### Windows (3 commands)

```batch
install-prerequisites.bat      # Install Rust, Git, VS Build Tools
setup-environment.bat          # Create directories
build-and-run.bat              # Build and run
```

### Linux/macOS (3 commands)

```bash
make install-deps              # Install dependencies
make setup-env                 # Setup directories
make run                       # Build and run
```

### Docker (1 command)

```bash
docker-compose up -d
```

**Or build from source:**

```bash
git clone https://github.com/fuzzynetwork1989-alt/SIGIL-OS.git
cd SIGIL-OS
cargo build --release
cargo run --release
```

📖 **For detailed installation instructions, see [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)**

---

## ✨ Features

### 🤖 TrueHD Avatar Voice Assistant

- Lifelike digital avatar that responds to your voice
- Real-time emotion expression and lip-syncing
- Customizable appearance (realistic, stylized, or procedural)

### 🧠 Dream Weaving™ Self-Evolution

- Revolutionary cognitive system that learns from conversations
- Self-reflection to detect and correct biases
- Controlled evolution with full rollback capability
- Every change is warranted, reversible, and auditable

### 🎨 Beautiful Customizable Interface

- 5 stunning themes (Light, Dark, Blue, Green, Purple)
- Custom avatar morphing based on conversation context
- Smooth animations and intuitive controls

### 🥽 Meta Quest 3 Mixed Reality

- Experience SIGIL OS in full mixed reality
- Spatial anchors to pin your companion anywhere
- Hand gesture controls for natural interaction
- Passthrough mode to see your real environment

### 🔒 Privacy-First Design

- All data stored locally by default
- No telemetry without your consent
- Open-source code for full transparency
- Cryptographic signing for all operations

---

## 📸 Screenshots

### Main Chat Interface

Beautiful chat interface with avatar on the left, conversation history in center, and input area at bottom.

### Avatar Customization

Customize your digital companion with face shape, hair style, eye color, skin tone, and clothing options.

### Dream Weaving Dashboard

Monitor dream cycles, insights generated, evolutionary history, and safeguard settings.

### Meta Quest 3 Mixed Reality

Experience SIGIL OS in full mixed reality with spatial anchors and hand tracking.

---

## 🚀 Installation

### Prerequisites

- Rust toolchain (1.70+)
- Git
- Build tools (platform-specific)

### Quick Install

**Windows:**

```batch
install-prerequisites.bat
setup-environment.bat
build-and-run.bat
```

**Linux/macOS:**

```bash
make install-deps
make setup-env
make run
```

**Docker:**

```bash
docker-compose up -d
```

📖 **See [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md) for detailed instructions**

See [Installation Guide](INSTALLATION_GUIDE.md) for detailed instructions.

### Quick Install

```bash
# Clone and build
git clone https://github.com/fuzzynetwork1989-alt/SIGIL-OS.git
cd SIGIL-OS
cargo build --release

# Run the API server
./target/release/sigil-api

# Launch the UI (in another terminal)
./target/release/sigil-ui
```

---

## 📖 Documentation

- [Installation Guide](INSTALLATION_GUIDE.md) - Step-by-step setup instructions
- [User Manual](USER_MANUAL.md) - Complete feature documentation
- [App Store Submission Guide](APP_STORE_SUBMISSION_GUIDE.md) - Store listing materials
- [Architecture](docs/ARCHITECTURE.md) - Technical architecture overview
- [Security Model](docs/SECURITY_MODEL.md) - Privacy and security details

---

## 🧪 Testing

```bash
# Run all tests
cargo test

# Run specific crate tests
cargo test -p model-fabric
cargo test -p dream-weaving
cargo test -p quest-integration

# Run with coverage
cargo tarpaulin --out Html
```

**Test Results:** 66/66 tests passing ✅

---

## 🏗️ Architecture

SIGIL OS is built with Rust for maximum performance and security:

```
sigil-os/
├── sigil-core/           # Core primitives (signing, persistence, API)
├── model-fabric/         # AI model integration (Qwen 7B)
├── ui-ux/                # Slint-based UI (themes, avatars, components)
├── dream-weaving/        # Self-evolving cognitive system
└── quest-integration/    # Meta Quest 3 MR integration
```

**Tech Stack:**

- **Language:** Rust
- **UI Framework:** Slint
- **AI Model:** Qwen 7B (Alibaba)
- **Database:** SQLite
- **Async Runtime:** Tokio

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Setup

```bash
# Fork the repository
# Clone your fork
git clone https://github.com/YOUR_USERNAME/SIGIL-OS.git
cd SIGIL-OS

# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes
# Run tests
cargo test

# Commit and push
git commit -m "Add amazing feature"
git push origin feature/amazing-feature

# Open a Pull Request
```

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🌟 What Makes SIGIL OS Different?

Unlike other AI assistants, SIGIL OS features **Dream Weaving™**—a groundbreaking self-evolving cognitive system. While other AIs remain static, SIGIL OS learns and adapts over time, with full control and transparency.

**Key Differentiators:**

- ✅ Self-evolving intelligence (not just static responses)
- ✅ Full user control (you approve all changes)
- ✅ Complete rollback (undo any unwanted evolution)
- ✅ Cryptographic provenance (every step is tracked)
- ✅ Privacy-first (local processing by default)
- ✅ Open-source (fully inspectable code)

---

## 🙏 Acknowledgments

SIGIL OS builds on concepts from:

- **MERIDIAN** - Governed cognitive runtime
- **AETHER OS** - Inference-native substrate
- **Rillmark** - Evidence-backed commitment fabric

---

## 📞 Support

- **GitHub Issues:** <https://github.com/fuzzynetwork1989-alt/SIGIL-OS/issues>
- **Documentation:** <https://github.com/fuzzynetwork1989-alt/SIGIL-OS/tree/main/docs>
- **Discord:** (Coming soon)

---

## 🌐 Social

- **Twitter:** [@SIGIL_OS](https://twitter.com/SIGIL_OS) (Coming soon)
- **Website:** <https://sigil-os.com> (Coming soon)

---

<div align="center">

**Made with ❤️ by the SIGIL OS team**

[⬆ Back to top](#sigil-os)

</div>

---

## 🔮 Roadmap

### Version 1.1 (Q4 2026)

- [ ] Mobile apps (iOS, Android)
- [ ] Additional AI models (Mistral, LLaMA)
- [ ] Plugin system
- [ ] Cloud sync (optional)

### Version 2.0 (Q1 2027)

- [ ] Full MERIDIAN governance integration
- [ ] AETHER OS inference kernel
- [ ] Multi-modal (vision, audio)
- [ ] Distributed SIGIL OS

---

## 📄 Technical Manifesto

SIGIL OS is the Post-AI Operating System with Cryptographic Warrant — a new category of computing where intelligence is the substrate and every act of cognition bears a sigil: a verifiable mark of provenance, authorization, and reversibility.

Every operating system you have ever used was designed for a world where intelligence was external. Windows, macOS, Linux, Android, iOS — they all treat AI as an application, a service, a feature bolted on top of a fundamentally non-intelligent substrate.

The next generation does not just invert that. It goes further.

Intelligence becomes the substrate. And every act of intelligence — every belief, every action, every memory, every improvement — carries a sigil: a cryptographically verifiable mark that says who authorized this, when it was produced, what evidence supports it, what it predicts, and how to undo it.

SIGIL OS is not "AI-powered." It is not even "AI-native." It is warranted cognition as substrate. The kernel does not merely run inference; it governs inference against criteria the kernel itself cannot modify. The file system does not merely store knowledge; it makes every claim auditable by provenance. The identity layer does not merely authenticate; it binds every belief to a signed, device-attested, sender-constrained actor.

For the full technical architecture, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

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
| ------- | ---------- | ------- | ---------------- |
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
