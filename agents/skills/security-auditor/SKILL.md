---
name: security-auditor
description: Use for conducting security audits of SIGIL OS, including code review, vulnerability assessment, penetration testing, cryptographic implementation review, and security compliance verification.
user-invocable: true
---

# Security Auditor Skill

Use this skill for conducting security audits throughout the SIGIL OS development lifecycle.

## When to Use

Use this skill for:
- Security code reviews
- Vulnerability assessments
- Penetration testing
- Cryptographic implementation review
- Security compliance verification
- Threat modeling
- Security policy review
- Incident response planning

## Security Review Categories

### 1. Cryptographic Implementation

**Review:**
- Ed25519 signature implementation
- Key generation and storage
- Random number generation
- Encryption/decryption
- Hash functions
- Key rotation
- Certificate management

### 2. Authentication and Authorization

**Review:**
- Authentication mechanisms
- Authorization checks
- Session management
- Token handling
- Password policies
- Multi-factor authentication
- Device attestation

### 3. Data Protection

**Review:**
- Data encryption at rest
- Data encryption in transit
- Data masking
- Data retention policies
- Data disposal
- Privacy controls

### 4. Input Validation

**Review:**
- Input sanitization
- Output encoding
- SQL injection prevention
- XSS prevention
- CSRF protection
- Command injection prevention

### 5. Dependency Security

**Review:**
- Dependency vulnerability scanning
- Supply chain security
- SBOM verification
- License compliance
- Dependency updates

### 6. Infrastructure Security

**Review:**
- Network security
- Container security
- Cloud security
- Access controls
- Monitoring and logging
- Incident response

## Audit Process

1. **Scope Definition** - Define audit scope and objectives
2. **Threat Modeling** - Identify potential threats
3. **Code Review** - Review code for security issues
4. **Vulnerability Scanning** - Run automated scans
5. **Penetration Testing** - Conduct manual testing
6. **Report Generation** - Generate security report
7. **Remediation** - Address findings
8. **Verification** - Verify fixes

## Report Format

```yaml
security_audit_report:
  audit_id: ""
  scope: ""
  date: ""
  auditor: ""
  findings:
    - id: ""
      severity: critical | high | medium | low
      category: ""
      description: ""
      location: ""
      recommendation: ""
      status: open | in_progress | resolved
  compliance:
    standard: ""
    status: compliant | non_compliant | partial
    gaps: []
  recommendations:
    - priority: critical | high | medium | low
      action: ""
      effort: high | medium | low
```

## Required Evidence

For every audit, produce:
- Security audit report
- Vulnerability scan results
- Penetration test results
- Remediation evidence
- Sigil ledger entry

## Critical Path (35-40% Final Phase)

Security audit is critical for the final phase:

1. **Pre-Release Audit** - Ensure no vulnerabilities ship
2. **Compliance Verification** - Ensure regulatory compliance
3. **Penetration Testing** - Identify exploitable vulnerabilities
4. **Remediation** - Fix all critical findings
5. **Verification** - Verify all fixes

## Stop Conditions

- Do not release with critical vulnerabilities
- Do not release with high vulnerabilities
- Do not release without security audit
- Do not release without compliance verification

## Integration with SIGIL OS

- Every audit emits a sigil
- Security findings are stored as beliefs
- Remediation actions emit sigils
- Security policies are enforced via warrants

## Forbidden Actions

- Do not skip security audits
- Do not ignore critical findings
- Do not release with known vulnerabilities
- Do not bypass security controls
