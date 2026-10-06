# Build Packet: Meta Quest 3 Integration

**Work Item ID:** SIGIL-MQ3-001
**Title:** Meta Quest 3 Foundation - SDK Integration and Voice Assistant
**Stage:** meta-quest-3-foundation
**Risk Tier:** safety-critical
**Generated:** 2026-10-05T12:30:00Z
**Autopilot Mode:** SIGIL OS Autopilot Mode v1.0

## Objective

Integrate Meta Quest 3 SDKs and toolchains to enable SIGIL OS on Meta Quest 3, including 3rd party voice assistant with vision, mixed reality interface, spatial mapping, hand tracking, and XR presence.

## Non-Goals

- Production deployment to Quest Store
- Bypassing Meta's approval process
- Using Quest APIs without proper permissions
- Skipping safety testing on device
- Removing privacy controls

## Depends On

- Android SDK/NDK installation
- Meta Quest SDK installation
- Phase 0 completion
- Model Fabric foundation (for voice assistant)
- UI/UX layer (for mixed reality interface)

## Scope

### Allowed Paths

- `experience-surfaces/quest/` (new directory)
- `experience-surfaces/xr/` (shared XR code)
- Android build configuration
- Quest-specific configurations
- `tests/` (Quest integration tests)

### Forbidden Paths

- Bypassing Meta's developer agreement
- Using undocumented Quest APIs
- Accessing user data without permission
- Disabling privacy controls
- Removing Meta's safety features

## Data Zone

local + device (Quest device access requires permissions)

## Acceptance Criteria

### Positive

- [ ] Android SDK/NDK installed and configured
- [ ] Meta Quest SDK installed and configured
- [ ] Quest project structure created
- [ ] Basic Quest app builds successfully
- [ ] App can be deployed to Quest device
- [ ] Voice assistant with vision working
- [ ] Camera/vision integration working
- [ ] Spatial mapping functional
- [ ] Hand tracking integration working
- [ ] Passthrough API integration working
- [ ] Spatial audio implementation working
- [ ] XR presence system (The Presence) working
- [ ] Mixed reality interface rendering
- [ ] Avatar/digital model display in XR
- [ ] Voice input/output working
- [ ] Every interaction emits a sigil
- [ ] Privacy controls enforced
- [ ] Quest Store build configuration ready

### Negative

- [ ] Build failure detected and reported
- [ ] SDK installation failure detected
- [ ] Deployment failure detected
- [ ] Voice assistant failure detected
- [ ] Vision integration failure detected
- [ ] Privacy violation attempt blocked
- [ ] Sigil emission failure detected
- [ ] Unauthorized API access blocked

## Verification

### Commands

```bash
# Android SDK installation (manual)
# Download and install Android Studio with SDK/NDK

# Quest SDK installation (manual)
# Download and install Meta Quest SDK from Oculus

# Build Quest app
./gradlew assembleDebug

# Deploy to Quest device
adb install -r app/build/outputs/apk/debug/app-debug.apk

# Test voice assistant
# Manual test on device

# Test vision/camera
# Manual test on device

# Test spatial mapping
# Manual test on device

# Test hand tracking
# Manual test on device
```

### Evidence

- Android SDK installation logs
- Quest SDK installation logs
- Gradle build output
- APK build output
- ADB deployment output
- Device test results
- Voice assistant test results
- Vision integration test results
- Spatial mapping test results
- Hand tracking test results
- Sigil emission logs
- Privacy control logs

## Budget

- max_elapsed_minutes: 240 (includes SDK installation)
- max_local_gpu_minutes: 0
- max_external_cost_usd: 0 (SDKs are free)

## Rollback

- strategy: revert_commit_via_sigil_rollback
- migration_involved: false
- rollback_sigil_required: true

## Stop Conditions

- Build failure
- SDK installation failure
- Deployment failure
- Voice assistant failure
- Vision integration failure
- Privacy violation attempt
- Sigil emission failure
- Android SDK not installed
- Quest SDK not installed
- Quest device not available for testing

## Implementation Plan

### Step 1: SDK Installation

1. Install Android Studio with Android SDK
2. Install Android NDK
3. Install Meta Quest SDK (Oculus SDK)
4. Install OpenXR runtime
5. Install Spatial Audio SDK
6. Configure environment variables
7. Verify installations

### Step 2: Project Setup

1. Create Android project structure
2. Configure Gradle build files
3. Add Quest SDK dependencies
4. Configure manifest with Quest permissions
5. Set up build variants (debug/release)
6. Add ProGuard/R8 configuration

### Step 3: Basic Quest App

1. Create main activity
2. Initialize OpenXR runtime
3. Set up XR session
4. Implement basic rendering
5. Test on device
6. Add tests

### Step 4: Voice Assistant

1. Integrate voice recognition SDK
2. Integrate text-to-speech SDK
3. Connect to Model Fabric for inference
4. Implement voice command processing
5. Add voice feedback
6. Test on device
7. Add tests

### Step 5: Vision/Camera Integration

1. Request camera permissions
2. Initialize camera access
3. Implement frame capture
4. Implement vision processing
5. Integrate with Model Fabric for vision understanding
6. Test on device
7. Add tests

### Step 6: Spatial Mapping

1. Initialize spatial mapping API
2. Implement room scanning
3. Implement mesh generation
4. Implement spatial anchors
5. Test on device
6. Add tests

### Step 7: Hand Tracking
1. Initialize hand tracking API
2. Implement hand detection
3. Implement gesture recognition
4. Map gestures to actions
5. Test on device
6. Add tests

### Step 8: Passthrough

1. Initialize passthrough API
2. Implement mixed reality rendering
3. Blend virtual and real content
4. Optimize performance
5. Test on device
6. Add tests

### Step 9: Spatial Audio

1. Initialize spatial audio SDK
2. Implement 3D audio positioning
3. Implement audio spatialization
4. Test on device
5. Add tests

### Step 10: XR Presence (The Presence)

1. Design Presence avatar
2. Implement Presence rendering
3. Implement Presence spatial anchoring
4. Implement Presence interaction
5. Integrate with voice assistant
6. Test on device
7. Add tests

### Step 11: Mixed Reality Interface

1. Design MR UI layout
2. Implement UI panel rendering
3. Implement interactive buttons
4. Implement text input
5. Implement immersive overlays
6. Test on device
7. Add tests

### Step 12: Avatar/Digital Model
1. Integrate avatar system from UI/UX layer
2. Implement avatar rendering in XR
3. Implement avatar morphing
4. Implement avatar voice sync
5. Test on device
6. Add tests

### Step 13: Sigil Integration

1. Emit sigil on every interaction
2. Emit sigil on voice command
3. Emit sigil on vision processing
4. Emit sigil on spatial action
5. Implement rollback for XR actions
6. Add tests

### Step 14: Privacy Controls

1. Implement camera permission flow
2. Implement microphone permission flow
3. Implement spatial data privacy controls
4. Implement data deletion
5. Add privacy indicators
6. Test on device
7. Add tests

### Step 15: Quest Store Preparation

1. Configure Quest Store build
2. Prepare store listing assets
3. Prepare privacy policy
4. Prepare content rating
5. Prepare age rating
6. Add Oculus-specific metadata

### Step 16: Verification
1. Build debug APK
2. Deploy to Quest device
3. Test all features on device
4. Test voice assistant
5. Test vision integration
6. Test spatial mapping
7. Test hand tracking
8. Test passthrough
9. Test spatial audio
10. Test XR Presence
11. Test MR interface
12. Test avatar
13. Test sigil emission
14. Test privacy controls
15. Collect evidence

## Current Gaps

1. **Android SDK not installed** - Must install manually
2. **Quest SDK not installed** - Must install manually
3. **Quest device not available** - Need device for testing
4. **Model Fabric not ready** - Voice assistant depends on it
5. **UI/UX layer not ready** - Avatar depends on it
6. **Complex XR rendering** - Significant graphics programming required

## Dependencies

**External SDKs:**

- Android SDK (API level 32+)
- Android NDK (r21+)
- Meta Quest SDK (Oculus SDK)
- OpenXR runtime
- Spatial Audio SDK
- Hand Tracking SDK
- Passthrough API

**Rust Crates (if using Rust for Android):**

- `jni` - JNI bindings
- `ndk` - Android NDK bindings
- `ndk-glue` - Android glue code

**Internal:**

- `model-fabric` - Voice assistant inference
- `ui-ux` - Avatar system
- `sigil-core` - Sigil emission

## Architecture

```text
experience-surfaces/
├── quest/
│   ├── android/
│   │   ├── app/
│   │   │   ├── src/
│   │   │   │   ├── main/
│   │   │   │   │   ├── java/
│   │   │   │   │   │   └── com/
│   │   │   │   │   │       └── sigilos/
│   │   │   │   │   │           ├── MainActivity.java
│   │   │   │   │   │           ├── XRActivity.java
│   │   │   │   │   │           ├── VoiceAssistant.java
│   │   │   │   │   │           ├── VisionProcessor.java
│   │   │   │   │   │           ├── SpatialMapper.java
│   │   │   │   │   │           ├── HandTracker.java
│   │   │   │   │   │           ├── PassthroughRenderer.java
│   │   │   │   │   │           ├── SpatialAudio.java
│   │   │   │   │   │           ├── Presence.java
│   │   │   │   │   │           ├── MRInterface.java
│   │   │   │   │   │           └── AvatarRenderer.java
│   │   │   │   │   ├── cpp/
│   │   │   │   │   │   └── native-lib.cpp
│   │   │   │   │   ├── res/
│   │   │   │   │   └── AndroidManifest.xml
│   │   │   │   └── test/
│   │   │   └── build.gradle
│   │   ├── build.gradle
│   │   ├── settings.gradle
│   │   └── gradle.properties
│   └── configs/
│       ├── quest.yaml
│       └── permissions.yaml
└── xr/
    ├── openxr/
    │   ├── runtime.rs
    │   └── session.rs
    └── shared/
        ├── rendering.rs
        └── spatial.rs
```

## Evidence Status

- SDK installation: pending (manual)
- Project setup: pending
- Basic Quest app: pending
- Voice assistant: pending
- Vision integration: pending
- Spatial mapping: pending
- Hand tracking: pending
- Passthrough: pending
- Spatial audio: pending
- XR Presence: pending
- MR interface: pending
- Avatar: pending
- Sigil integration: pending
- Privacy controls: pending
- Quest Store prep: pending
- Device testing: pending

## Required Approvals

1. **SDK installation approval** - Manual installation required
2. **Meta developer account** - Need Meta developer account
3. **Quest device access** - Need Quest device for testing
4. **Scope approval** - This is a major new platform
5. **Privacy policy approval** - Vision/audio access requires privacy policy

## Next Steps

After this work item:

- SIGIL OS runs on Meta Quest 3
- Voice assistant with vision working
- Mixed reality interface functional
- XR Presence (The Presence) operational
- Ready for Quest Store submission

## Risk Assessment

**Risks:**

1. SDK installation complex/fails
2. Quest device not available
3. XR rendering performance issues
4. Voice recognition quality poor
5. Vision processing too slow
6. Privacy concerns with camera/mic
7. Meta rejects app from store

**Mitigations:**

1. Follow official installation guides
2. Acquire Quest device early
3. Optimize rendering, use level of detail
4. Use high-quality voice SDK
5. Offload vision processing to server if needed
6. Strong privacy controls, clear permissions
7. Follow Meta's guidelines closely
