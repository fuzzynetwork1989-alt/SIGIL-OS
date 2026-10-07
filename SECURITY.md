# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

### Security Issues

If you discover a security vulnerability in SIGIL OS, please report it responsibly.

**Do NOT:**
- Open a public issue
- Discuss it on public channels
- Exploit the vulnerability

**DO:**
- Email us at security@sigil-os.com (coming soon)
- Include "VULNERABILITY" in the subject line
- Provide detailed description of the issue
- Include steps to reproduce
- Allow us 48 hours to respond

### What to Include

- Type of vulnerability (XSS, injection, etc.)
- Affected versions
- Impact assessment
- Proof of concept (if safe)
- Suggested fix (if known)

### Response Timeline

- **Initial Response:** Within 48 hours
- **Assessment:** Within 7 days
- **Fix:** As soon as feasible
- **Public Disclosure:** After fix is released

---

## Security Principles

SIGIL OS is built with security as a core principle:

### 1. Cryptographic Warrant

Every cognitive operation carries a sigil - a cryptographically verifiable mark of provenance, authorization, and reversibility.

### 2. Privacy-First

- All data stored locally by default
- No telemetry without consent
- No cloud transmission unless explicitly requested
- User has full control over data

### 3. Open Source

- Fully inspectable code
- Community security review
- Transparent development
- Auditable provenance

### 4. Governance

- No trust-root self-modification
- All mutations require approval
- Full rollback capability
- Audit trails for all operations

---

## Security Features

### Cryptographic Signing

- Ed25519 digital signatures
- Keyless identity fabric (passkey, DPoP, CIBA)
- Device attestation
- Sender-constrained actors

### Governance

- Anchor-II governance system
- Distributed criterion consensus
- Derivation DAG
- Alignment oracle separation
- Defense in depth (6 layers)

### Safe AI

- Grammar-constrained decoding
- Frame-aware ethics enforcement
- Reversible inference
- Capability-typed IPC (CaMeL)
- Dual-LLM privilege separation

### Privacy

- Local processing by default
- Optional cloud sync
- Data encryption at rest
- Secure key storage
- No silent fallback

---

## Threat Model

### Threats We Mitigate

1. **Unauthorized Code Execution**
   - Capability-based security
   - Code signing verification
   - Sandbox isolation

2. **Data Exfiltration**
   - Local processing by default
   - Explicit data transfer controls
   - Audit logging

3. **Privilege Escalation**
   - Ephemeral capability leases
   - Least privilege enforcement
   - Decay of unused privileges

4. **AI Misuse**
   - Grammar-constrained decoding
   - Frame-aware ethics
   - Human-in-the-loop for sensitive operations

5. **Supply Chain Attacks**
   - Dependency verification
   - SBOM generation
   - Provenance tracking

### Threats We Accept

1. **Physical Access**
   - If attacker has physical access, local data may be compromised
   - Mitigation: Full disk encryption (user-managed)

2. **User Error**
   - Users may approve malicious mutations
   - Mitigation: Clear warnings, rollback capability

3. **Social Engineering**
   - Users may be tricked into revealing information
   - Mitigation: Education, clear UI indicators

---

## Dependency Security

### Vulnerability Scanning

We run automated security scans on dependencies:

- GitHub Dependabot
- Cargo audit
- OWASP dependency check

### Vulnerability Response

When a vulnerability is found in a dependency:

1. Assess severity and impact
2. Update to patched version
3. Release security update
4. Notify users via changelog

---

## Secure Development

### Code Review

All code changes require:
- At least one reviewer approval
- Security review for sensitive changes
- Automated CI/CD checks

### Testing

- Unit tests for all components
- Integration tests for critical paths
- Security-focused tests for authentication, authorization
- Fuzz testing for parsing code

### Secrets Management

- No secrets in source code
- Environment variables for configuration
- Secret scanning in CI/CD
- Keyless authentication where possible

---

## Privacy Policy

### Data Collection

SIGIL OS collects minimal data:

- **Local:** Chat history, avatar preferences, settings (stored locally)
- **Optional:** Crash reports (with consent)
- **Never:** Voice data, biometric data, location (without explicit consent)

### Data Sharing

We do not share user data with third parties without explicit consent.

### Data Retention

Users have full control:
- Delete any data at any time
- Export data on request
- Clear all data with one click

### Data Security

- Encryption at rest (user-managed)
- Encryption in transit (TLS)
- Secure key storage
- Regular security updates

---

## Compliance

SIGIL OS aims to comply with:

- **GDPR** - General Data Protection Regulation
- **CCPA** - California Consumer Privacy Act
- **COPPA** - Children's Online Privacy Protection Act (age rating 12+)
- **SECURITY.md** - Security policy disclosure

---

## Security Best Practices for Users

### For Desktop Users

1. **Keep Updated**
   - Install security updates promptly
   - Enable auto-updates if available

2. **Secure Your Device**
   - Use device encryption
   - Use strong passwords/passkeys
   - Keep OS updated

3. **Data Management**
   - Regular backups
   - Review permissions
   - Clear sensitive data regularly

### For Quest 3 Users

1. **Developer Mode**
   - Only enable if needed
   - Disable when not in use
   - Use PIN protection

2. **Network Security**
   - Use secure Wi-Fi
   - Avoid public networks for sensitive data
   - Monitor for unusual activity

3. **Physical Security**
   - Don't leave headset unattended
   - Use device lock
   - Report theft immediately

---

## Security Disclosures

### Past Vulnerabilities

*(None to date - v1.0.0)*

### Vulnerability Coordination

We follow responsible disclosure:
- Private disclosure to maintainers
- Time to fix before public disclosure
- Credit to discoverers
- Public disclosure after fix

---

## Contact

### Security Team

- **Email:** security@sigil-os.com (coming soon)
- **PGP Key:** (coming soon)
- **GitHub Security:** https://github.com/fuzzynetwork1989-alt/SIGIL-OS/security

### General Inquiries

- **Email:** support@sigil-os.com (coming soon)
- **GitHub Issues:** https://github.com/fuzzynetwork1989-alt/SIGIL-OS/issues

---

## Acknowledgments

We thank all security researchers who responsibly disclose vulnerabilities to help make SIGIL OS more secure.

---

*Last Updated: 2026-10-07*
