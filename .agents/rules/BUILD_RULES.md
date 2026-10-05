# SIGIL OS Build Rules

These rules govern the entire build process for SIGIL OS from foundations to app store submission.

## Universal Rules

### 1. No State Change Without Sigil
- Every file change must emit a sigil
- Every test execution must emit a sigil
- Every deployment must emit a sigil
- Every security audit must emit a sigil
- Every performance optimization must emit a sigil
- Every app store submission must emit a sigil

### 2. No Unsigned Cognition
- Every cognitive act must be signed
- Every decision must be attested
- Every approval must be warranted
- Every artifact must be signed

### 3. No Irreversible Actions Without Classification
- Irreversible actions must be explicitly classified
- Irreversible actions require highest approval
- Irreversible actions require rollback documentation

### 4. No Capability Without Decay
- All capability leases must have half-life
- All capability leases must expire
- All capability leases must be renewable

### 5. No Unauthorized Scope Expansion
- New paths require approval
- New tools require approval
- New providers require approval
- New deployment targets require approval

## Phase-Specific Rules

### Phase 0: Foundations

- Must complete before Phase 1
- Exit criteria: cargo test passes, /health responds
- No production deployment
- No connector execution

### Phase 1: Warrant

- Must complete before Phase 2
- Exit criteria: every state change emits sigil
- Cryptographic implementation must pass security audit
- Rollback mechanism must work

### Phase 2: Substrate

- Must complete before Phase 3
- Exit criteria: all substrate primitives implemented
- Performance must meet benchmarks
- No performance regressions

### Phase 3: Anchor

- Must complete before Phase 4
- Exit criteria: consensus works across workers
- Security audit must pass
- Governance must be enforced

### Phase 4: Inference

- Must complete before Phase 5
- Exit criteria: grammar constraints work
- Performance must meet targets
- Kernel must refuse unaligned completions

### Phase 5: Runtime

- Must complete before Phase 6
- Exit criteria: routing works correctly
- Performance must meet targets
- All model tiers must work

### Phase 6: Experience

- Must complete before final phase
- Exit criteria: all UX surfaces implemented
- Accessibility must be compliant
- i18n support must be complete

### Final Phase: CI/CD and App Store

- Must complete before release
- Exit criteria: CI/CD operational, tests passing, security audit passed, performance met, no critical missing layers, app store submitted, released

## CI/CD Rules

### Testing

- All tests must pass before deployment
- Test coverage must be monitored
- Failing tests block deployment
- Flaky tests must be fixed

### Security

- Security scans must pass before deployment
- Vulnerabilities must be fixed before deployment
- Secrets must never be committed
- Security audit must pass before release

### Performance

- Performance benchmarks must meet targets
- Performance regressions block deployment
- Performance must be monitored in production
- Performance must be optimized before release

### Deployment

- Canary deployments required for production
- Rollback must be available
- Rollback must be tested
- Deployment must be monitored

## App Store Rules

### Preparation

- App must pass all tests
- App must pass security audit
- App must meet performance targets
- App must be accessible
- App must have privacy policy

### Submission

- Metadata must be complete
- Screenshots must be prepared
- Privacy policy must be written
- Compliance must be verified

### Release

- Review process must be managed
- Release must be coordinated
- Post-release must be monitored
- Rollback must be available

## Security Rules

### Cryptography

- Only approved cryptographic algorithms
- Keys must be securely stored
- Keys must be rotated
- Keys must be backed up

### Authentication

- All endpoints must be authenticated
- All actions must be authorized
- Sessions must be managed
- Tokens must be validated

### Data Protection

- Data must be encrypted at rest
- Data must be encrypted in transit
- Data must be masked in logs
- Data must be retained according to policy

## Performance Rules

### Profiling

- Performance must be profiled
- Baselines must be established
- Benchmarks must be run
- Regressions must be prevented

### Optimization

- Optimizations must be measured
- Optimizations must not introduce regressions
- Optimizations must be documented
- Optimizations must be reversible

## Documentation Rules

### Required Documentation

- README must be complete
- API documentation must be complete
- Architecture documentation must be complete
- Installation instructions must be complete
- Contributor guidelines must be complete

### Documentation Updates

- Documentation must be updated with code
- Documentation must be reviewed
- Documentation must be accurate
- Documentation must be accessible

## Approval Rules

### Approval Classes

- Routine: Valid policy and warrant
- Scope: Explicit human approval
- Sensitive: Explicit approval plus policy controls
- Release: Protected workflow approval
- Irreversible: Explicit approval with exact target

### Approval Process

- Approval must be requested
- Approval must be documented
- Approval must be warranted
- Approval must be sigil-emitted

## Rollback Rules

### Rollback Triggers

- Test failures
- Security vulnerabilities
- Performance regressions
- User complaints
- Incidents

### Rollback Process

- Rollback must be authorized
- Rollback must use sigil rollback key
- Rollback must be documented
- Rollback must be verified

## Forbidden Actions

- Do not skip tests
- Do not skip security scans
- Do not skip performance benchmarks
- Do not skip documentation
- Do not skip approval
- Do not skip rollback verification
- Do not release with known issues
- Do not release without testing
- Do not release without security approval
- Do not release without performance approval
- Do not release without app store approval

## Violation Handling

### Violation Detection

- Violations must be detected
- Violations must be reported
- Violations must be documented
- Violations must be addressed

### Violation Response

- Violations must be fixed
- Violations must be prevented
- Violations must be learned from
- Violations must be sigil-emitted

## Continuous Improvement

### Metrics

- Metrics must be collected
- Metrics must be analyzed
- Metrics must be acted upon
- Metrics must be sigil-emitted

### Feedback

- Feedback must be collected
- Feedback must be analyzed
- Feedback must be acted upon
- Feedback must be sigil-emitted

### Learning

- Incidents must be learned from
- Failures must be learned from
- Successes must be learned from
- Learning must be sigil-emitted
