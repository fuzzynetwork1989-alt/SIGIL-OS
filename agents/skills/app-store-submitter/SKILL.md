---
name: app-store-submitter
description: Use for managing app store submission for SIGIL OS, including store-specific requirements, app signing, metadata preparation, privacy policy, compliance documentation, and review process management. This is for the final phase of the build process.
user-invocable: true
---

# App Store Submitter Skill

Use this skill for managing app store submission for SIGIL OS.

## When to Use

Use this skill for:
- Preparing app store submissions
- Managing app signing and certificates
- Creating store metadata and screenshots
- Writing privacy policies
- Preparing compliance documentation
- Managing the review process
- Handling store-specific requirements
- Coordinating releases across multiple stores

## Supported Stores

### iOS App Store
- App Store Connect setup
- App ID configuration
- Provisioning profiles
- Code signing
- App metadata
- Screenshots and videos
- Privacy labels
- Review submission

### Google Play Store
- Play Console setup
- App signing key management
- App bundle (AAB) generation
- Store listing
- Screenshots and videos
- Privacy policy
- Content rating
- Review submission

### Desktop Platforms
- Microsoft Store
- Mac App Store
- Linux package repositories

## Pre-Submission Checklist

### 1. Code Signing
- [ ] Code signing certificates obtained
- [ ] Provisioning profiles configured
- [ ] Signing keys securely stored
- [ ] Signing process automated in CI/CD

### 2. App Metadata
- [ ] App name finalized
- [ ] App description written
- [ ] Keywords selected
- [ ] Category selected
- [ ] Screenshots prepared
- [ ] Promotional videos prepared
- [ ] App icon finalized

### 3. Privacy and Compliance
- [ ] Privacy policy written
- [ ] Data collection documented
- [ ] Third-party SDKs documented
- [ ] Compliance with store policies verified
- [ ] Age rating obtained
- [ ] Export compliance verified

### 4. Technical Requirements
- [ ] App builds successfully
- [ ] App passes all tests
- [ ] App meets performance requirements
- [ ] App meets security requirements
- [ ] App is accessible
- [ ] App is internationalized

### 5. Store-Specific Requirements
- [ ] Store-specific guidelines reviewed
- [ ] Store-specific testing completed
- [ ] Store-specific assets prepared
- [ ] Store-specific configurations applied

## Submission Process

### 1. Preparation
- Generate release build
- Sign the build
- Create app bundle/package
- Generate screenshots
- Write metadata
- Prepare privacy policy

### 2. Upload
- Upload to store portal
- Upload screenshots
- Upload metadata
- Upload privacy policy
- Submit for review

### 3. Review Management
- Monitor review status
- Respond to review questions
- Address rejection reasons
- Resubmit if rejected

### 4. Release
- Schedule release
- Monitor release
- Handle post-release issues
- Rollback if necessary

## Required Evidence

For every submission, produce:
- Build artifact sigil
- Certificate sigil
- Metadata sigil
- Submission receipt
- Review status report
- Release report

## Store-Specific Guidelines

### iOS App Store
- Follow Apple Human Interface Guidelines
- Meet App Store Review Guidelines
- Use App Store Connect API for automation
- Support TestFlight for beta testing

### Google Play Store
- Follow Material Design Guidelines
- Meet Google Play Policy Center requirements
- Use Play Console API for automation
- Support Play Store Internal Testing

## Critical Path (Final Phase)

App store submission is the final critical phase:

1. **Preparation** - Ensure all requirements are met
2. **Submission** - Submit to stores
3. **Review** - Manage review process
4. **Release** - Coordinate release
5. **Post-Release** - Monitor and support

## Stop Conditions

- Do not submit without passing all tests
- Do not submit without security approval
- Do not submit without privacy policy
- Do not submit without accessibility compliance
- Do not submit without store-specific approval

## Integration with SIGIL OS

- Every submission emits a sigil
- Build artifacts are signed with sigil warrants
- Release decisions are attested in sigils
- Review status is tracked in sigils
- Rollback operations use sigil rollback keys

## Forbidden Actions

- Do not submit incomplete apps
- Do not bypass review process
- Do not submit with known vulnerabilities
- Do not submit without privacy policy
- Do not submit without accessibility compliance
