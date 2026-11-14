@echo off
setlocal
set "CARGO_TARGET_DIR=C:\temp-sigil-build"
if not exist "C:\temp-sigil-build" mkdir "C:\temp-sigil-build"
rustup default stable-x86_64-pc-windows-gnu
cargo build --workspace --target-dir C:\temp-sigil-build %*
endlocal
