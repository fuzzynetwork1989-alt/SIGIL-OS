# SIGIL OS - Prevent Cargo Lock Issues

This script prevents "Blocking waiting for file lock on build directory" errors.

# Kill any running cargo/rustc processes
taskkill /F /IM cargo.exe 2>nul
taskkill /F /IM rustc.exe 2>nul

# Remove target directory
powershell -Command "Remove-Item -Recurse -Force target -ErrorAction SilentlyContinue"

# Set Cargo to use offline mode for faster builds
set CARGO_NET_OFFLINE=true

# Set parallel jobs to 1 to prevent lock contention
set CARGO_BUILD_JOBS=1

echo "Cargo lock issues prevented. Ready to build."
