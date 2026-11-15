# Quest 3 Android Integration

This directory contains the Android/Quest 3 application code for SIGIL OS.

## Project Structure

```
android/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/sigilos/quest/
│   │   │   │   ├── MainActivity.java
│   │   │   │   ├── XRActivity.java
│   │   │   │   ├── QuestRuntime.java
│   │   │   │   ├── VoiceAssistant.java
│   │   │   │   ├── HandTracking.java
│   │   │   │   ├── EyeTracking.java
│   │   │   │   ├── SpatialMapping.java
│   │   │   │   ├── MixedReality.java
│   │   │   │   ├── PersonalCompanion.java
│   │   │   │   ├── PresenceEngine.java
│   │   │   │   └── VisionProcessor.java
│   │   │   ├── cpp/
│   │   │   │   ├── native-lib.cpp
│   │   │   │   └── CMakeLists.txt
│   │   │   ├── res/
│   │   │   │   └── values/
│   │   │   │       └── strings.xml
│   │   │   └── AndroidManifest.xml
│   │   └── build.gradle
│   ├── build.gradle
│   ├── settings.gradle
│   └── gradle.properties
```

## Prerequisites

1. **Android Studio** - Install Android Studio 2023.1.1 or later
2. **Android SDK** - Install API level 32+ (Android 12L)
3. **Android NDK** - Install NDK r25.2.9519653 or later
4. **Meta Quest SDK** - Download from https://developer.oculus.com/downloads/package/oculus-mobile-sdk/
5. **OpenXR Runtime** - Install OpenXR loader 1.0.26 or later
6. **Quest 3 Device** - Enable Developer Mode and USB Debugging

See `docs/QUEST_SDK_REQUIREMENTS.md` for detailed installation instructions.

## Building the APK

### Using Android Studio

1. Open Android Studio
2. Open this project (`experience-surfaces/quest/android`)
3. Sync Gradle files
4. Build → Build Bundle(s) / APK(s) → Build APK(s)
5. APK will be in `app/build/outputs/apk/debug/app-debug.apk`

### Using Command Line

```bash
cd experience-surfaces/quest/android

# Build debug APK
./gradlew assembleDebug

# Build release APK
./gradlew assembleRelease

# APK location
# Debug: app/build/outputs/apk/debug/app-debug.apk
# Release: app/build/outputs/apk/release/app-release.apk
```

## Deploying to Quest 3

### Using ADB

```bash
# Connect Quest 3 via USB-C
# Enable USB Debugging on Quest 3

# Verify connection
adb devices

# Install APK
adb install -r app/build/outputs/apk/debug/app-debug.apk

# Launch app
adb shell am start -n com.sigilos.quest/.MainActivity
```

### Using Android Studio

1. Connect Quest 3 via USB-C
2. Select Quest 3 device in Android Studio
3. Run → Run 'app'
4. App will be installed and launched automatically

## Quest 3 Runtime Components

### Voice Runtime
- **File:** `VoiceAssistant.java`
- **Features:** Voice recognition, text-to-speech, voice command processing
- **Status:** Placeholder - TODO comments for SDK integration
- **Next Steps:** Integrate Quest voice recognition SDK, connect to Model Fabric

### Hand Runtime
- **File:** `HandTracking.java`
- **Features:** Hand detection, gesture recognition, gesture-to-action mapping
- **Status:** Placeholder - TODO comments for SDK integration
- **Next Steps:** Integrate Quest hand tracking SDK, implement gesture recognition

### Eye Runtime
- **File:** `EyeTracking.java`
- **Features:** Gaze detection, attention tracking, gaze-based commands
- **Status:** Placeholder - TODO comments for SDK integration
- **Next Steps:** Integrate Quest eye tracking SDK, implement gaze commands

### Spatial Runtime
- **File:** `SpatialMapping.java`
- **Features:** Room scanning, mesh generation, spatial anchors
- **Status:** Placeholder - TODO comments for SDK integration
- **Next Steps:** Integrate Quest spatial mapping API, implement room scanning

### Avatar Runtime
- **File:** QuestRuntime.java (coordinates avatar)
- **Features:** Avatar state machine, spatial positioning, animation
- **Status:** Not implemented - needs 3D model loading and rendering
- **Next Steps:** Load 3D avatar model, implement avatar rendering in XR

### Presence Engine
- **File:** `PresenceEngine.java`
- **Features:** Breathing, blinking, eye focus, posture, micro gestures
- **Status:** Placeholder - TODO comments for SDK integration
- **Next Steps:** Implement presence animations using Quest SDK

### Mixed Reality Interface
- **File:** `MixedReality.java`
- **Features:** Passthrough, spatial anchors, MR rendering
- **Status:** Placeholder - TODO comments for SDK integration
- **Next Steps:** Integrate Quest passthrough API, implement MR rendering

### Vision Processor
- **File:** `VisionProcessor.java`
- **Features:** Camera access, frame capture, vision processing
- **Status:** Placeholder - TODO comments for SDK integration
- **Next Steps:** Integrate Quest camera API, connect to Model Fabric

## SCA-1R Cognitive Integration

The Quest Runtime (`QuestRuntime.java`) is designed to integrate with SCA-1R cognitive services:

### Identity Vault Integration
- **Connector:** `IdentityVaultConnector`
- **Purpose:** Quest device authentication, device trust layer
- **Status:** Placeholder - TODO comments for sigil-core/auth integration
- **Next Steps:** Connect to sigil-core/auth Identity Vault

### Persistent Context Router (PCR) Integration
- **Connector:** `PersistentContextRouterConnector`
- **Purpose:** Context assembly for Quest interactions
- **Status:** Placeholder - TODO comments for sigil-core/context integration
- **Next Steps:** Connect to sigil-core/context PCR

### Cognitive Assembly Integration
- **Connector:** `CognitiveAssemblyConnector`
- **Purpose:** Temporary mind creation for Quest tasks
- **Status:** Placeholder - TODO comments for Cognitive Assembly Engine
- **Next Steps:** Connect to Cognitive Assembly Engine

### Planner Integration
- **Connector:** `PlannerConnector`
- **Purpose:** Action planning for Quest interactions
- **Status:** Placeholder - TODO comments for Action Planner
- **Next Steps:** Connect to Action Planner

## Native Code (C++)

The native code (`native-lib.cpp`) provides OpenXR integration:

- **File:** `native-lib.cpp`
- **Features:** OpenXR instance creation, session management
- **Status:** Basic initialization only
- **Next Steps:** Implement full OpenXR session, rendering, runtime components

## Testing

### Unit Tests
```bash
./gradlew test
```

### Instrumented Tests
```bash
./gradlew connectedAndroidTest
```

### Device Testing
1. Deploy APK to Quest 3
2. Test each runtime component manually
3. Verify latency (target: voice ≤ 1.5s)
4. Verify gesture recognition
5. Verify spatial mapping
6. Verify MR rendering

## Debugging

### ADB Logcat
```bash
# View logs
adb logcat | grep SIGIL

# View specific component logs
adb logcat | grep VoiceAssistant
adb logcat | grep HandTracking
adb logcat | grep EyeTracking
adb logcat | grep SpatialMapping
adb logcat | grep PresenceEngine
```

### Android Studio Debugger
1. Attach debugger to Quest 3 device
2. Set breakpoints in Java code
3. Debug native code with LLDB

## Known Issues

1. **SDK Integration Missing** - All Quest SDK integrations are placeholder TODO comments
2. **No 3D Avatar Rendering** - Avatar system needs 3D model loading and rendering
3. **No Model Fabric Connection** - Voice and vision processing need Model Fabric integration
4. **No SCA-1R Cognitive Integration** - Identity Vault, PCR, Cognitive Assembly, Planner not connected
5. **Build May Fail** - Gradle configuration may need adjustment based on SDK paths

## Next Steps

1. **Install SDKs** - Follow `docs/QUEST_SDK_REQUIREMENTS.md`
2. **Configure SDK Paths** - Update CMakeLists.txt with Quest SDK path
3. **Integrate Quest SDKs** - Replace TODO comments with actual SDK calls
4. **Connect to Model Fabric** - Integrate voice and vision processing
5. **Connect to SCA-1R Cognitive Services** - Integrate Identity Vault, PCR, Cognitive Assembly, Planner
6. **Implement Avatar Rendering** - Load 3D model, implement rendering in XR
7. **Test on Device** - Deploy to Quest 3, verify all components
8. **Optimize Performance** - Optimize rendering, latency, memory usage

## Support

- **Meta Developer Documentation:** https://developer.oculus.com/documentation/
- **OpenXR Documentation:** https://www.khronos.org/openxr/
- **Android NDK Guide:** https://developer.android.com/ndk/guides
- **SIGIL OS Issues:** https://github.com/fuzzynetwork1989-alt/SIGIL-OS/issues
