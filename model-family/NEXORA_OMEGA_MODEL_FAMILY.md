# NEXORA Omega Model Family

Training configurations, model manifests, and evaluation assets for the NEXORA Omega model family.

## Base Model

All NEXORA Omega models are derived from **Qwen/Qwen3-30B-A3B-Base** (Apache-2.0 licensed).

## Model Variants

### NEXORA Ω Core
Primary general cognitive model for reasoning, planning, synthesis, dialogue, and structured decisions.

### NEXORA Ω Forge
Core-derived coding specialization for repository understanding, architecture, code changes, tests, and repair.

### NEXORA Ω Atlas
Core-derived world-state specialization for entity extraction, temporal claims, causal links, and contradiction detection.

### NEXORA Ω Recall
Core-derived retrieval and memory specialization for memory selection, provenance packaging, and contextual reconstruction.

### NEXORA Ω Sentinel
Core-derived verifier/policy specialization for safety classification, policy interpretation, plan verification, and threat detection.

### NEXORA Ω Vision
Multimodal derivative for documents, screenshots, images, UI state, and visual artifacts.

### NEXORA Ω Voice
Speech input/output family for speech recognition, turn segmentation, and expressive voice output.

### NEXORA Ω Edge
Distilled Core derivative for low-latency mobile/desktop continuity features.

## Training Pipeline

```text
Qwen3-30B-A3B-Base
        |
        v
NEXORA Foundation Pretraining Continuation
        |
        v
NEXORA Instruction + Tool-Use + Structured-Output Alignment
        |
        v
NEXORA Policy-Aware Reasoning Derivative
        |
        v
Shadow Evaluation -> Canary -> Champion Promotion -> Continuous Revalidation
```

## Requirements

Every model must have:
- Immutable artifact hash
- Dataset lineage
- License inventory
- Training configuration
- Evaluation record
- Safety profile
- Deployment manifest
- Rollback target
- Retirement status

## Evaluation

All models must pass:
- Golden tests
- Adversarial tests
- Model benchmarks
- Regression gates
- Safety evaluations

## License Preservation

All derivative models must preserve the Apache-2.0 license from the base Qwen3 model and include clear attribution.