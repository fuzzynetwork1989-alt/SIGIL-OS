# Contributing to SIGIL OS

Thank you for your interest in contributing to SIGIL OS! We welcome contributions from developers, designers, writers, and enthusiasts.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Testing](#testing)
6. [Documentation](#documentation)
7. [Submitting Changes](#submitting-changes)
8. [Reporting Issues](#reporting-issues)

---

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- The use of sexualized language or imagery
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information
- Other unethical or unprofessional conduct

---

## Getting Started

### Prerequisites

- Rust toolchain (1.70+)
- Git
- Platform-specific build tools

See [Installation Guide](INSTALLATION_GUIDE.md) for detailed setup.

### Fork and Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/SIGIL-OS.git
cd SIGIL-OS

# Add upstream remote
git remote add upstream https://github.com/fuzzynetwork1989-alt/SIGIL-OS.git
```

### Build

```bash
# Build the project
cargo build

# Run tests
cargo test

# Build with optimizations
cargo build --release
```

---

## Development Workflow

### Branch Naming

Use descriptive branch names:

- `feature/amazing-feature`
- `fix/critical-bug`
- `docs/update-readme`
- `refactor/optimize-performance`

### Commit Messages

Follow conventional commits:

```
feat: add avatar morphing support
fix: resolve memory leak in dream weaving
docs: update installation guide
refactor: simplify model fabric API
test: add unit tests for ledger
chore: update dependencies
```

### Pull Request Process

1. Update your branch with upstream:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. Ensure tests pass:
   ```bash
   cargo test
   cargo clippy
   cargo fmt
   ```

3. Push to your fork:
   ```bash
   git push origin feature/amazing-feature
   ```

4. Open a Pull Request on GitHub

5. Wait for review and address feedback

---

## Coding Standards

### Rust Style

- Use `cargo fmt` for formatting
- Use `cargo clippy` for linting
- Follow Rust naming conventions
- Document public APIs with `///` doc comments
- Use `#[cfg(test)]` for test-only code

### Example

```rust
/// Adds two numbers together.
///
/// # Arguments
///
/// * `a` - First number
/// * `b` - Second number
///
/// # Returns
///
/// The sum of `a` and `b`
///
/// # Examples
///
/// ```
/// let result = add(2, 3);
/// assert_eq!(result, 5);
/// ```
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add() {
        assert_eq!(add(2, 3), 5);
    }
}
```

### Error Handling

- Use `Result<T, E>` for fallible operations
- Provide helpful error messages
- Use `thiserror` for custom error types
- Avoid `unwrap()` and `expect()` in production code

### Example

```rust
use thiserror::Error;

#[derive(Debug, Error)]
pub enum SigilError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Serialization error: {0}")]
    Serialization(#[from] serde_json::Error),

    #[error("Invalid sigil format")]
    InvalidSigilFormat,
}

pub fn process_sigil(data: &[u8]) -> Result<Sigil, SigilError> {
    // Implementation
}
```

---

## Testing

### Unit Tests

Write unit tests for all non-trivial functions:

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_functionality() {
        // Arrange
        let input = "test";

        // Act
        let result = process(input);

        // Assert
        assert_eq!(result, "expected");
    }
}
```

### Integration Tests

Place integration tests in `tests/` directory:

```rust
// tests/integration_test.rs
use sigil_os::SigilCore;

#[test]
fn test_integration() {
    let core = SigilCore::new();
    assert!(core.is_healthy());
}
```

### Test Coverage

Aim for >80% code coverage. Use tarpaulin:

```bash
cargo install cargo-tarpaulin
cargo tarpaulin --out Html
```

---

## Documentation

### Code Documentation

Document all public APIs:

```rust
/// Represents a sigil - a cryptographic mark of provenance.
///
/// Sigils are used to track the origin and authorization of
/// cognitive operations in SIGIL OS.
#[derive(Debug, Clone)]
pub struct Sigil {
    /// Unique identifier
    pub id: Uuid,

    /// Creator signature
    pub signature: Vec<u8>,

    /// Timestamp
    pub timestamp: chrono::DateTime<chrono::Utc>,
}
```

### Documentation Files

- Update README.md for user-facing changes
- Update INSTALLATION_GUIDE.md for installation changes
- Update USER_MANUAL.md for feature changes
- Update docs/ARCHITECTURE.md for architectural changes

---

## Submitting Changes

### Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows style guidelines (`cargo fmt`, `cargo clippy`)
- [ ] All tests pass (`cargo test`)
- [ ] New features include tests
- [ ] Documentation is updated
- [ ] Commit messages follow conventional commits
- [ ] PR description explains the change

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested this change

## Checklist
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

---

## Reporting Issues

### Bug Reports

Use the GitHub issue tracker and include:

- Title: Clear description of the bug
- Description: Detailed explanation
- Steps to reproduce: How to reproduce the bug
- Expected behavior: What should happen
- Actual behavior: What actually happens
- Environment: OS, Rust version, etc.
- Logs: Relevant error messages or logs

### Feature Requests

Use the GitHub issue tracker and include:

- Title: Clear description of the feature
- Description: Detailed explanation
- Use case: Why this feature is needed
- Alternatives: What you've considered
- Implementation ideas: How you think it could work

---

## Areas for Contribution

### High Priority

- [ ] Resolve candle dependency conflicts in Model Fabric
- [ ] Implement actual ML inference (currently placeholder)
- [ ] Add mobile app support (iOS, Android)
- [ ] Complete Quest 3 SDK integration

### Medium Priority

- [ ] Add more AI models (Mistral, LLaMA)
- [ ] Implement plugin system
- [ ] Add cloud sync (optional)
- [ ] Improve UI animations

### Low Priority

- [ ] Additional themes
- [ ] More avatar options
- [ ] Voice customization
- [ ] Keyboard shortcuts

---

## Questions?

- Open an issue on GitHub
- Join our Discord (coming soon)
- Email: contributors@sigil-os.com (coming soon)

---

Thank you for contributing to SIGIL OS! 🚀
