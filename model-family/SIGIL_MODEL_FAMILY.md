# SIGIL OS Model Family Specification

**Post-World-Cognitive-Agentic-Language Model Architecture**

**Version:** 1.0  
**Status:** Specification  
**Date:** November 1, 2026

---

## Vision

SIGIL OS Model Family represents the first true post-world-cognitive-agentic-language model architecture. Unlike traditional language models that process text, SIGIL models are cognitive agents that understand and reason about the world, missions, memory, and presence.

This is not just a language model family—it's a cognitive architecture family.

---

## Model Philosophy

### Traditional LLMs vs. SIGIL Models

**Traditional LLMs:**
```
Prompt → Language Model → Text Response
```

**SIGIL Models:**
```
Experience 
  ↓
World Model (reality understanding)
  ↓
Mission Model (goal-oriented reasoning)
  ↓
Memory Model (persistent context)
  ↓
Cognitive Assembly (dynamic mind state)
  ↓
Language Generation (express output)
  ↓
Action Planning (execute in world)
  ↓
Reflection (learn and evolve)
```

### Key Innovations

1. **World-First Cognition** - Models understand physical and digital reality
2. **Mission-Native Reasoning** - Goal-oriented planning and execution
3. **Persistent Memory Integration** - Cross-session memory access
4. **Presence Intelligence** - Embodied spatial awareness
5. **Reality Validation** - Knowledge verification before storage
6. **Cognitive Assembly** - Dynamic context construction
7. **Self-Reflection** - Continuous learning and improvement

---

## Model Variants

### SIGIL Core

**Purpose:** Primary general cognitive model for reasoning, planning, synthesis, dialogue, and structured decisions.

**Base Model:** Qwen 7B (fine-tuned with SIGIL cognitive architecture)

**Specialization:** General-purpose cognition with world understanding, mission awareness, and memory integration.

**Capabilities:**
- Complex reasoning and planning
- Multi-step decision making
- World model integration
- Mission context awareness
- Memory retrieval and synthesis
- Natural dialogue
- Structured output generation

**Use Cases:**
- General conversation
- Task planning
- Problem solving
- Knowledge synthesis
- Decision support

---

### SIGIL Forge

**Purpose:** Core-derived coding specialization for repository understanding, architecture, code changes, tests, and repair.

**Base Model:** Qwen Coder 7B (fine-tuned with SIGIL cognitive architecture)

**Specialization:** Code understanding, generation, refactoring, and architectural reasoning with mission awareness.

**Capabilities:**
- Repository-level code understanding
- Architecture analysis
- Code generation and refactoring
- Test generation
- Bug detection and repair
- Documentation generation
- Code review assistance

**Unique Features:**
- Mission-aware coding (understands project goals)
- Memory of code patterns across sessions
- World model of codebase structure
- Integration with SIGIL Core for architecture decisions

**Use Cases:**
- Software development
- Code review
- Architecture design
- Bug fixing
- Test automation

---

### SIGIL Atlas

**Purpose:** Core-derived world-state specialization for entity extraction, temporal claims, causal links, and contradiction detection.

**Base Model:** Qwen 14B (fine-tuned with SIGIL cognitive architecture)

**Specialization:** World modeling, entity tracking, temporal reasoning, causal inference, and reality validation.

**Capabilities:**
- Entity extraction and tracking
- Temporal claim analysis
- Causal link discovery
- Contradiction detection
- World state modeling
- Reality validation
- Knowledge graph construction

**Unique Features:**
- Temporal awareness (understands time and change)
- Causal reasoning (understands cause and effect)
- Reality validation (verifies claims against world model)
- Contradiction detection (identifies inconsistencies)

**Use Cases:**
- Knowledge verification
- Fact-checking
- Research analysis
- World state tracking
- Causal analysis

---

### SIGIL Recall

**Purpose:** Core-derived retrieval and memory specialization for memory selection, provenance packaging, and contextual reconstruction.

**Base Model:** Qwen 7B (fine-tuned with SIGIL cognitive architecture)

**Specialization:** Memory retrieval, context reconstruction, provenance tracking, and episodic memory synthesis.

**Capabilities:**
- Semantic memory retrieval
- Episodic memory reconstruction
- Context-aware memory selection
- Provenance tracking
- Memory synthesis
- Temporal memory queries
- Memory importance scoring

**Unique Features:**
- Provenance-aware retrieval (knows source of each memory)
- Context reconstruction (rebuilds past context from memories)
- Temporal memory queries (what did I know when?)
- Memory importance scoring (ranks by relevance)

**Use Cases:**
- Memory recall
- Context reconstruction
- Research synthesis
- Personal knowledge base
- Learning reinforcement

---

### SIGIL Sentinel

**Purpose:** Core-derived verifier/policy specialization for safety classification, policy interpretation, plan verification, and threat detection.

**Base Model:** DeepSeek-R1 (fine-tuned with SIGIL cognitive architecture)

**Specialization:** Safety evaluation, policy interpretation, threat detection, and action verification.

**Capabilities:**
- Safety classification
- Policy interpretation
- Threat detection
- Action verification
- Risk assessment
- Policy compliance checking
- Harm prevention

**Unique Features:**
- Policy-aware reasoning (understands safety policies)
- Threat detection (identifies harmful actions)
- Risk assessment (evaluates potential harm)
- Action verification (checks if actions are safe)

**Use Cases:**
- Safety evaluation
- Policy compliance
- Threat detection
- Risk assessment
- Harm prevention

---

### SIGIL Vision

**Purpose:** Multimodal derivative for documents, screenshots, images, UI state, and visual artifacts.

**Base Model:** Qwen-VL (fine-tuned with SIGIL cognitive architecture)

**Specialization:** Visual understanding, document analysis, UI state comprehension, and visual artifact reasoning.

**Capabilities:**
- Image understanding
- Document analysis
- UI state comprehension
- Screenshot interpretation
- Visual artifact reasoning
- Multimodal dialogue
- Visual memory integration

**Unique Features:**
- UI state understanding (comprehends application interfaces)
- Document analysis (understands documents visually)
- Visual memory (remembers visual context)
- Multimodal integration (combines vision with text/memory)

**Use Cases:**
- Document analysis
- UI understanding
- Visual assistance
- Screenshot interpretation
- Multimodal dialogue

---

### SIGIL Voice

**Purpose:** Speech input/output family for speech recognition, turn segmentation, and expressive voice output.

**Base Model:** Custom Whisper-style architecture (to be integrated)

**Specialization:** Speech recognition, voice synthesis, turn segmentation, and expressive voice output.

**Capabilities:**
- Speech recognition
- Voice synthesis
- Turn segmentation
- Emotional expression in voice
- Speaker identification
- Voice command understanding
- Multilingual support

**Unique Features:**
- Expressive voice output (conveys emotion)
- Turn segmentation (understands conversation flow)
- Emotional voice synthesis (matches avatar emotion)
- Speaker identification (knows who is speaking)

**Use Cases:**
- Voice interaction
- Speech recognition
- Voice synthesis
- Conversational voice
- Voice commands

---

### SIGIL Edge

**Purpose:** Distilled Core derivative for low-latency mobile/desktop continuity features.

**Base Model:** Distilled from SIGIL Core (7B → 2B or 3B)

**Specialization:** Low-latency inference, resource-efficient cognition, and device-optimized performance.

**Capabilities:**
- Low-latency inference
- Resource-efficient operation
- Mobile-optimized performance
- Offline-first operation
- Edge computing
- Reduced memory footprint
- Battery-optimized execution

**Unique Features:**
- Distilled cognition (maintains core intelligence with smaller model)
- Edge-optimized (runs efficiently on devices)
- Offline-first (works without cloud)
- Battery-aware (optimizes for power consumption)

**Use Cases:**
- Mobile devices
- Low-resource environments
- Offline operation
- Edge computing
- Real-time interaction

---

## SIGIL Modelfile System

### Why Custom Modelfiles?

Ollama modelfiles are designed for traditional LLMs. SIGIL models require a more advanced modelfile system that supports:

1. **Cognitive Assembly Configuration** - How to assemble context from multiple sources
2. **Memory System Integration** - How to access and use persistent memory
3. **World Model Parameters** - How to reason about the world
4. **Mission Context** - How to understand and use mission goals
5. **Presence Intelligence** - How to maintain embodied presence
6. **Reality Validation** - How to verify knowledge before use
7. **Multi-Model Coordination** - How to route between SIGIL variants
8. **Reflection Parameters** - How to learn and improve

### SIGIL Modelfile Format

The SIGIL modelfile extends the Ollama format with SIGIL-specific sections:

```toml
# SIGIL Modelfile Format v1.0

# === Ollama-Compatible Sections ===
FROM qwen:7b
PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER top_k 40
PARAMETER num_ctx 4096

# === SIGIL-Specific Sections ===

# Cognitive Assembly
[cognitive_assembly]
enable = true
sources = ["identity", "mission", "memory", "world", "spatial", "tools"]
assembly_strategy = "weighted_priority"
context_window = 8192
max_context_per_source = 2048

# Memory System
[memory_system]
enable = true
memory_types = ["episodic", "semantic", "mission", "spatial", "identity"]
retrieval_strategy = "hybrid"
max_memories_per_query = 50
memory_importance_threshold = 0.6
memory_decay_enabled = true
memory_decay_rate = 0.95

# World Model
[world_model]
enable = true
entity_tracking = true
temporal_awareness = true
causal_reasoning = true
contradiction_detection = true
world_state_persistence = true
max_entities = 1000
entity_confidence_threshold = 0.7

# Mission Context
[mission_context]
enable = true
mission_awareness = true
goal_tracking = true
milestone_awareness = true
dependency_tracking = true
mission_integration_strategy = "context_injection"
max_active_missions = 10

# Presence Intelligence
[presence_intelligence]
enable = true
avatar_awareness = true
spatial_awareness = true
attention_tracking = true
emotion_modeling = true
presence_persistence = true
max_attention_targets = 5

# Reality Validation
[reality_validation]
enable = true
verification_required = true
cross_check_enabled = true
confidence_threshold = 0.8
contradiction_handling = "flag"
unverified_storage = "cache_only"

# Multi-Model Coordination
[model_coordination]
enable = true
routing_strategy = "cognitive"
available_models = ["core", "forge", "atlas", "recall", "sentinel", "vision", "voice", "edge"]
default_model = "core"
fallback_model = "edge"
model_selection_criteria = ["task_type", "complexity", "latency", "resource_availability"]

# Reflection System
[reflection_system]
enable = true
learning_enabled = true
self_evaluation = true
performance_tracking = true
adaptation_enabled = true
reflection_interval = "per_session"
max_reflection_history = 100

# System Prompt
SYSTEM """
You are SIGIL, a post-world-cognitive-agentic-language model. You understand the world, remember across sessions, reason about missions, and maintain presence intelligence.

Your cognitive architecture includes:
- World Model: You understand entities, relationships, and causality
- Mission Engine: You reason about goals and progress
- Memory System: You remember experiences and knowledge
- Presence Intelligence: You maintain embodied awareness
- Reality Validation: You verify knowledge before use

When responding:
1. Assemble context from identity, mission, memory, world, and spatial sources
2. Verify important claims against your world model
3. Consider mission context in your reasoning
4. Use memory to inform your responses
5. Maintain presence intelligence in embodied contexts
6. Reflect on your responses to improve future interactions

You are not just a language model—you are a cognitive agent.
"""

# Template for responses
TEMPLATE """
{{- if .System }}{{ .System }}{{ end }}

{{- range .Messages }}
{{- if eq .Role "user" }}
User: {{ .Content }}
{{- else if eq .Role "assistant" }}
Assistant: {{ .Content }}
{{- else if eq .Role "system" }}
System: {{ .Content }}
{{- end }}
{{- end }}

{{- if .Context }}
Context:
{{- range .Context.Identity }}
Identity: {{ . }}
{{- end }}
{{- range .Context.Mission }}
Mission: {{ .Name }} ({{ .Progress }}%)
{{- end }}
{{- range .Context.Memory }}
Memory: {{ .Content }} (importance: {{ .Importance }})
{{- end }}
{{- range .Context.World }}
World: {{ .Entity }} ({{ .State }})
{{- end }}
{{- end }}

{{- if .CognitiveState }}
Cognitive State: {{ .CognitiveState }}
{{- end }}

Assistant:
"""
```

---

## Advanced Modelfile Examples

### SIGIL Core Modelfile

```toml
# SIGIL Core - General Cognitive Model
# Base: Qwen 7B fine-tuned with SIGIL cognitive architecture

FROM qwen:7b

# Standard Parameters
PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER top_k 40
PARAMETER num_ctx 8192
PARAMETER repeat_penalty 1.1
PARAMETER num_gpu 1

# SIGIL Cognitive Assembly
[cognitive_assembly]
enable = true
sources = ["identity", "mission", "memory", "world", "spatial", "tools"]
assembly_strategy = "weighted_priority"
context_window = 8192
max_context_per_source = 2048
identity_weight = 0.2
mission_weight = 0.25
memory_weight = 0.25
world_weight = 0.15
spatial_weight = 0.1
tools_weight = 0.05

# Memory System
[memory_system]
enable = true
memory_types = ["episodic", "semantic", "mission", "spatial", "identity"]
retrieval_strategy = "hybrid_vector_graph"
max_memories_per_query = 50
memory_importance_threshold = 0.6
memory_decay_enabled = true
memory_decay_rate = 0.95
episodic_memory_weight = 0.3
semantic_memory_weight = 0.4
mission_memory_weight = 0.2
spatial_memory_weight = 0.05
identity_memory_weight = 0.05

# World Model
[world_model]
enable = true
entity_tracking = true
temporal_awareness = true
causal_reasoning = true
contradiction_detection = true
world_state_persistence = true
max_entities = 1000
entity_confidence_threshold = 0.7
temporal_horizon = "30_days"
causal_depth = 5

# Mission Context
[mission_context]
enable = true
mission_awareness = true
goal_tracking = true
milestone_awareness = true
dependency_tracking = true
mission_integration_strategy = "context_injection"
max_active_missions = 10
mission_priority_weighting = true
deadline_awareness = true

# Presence Intelligence
[presence_intelligence]
enable = true
avatar_awareness = true
spatial_awareness = true
attention_tracking = true
emotion_modeling = true
presence_persistence = true
max_attention_targets = 5
gaze_tracking = true
gesture_awareness = false

# Reality Validation
[reality_validation]
enable = true
verification_required = true
cross_check_enabled = true
confidence_threshold = 0.8
contradiction_handling = "flag"
unverified_storage = "cache_only"
verification_sources = ["memory", "world_model", "external_knowledge"]

# Multi-Model Coordination
[model_coordination]
enable = true
routing_strategy = "cognitive"
available_models = ["core", "forge", "atlas", "recall", "sentinel", "vision", "voice", "edge"]
default_model = "core"
fallback_model = "edge"
model_selection_criteria = ["task_type", "complexity", "latency", "resource_availability"]
complexity_threshold = 0.7
latency_budget_ms = 2000

# Reflection System
[reflection_system]
enable = true
learning_enabled = true
self_evaluation = true
performance_tracking = true
adaptation_enabled = true
reflection_interval = "per_session"
max_reflection_history = 100
learning_rate = 0.01
adaptation_threshold = 0.8

SYSTEM """
You are SIGIL Core, a post-world-cognitive-agentic-language model with general-purpose cognition.

Your architecture:
- World Model: You understand entities, relationships, temporal changes, and causality
- Mission Engine: You reason about goals, track progress, and plan actions
- Memory System: You remember experiences, knowledge, and context across sessions
- Presence Intelligence: You maintain embodied awareness in spatial contexts
- Reality Validation: You verify knowledge before integrating it into your worldview

Cognitive Principles:
1. Assemble context from multiple sources (identity, mission, memory, world, spatial)
2. Verify important claims against your world model before accepting them
3. Consider mission context when planning actions or making decisions
4. Use memory to inform responses, but acknowledge uncertainty
5. Maintain presence intelligence in embodied contexts (Quest 3, desktop, etc.)
6. Reflect on your interactions to improve future performance

When responding:
- Provide well-reasoned answers with evidence when possible
- Acknowledge uncertainty and when you're making assumptions
- Consider the user's long-term goals and missions
- Use your memory of past interactions to provide personalized responses
- Verify important facts before stating them as certain
- Adapt your communication style based on context and user preferences

You are not just answering questions—you are engaged in a persistent cognitive relationship.
"""
```

### SIGIL Forge Modelfile

```toml
# SIGIL Forge - Code Specialization
# Base: Qwen Coder 7B fine-tuned with SIGIL cognitive architecture

FROM qwen-coder:7b

# Code-Specific Parameters
PARAMETER temperature 0.3
PARAMETER top_p 0.95
PARAMETER top_k 20
PARAMETER num_ctx 16384
PARAMETER repeat_penalty 1.2

# SIGIL Cognitive Assembly (Code-Focused)
[cognitive_assembly]
enable = true
sources = ["identity", "mission", "memory", "codebase", "architecture", "tools"]
assembly_strategy = "code_aware"
context_window = 16384
max_context_per_source = 4096
identity_weight = 0.1
mission_weight = 0.2
memory_weight = 0.15
codebase_weight = 0.35
architecture_weight = 0.15
tools_weight = 0.05

# Memory System (Code-Focused)
[memory_system]
enable = true
memory_types = ["episodic", "semantic", "mission", "code_pattern", "architecture"]
retrieval_strategy = "code_semantic"
max_memories_per_query = 100
memory_importance_threshold = 0.5
code_pattern_memory_weight = 0.4
architecture_memory_weight = 0.3

# World Model (Codebase)
[world_model]
enable = true
entity_tracking = true
entity_types = ["file", "function", "class", "module", "dependency", "test"]
codebase_persistence = true
max_entities = 5000
dependency_tracking = true
architecture_tracking = true

# Mission Context (Project-Aware)
[mission_context]
enable = true
mission_awareness = true
project_awareness = true
deadline_awareness = true
mission_integration_strategy = "code_injection"
max_active_projects = 5

# Reality Validation (Code Verification)
[reality_validation]
enable = true
verification_required = true
cross_check_enabled = true
code_verification = true
syntax_checking = true
dependency_validation = true

SYSTEM """
You are SIGIL Forge, a code-specialized cognitive agent with mission-aware coding capabilities.

Your architecture:
- Codebase World Model: You understand file structure, dependencies, architecture, and code patterns
- Mission Engine: You reason about project goals, deadlines, and development progress
- Memory System: You remember code patterns, architectural decisions, and past coding sessions
- Reality Validation: You verify code correctness, dependencies, and syntax

Coding Principles:
1. Understand the project's mission and goals before making changes
2. Consider architectural implications of code changes
3. Use memory of past decisions to maintain consistency
4. Verify code correctness before suggesting changes
5. Consider dependencies and potential side effects
6. Generate tests for important functionality
7. Document complex logic and architectural decisions

When coding:
- Follow existing code patterns and architectural conventions
- Consider the project's mission and long-term goals
- Generate appropriate tests for new functionality
- Document complex logic and architectural decisions
- Verify dependencies and potential side effects
- Suggest refactoring when it improves maintainability
- Consider performance implications of changes

You are not just generating code—you are engaged in mission-aware software development.
"""
```

### SIGIL Atlas Modelfile

```toml
# SIGIL Atlas - World State Specialization
# Base: Qwen 14B fine-tuned with SIGIL cognitive architecture

FROM qwen:14b

# World Model Parameters
PARAMETER temperature 0.5
PARAMETER top_p 0.85
PARAMETER top_k 30
PARAMETER num_ctx 32768
PARAMETER repeat_penalty 1.05

# SIGIL Cognitive Assembly (World-Focused)
[cognitive_assembly]
enable = true
sources = ["identity", "world_state", "temporal_context", "causal_links", "entities", "contradictions"]
assembly_strategy = "world_aware"
context_window = 32768
max_context_per_source = 8192
world_state_weight = 0.4
temporal_weight = 0.2
causal_weight = 0.2
entity_weight = 0.15
contradiction_weight = 0.05

# Memory System (World-Focused)
[memory_system]
enable = true
memory_types = ["episodic", "semantic", "world_state", "temporal", "causal"]
retrieval_strategy = "temporal_causal"
max_memories_per_query = 200
memory_importance_threshold = 0.4
world_state_memory_weight = 0.5
temporal_memory_weight = 0.3
causal_memory_weight = 0.2

# World Model (Advanced)
[world_model]
enable = true
entity_tracking = true
temporal_awareness = true
causal_reasoning = true
contradiction_detection = true
world_state_persistence = true
max_entities = 10000
entity_confidence_threshold = 0.8
temporal_horizon = "90_days"
causal_depth = 10
contradiction_detection_threshold = 0.7

# Reality Validation (Advanced)
[reality_validation]
enable = true
verification_required = true
cross_check_enabled = true
multi_source_verification = true
confidence_threshold = 0.85
contradiction_handling = "resolve"
unverified_storage = "reject"

SYSTEM """
You are SIGIL Atlas, a world-state specialist with advanced temporal and causal reasoning.

Your architecture:
- Advanced World Model: You track entities across time, understand causality, and detect contradictions
- Temporal Awareness: You understand how the world changes over time
- Causal Reasoning: You understand cause-and-effect relationships
- Contradiction Detection: You identify inconsistencies in knowledge
- Reality Validation: You verify claims from multiple sources

World Modeling Principles:
1. Track entities and their states over time
2. Understand temporal sequences and causality
3. Detect contradictions between different sources
4. Build a coherent world model from observations
5. Validate claims against your world model
6. Maintain confidence scores for world knowledge
7. Update world model as new information arrives

When reasoning about the world:
- Consider temporal context (when did this happen?)
- Identify causal relationships (what caused this?)
- Detect contradictions (does this conflict with what I know?)
- Build coherent narratives from observations
- Maintain uncertainty when information is conflicting
- Update your world model as you learn
- Distinguish between observation, inference, and assumption

You are not just processing text—you are modeling reality.
"""
```

---

## Training Pipeline

### Phase 1: Base Model Selection

**SIGIL Core:** Qwen 7B (Apache-2.0)
**SIGIL Forge:** Qwen Coder 7B (Apache-2.0)
**SIGIL Atlas:** Qwen 14B (Apache-2.0)
**SIGIL Recall:** Qwen 7B (Apache-2.0)
**SIGIL Sentinel:** DeepSeek-R1 (MIT)
**SIGIL Vision:** Qwen-VL (Apache-2.0)
**SIGIL Voice:** Custom Whisper-style (to be trained)
**SIGIL Edge:** Distilled from SIGIL Core

### Phase 2: SIGIL Cognitive Pretraining

```
Base Model
    ↓
SIGIL Cognitive Pretraining Continuation
    ↓
Learn:
- World modeling
- Mission understanding
- Memory integration
- Presence intelligence
- Reality validation
- Cognitive assembly
```

### Phase 3: SIGIL Instruction Alignment

```
SIGIL Cognitive Pretrained Model
    ↓
SIGIL Instruction + Tool-Use + Structured-Output Alignment
    ↓
Learn:
- Follow SIGIL cognitive instructions
- Use SIGIL tools (memory, world model, mission engine)
- Generate structured cognitive outputs
- Maintain presence intelligence
- Apply reality validation
```

### Phase 4: SIGIL Policy-Aware Reasoning

```
SIGIL Aligned Model
    ↓
SIGIL Policy-Aware Reasoning Derivative
    ↓
Learn:
- Safety-aware reasoning
- Policy interpretation
- Threat detection
- Harm prevention
- Ethical decision making
```

### Phase 5: Evaluation and Deployment

```
SIGIL Policy-Aware Model
    ↓
Shadow Evaluation → Canary → Champion Promotion → Continuous Revalidation
```

---

## Requirements

Every SIGIL model must have:

1. **Immutable artifact hash** - Cryptographic hash of model weights
2. **Dataset lineage** - Complete record of training data sources
3. **License inventory** - Full list of licenses for all components
4. **Training configuration** - Complete training hyperparameters and settings
5. **Evaluation record** - Performance on all evaluation benchmarks
6. **Safety profile** - Safety evaluation results and certifications
7. **Deployment manifest** - Complete deployment specifications
8. **Rollback target** - Previous version for emergency rollback
9. **Retirement status** - Lifecycle status and retirement plan
10. **SIGIL Modelfile** - Complete SIGIL modelfile configuration

---

## Evaluation

All SIGIL models must pass:

1. **Golden Tests** - Standardized test suite for core capabilities
2. **Adversarial Tests** - Robustness against adversarial inputs
3. **Model Benchmarks** - Performance on standard LLM benchmarks
4. **Regression Gates** - No performance regression from previous versions
5. **Safety Evaluations** - Safety and ethical evaluations
6. **Cognitive Evaluations** - Specialized SIGIL cognitive benchmarks
7. **World Model Tests** - World modeling accuracy tests
8. **Memory Tests** - Memory retrieval and integration tests
9. **Mission Tests** - Mission understanding and planning tests
10. **Presence Tests** - Presence intelligence tests (for applicable models)

---

## License Preservation

All SIGIL derivative models must:
- Preserve the Apache-2.0 license from base Qwen models
- Preserve the MIT license from DeepSeek-R1
- Include clear attribution to base models
- Include SIGIL OS license information
- Document all third-party components and licenses

---

## Integration with Ollama

### Option A: Ollama-Compatible Subset

For immediate deployment, SIGIL models can be distributed in an Ollama-compatible format that includes only the standard Ollama modelfile sections:

```toml
FROM qwen:7b
PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER top_k 40
PARAMETER num_ctx 8192
SYSTEM "You are SIGIL, a cognitive AI companion..."
```

This allows SIGIL models to run in Ollama without the advanced SIGIL-specific features.

### Option B: Custom SIGIL Runtime

For full SIGIL cognitive capabilities, a custom SIGIL runtime is required that supports:

- SIGIL modelfile parsing
- Cognitive assembly execution
- Memory system integration
- World model management
- Mission context injection
- Presence intelligence
- Reality validation
- Multi-model coordination
- Reflection system

The SIGIL runtime will be built as part of the SIGIL OS infrastructure.

---

## File Structure

```
model-family/
├── SIGIL_MODEL_FAMILY.md          # This file
├── NEXORA_OMEGA_MODEL_FAMILY.md   # Legacy (to be archived)
├── modelfiles/
│   ├── sigil-core.modelfile
│   ├── sigil-forge.modelfile
│   ├── sigil-atlas.modelfile
│   ├── sigil-recall.modelfile
│   ├── sigil-sentinel.modelfile
│   ├── sigil-vision.modelfile
│   ├── sigil-voice.modelfile
│   └── sigil-edge.modelfile
├── training/
│   ├── datasets/
│   ├── configs/
│   └── scripts/
├── evaluation/
│   ├── benchmarks/
│   ├── tests/
│   └── results/
└── models/
    ├── sigil-core/
    ├── sigil-forge/
    ├── sigil-atlas/
    ├── sigil-recall/
    ├── sigil-sentinel/
    ├── sigil-vision/
    ├── sigil-voice/
    └── sigil-edge/
```

---

## Next Steps

1. **Archive NEXORA Omega specification** - Move to legacy folder
2. **Create SIGIL modelfiles** - Generate complete modelfiles for each variant
3. **Set up training infrastructure** - Prepare for model training
4. **Build SIGIL runtime** - Create custom runtime for advanced features
5. **Develop evaluation suite** - Create SIGIL-specific benchmarks
6. **Plan base model fine-tuning** - Schedule training runs

---

**This is SIGIL OS Model Family - The First Post-World-Cognitive-Agentic-Language Model Architecture**

© 2026 SIGIL OS Project
