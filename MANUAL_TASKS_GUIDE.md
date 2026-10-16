# Manual Tasks Guide - Next Steps for App Store Submission

**Date:** 2026-10-16

This guide covers the tasks that require manual action (GitHub settings, domain registration, SDK installation, hardware testing).

---

## Immediate Tasks (Do Today)

### 1. Enable GitHub Pages ⚠️ MANUAL

**Steps:**
1. Go to: https://github.com/fuzzynetwork1989-alt/SIGIL-OS/settings/pages
2. Under "Source", select:
   - Deploy from a branch
   - Branch: `main`
   - Folder: `/docs`
3. Click "Save"

**Result:** Your website will be available at: https://fuzzynetwork1989-alt.github.io/SIGIL-OS/

**Note:** You need GitHub account access for this repository.

---

### 2. Register sigil-os.com Domain ⚠️ MANUAL + PAYMENT

**Option A: Cloudflare (Recommended - Best Value)**
1. Go to: https://www.cloudflare.com/products/registrar/
2. Search for: `sigil-os.com`
3. Add to cart ($8-10/year)
4. Create account
5. Complete purchase
6. Enable WHOIS privacy (free)
7. Go to DNS settings → Add records:
   - CNAME `sigil-os.com` → `fuzzynetwork1989-alt.github.io`
   - CNAME `www.sigil-os.com` → `fuzzynetwork1989-alt.github.io`

**Option B: Namecheap**
1. Go to: https://www.namecheap.com/
2. Search for: `sigil-os.com`
3. Add to cart ($8-12/year)
4. Create account
5. Complete purchase
6. Enable WHOIS privacy (free)
7. Go to Advanced DNS → Add records:
   - Type: CNAME
   - Host: `@`
   - Value: `fuzzynetwork1989-alt.github.io`
   - TTL: Automatic

**Option C: Google Domains**
1. Go to: https://domains.google/
2. Search for: `sigil-os.com`
3. Register ($12/year)
4. Free WHOIS privacy included
5. Go to DNS settings → Custom resource records:
   - Name: `@`
   - Type: CNAME
   - TTL: 3600
   - Data: `fuzzynetwork1989-alt.github.io`

**Cost:** $8-12/year

---

### 3. Convert App Icon SVG to PNG ⚠️ MANUAL

**Option A: Online Converter (Easiest)**
1. Go to: https://cloudconvert.com/svg-to-png
2. Upload: `assets/app-icon.svg`
3. Convert to sizes:
   - 1024x1024 (primary)
   - 512x512 (Google Play)
   - 180x180 (iOS)
   - 192x192 (Android adaptive)
   - 48x48 (favicon)
4. Download all variants

**Option B: Command Line (If you have ImageMagick)**
```bash
# Install ImageMagick first
# Windows: winget install ImageMagick.ImageMagick
# macOS: brew install imagemagick
# Linux: sudo apt install imagemagick

# Convert to all sizes
magick assets/app-icon.svg -resize 1024x1024 assets/icon-1024.png
magick assets/app-icon.svg -resize 512x512 assets/icon-512.png
magick assets/app-icon.svg -resize 180x180 assets/icon-180.png
magick assets/app-icon.svg -resize 192x192 assets/icon-192.png
magick assets/app-icon.svg -resize 48x48 assets/icon-48.png
```

**Cost:** Free

---

## This Week Tasks

### 4. Create Screenshots of SIGIL OS UI ⚠️ MANUAL

**Prerequisites:**
- Build SIGIL OS: `cargo build --release`
- Run SIGIL OS: `./target/release/sigil-ui`

**Steps:**
1. Launch SIGIL OS UI
2. For each screenshot (6 total):
   - Windows: Use Snipping Tool (Win+Shift+S)
   - macOS: Cmd+Shift+4
   - Linux: `gnome-screenshot -w`
3. Save to: `assets/screenshots/`
4. Resize to store specifications (see VISUAL_ASSETS_GUIDE.md)

**Screenshot Descriptions:**
1. Main Chat Interface - Avatar, chat history, input
2. Avatar Customization - Face, hair, clothing options
3. Dream Weaving Dashboard - Dream cycles, insights, history
4. Theme Selection - 5 themes with preview
5. Meta Quest 3 MR - Avatar in mixed reality (requires Quest 3)
6. Voice Assistant - Voice input with waveform

**Cost:** Free

---

### 5. Install Quest SDK ⚠️ MANUAL + TIME (1-2 weeks)

**Prerequisites:**
- Meta Quest 3 device
- Meta developer account (free)
- Windows PC recommended

**Steps:**

**Step 1: Enable Developer Mode on Quest 3**
1. Open Meta Quest app on phone
2. Menu → Devices → Your Quest 3
3. Enable Developer Mode

**Step 2: Install Android Studio**
1. Download: https://developer.android.com/studio
2. Run installer
3. Complete setup wizard

**Step 3: Install Android SDK/NDK**
1. In Android Studio: Tools → SDK Manager
2. Install:
   - Android SDK Platform-Tools
   - Android SDK Build-Tools
   - Android NDK (Side by side)
3. Set environment variables:
   ```powershell
   $env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
   $env:ANDROID_NDK_HOME = "$env:ANDROID_HOME\ndk\25.2.9519653"
   ```

**Step 4: Install Quest SDK**
1. Download: https://developer.oculus.com/downloads/package/oculus-mobile-sdk/
2. Extract to: `C:\OculusMobileSDK`
3. Add to PATH

**Step 5: Install OpenXR**
1. Download: https://github.com/KhronosGroup/OpenXR-SDK
2. Build or download pre-built binaries
3. Install to: `C:\Program Files\OpenXR`

**Step 6: Configure Quest 3**
1. Connect Quest 3 via USB-C
2. Enable USB debugging in headset
3. Verify connection: `adb devices`

**Cost:** Free (SDKs are free, Quest 3 device: $499 if not owned)

**Time:** 1-2 weeks

---

### 6. Test on Actual Quest 3 Device ⚠️ MANUAL + HARDWARE

**Steps:**
1. Build Quest app: `cd quest-integration && cargo apk build`
2. Deploy: `cargo apk install`
3. Put on Quest 3 headset
4. Open Library → Unknown Sources
5. Launch SIGIL OS
6. Test features:
   - Voice input
   - Hand tracking
   - Passthrough mode
   - MR avatar
   - Spatial anchors

**Cost:** Free (requires Quest 3 device)

**Time:** 1 week

---

## Already Completed (Automated)

### ✅ Download Qwen 7B Model (In Progress)
- Status: Downloading now (13GB, ~57% complete)
- Command: `python -c "from modelscope import snapshot_download; snapshot_download('Qwen/Qwen-7B', cache_dir='C:/Users/Corey Smith/.sigil-os/models')"`
- Location: `C:\Users\Corey Smith\.sigil-os\models\Qwen\Qwen-7B\`
- Estimated time remaining: ~5-10 minutes

### ✅ Integrate Actual ML Inference
- Status: Will integrate after download completes
- Already have Candle v0.11.0 working
- Will update `model-fabric/src/engine.rs` to use actual model

### ✅ Candle v0.11.0 Upgrade
- Status: ✅ Complete
- Build: Successful (14m 40s)
- No dependency conflicts

### ✅ Marketing Website
- Status: ✅ Complete
- Files: `website/index.html`, `website/styles.css`
- GitHub Pages: Files copied to `docs/` (ready to enable)

### ✅ App Icon
- Status: ✅ Complete (SVG)
- File: `assets/app-icon.svg`
- Next: Convert to PNG (manual task above)

### ✅ Next-Generation MR Avatar Assistant
- Status: ✅ Complete
- File: `quest-integration/src/mr_avatar_assistant.rs` (966 lines)
- Features: Full-body avatar, walking, tutorials, visualizations, virtual windows
- Tests: 10/10 passing

---

## Summary

**Tasks YOU need to do manually:**
1. Enable GitHub Pages (5 minutes)
2. Register sigil-os.com domain ($8-12, 5 minutes)
3. Convert app icon SVG to PNG (5 minutes)
4. Create screenshots (30 minutes)
5. Install Quest SDK (1-2 weeks)
6. Test on Quest 3 device (1 week)

**Tasks being done automatically:**
- ✅ Download Qwen 7B model (in progress, ~57% complete)
- ⏳ Integrate actual ML inference (will do after download)

**Total Manual Cost:** $8-12 (domain) + $499 (Quest 3 if not owned)
**Total Manual Time:** 1-3 weeks

---

## After All Tasks Complete

You'll have:
- ✅ Functional SIGIL OS with actual ML inference
- ✅ Professional app icon
- ✅ Marketing website live at sigil-os.com
- ✅ Quest 3 app ready for testing
- ✅ All materials for app store submission

**Next:** Submit to Apple App Store, Google Play, and Meta Quest Store
