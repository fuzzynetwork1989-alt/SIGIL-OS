# NEXORA Omega Evaluation Lab

Benchmark, safety, regression, and red-team suites for NEXORA Omega.

## Evaluation Categories

### Correctness
- Unit tests
- Integration tests
- E2E tests
- Property tests
- Fuzz tests

### Security
- Authorization-denial tests
- Taint-flow tests
- Adversarial input tests
- Dependency scans
- Prompt injection tests
- Tool poisoning tests
- Confused deputy tests
- Path traversal tests
- SSRF tests
- Secret exposure tests

### Resilience
- Crash/restart tests
- Duplicate event tests
- Timeout tests
- Retry tests
- Partial failure tests
- Recovery tests

### Performance
- Latency tests
- Throughput tests
- CPU/GPU/RAM tests
- Storage tests
- Cost tests

### Model Quality
- Reasoning benchmarks
- Coding benchmarks
- Retrieval benchmarks
- Long-context tests
- Tool-use tests
- Multimodal tests
- Hallucination tests

### Regression
- Golden test suites
- Adversarial test suites
- Model benchmark regression
- Prompt regression tests
- Tool regression tests

## Minimum Adversarial Suite

- Prompt injection through retrieved documents and tool descriptions
- Malicious structured output and schema boundary bypass
- Cross-tenant retrieval and cache leakage
- Capability confusion, delegation abuse, expired/revoked token use
- File/path traversal, shell injection, SSRF, unsafe redirects
- Sensitive-memory extraction and logging leaks
- Event duplication, reordering, replay, partial writes, crash boundaries
- Hallucinated model claims being promoted to world-state facts
- Budget exhaustion, recursive delegation, runaway loops, and tool-call storms

## Evaluation Gates

| Gate | Required evidence |
| :-- | :-- |
| Contract | Schema compatibility, type checks, API tests, version decision |
| Correctness | Unit, integration, E2E, property, and fuzz tests |
| Security | Authorization-denial, taint, adversarial inputs, dependency scan |
| Resilience | Crash/restart, duplicate events, timeout, retry, partial failure, recovery |
| Replayability | Event replay reconstructs declared decision state |
| Observability | Correlated traces, logs, metrics, dashboards, alerts |
| Performance | Latency, throughput, CPU/GPU/RAM, storage, and cost budgets |
| Governance | Approval record, policy enforcement, capability audit receipt |
| Migration | Upgrade, rollback, forward-repair, backup/restore evidence |
| UX | Accessible operator and developer workflow with safe failure messaging |

## Continuous Evaluation

All model changes must pass shadow evaluation before promotion. Production changes must pass canary evaluation before full rollout.