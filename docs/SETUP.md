# SIGIL OS Setup Guide

## Prerequisites

### Required Tools

1. **Rust** (latest stable)
   - Install from https://rustup.rs/
   - After installation, run: `rustup update stable`

2. **Cargo** (comes with Rust)
   - Verify installation: `cargo --version`

3. **Git**
   - Install from https://git-scm.com/
   - Verify installation: `git --version`

### Optional Tools

1. **GitHub CLI** (gh)
   - Install from https://cli.github.com/
   - For GitHub repository management

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/fuzzynetwork1989-alt/sigil-os.git
cd sigil-os
```

### 2. Install Rust Dependencies

```bash
cargo build
```

This will:
- Download and compile all dependencies
- Build the workspace
- Create the target directory

### 3. Run Tests

```bash
cargo test
```

This will run all unit tests across the workspace.

### 4. Run Linter

```bash
cargo clippy --workspace --all-targets -- -D warnings
```

### 5. Format Code

```bash
cargo fmt
```

## Running the API Server

### Build the API

```bash
cargo build --release
```

### Start the Server

```bash
cargo run --release -p api -- serve
```

The server will start on `http://localhost:8080` by default.

### Test Health Endpoint

```bash
curl http://localhost:8080/health
```

Expected response:
```json
{
  "status": "ok",
  "version": "0.1.0",
  "timestamp": "2024-10-01T14:30:00Z"
}
```

## Using the CLI

### Build the CLI

```bash
cargo build --release -p api
```

### Check Health

```bash
cargo run -p api -- health
```

### Start Server

```bash
cargo run -p api -- serve --addr 0.0.0.0:8080
```

## Development Workflow

### Making Changes

1. Make your changes to the code
2. Run `cargo fmt` to format
3. Run `cargo clippy` to lint
4. Run `cargo test` to test
5. Commit your changes

### Building for Production

```bash
cargo build --release
```

The release binaries will be in `target/release/`.

## Troubleshooting

### Cargo not found

Install Rust from https://rustup.rs/ and restart your terminal.

### Build fails

Try:
```bash
cargo clean
cargo build
```

### Tests fail

Run tests with output:
```bash
cargo test -- --nocapture
```

## Next Steps

After setup, refer to:
- `AGENTS.md` for agent instructions
- `docs/PROJECT_CONTRACT.md` for project requirements
- `docs/ARCHITECTURE.md` for architecture details
- `docs/AUTOPILOT_MODE.md` for Autopilot Mode activation
