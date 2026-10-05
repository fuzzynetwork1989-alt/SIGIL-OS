---
name: performance-optimizer
description: Use for optimizing performance of SIGIL OS, including profiling, benchmarking, memory optimization, CPU optimization, database optimization, network optimization, and UI responsiveness optimization.
user-invocable: true
---

# Performance Optimizer Skill

Use this skill for optimizing performance throughout the SIGIL OS development lifecycle.

## When to Use

Use this skill for:
- Performance profiling
- Benchmarking
- Memory optimization
- CPU optimization
- Database optimization
- Network optimization
- UI responsiveness optimization
- Load testing
- Performance regression detection

## Optimization Categories

### 1. Profiling

**Profile:**
- CPU usage
- Memory usage
- I/O operations
- Network calls
- Database queries
- API latency

### 2. Benchmarking

**Benchmark:**
- Startup time
- Response time
- Throughput
- Resource utilization
- Scalability
- Concurrency

### 3. Memory Optimization

**Optimize:**
- Memory leaks
- Memory allocation patterns
- Data structure efficiency
- Caching strategies
- Memory pooling
- Garbage collection

### 4. CPU Optimization

**Optimize:**
- Algorithm efficiency
- Parallelization
- Async operations
- Resource contention
- Lock contention
- CPU cache efficiency

### 5. Database Optimization

**Optimize:**
- Query performance
- Indexing strategies
- Connection pooling
- Query batching
- Data partitioning
- Caching

### 6. Network Optimization

**Optimize:**
- API latency
- Bandwidth usage
- Connection reuse
- Compression
- CDN usage
- Edge computing

### 7. UI Responsiveness

**Optimize:**
- Frame rate
- Input latency
- Rendering performance
- Animation smoothness
- Scroll performance
- Touch responsiveness

## Optimization Process

1. **Baseline Measurement** - Establish performance baseline
2. **Profiling** - Identify bottlenecks
3. **Analysis** - Analyze profiling data
4. **Optimization** - Implement optimizations
5. **Measurement** - Measure improvement
6. **Regression Testing** - Ensure no regressions
7. **Documentation** - Document findings

## Report Format

```yaml
performance_report:
  optimization_id: ""
  component: ""
  date: ""
  baseline:
    metric: ""
    value: ""
  optimized:
    metric: ""
    value: ""
  improvement: ""
  techniques_used: []
  regressions: []
  recommendations: []
```

## Required Evidence

For every optimization, produce:
- Performance report
- Profiling data
- Benchmark results
- Sigil ledger entry

## Critical Path (35-40% Final Phase)

Performance optimization is critical for the final phase:

1. **Baseline Establishment** - Establish performance baselines
2. **Bottleneck Identification** - Identify critical bottlenecks
3. **Optimization** - Implement optimizations
4. **Regression Prevention** - Prevent performance regressions
5. **Monitoring** - Set up performance monitoring

## Stop Conditions

- Do not release with performance regressions
- Do not release without baseline measurements
- Do not release without performance testing
- Do not optimize without measurement

## Integration with SIGIL OS

- Every optimization emits a sigil
- Performance metrics are stored as beliefs
- Regression detection uses epistemic decay
- Rollback enables undo of bad optimizations

## Forbidden Actions

- Do not optimize without profiling
- Do not optimize without baseline
- Do not introduce regressions
- Do not skip performance testing
