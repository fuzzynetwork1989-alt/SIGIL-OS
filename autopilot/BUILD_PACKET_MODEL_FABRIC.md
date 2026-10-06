# Build Packet: Model Fabric Infrastructure

**Work Item ID:** SIGIL-MF-001
**Title:** Model Fabric Foundation - Base Model Selection and Integration
**Stage:** model-fabric-foundation
**Risk Tier:** trust-critical
**Generated:** 2026-10-05T12:00:00Z
**Autopilot Mode:** SIGIL OS Autopilot Mode v1.0

## Objective

Establish the Model Fabric infrastructure for SIGIL OS, including base model selection, Modelfile management, model family creation, enhanced next-generation brain/engine, and multi-provider integrations. This is the foundation for Dream Weaving, chat interfaces, and all cognitive features.

## Non-Goals

- Production deployment
- Model training from scratch
- Custom model architecture design
- Model fine-tuning (deferred to later phase)
- Bypassing model selection warrants
- Using unverified model providers

## Depends On

- Phase 0 completion (sigil-core compilation and tests)
- Rust toolchain installation
- Base model selection approval

## Scope

### Allowed Paths

- `model-fabric/` (new directory)
- `sigil-core/` (for integration)
- `Cargo.toml` (workspace)
- `configs/` (model configurations)
- `tests/` (model fabric tests)

### Forbidden Paths

- `infrastructure/production/`
- Model training data
- Unverified model sources
- External model providers without approval

## Data Zone

local + cloud (with explicit warrants for cloud access)

## Acceptance Criteria

### Positive

- [ ] Model Fabric workspace structure created
- [ ] Base model selected and integrated (LLaMA or equivalent)
- [ ] Modelfile format defined and parser implemented
- [ ] Model family management system working
- [ ] Local model loading and inference working
- [ ] Model routing system implemented
- [ ] Model capability typing system working
- [ ] Performance monitoring dashboard functional
- [ ] OpenAI integration (optional, with API key)
- [ ] Anthropic integration (optional, with API key)
- [ ] Every model inference emits a sigil
- [ ] Model selection emits sigils
- [ ] Rollback capability for model changes
- [ ] `cargo build` passes for model-fabric
- [ ] `cargo test` passes for model-fabric
- [ ] Model can answer basic queries

### Negative

- [ ] Build failure detected and reported
- [ ] Test failure detected and reported
- [ ] Model loading failure detected and reported
- [ ] Inference failure detected and reported
- [ ] Sigil emission failure detected and reported
- [ ] Unauthorized model access blocked
- [ ] Unverified model provider blocked

## Verification

### Commands

```bash
# Build
cargo build --package model-fabric

# Test
cargo test --package model-fabric

# Lint
cargo clippy --package model-fabric -- -D warnings

# Format check
cargo fmt --check --package model-fabric

# Test model loading
cargo run --package model-fabric -- test-load

# Test inference
cargo run --package model-fabric -- test-inference

# Test model routing
cargo run --package model-fabric -- test-routing
```

### Evidence

- `cargo build` output
- `cargo test` output
- `cargo clippy` output
- `cargo fmt --check` output
- Model loading test output
- Inference test output
- Model routing test output
- Sigil emission logs
- Model selection logs
- Performance metrics

## Budget

- max_elapsed_minutes: 120
- max_local_gpu_minutes: 60 (if GPU available)
- max_external_cost_usd: 0 (local models only by default)

## Rollback

- strategy: revert_commit_via_sigil_rollback
- migration_involved: false
- rollback_sigil_required: true

## Stop Conditions

- Build failure
- Test failure
- Linter warnings
- Format violations
- Model loading failure
- Inference failure
- Sigil emission failure
- Unauthorized model access attempt
- Unverified provider attempt
- Base model selection not approved
- Rust not installed

## Implementation Plan

### Step 1: Workspace Setup
1. Create `model-fabric/` directory structure
2. Create `model-fabric/Cargo.toml`
3. Add to workspace `Cargo.toml`
4. Add dependencies (candle-core, candle-transformers, etc.)

### Step 2: Base Model Selection
1. Evaluate candidate models (LLaMA 3, Mistral, Phi, Qwen)
2. Select base model based on:
   - Local inference capability
   - Model size (target: 2-7B for local)
   - License compatibility
   - Performance benchmarks
3. Download model weights
4. Create model manifest
5. Emit sigil for model selection

### Step 3: Modelfile Format
1. Define Modelfile format (similar to Ollama)
2. Implement Modelfile parser
3. Create sample Modelfiles
4. Implement Modelfile validation
5. Add tests

### Step 4: Model Loading
1. Implement model loader
2. Implement model weight loading
3. Implement tokenizer loading
4. Add error handling
5. Add tests

### Step 5: Inference Engine
1. Implement basic inference loop
2. Implement generation parameters
3. Implement streaming output
4. Add memory management
5. Add tests

### Step 6: Model Family Management
1. Implement model family registry
2. Implement model versioning
3. Implement model metadata
4. Add tests

### Step 7: Model Routing
1. Implement routing logic
2. Implement load balancing
3. Implement fallback logic
4. Add tests

### Step 8: Capability Typing
1. Define capability types (text, vision, audio, code)
2. Implement capability detection
3. Implement capability matching
4. Add tests

### Step 9: Performance Monitoring
1. Implement inference timing
2. Implement memory usage tracking
3. Implement token throughput
4. Create monitoring dashboard

### Step 10: Sigil Integration
1. Emit sigil on model selection
2. Emit sigil on every inference
3. Emit sigil on model change
4. Implement rollback for model changes
5. Add tests

### Step 11: Cloud Integrations (Optional)
1. OpenAI integration (with API key)
2. Anthropic integration (with API key)
3. Google integration (with API key)
4. Add provider switching logic
5. Add tests

### Step 12: Verification
1. Run full build
2. Run full test suite
3. Run linter
4. Run format check
5. Test model loading
6. Test inference
7. Test routing
8. Test sigil emission
9. Test rollback
10. Collect evidence

## Current Gaps

1. **Rust not installed** - Cannot build or test
2. **Base model not selected** - Need to choose and approve
3. **Model weights not downloaded** - Need to download selected model
4. **GPU availability unknown** - May need CPU-only inference
5. **No cloud API keys** - Cloud integrations optional but need keys if used

## Dependencies

**Rust Crates:**
- `candle-core` - Core ML framework
- `candle-transformers` - Transformer models
- `candle-nn` - Neural network layers
- `tokenizers` - Tokenization
- `serde` - Serialization
- `tokio` - Async runtime
- `reqwest` - HTTP for cloud APIs
- `anyhow` - Error handling

**External:**
- Model weights (LLaMA 3 or equivalent)
- (Optional) OpenAI API key
- (Optional) Anthropic API key
- (Optional) Google API key

## Architecture

```
model-fabric/
├── Cargo.toml
├── src/
│   ├── lib.rs
│   ├── base-model/
│   │   ├── selector.rs
│   │   ├── loader.rs
│   │   └── manifest.rs
│   ├── modelfile/
│   │   ├── format.rs
│   │   ├── parser.rs
│   │   └── validator.rs
│   ├── family/
│   │   ├── registry.rs
│   │   ├── versioning.rs
│   │   └── metadata.rs
│   ├── integrations/
│   │   ├── local/
│   │   │   ├── llama.rs
│   │   │   ├── mistral.rs
│   │   │   └── phi.rs
│   │   ├── openai/
│   │   │   ├── client.rs
│   │   │   └── api.rs
│   │   ├── anthropic/
│   │   │   ├── client.rs
│   │   │   └── api.rs
│   │   └── router.rs
│   ├── engine/
│   │   ├── runtime.rs
│   │   ├── inference.rs
│   │   └── generation.rs
│   ├── capability/
│   │   ├── types.rs
│   │   ├── detection.rs
│   │   └── matching.rs
│   ├── monitoring/
│   │   ├── metrics.rs
│   │   ├── timing.rs
│   │   └── dashboard.rs
│   └── sigil/
│       ├── emission.rs
│       └── rollback.rs
├── tests/
│   ├── loading.rs
│   ├── inference.rs
│   ├── routing.rs
│   └── sigil.rs
└── configs/
    ├── models/
    │   ├── llama3.yaml
    │   ├── mistral.yaml
    │   └── phi.yaml
    └── modelfiles/
        ├── default.modelfile
        └── custom.modelfile
```

## Evidence Status

- Workspace setup: pending
- Base model selection: pending (requires approval)
- Modelfile format: pending
- Model loading: pending
- Inference engine: pending
- Model family: pending
- Model routing: pending
- Capability typing: pending
- Monitoring: pending
- Sigil integration: pending
- Cloud integrations: pending
- Build verification: pending
- Test execution: pending

## Required Approvals

1. **Base model selection** - Which model to use (LLaMA 3, Mistral, Phi, Qwen?)
2. **Model size** - 2B, 7B, 13B? (depends on hardware)
3. **Cloud provider usage** - Allow cloud APIs? (requires API keys)
4. **Scope approval** - This is a major new component

## Next Steps

After this work item:
- Dream Weaving can use Model Fabric for cognitive evolution
- Chat interfaces can use Model Fabric for inference
- All cognitive features have a model to work with
- Phase 0 completion can be verified

## Risk Assessment

**Risks:**
1. Model too large for available hardware
2. Inference too slow for interactive use
3. Model license incompatible with project
4. GPU not available, CPU-only too slow
5. Cloud API costs if using cloud providers

**Mitigations:**
1. Start with smaller model (2-3B)
2. Optimize inference (quantization, caching)
3. Choose permissive license (Apache 2.0, MIT)
4. Implement CPU-optimized inference
5. Default to local-only, cloud optional
