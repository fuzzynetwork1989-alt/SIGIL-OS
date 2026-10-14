# Quest SDK Manual Installation Requirements

**Version:** 1.0.0  
**Last Updated:** 2026-10-07  
**Target Platform:** Meta Quest 3

---

## Overview

Meta Quest 3 integration requires manual installation of several SDKs and tools. This document provides the complete list of requirements and installation steps.

---

## Required Components

### 1. Meta Developer Account

**Required:** Yes  
**Manual Installation:** Yes  
**Cost:** Free (for individual developers)

**Steps:**
1. Go to https://developer.oculus.com/
2. Sign up or log in with your Meta account
3. Verify your organization (individual or company)
4. Enable Developer Mode on your Quest 3 headset via the Meta Quest mobile app

**Verification:**
- You can access the Oculus Developer Dashboard
- Developer Mode is enabled on your Quest 3

---

### 2. Android Studio

**Required:** Yes  
**Manual Installation:** Yes  
**Version:** 2023.1.1 or later  
**Cost:** Free

**Purpose:** IDE for Android/Quest development, includes SDK Manager

**Download Links:**
- Windows: https://developer.android.com/studio
- Linux: https://developer.android.com/studio
- macOS: https://developer.android.com/studio

**Installation Steps:**

**Windows:**
1. Download `android-studio-*.exe`
2. Run installer with default settings
3. Launch Android Studio
4. Complete the setup wizard

**Linux:**
```bash
wget https://redirector.gvt1.com/edgedl/android/studio/ide-zips/android-studio-2023.1.1.28-linux.tar.gz
tar -xzf android-studio-*.tar.gz
sudo mv android-studio /opt/
sudo ln -s /opt/android-studio/bin/studio.sh /usr/local/bin/android-studio
```

**macOS:**
1. Download Android Studio for Mac
2. Install DMG
3. Drag to Applications folder

**Verification:**
```bash
# Check Android Studio version
android-studio --version

# Or check in Help > About in Android Studio
```

---

### 3. Android SDK

**Required:** Yes  
**Manual Installation:** Via Android Studio SDK Manager  
**Version:** API Level 32+ (Android 12L)  
**Cost:** Free

**Required Components:**
- Android SDK Platform-Tools (ADB, fastboot)
- Android SDK Build-Tools
- Android SDK Platform (API 32, 33, 34)
- Android Emulator (optional, for testing without device)

**Installation Steps:**

1. Open Android Studio
2. Go to **Tools → SDK Manager**
3. In the **SDK Platforms** tab, check:
   - Android 12L (API 32)
   - Android 13 (API 33)
   - Android 14 (API 34)
4. In the **SDK Tools** tab, check:
   - Android SDK Build-Tools
   - Android SDK Platform-Tools
   - Android SDK Tools
   - Android Emulator (optional)
5. Click **Apply** to install

**Environment Variables:**

**Windows (PowerShell):**
```powershell
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator"

# For persistence, add to System Environment Variables
```

**Linux/macOS (Bash):**
```bash
# Add to ~/.bashrc or ~/.zshrc
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

# Reload shell
source ~/.bashrc
```

**Verification:**
```bash
# Check ADB version
adb version

# List installed SDKs
sdkmanager --list
```

---

### 4. Android NDK

**Required:** Yes  
**Manual Installation:** Via Android Studio SDK Manager  
**Version:** r25.2.9519653 or later  
**Cost:** Free

**Purpose:** Native development for Android (C/C++/Rust)

**Installation Steps:**

1. Open Android Studio
2. Go to **Tools → SDK Manager**
3. In the **SDK Tools** tab, check:
   - NDK (Side by side)
   - CMake (for native builds)
4. Click **Apply** to install

**Environment Variables:**

**Windows (PowerShell):**
```powershell
$env:ANDROID_NDK_HOME = "$env:ANDROID_HOME\ndk\25.2.9519653"
$env:PATH += ";$env:ANDROID_NDK_HOME"

# For persistence, add to System Environment Variables
```

**Linux/macOS (Bash):**
```bash
# Add to ~/.bashrc or ~/.zshrc
export ANDROID_NDK_HOME=$ANDROID_HOME/ndk/25.2.9519653
export PATH=$PATH:$ANDROID_NDK_HOME

# Reload shell
source ~/.bashrc
```

**Verification:**
```bash
# Check NDK version
echo $ANDROID_NDK_HOME

# List NDK contents
ls $ANDROID_NDK_HOME
```

---

### 5. Meta Quest SDK (Oculus Mobile SDK)

**Required:** Yes  
**Manual Installation:** Yes  
**Version:** Latest (v66.0 or later)  
**Cost:** Free (requires developer account)

**Download:**
1. Go to https://developer.oculus.com/downloads/package/oculus-mobile-sdk/
2. Log in with your Meta developer account
3. Download the latest version for your platform
4. Extract to a development directory

**Installation Steps:**

**Windows:**
```powershell
# Extract to C:\OculusMobileSDK
$env:QUEST_SDK = "C:\OculusMobileSDK"
$env:PATH += ";$env:QUEST_SDK\Tools"

# For persistence, add to System Environment Variables
```

**Linux/macOS:**
```bash
# Extract to ~/OculusMobileSDK
export QUEST_SDK=$HOME/OculusMobileSDK
export PATH=$PATH:$QUEST_SDK/Tools

# Add to ~/.bashrc or ~/.zshrc
```

**Verification:**
```bash
# Check Quest SDK path
echo $QUEST_SDK

# List Quest SDK contents
ls $QUEST_SDK
```

---

### 6. OpenXR Loader

**Required:** Yes  
**Manual Installation:** Yes  
**Version:** 1.0.26 or later  
**Cost:** Free

**Purpose:** OpenXR runtime for cross-platform XR development

**Download:**
- GitHub: https://github.com/KhronosGroup/OpenXR-SDK
- Pre-built binaries: https://github.com/KhronosGroup/OpenXR-SDK/releases

**Installation Steps:**

**Windows:**
1. Download pre-built binaries from GitHub releases
2. Extract to `C:\Program Files\OpenXR`
3. Add to PATH:
```powershell
$env:OPENXR_SDK = "C:\Program Files\OpenXR"
$env:PATH += ";$env:OPENXR_SDK\bin"

# For persistence, add to System Environment Variables
```

**Linux:**
```bash
# Build from source
git clone https://github.com/KhronosGroup/OpenXR-SDK.git
cd OpenXR-SDK
mkdir build && cd build
cmake ..
make
sudo make install

# Or install via package manager
sudo apt install libopenxr-loader-dev  # Ubuntu/Debian
```

**macOS:**
```bash
# Build from source
git clone https://github.com/KhronosGroup/OpenXR-SDK.git
cd OpenXR-SDK
mkdir build && cd build
cmake ..
make
sudo make install
```

**Verification:**
```bash
# Check OpenXR loader
xrinfo  # If available
# Or check library installation
ls /usr/local/lib/libopenxr*
```

---

### 7. ADB (Android Debug Bridge)

**Required:** Yes  
**Manual Installation:** Included with Android SDK  
**Version:** Latest (included with Platform-Tools)  
**Cost:** Free

**Purpose:** Deploy and debug apps on Quest 3

**Installation:**
- Installed automatically with Android SDK Platform-Tools

**Configuration Steps:**

1. Enable Developer Mode on Quest 3:
   - Open Meta Quest app on phone
   - Menu → Devices → Select Quest 3
   - Scroll down to "Developer Mode"
   - Toggle ON
   - Confirm your account

2. Enable USB Debugging on Quest 3:
   - Put on Quest 3 headset
   - Settings → System → Developer
   - Enable "USB Connection"
   - Select "File Transfer" or "ADB"

3. Connect Quest 3 via USB-C cable
4. Allow USB debugging on headset when prompted

**Verification:**
```bash
# Check ADB connection
adb devices

# Should show your Quest 3 device ID
```

---

### 8. Rust Android Target

**Required:** Yes  
**Manual Installation:** Via rustup  
**Version:** Latest stable  
**Cost:** Free

**Purpose:** Compile Rust code for Android/Quest

**Installation Steps:**

```bash
# Add Android targets
rustup target add aarch64-linux-android  # ARM64 (Quest 3)
rustup target add armv7-linux-androideabi  # ARM32 (legacy)
rustup target add i686-linux-android  # x86 (emulator)
rustup target add x86_64-linux-android  # x86_64 (emulator)

# Install cargo-apk for building APKs
cargo install cargo-apk
```

**Verification:**
```bash
# List installed targets
rustup target list --installed

# Check cargo-apk
cargo apk --version
```

---

## Hardware Requirements

### Development Machine
- **OS:** Windows 10/11 (recommended), Linux, macOS
- **CPU:** x86_64 with 8+ cores
- **RAM:** 16 GB minimum, 32 GB recommended
- **Storage:** 50 GB free space
- **USB:** USB 3.0+ port for Quest 3 connection

### Quest 3 Device
- **Headset:** Meta Quest 3
- **OS:** Quest OS v50 or higher
- **Storage:** 2 GB free for app
- **Cable:** USB 3.0+ cable (USB-C)

---

## Complete Environment Setup Script

### Windows (PowerShell)

Save as `setup-quest-sdk.bat`:

```batch
@echo off
echo Setting up Quest SDK environment...
echo.

REM Set Android SDK
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
set ANDROID_NDK_HOME=%ANDROID_HOME%\ndk\25.2.9519653
set QUEST_SDK=C:\OculusMobileSDK
set OPENXR_SDK=C:\Program Files\OpenXR

REM Add to PATH
set PATH=%PATH%;%ANDROID_HOME%\platform-tools
set PATH=%PATH%;%ANDROID_HOME%\emulator
set PATH=%PATH%;%ANDROID_NDK_HOME%
set PATH=%PATH%;%QUEST_SDK%\Tools
set PATH=%PATH%;%OPENXR_SDK%\bin

echo Environment variables set:
echo ANDROID_HOME=%ANDROID_HOME%
echo ANDROID_NDK_HOME=%ANDROID_NDK_HOME%
echo QUEST_SDK=%QUEST_SDK%
echo OPENXR_SDK=%OPENXR_SDK%
echo.

echo Verifying installations...
echo.
echo Checking ADB...
adb version
echo.

echo Checking Rust targets...
rustup target list --installed
echo.

echo Setup complete!
pause
```

### Linux/macOS (Bash)

Save as `setup-quest-sdk.sh`:

```bash
#!/bin/bash
echo "Setting up Quest SDK environment..."
echo

# Set environment variables
export ANDROID_HOME=$HOME/Android/Sdk
export ANDROID_NDK_HOME=$ANDROID_HOME/ndk/25.2.9519653
export QUEST_SDK=$HOME/OculusMobileSDK
export OPENXR_SDK=/usr/local

# Add to PATH
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_NDK_HOME
export PATH=$PATH:$QUEST_SDK/Tools
export PATH=$PATH:$OPENXR_SDK/bin

echo "Environment variables set:"
echo "ANDROID_HOME=$ANDROID_HOME"
echo "ANDROID_NDK_HOME=$ANDROID_NDK_HOME"
echo "QUEST_SDK=$QUEST_SDK"
echo "OPENXR_SDK=$OPENXR_SDK"
echo

echo "Verifying installations..."
echo
echo "Checking ADB..."
adb version
echo

echo "Checking Rust targets..."
rustup target list --installed
echo

echo "Setup complete!"
```

---

## Common Issues and Solutions

### Issue: ADB not recognizing Quest 3 device

**Solution:**
```bash
# Restart ADB server
adb kill-server
adb start-server

# Check device
adb devices

# If still not working, try different USB cable or port
# Ensure USB debugging is enabled on Quest 3
```

### Issue: NDK not found during build

**Solution:**
```bash
# Verify NDK path
echo $ANDROID_NDK_HOME

# Set correct path
export ANDROID_NDK_HOME=$ANDROID_HOME/ndk/25.2.9519653

# Reinstall NDK via Android Studio SDK Manager
```

### Issue: OpenXR loader not found

**Solution:**
```bash
# Verify OpenXR installation
ls $OPENXR_SDK/lib

# Reinstall OpenXR
# Windows: Reinstall from GitHub releases
# Linux: sudo apt install libopenxr-loader-dev
```

### Issue: Rust Android target not found

**Solution:**
```bash
# Add Android targets
rustup target add aarch64-linux-android
rustup target add armv7-linux-androideabi
rustup target add i686-linux-android
rustup target add x86_64-linux-android

# Install cargo-apk
cargo install cargo-apk
```

---

## Next Steps

After completing all installations:

1. Connect Quest 3 via USB-C
2. Verify ADB connection: `adb devices`
3. Build Quest app: `cargo apk build`
4. Deploy to Quest 3: `cargo apk install`
5. Test on device

For detailed Quest integration instructions, see `docs/TECHNICAL_RESOLUTION_GUIDE.md`.

---

## Support

- **Meta Developer Documentation:** https://developer.oculus.com/documentation/
- **OpenXR Documentation:** https://www.khronos.org/openxr/
- **Android NDK Guide:** https://developer.android.com/ndk/guides
- **SIGIL OS Issues:** https://github.com/fuzzynetwork1989-alt/SIGIL-OS/issues
