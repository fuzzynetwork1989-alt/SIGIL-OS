# SIGIL OS Quick Start Guide

## Get SIGIL OS running in 5 minutes

---

## Windows (3 Commands)

```batch
install-complete.bat           # Install all prerequisites
cargo build --release          # Build the project
.\target\release\api.exe       # Start API server
```

Then in a new terminal:

```batch
cd desktop-client
npm run dev                    # Start web UI
```

Visit <http://localhost:5173>

---

## Linux/macOS (3 Commands)

```bash
chmod +x install-complete.sh
./install-complete.sh         # Install all prerequisites
cargo build --release          # Build the project
./target/release/api           # Start API server
```

Then in a new terminal:

```bash
cd desktop-client
npm run dev                    # Start web UI
```

Visit <http://localhost:5173>

---

## What This Does

1. **Install Prerequisites** - Rust, Node.js, Git, Python
2. **Build Project** - Compile all Rust components
3. **Start API Server** - Backend on port 8080
4. **Start Web UI** - Frontend on port 5173

---

## Verify Installation

```bash
# Check API health
curl http://localhost:8080/health

# Expected response:
# {"status":"ok","version":"0.1.0","timestamp":"...","superbrain_enabled":true}
```

---

## Next Steps

- **Desktop App:** See [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md#desktop-setup-electron)
- **Mobile App:** See [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md#mobile-setup-android-apk-with-expo)
- **Quest 3:** See [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md#meta-quest-3-setup)
- **Full Documentation:** See [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)

---

## Troubleshooting

**Port already in use?**

```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/macOS
lsof -i :8080
kill -9 <PID>
```

**Build failed?**

```bash
cargo clean
cargo build --release
```

**For more help:** See [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md#troubleshooting)
