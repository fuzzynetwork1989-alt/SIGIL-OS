# Quest 3 Detailed Task Implementation Guide

**Version:** 1.0.0  
**Last Updated:** 2026-10-31  
**Target:** Meta Quest 3

---

## Overview

This guide provides detailed step-by-step instructions for completing the 6 remaining tasks for Quest 3 integration.

---

## Task 1: SDK Installation (Android SDK, NDK, Quest SDK, OpenXR)

### Overview

You need to install 4 major SDKs manually before you can build or deploy the Quest 3 app. This is a one-time setup that takes 1-2 hours.

---

### Step 1.1: Create Meta Developer Account (15 minutes)

**Why:** Required to download Quest SDK and enable Developer Mode on Quest 3.

**Steps:**

1. Go to https://developer.oculus.com/
2. Click "Sign Up" or log in with your existing Meta account
3. Choose your organization type:
   - **Individual:** For personal development (free)
   - **Company:** For commercial development (may require verification)
4. Verify your email address
5. Complete organization verification if required

**Verification:**
- You can access the Oculus Developer Dashboard
- You see your organization name in the dashboard

**Next:** Enable Developer Mode on Quest 3

---

### Step 1.2: Enable Developer Mode on Quest 3 (10 minutes)

**Why:** Required to deploy apps to Quest 3 via ADB.

**Steps:**

1. Install the Meta Quest app on your phone (if not already installed)
2. Open the Meta Quest app
3. Tap the **Menu** icon (headset icon) in the bottom right
4. Tap **Devices**
5. Select your Quest 3 headset
6. Scroll down to find **Developer Mode**
7. Toggle **Developer Mode** to ON
8. Confirm your account when prompted
9. Put on your Quest 3 headset
10. You should see a "Developer Mode Enabled" notification

**Verification:**
- Developer Mode toggle is ON in the Meta Quest app
- You see Developer Mode options in Quest 3 Settings → System → Developer

**Next:** Install Android Studio

---

### Step 1.3: Install Android Studio (30 minutes)

**Why:** Android Studio includes the SDK Manager for installing Android SDK/NDK and provides the IDE for building Quest apps.

**Steps:**

**Windows:**

1. Download Android Studio from https://developer.android.com/studio
2. Download the `.exe` installer (e.g., `android-studio-2023.1.1.28-windows.exe`)
3. Run the installer
4. Click **Next** through the installer wizard with default settings:
   - Installation location: `C:\Program Files\Android\Android Studio`
   - Android SDK location: `C:\Users\[YourUsername]\AppData\Local\Android\Sdk`
5. Click **Install**
6. Wait for installation to complete (5-10 minutes)
7. Click **Finish** to launch Android Studio
8. Complete the setup wizard:
   - Select **Standard** installation type
   - Accept the license agreement
   - Wait for components to download (Android SDK, SDK Platform-Tools, Android Emulator)
   - Click **Finish**

**macOS:**

1. Download Android Studio for Mac from https://developer.android.com/studio
2. Download the `.dmg` file (e.g., `android-studio-2023.1.1.28-mac.dmg`)
3. Open the `.dmg` file
4. Drag Android Studio to your Applications folder
5. Launch Android Studio from Applications
6. Complete the setup wizard (same as Windows)

**Linux:**

```bash
# Download Android Studio
wget https://redirector.gvt1.com/edgedl/android/studio/ide-zips/android-studio-2023.1.1.28-linux.tar.gz

# Extract
tar -xzf android-studio-*.tar.gz

# Move to /opt
sudo mv android-studio /opt/

# Create symbolic link
sudo ln -s /opt/android-studio/bin/studio.sh /usr/local/bin/android-studio

# Launch
android-studio
```

**Verification:**

```bash
# Check Android Studio version
android-studio --version

# Or check in Android Studio: Help → About
```

**Expected Output:** Version 2023.1.1 or later

**Next:** Install Android SDK and NDK

---

### Step 1.4: Install Android SDK (20 minutes)

**Why:** Required to build Android apps. Includes ADB for deploying to Quest 3.

**Steps:**

1. Open Android Studio
2. Go to **Tools → SDK Manager** (or click the SDK Manager icon in the toolbar)
3. In the **SDK Platforms** tab:
   - Check **Android 12L (API 32)** - Minimum for Quest 3
   - Check **Android 13 (API 33)** - Recommended
   - Check **Android 14 (API 34)** - Latest
4. In the **SDK Tools** tab:
   - Check **Android SDK Build-Tools 33.0.0** or later
   - Check **Android SDK Platform-Tools** (includes ADB)
   - Check **Android SDK Tools**
   - Check **Android Emulator** (optional, for testing without device)
5. Click **Apply**
6. Review the changes and click **OK**
7. Wait for download and installation (5-10 minutes)
8. Click **Finish**

**Set Environment Variables (Windows):**

```powershell
# Open PowerShell as Administrator
# Set ANDROID_HOME
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\Users\[YourUsername]\AppData\Local\Android\Sdk', 'User')

# Add to PATH
[System.Environment]::SetEnvironmentVariable('Path', $env:Path + ';C:\Users\[YourUsername]\AppData\Local\Android\Sdk\platform-tools', 'User')

# Restart PowerShell to apply changes
```

**Set Environment Variables (Linux/macOS):**

```bash
# Add to ~/.bashrc or ~/.zshrc
echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/emulator' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin' >> ~/.bashrc

# Reload shell
source ~/.bashrc
```

**Verification:**

```bash
# Check ADB version
adb version

# Should output: Android Debug Bridge version X.X.X
```

**Expected Output:** ADB version displays successfully

**Next:** Install Android NDK

---

### Step 1.5: Install Android NDK (15 minutes)

**Why:** Required to compile native C/C++ code for Android/Quest.

**Steps:**

1. Open Android Studio
2. Go to **Tools → SDK Manager**
3. In the **SDK Tools** tab:
   - Check **NDK (Side by side)**
   - Check **CMake** (required for native builds)
4. Click **Apply**
5. Review the changes and click **OK**
6. Wait for download and installation (5-10 minutes)
7. Click **Finish**

**Set Environment Variables (Windows):**

```powershell
# Open PowerShell as Administrator
# Set ANDROID_NDK_HOME (version may vary)
[System.Environment]::SetEnvironmentVariable('ANDROID_NDK_HOME', 'C:\Users\[YourUsername]\AppData\Local\Android\Sdk\ndk\25.2.9519653', 'User')

# Add to PATH
[System.Environment]::SetEnvironmentVariable('Path', $env:Path + ';C:\Users\[YourUsername]\AppData\Local\Android\Sdk\ndk\25.2.9519653', 'User')

# Restart PowerShell to apply changes
```

**Set Environment Variables (Linux/macOS):**

```bash
# Add to ~/.bashrc or ~/.zshrc
echo 'export ANDROID_NDK_HOME=$ANDROID_HOME/ndk/25.2.9519653' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_NDK_HOME' >> ~/.bashrc

# Reload shell
source ~/.bashrc
```

**Verification:**

```bash
# Check NDK path
echo $ANDROID_NDK_HOME

# Should output path to NDK directory
```

**Expected Output:** Path to NDK directory displays

**Next:** Download and install Quest SDK

---

### Step 1.6: Install Meta Quest SDK (20 minutes)

**Why:** Required to access Quest-specific APIs (hand tracking, passthrough, spatial mapping, etc.).

**Steps:**

1. Go to https://developer.oculus.com/downloads/package/oculus-mobile-sdk/
2. Log in with your Meta developer account
3. Download the latest version:
   - **Windows:** `OculusMobileSDK_Windows_v66.zip` (or latest)
   - **macOS:** `OculusMobileSDK_Mac_v66.zip` (or latest)
   - **Linux:** `OculusMobileSDK_Linux_v66.zip` (or latest)
4. Extract the ZIP file to a development directory:
   - **Windows:** Extract to `C:\OculusMobileSDK`
   - **macOS/Linux:** Extract to `~/OculusMobileSDK`

**Set Environment Variables (Windows):**

```powershell
# Open PowerShell as Administrator
# Set QUEST_SDK
[System.Environment]::SetEnvironmentVariable('QUEST_SDK', 'C:\OculusMobileSDK', 'User')

# Add to PATH
[System.Environment]::SetEnvironmentVariable('Path', $env:Path + ';C:\OculusMobileSDK\Tools', 'User')

# Restart PowerShell to apply changes
```

**Set Environment Variables (Linux/macOS):**

```bash
# Add to ~/.bashrc or ~/.zshrc
echo 'export QUEST_SDK=$HOME/OculusMobileSDK' >> ~/.bashrc
echo 'export PATH=$PATH:$QUEST_SDK/Tools' >> ~/.bashrc

# Reload shell
source ~/.bashrc
```

**Verification:**

```bash
# Check Quest SDK path
echo $QUEST_SDK

# List Quest SDK contents
ls $QUEST_SDK

# Should show directories like: 1stParty, Samples, Tools, etc.
```

**Expected Output:** Quest SDK directory contents display

**Next:** Install OpenXR

---

### Step 1.7: Install OpenXR Loader (15 minutes)

**Why:** Required for cross-platform XR development. OpenXR is the standard API for VR/AR.

**Steps:**

**Windows:**

1. Go to https://github.com/KhronosGroup/OpenXR-SDK/releases
2. Download the latest release:
   - Download `openxr-sdk-windows-x64.zip` (or similar)
3. Extract the ZIP file
4. Copy the extracted contents to `C:\Program Files\OpenXR`
5. Set environment variables:

```powershell
# Open PowerShell as Administrator
# Set OPENXR_SDK
[System.Environment]::SetEnvironmentVariable('OPENXR_SDK', 'C:\Program Files\OpenXR', 'User')

# Add to PATH
[System.Environment]::SetEnvironmentVariable('Path', $env:Path + ';C:\Program Files\OpenXR\bin', 'User')

# Restart PowerShell to apply changes
```

**Linux:**

```bash
# Install via package manager (Ubuntu/Debian)
sudo apt update
sudo apt install libopenxr-loader-dev

# Or build from source
git clone https://github.com/KhronosGroup/OpenXR-SDK.git
cd OpenXR-SDK
mkdir build && cd build
cmake ..
make
sudo make install
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
# Check OpenXR installation
ls /usr/local/lib/libopenxr*  # Linux/macOS
dir "C:\Program Files\OpenXR\bin"  # Windows
```

**Expected Output:** OpenXR library files display

**Next:** Install Rust Android targets

---

### Step 1.8: Install Rust Android Targets (10 minutes)

**Why:** Required to compile Rust code for Android/Quest (if using Rust for native code).

**Steps:**

```bash
# Add Android targets to Rust
rustup target add aarch64-linux-android  # ARM64 (Quest 3)
rustup target add armv7-linux-androideabi  # ARM32 (legacy)
rustup target add i686-linux-android  # x86 (emulator)
rustup target add x86_64-linux-android  # x86_64 (emulator)

# Install cargo-apk for building APKs from Rust
cargo install cargo-apk
```

**Verification:**

```bash
# List installed targets
rustup target list --installed

# Should show: aarch64-linux-android, armv7-linux-androideabi, etc.

# Check cargo-apk
cargo apk --version
```

**Expected Output:** Android targets listed, cargo-apk version displays

**Next:** Enable USB Debugging on Quest 3

---

### Step 1.9: Enable USB Debugging on Quest 3 (10 minutes)

**Why:** Required to deploy apps to Quest 3 via ADB.

**Steps:**

1. Connect Quest 3 to your computer via USB-C cable (USB 3.0+ recommended)
2. Put on your Quest 3 headset
3. Open **Settings**
4. Go to **System**
5. Go to **Developer**
6. Enable **USB Connection**
7. Select **File Transfer** or **ADB**
8. A dialog will appear on your headset: "Allow USB debugging?"
9. Check **Always allow from this computer**
10. Click **Allow**

**Verification:**

```bash
# Check ADB connection
adb devices

# Should show your Quest 3 device ID, e.g.:
# List of devices attached
# 1WMHH811Y1111    device
```

**Expected Output:** Quest 3 device ID displays with "device" status

**Troubleshooting:**

If ADB doesn't recognize the device:

```bash
# Restart ADB server
adb kill-server
adb start-server

# Check device again
adb devices

# If still not working:
# - Try a different USB cable (must be USB 3.0+)
# - Try a different USB port
# - Ensure USB Debugging is enabled on Quest 3
# - Disconnect and reconnect the headset
```

**Next:** Configure Quest SDK path in CMakeLists.txt

---

### Step 1.10: Configure Quest SDK Path (5 minutes)

**Why:** The native C++ build needs to know where the Quest SDK is located.

**Steps:**

1. Open `experience-surfaces/quest/android/app/src/main/cpp/CMakeLists.txt`
2. Find this line:

```cmake
set(QUEST_SDK_PATH "${CMAKE_SOURCE_DIR}/../../../OculusMobileSDK" CACHE PATH "Path to Quest SDK")
```

3. Update it to your actual Quest SDK path:

**Windows:**
```cmake
set(QUEST_SDK_PATH "C:/OculusMobileSDK" CACHE PATH "Path to Quest SDK")
```

**Linux/macOS:**
```cmake
set(QUEST_SDK_PATH "$ENV{HOME}/OculusMobileSDK" CACHE PATH "Path to Quest SDK")
```

4. Save the file

**Verification:**

Try to build the project (see Task 2 for build instructions).

**Next:** Build the APK to verify SDK installation

---

### Step 1.11: Verify SDK Installation (10 minutes)

**Why:** Ensure all SDKs are correctly installed and configured.

**Steps:**

```bash
# Navigate to Android project
cd experience-surfaces/quest/android

# Build debug APK
./gradlew assembleDebug

# If build succeeds, SDKs are correctly installed
# If build fails, check error messages for missing SDKs
```

**Expected Output:** Build succeeds with `BUILD SUCCESSFUL` message

**Troubleshooting:**

If build fails with SDK-related errors:

1. **Android SDK not found:**
   - Check `ANDROID_HOME` environment variable
   - Reinstall Android SDK via Android Studio SDK Manager

2. **NDK not found:**
   - Check `ANDROID_NDK_HOME` environment variable
   - Reinstall NDK via Android Studio SDK Manager

3. **Quest SDK not found:**
   - Check `QUEST_SDK_PATH` in CMakeLists.txt
   - Verify Quest SDK is extracted to correct location

4. **OpenXR not found:**
   - Check `OPENXR_SDK` environment variable
   - Reinstall OpenXR

**Completion Checklist:**

- [ ] Meta Developer Account created
- [ ] Developer Mode enabled on Quest 3
- [ ] Android Studio installed
- [ ] Android SDK installed (API 32+)
- [ ] Android NDK installed (r25.2.9519653+)
- [ ] Quest SDK installed and extracted
- [ ] OpenXR installed
- [ ] Rust Android targets installed
- [ ] USB Debugging enabled on Quest 3
- [ ] ADB recognizes Quest 3 device
- [ ] Quest SDK path configured in CMakeLists.txt
- [ ] APK builds successfully

**Estimated Total Time:** 2-3 hours

**Next:** Proceed to Task 2: SDK Integration

---

## Task 2: SDK Integration (Replace TODO Comments with Actual Quest SDK Calls)

### Overview

The Java and C++ code has TODO comments where actual Quest SDK calls should be. This task involves replacing those TODOs with real SDK integrations.

---

### Step 2.1: Integrate OpenXR in Native Code (2 hours)

**File:** `experience-surfaces/quest/android/app/src/main/cpp/native-lib.cpp`

**Current State:** Basic OpenXR instance creation only

**What to Add:**

1. **OpenXR Session Management**

Replace the TODO in `nativeOnCreate` with full session initialization:

```cpp
// In nativeOnCreate, after creating instance:

// Get system
XrSystemGetInfo systemInfo{XR_TYPE_SYSTEM_GET_INFO};
systemInfo.formFactor = XR_FORM_FACTOR_HEAD_MOUNTED_DISPLAY;
XrResult result = xrGetSystem(g_instance, &systemInfo, &g_systemId);
if (result != XR_SUCCESS) {
    LOGE("Failed to get system: %d", result);
    return;
}

// Create session
XrSessionCreateInfo sessionCreateInfo{XR_TYPE_SESSION_CREATE_INFO};
sessionCreateInfo.systemId = g_systemId;
sessionCreateInfo.createFlags = 0;

// Android-specific session creation
XrGraphicsBindingOpenXRExtensionKHR graphicsBinding{XR_TYPE_GRAPHICS_BINDING_OPENXR_EXTENSION_KHR};
// TODO: Initialize graphics binding based on your graphics API (Vulkan, OpenGL ES, etc.)
sessionCreateInfo.next = &graphicsBinding;

result = xrCreateSession(g_instance, &sessionCreateInfo, &g_session);
if (result != XR_SUCCESS) {
    LOGE("Failed to create session: %d", result);
    return;
}

LOGI("OpenXR session created successfully");
```

2. **Space Management**

Add space management for tracking:

```cpp
// Add global variables
static XrSpace g_viewSpace = XR_NULL_HANDLE;
static XrSpace g_localSpace = XR_NULL_HANDLE;

// In nativeOnCreate, after creating session:

// Create view space
XrReferenceSpaceCreateInfo viewSpaceCreateInfo{XR_TYPE_REFERENCE_SPACE_CREATE_INFO};
viewSpaceCreateInfo.referenceSpaceType = XR_REFERENCE_SPACE_TYPE_VIEW;
XrResult result = xrCreateSpace(g_session, &viewSpaceCreateInfo, &g_viewSpace);
if (result != XR_SUCCESS) {
    LOGE("Failed to create view space: %d", result);
    return;
}

// Create local space for room-scale tracking
XrReferenceSpaceCreateInfo localSpaceCreateInfo{XR_TYPE_REFERENCE_SPACE_CREATE_INFO};
localSpaceCreateInfo.referenceSpaceType = XR_REFERENCE_SPACE_TYPE_LOCAL;
XrPosef identityPose = {
    .orientation = {0.0f, 0.0f, 0.0f, 1.0f},
    .position = {0.0f, 0.0f, 0.0f}
};
localSpaceCreateInfo.poseInReferenceSpace = identityPose;
result = xrCreateSpace(g_session, &localSpaceCreateInfo, &g_localSpace);
if (result != XR_SUCCESS) {
    LOGE("Failed to create local space: %d", result);
    return;
}

LOGI("OpenXR spaces created successfully");
```

3. **Frame Loop**

Add frame rendering loop:

```cpp
// Add to native-lib.cpp
void renderFrame() {
    XrFrameState frameState{XR_TYPE_FRAME_STATE};
    XrFrameWaitInfo frameWaitInfo{XR_TYPE_FRAME_WAIT_INFO};
    xrWaitFrame(g_session, &frameWaitInfo, &frameState);

    if (!frameState.shouldRender) {
        return;
    }

    XrFrameBeginInfo frameBeginInfo{XR_TYPE_FRAME_BEGIN_INFO};
    xrBeginFrame(g_session, &frameBeginInfo);

    // Get view locations
    XrViewState viewState{XR_TYPE_VIEW_STATE};
    XrViewLocateInfo viewLocateInfo{XR_TYPE_VIEW_LOCATE_INFO};
    viewLocateInfo.viewConfigurationType = XR_VIEW_CONFIGURATION_TYPE_PRIMARY_STEREO;
    viewLocateInfo.displayTime = frameState.predictedDisplayTime;
    viewLocateInfo.space = g_viewSpace;

    XrView views[2];
    XrViewStateFlags viewStateFlags;
    uint32_t viewCount;
    xrLocateViews(g_session, &viewLocateInfo, &viewState, 2, &viewCount, views);

    // TODO: Render views using your graphics API (Vulkan, OpenGL ES, etc.)

    XrFrameEndInfo frameEndInfo{XR_TYPE_FRAME_END_INFO};
    frameEndInfo.displayTime = frameState.predictedDisplayTime;
    frameEndInfo.environmentBlendMode = XR_ENVIRONMENT_BLEND_MODE_OPAQUE;
    frameEndInfo.layerCount = 0;
    frameEndInfo.layers = nullptr;
    xrEndFrame(g_session, &frameEndInfo);
}

// In nativeOnResume, start render loop
// In nativeOnPause, stop render loop
```

**Resources:**
- OpenXR Specification: https://www.khronos.org/registry/OpenXR/specs/1.0/html/xrspec.html
- OpenXR Tutorial: https://github.com/KhronosGroup/OpenXR-SDK-Source/tree/master/src/tests/conformance

---

### Step 2.2: Integrate Quest Hand Tracking SDK (3 hours)

**File:** `experience-surfaces/quest/android/app/src/main/java/com/sigilos/quest/HandTracking.java`

**Current State:** Placeholder TODO comments

**What to Add:**

1. **Add Quest SDK Dependencies**

Edit `experience-surfaces/quest/android/app/build.gradle`:

```gradle
dependencies {
    // Add Quest SDK dependencies
    implementation 'com.facebook.fbjni:fbjni:0.3.0'
    
    // Add Oculus Hand Tracking SDK (path may vary based on SDK version)
    implementation files('../../OculusMobileSDK/Libraries/Java/ovr_handtracking.jar')
}
```

2. **Initialize Hand Tracking SDK**

Replace TODO in `startTracking()`:

```java
import com.oculus.handtracking.HandTracking;
import com.oculus.handtracking.HandTrackingListener;

public class HandTracking {
    private HandTracking handTrackingSDK;
    private Context context;

    public HandTracking(Context context) {
        this.context = context;
        this.id = UUID.randomUUID().toString();
        this.active = false;
        this.hands = new ArrayList<>();
    }

    public void startTracking() {
        Log.i(TAG, "Starting hand tracking");
        
        // Initialize Quest hand tracking SDK
        handTrackingSDK = new HandTracking(context);
        
        // Set up listener
        handTrackingSDK.setListener(new HandTrackingListener() {
            @Override
            public void onHandDataUpdated(HandData handData) {
                // Process hand data
                updateHands(handData);
            }
            
            @Override
            public void onHandTrackingLost() {
                Log.w(TAG, "Hand tracking lost");
                hands.clear();
            }
        });
        
        // Start tracking
        handTrackingSDK.start();
        this.active = true;
    }
    
    private void updateHands(HandData handData) {
        // Convert Quest SDK HandData to our Hand structure
        hands.clear();
        
        for (Hand hand : handData.getHands()) {
            Hand ourHand = new Hand(
                UUID.randomUUID().toString(),
                hand.getHandType() == HandType.LEFT ? HandType.LEFT : HandType.RIGHT
            );
            
            // Add fingers
            for (Finger finger : hand.getFingers()) {
                ourHand.getFingers().add(new Finger(
                    UUID.randomUUID().toString(),
                    new float[]{finger.getPosition().x, finger.getPosition().y, finger.getPosition().z},
                    finger.isExtended()
                ));
            }
            
            hands.add(ourHand);
        }
    }
}
```

3. **Implement Gesture Recognition**

Replace TODO in `detectGesture()`:

```java
public Gesture detectGesture(Hand hand) {
    Log.i(TAG, "Detecting gesture");
    
    // Analyze finger positions and extensions
    List<Finger> fingers = hand.getFingers();
    
    // Count extended fingers
    int extendedCount = 0;
    for (Finger finger : fingers) {
        if (finger.isExtended()) {
            extendedCount++;
        }
    }
    
    // Detect gesture based on finger pattern
    if (extendedCount == 0) {
        return new Gesture(UUID.randomUUID().toString(), GestureType.FIST, 0.9f);
    } else if (extendedCount == 5) {
        return new Gesture(UUID.randomUUID().toString(), GestureType.OPEN_PALM, 0.9f);
    } else if (isPinchGesture(fingers)) {
        return new Gesture(UUID.randomUUID().toString(), GestureType.PINCH, 0.85f);
    } else if (isPointGesture(fingers)) {
        return new Gesture(UUID.randomUUID().toString(), GestureType.POINT, 0.85f);
    }
    
    return new Gesture(UUID.randomUUID().toString(), GestureType.OPEN_PALM, 0.5f);
}

private boolean isPinchGesture(List<Finger> fingers) {
    // Check if thumb and index finger are close together
    Finger thumb = fingers.get(0); // Assuming thumb is first
    Finger index = fingers.get(1); // Assuming index is second
    
    float distance = calculateDistance(thumb.getPosition(), index.getPosition());
    return distance < 0.05f; // 5cm threshold
}

private boolean isPointGesture(List<Finger> fingers) {
    // Check if only index finger is extended
    Finger index = fingers.get(1);
    if (!index.isExtended()) return false;
    
    for (int i = 0; i < fingers.size(); i++) {
        if (i != 1 && fingers.get(i).isExtended()) {
            return false;
        }
    }
    
    return true;
}

private float calculateDistance(float[] pos1, float[] pos2) {
    float dx = pos1[0] - pos2[0];
    float dy = pos1[1] - pos2[1];
    float dz = pos1[2] - pos2[2];
    return (float) Math.sqrt(dx*dx + dy*dy + dz*dz);
}
```

**Resources:**
- Quest Hand Tracking SDK Documentation: https://developer.oculus.com/documentation/native/android/mobile-hand-tracking/

---

### Step 2.3: Integrate Quest Spatial Mapping SDK (3 hours)

**File:** `experience-surfaces/quest/android/app/src/main/java/com/sigilos/quest/SpatialMapping.java`

**Current State:** Placeholder TODO comments

**What to Add:**

1. **Add Quest SDK Dependencies**

Edit `experience-surfaces/quest/android/app/build.gradle`:

```gradle
dependencies {
    // Add Quest Spatial Mapping SDK
    implementation files('../../OculusMobileSDK/Libraries/Java/ovr_spatial_mapping.jar')
}
```

2. **Initialize Spatial Mapping SDK**

Replace TODO in `startMapping()`:

```java
import com.oculus.spatialmapping.SpatialMapping;
import com.oculus.spatialmapping.SpatialMappingListener;

public class SpatialMapping {
    private SpatialMapping spatialMappingSDK;
    private Context context;

    public SpatialMapping(Context context) {
        this.context = context;
        this.id = UUID.randomUUID().toString();
        this.active = false;
        this.meshes = new ArrayList<>();
    }

    public void startMapping() {
        Log.i(TAG, "Starting spatial mapping");
        
        // Initialize Quest spatial mapping SDK
        spatialMappingSDK = new SpatialMapping(context);
        
        // Set up listener
        spatialMappingSDK.setListener(new SpatialMappingListener() {
            @Override
            public void onMeshGenerated(MeshData meshData) {
                // Process generated mesh
                addMesh(meshData);
            }
            
            @Override
            public void onMappingComplete() {
                Log.i(TAG, "Spatial mapping complete");
            }
        });
        
        // Start mapping
        spatialMappingSDK.startScanning();
        this.active = true;
    }
    
    private void addMesh(MeshData meshData) {
        // Convert Quest SDK MeshData to our Mesh structure
        Mesh mesh = new Mesh(
            UUID.randomUUID().toString(),
            meshData.getVertices(),
            meshData.getTriangles()
        );
        meshes.add(mesh);
    }
}
```

3. **Implement Room Scanning**

Replace TODO in `scanRoom()`:

```java
public SceneUnderstanding scanRoom() {
    Log.i(TAG, "Scanning room");
    
    // Request room scan from Quest SDK
    RoomScanResult scanResult = spatialMappingSDK.scanRoom();
    
    // Analyze scan results
    List<String> detectedObjects = new ArrayList<>();
    String sceneType = "unknown";
    
    // Detect objects from mesh data
    for (Mesh mesh : meshes) {
        // Use object detection on mesh
        String objectType = classifyMesh(mesh);
        if (objectType != null && !detectedObjects.contains(objectType)) {
            detectedObjects.add(objectType);
        }
    }
    
    // Classify scene type based on detected objects
    if (detectedObjects.contains("desk") && detectedObjects.contains("monitor")) {
        sceneType = "office";
    } else if (detectedObjects.contains("couch") && detectedObjects.contains("tv")) {
        sceneType = "living_room";
    } else if (detectedObjects.contains("bed")) {
        sceneType = "bedroom";
    }
    
    return new SceneUnderstanding(UUID.randomUUID().toString(), detectedObjects, sceneType);
}

private String classifyMesh(Mesh mesh) {
    // TODO: Use Model Fabric for object classification
    // For now, return null (requires ML model)
    return null;
}
```

**Resources:**
- Quest Spatial Mapping Documentation: https://developer.oculus.com/documentation/native/android/mobile-spatial-mapping/

---

### Step 2.4: Integrate Quest Passthrough SDK (2 hours)

**File:** `experience-surfaces/quest/android/app/src/main/java/com/sigilos/quest/MixedReality.java`

**Current State:** Placeholder TODO comments

**What to Add:**

1. **Add Quest SDK Dependencies**

Edit `experience-surfaces/quest/android/app/build.gradle`:

```gradle
dependencies {
    // Add Quest Passthrough SDK
    implementation files('../../OculusMobileSDK/Libraries/Java/ovr_passthrough.jar')
}
```

2. **Initialize Passthrough SDK**

Replace TODO in `enablePassthrough()`:

```java
import com.oculus.passthrough.Passthrough;
import com.oculus.passthrough.PassthroughListener;

public class MixedReality {
    private Passthrough passthroughSDK;
    private Context context;

    public MixedReality(Context context) {
        this.context = context;
        this.id = UUID.randomUUID().toString();
        this.passthroughEnabled = false;
        this.anchors = new ArrayList<>();
    }

    public void enablePassthrough() {
        Log.i(TAG, "Enabling passthrough");
        
        // Initialize Quest passthrough SDK
        passthroughSDK = new Passthrough(context);
        
        // Set up listener
        passthroughSDK.setListener(new PassthroughListener() {
            @Override
            public void onPassthroughReady() {
                Log.i(TAG, "Passthrough ready");
            }
            
            @Override
            public void onPassthroughError(int errorCode) {
                Log.e(TAG, "Passthrough error: " + errorCode);
            }
        });
        
        // Enable passthrough
        passthroughSDK.enable();
        this.passthroughEnabled = true;
    }
    
    public void disablePassthrough() {
        Log.i(TAG, "Disabling passthrough");
        
        if (passthroughSDK != null) {
            passthroughSDK.disable();
        }
        
        this.passthroughEnabled = false;
    }
}
```

3. **Implement MR Rendering**

Replace TODO in `blendContent()`:

```java
public void blendContent() {
    Log.i(TAG, "Blending virtual and real content");
    
    if (!passthroughEnabled) {
        Log.w(TAG, "Passthrough not enabled");
        return;
    }
    
    // Configure passthrough layer
    PassthroughLayer layer = passthroughSDK.createLayer();
    layer.setOpacity(0.8f); // 80% opacity for real world
    layer.setQuality(PassthroughQuality.HIGH);
    
    // Render virtual content on top
    // TODO: Integrate with your rendering engine (Unity, custom renderer, etc.)
    // The rendering engine should use the passthrough layer as background
}
```

**Resources:**
- Quest Passthrough Documentation: https://developer.oculus.com/documentation/native/android/mobile-passthrough/

---

### Step 2.5: Integrate Quest Eye Tracking SDK (2 hours)

**File:** `experience-surfaces/quest/android/app/src/main/java/com/sigilos/quest/EyeTracking.java`

**Current State:** Placeholder TODO comments

**What to Add:**

1. **Add Quest SDK Dependencies**

Edit `experience-surfaces/quest/android/app/build.gradle`:

```gradle
dependencies {
    // Add Quest Eye Tracking SDK
    implementation files('../../OculusMobileSDK/Libraries/Java/ovr_eyetracking.jar')
}
```

2. **Initialize Eye Tracking SDK**

Replace TODO in `startTracking()`:

```java
import com.oculus.eyetracking.EyeTracking;
import com.oculus.eyetracking.EyeTrackingListener;

public class EyeTracking {
    private EyeTracking eyeTrackingSDK;
    private Context context;

    public EyeTracking(Context context) {
        this.context = context;
        this.id = UUID.randomUUID().toString();
        this.active = false;
        this.currentGaze = new GazeData();
    }

    public void startTracking() {
        Log.i(TAG, "Starting eye tracking");
        
        // Initialize Quest eye tracking SDK
        eyeTrackingSDK = new EyeTracking(context);
        
        // Set up listener
        eyeTrackingSDK.setListener(new EyeTrackingListener() {
            @Override
            public void onGazeDataUpdated(GazeData gazeData) {
                // Process gaze data
                currentGaze = gazeData;
            }
            
            @Override
            public void onEyeTrackingLost() {
                Log.w(TAG, "Eye tracking lost");
            }
        });
        
        // Start tracking
        eyeTrackingSDK.start();
        this.active = true;
    }
}
```

3. **Implement Gaze-Based Commands**

Replace TODOs in gaze command methods:

```java
public void processWhatAmILookingAt() {
    Log.i(TAG, "Processing: What am I looking at?");
    
    // Get current gaze data
    GazeData gaze = getGazeData();
    
    // Raycast from gaze origin in gaze direction
    float[] hitPoint = raycast(gaze.getOrigin(), gaze.getDirection());
    
    if (hitPoint != null) {
        // Find object at hit point using spatial mapping
        String object = findObjectAtPosition(hitPoint);
        
        // TODO: Send to Cognitive Assembly for explanation
        // TODO: Use Reasoner to provide context
        Log.i(TAG, "Looking at: " + object);
    }
}

public void processRememberThis() {
    Log.i(TAG, "Processing: Remember this.");
    
    // Get current gaze data
    GazeData gaze = getGazeData();
    
    // Raycast to find object
    float[] hitPoint = raycast(gaze.getOrigin(), gaze.getDirection());
    
    if (hitPoint != null) {
        String object = findObjectAtPosition(hitPoint);
        
        // TODO: Send to Memory Engine for storage
        // TODO: Associate with spatial context
        Log.i(TAG, "Remembering: " + object);
    }
}

public void processExplainThis() {
    Log.i(TAG, "Processing: Explain this.");
    
    // Get current gaze data
    GazeData gaze = getGazeData();
    
    // Raycast to find object
    float[] hitPoint = raycast(gaze.getOrigin(), gaze.getDirection());
    
    if (hitPoint != null) {
        String object = findObjectAtPosition(hitPoint);
        
        // TODO: Send to Cognitive Assembly for explanation
        // TODO: Use World Model for context
        Log.i(TAG, "Explaining: " + object);
    }
}

private float[] raycast(float[] origin, float[] direction) {
    // TODO: Implement raycast using spatial mapping data
    // Return hit point or null if no hit
    return null;
}

private String findObjectAtPosition(float[] position) {
    // TODO: Find object at position using spatial mapping
    return "unknown";
}
```

**Resources:**
- Quest Eye Tracking Documentation: https://developer.oculus.com/documentation/native/android/mobile-eye-tracking/

---

### Step 2.6: Integrate Quest Voice Recognition SDK (3 hours)

**File:** `experience-surfaces/quest/android/app/src/main/java/com/sigilos/quest/VoiceAssistant.java`

**Current State:** Placeholder TODO comments

**What to Add:**

1. **Add Quest SDK Dependencies**

Edit `experience-surfaces/quest/android/app/build.gradle`:

```gradle
dependencies {
    // Add Quest Voice SDK
    implementation files('../../OculusMobileSDK/Libraries/Java/ovr_voice.jar')
}
```

2. **Initialize Voice Recognition SDK**

Replace TODO in `startListening()`:

```java
import com.oculus.voice.VoiceRecognition;
import com.oculus.voice.VoiceRecognitionListener;

public class VoiceAssistant {
    private VoiceRecognition voiceRecognitionSDK;
    private Context context;

    public VoiceAssistant(Context context) {
        this.context = context;
        this.id = UUID.randomUUID().toString();
        this.listening = false;
        this.speaking = false;
        this.language = "en-US";
    }

    public void startListening() {
        Log.i(TAG, "Starting voice recognition");
        
        // Initialize Quest voice recognition SDK
        voiceRecognitionSDK = new VoiceRecognition(context);
        
        // Set up listener
        voiceRecognitionSDK.setListener(new VoiceRecognitionListener() {
            @Override
            public void onVoiceCommandRecognized(String command, float confidence) {
                Log.i(TAG, "Voice command recognized: " + command + " (confidence: " + confidence + ")");
                
                // Create voice command
                VoiceCommand voiceCommand = new VoiceCommand(
                    UUID.randomUUID().toString(),
                    command,
                    confidence
                );
                
                // Process command
                processCommandInternal(voiceCommand);
            }
            
            @Override
            public void onVoiceRecognitionError(int errorCode) {
                Log.e(TAG, "Voice recognition error: " + errorCode);
            }
        });
        
        // Start listening
        voiceRecognitionSDK.startListening(language);
        this.listening = true;
    }
    
    private void processCommandInternal(VoiceCommand command) {
        // TODO: Connect to Model Fabric for intent detection
        // TODO: Send command to Cognitive Assembly
        Log.i(TAG, "Processing command: " + command.getCommand());
    }
}
```

3. **Initialize Text-to-Speech SDK**

Replace TODO in `speak()`:

```java
import com.oculus.voice.TextToSpeech;

public class VoiceAssistant {
    private TextToSpeech ttsSDK;

    public void speak(String text) {
        Log.i(TAG, "Speaking: " + text);
        
        // Initialize TTS SDK if not already initialized
        if (ttsSDK == null) {
            ttsSDK = new TextToSpeech(context);
        }
        
        // Speak text
        ttsSDK.speak(text, language, new TextToSpeechListener() {
            @Override
            public void onSpeechStarted() {
                speaking = true;
            }
            
            @Override
            public void onSpeechCompleted() {
                speaking = false;
            }
            
            @Override
            public void onSpeechError(int errorCode) {
                Log.e(TAG, "TTS error: " + errorCode);
                speaking = false;
            }
        });
    }
}
```

**Resources:**
- Quest Voice SDK Documentation: https://developer.oculus.com/documentation/native/android/mobile-voice-commands/

---

### Step 2.7: Integrate Quest Camera SDK (2 hours)

**File:** `experience-surfaces/quest/android/app/src/main/java/com/sigilos/quest/VisionProcessor.java`

**Current State:** Placeholder TODO comments

**What to Add:**

1. **Add Quest SDK Dependencies**

Edit `experience-surfaces/quest/android/app/build.gradle`:

```gradle
dependencies {
    // Add Quest Camera SDK
    implementation files('../../OculusMobileSDK/Libraries/Java/ovr_camera.jar')
}
```

2. **Initialize Camera SDK**

Replace TODO in `initializeCamera()`:

```java
import com.oculus.camera.Camera;
import com.oculus.camera.CameraListener;

public class VisionProcessor {
    private Camera cameraSDK;
    private Context context;

    public VisionProcessor(Context context) {
        this.context = context;
        this.id = UUID.randomUUID().toString();
        this.cameraInitialized = false;
        this.hasPermission = false;
    }

    public void initializeCamera() {
        Log.i(TAG, "Initializing camera");
        
        // Check permission
        if (!hasPermission) {
            Log.w(TAG, "Camera permission not granted");
            return;
        }
        
        // Initialize Quest camera SDK
        cameraSDK = new Camera(context);
        
        // Set up listener
        cameraSDK.setListener(new CameraListener() {
            @Override
            public void onFrameCaptured(byte[] frameData, int width, int height) {
                // Process frame
                processFrameInternal(frameData, width, height);
            }
            
            @Override
            public void onCameraError(int errorCode) {
                Log.e(TAG, "Camera error: " + errorCode);
            }
        });
        
        // Start camera
        cameraSDK.start();
        this.cameraInitialized = true;
    }
    
    private void processFrameInternal(byte[] frameData, int width, int height) {
        // TODO: Send frame to Model Fabric for vision understanding
        // TODO: Detect objects, text, scenes
        Log.i(TAG, "Processing frame: " + width + "x" + height);
    }
}
```

3. **Request Camera Permission**

Replace TODO in `requestCameraPermission()`:

```java
import android.Manifest;
import android.content.pm.PackageManager;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

public class VisionProcessor {
    private static final int CAMERA_PERMISSION_REQUEST_CODE = 1001;
    private Activity activity;

    public void requestCameraPermission() {
        Log.i(TAG, "Requesting camera permission");
        
        // Check if permission is already granted
        if (ContextCompat.checkSelfPermission(activity, Manifest.permission.CAMERA) 
            == PackageManager.PERMISSION_GRANTED) {
            hasPermission = true;
            return;
        }
        
        // Request permission
        ActivityCompat.requestPermissions(
            activity,
            new String[]{Manifest.permission.CAMERA},
            CAMERA_PERMISSION_REQUEST_CODE
        );
    }
    
    // Call this from Activity's onRequestPermissionsResult
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        if (requestCode == CAMERA_PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                hasPermission = true;
                Log.i(TAG, "Camera permission granted");
            } else {
                hasPermission = false;
                Log.w(TAG, "Camera permission denied");
            }
        }
    }
}
```

**Resources:**
- Quest Camera Documentation: https://developer.oculus.com/documentation/native/android/mobile-camera/

---

### Step 2.8: Build and Test SDK Integrations (2 hours)

**Steps:**

1. **Build the APK**

```bash
cd experience-surfaces/quest/android
./gradlew assembleDebug
```

2. **Deploy to Quest 3**

```bash
cd experience-surfaces/quest
deploy-quest.bat
```

3. **Test Each SDK Integration**

**Test Hand Tracking:**
- Put on Quest 3 headset
- Launch SIGIL OS
- Hold up your hands
- Verify hand tracking activates
- Verify gestures are detected

**Test Spatial Mapping:**
- Walk around room
- Verify spatial mapping starts
- Verify mesh generation

**Test Passthrough:**
- Enable passthrough
- Verify MR rendering works
- Verify virtual/real content blends

**Test Eye Tracking:**
- Look at objects
- Verify gaze tracking works
- Test gaze-based commands

**Test Voice Recognition:**
- Speak commands
- Verify voice recognition works
- Verify TTS works

**Test Camera:**
- Grant camera permission
- Verify camera initializes
- Verify frame capture works

**Completion Checklist:**

- [ ] OpenXR integrated in native code
- [ ] Hand Tracking SDK integrated
- [ ] Spatial Mapping SDK integrated
- [ ] Passthrough SDK integrated
- [ ] Eye Tracking SDK integrated
- [ ] Voice Recognition SDK integrated
- [ ] TTS SDK integrated
- [ ] Camera SDK integrated
- [ ] All SDKs tested on Quest 3 device
- [ ] APK builds successfully
- [ ] All features work on device

**Estimated Total Time:** 17-20 hours

**Next:** Proceed to Task 3: Model Fabric Connection

---

## Task 3: Model Fabric Connection (Voice and Vision Processing)

### Overview

Model Fabric is SIGIL OS's model management system. This task involves connecting the Quest runtime to Model Fabric for voice intent detection and vision understanding.

---

### Step 3.1: Understand Model Fabric API (1 hour)

**What is Model Fabric?**

Model Fabric is located in `sigil-core/model-fabric/` and provides:
- Model loading and management
- Inference execution
- Multiple model support (Qwen, NEXORA, etc.)
- Model routing and selection

**Review Model Fabric Code:**

```bash
# Read Model Fabric source
read sigil-core/model-fabric/src/lib.rs
read sigil-core/model-fabric/src/inference.rs
```

**Key APIs to Use:**

1. **Model Loading:**
```rust
model_fabric.load_model("qwen-7b")
```

2. **Inference:**
```rust
model_fabric.inference(prompt, model_id)
```

3. **Voice Intent Detection:**
```rust
model_fabric.detect_intent(audio)
```

4. **Vision Processing:**
```rust
model_fabric.process_vision(image)
```

---

### Step 3.2: Add Model Fabric HTTP Client (2 hours)

**File:** Create `experience-surfaces/quest/android/app/src/main/java/com/sigilos/quest/ModelFabricClient.java`

**What to Add:**

```java
package com.sigilos.quest;

import android.util.Log;
import org.json.JSONObject;
import org.json.JSONArray;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

/**
 * HTTP Client for Model Fabric API.
 * Connects Quest runtime to SIGIL OS Model Fabric service.
 */
public class ModelFabricClient {
    private static final String TAG = "ModelFabricClient";
    
    private String baseUrl;
    private String apiKey;
    
    public ModelFabricClient(String baseUrl, String apiKey) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
    }
    
    /**
     * Detect intent from voice command.
     */
    public IntentDetectionResult detectIntent(String command) {
        Log.i(TAG, "Detecting intent from: " + command);
        
        try {
            JSONObject requestBody = new JSONObject();
            requestBody.put("command", command);
            requestBody.put("model", "qwen-7b");
            
            HttpURLConnection conn = createConnection("/api/v1/intent/detect", "POST");
            conn.setDoOutput(true);
            
            OutputStream os = conn.getOutputStream();
            os.write(requestBody.toString().getBytes(StandardCharsets.UTF_8));
            os.flush();
            os.close();
            
            int responseCode = conn.getResponseCode();
            if (responseCode == 200) {
                BufferedReader br = new BufferedReader(
                    new InputStreamReader(conn.getInputStream())
                );
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    response.append(line);
                }
                br.close();
                
                JSONObject jsonResponse = new JSONObject(response.toString());
                return parseIntentDetectionResult(jsonResponse);
            } else {
                Log.e(TAG, "Intent detection failed: " + responseCode);
                return null;
            }
        } catch (Exception e) {
            Log.e(TAG, "Intent detection error", e);
            return null;
        }
    }
    
    /**
     * Process vision frame.
     */
    public VisionResult processVision(byte[] imageBytes) {
        Log.i(TAG, "Processing vision frame");
        
        try {
            // Convert image to base64
            String base64Image = android.util.Base64.encodeToString(
                imageBytes, 
                android.util.Base64.DEFAULT
            );
            
            JSONObject requestBody = new JSONObject();
            requestBody.put("image", base64Image);
            requestBody.put("model", "qwen-vl");
            
            HttpURLConnection conn = createConnection("/api/v1/vision/process", "POST");
            conn.setDoOutput(true);
            
            OutputStream os = conn.getOutputStream();
            os.write(requestBody.toString().getBytes(StandardCharsets.UTF_8));
            os.flush();
            os.close();
            
            int responseCode = conn.getResponseCode();
            if (responseCode == 200) {
                BufferedReader br = new BufferedReader(
                    new InputStreamReader(conn.getInputStream())
                );
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    response.append(line);
                }
                br.close();
                
                JSONObject jsonResponse = new JSONObject(response.toString());
                return parseVisionResult(jsonResponse);
            } else {
                Log.e(TAG, "Vision processing failed: " + responseCode);
                return null;
            }
        } catch (Exception e) {
            Log.e(TAG, "Vision processing error", e);
            return null;
        }
    }
    
    /**
     * Create HTTP connection.
     */
    private HttpURLConnection createConnection(String endpoint, String method) throws Exception {
        URL url = new URL(baseUrl + endpoint);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod(method);
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("Authorization", "Bearer " + apiKey);
        conn.setConnectTimeout(10000);
        conn.setReadTimeout(10000);
        return conn;
    }
    
    /**
     * Parse intent detection result.
     */
    private IntentDetectionResult parseIntentDetectionResult(JSONObject json) {
        String intent = json.optString("intent", "unknown");
        float confidence = (float) json.optDouble("confidence", 0.0);
        JSONObject entities = json.optJSONObject("entities");
        
        return new IntentDetectionResult(intent, confidence, entities);
    }
    
    /**
     * Parse vision result.
     */
    private VisionResult parseVisionResult(JSONObject json) {
        JSONArray objects = json.optJSONArray("objects");
        String[] detectedObjects = new String[objects.length()];
        for (int i = 0; i < objects.length(); i++) {
            detectedObjects[i] = objects.getString(i);
        }
        
        String sceneType = json.optString("scene_type", "unknown");
        float confidence = (float) json.optDouble("confidence", 0.0);
        
        return new VisionResult(detectedObjects, sceneType, confidence);
    }
    
    /**
     * Intent detection result.
     */
    public static class IntentDetectionResult {
        public String intent;
        public float confidence;
        public JSONObject entities;
        
        public IntentDetectionResult(String intent, float confidence, JSONObject entities) {
            this.intent = intent;
            this.confidence = confidence;
            this.entities = entities;
        }
    }
    
    /**
     * Vision result.
     */
    public static class VisionResult {
        public String[] detectedObjects;
        public String sceneType;
        public float confidence;
        
        public VisionResult(String[] detectedObjects, String sceneType, float confidence) {
            this.detectedObjects = detectedObjects;
            this.sceneType = sceneType;
            this.confidence = confidence;
        }
    }
}
```

---

### Step 3.3: Integrate Model Fabric in Voice Assistant (1 hour)

**File:** `experience-surfaces/quest/android/app/src/main/java/com/sigilos/quest/VoiceAssistant.java`

**What to Add:**

```java
public class VoiceAssistant {
    private ModelFabricClient modelFabricClient;
    
    public VoiceAssistant(Context context, String modelFabricUrl, String apiKey) {
        this.context = context;
        this.id = UUID.randomUUID().toString();
        this.listening = false;
        this.speaking = false;
        this.language = "en-US";
        
        // Initialize Model Fabric client
        this.modelFabricClient = new ModelFabricClient(modelFabricUrl, apiKey);
    }
    
    private void processCommandInternal(VoiceCommand command) {
        Log.i(TAG, "Processing command: " + command.getCommand());
        
        // Detect intent using Model Fabric
        ModelFabricClient.IntentDetectionResult intentResult = 
            modelFabricClient.detectIntent(command.getCommand());
        
        if (intentResult != null) {
            Log.i(TAG, "Intent detected: " + intentResult.intent + 
                      " (confidence: " + intentResult.confidence + ")");
            
            // TODO: Send intent to Cognitive Assembly
            // TODO: Route to appropriate action based on intent
        } else {
            Log.w(TAG, "Intent detection failed");
        }
    }
}
```

---

### Step 3.4: Integrate Model Fabric in Vision Processor (1 hour)

**File:** `experience-surfaces/quest/android/app/src/main/java/com/sigilos/quest/VisionProcessor.java`

**What to Add:**

```java
public class VisionProcessor {
    private ModelFabricClient modelFabricClient;
    
    public VisionProcessor(Context context, String modelFabricUrl, String apiKey) {
        this.context = context;
        this.id = UUID.randomUUID().toString();
        this.cameraInitialized = false;
        this.hasPermission = false;
        
        // Initialize Model Fabric client
        this.modelFabricClient = new ModelFabricClient(modelFabricUrl, apiKey);
    }
    
    private void processFrameInternal(byte[] frameData, int width, int height) {
        Log.i(TAG, "Processing frame: " + width + "x" + height);
        
        // Process vision using Model Fabric
        ModelFabricClient.VisionResult visionResult = 
            modelFabricClient.processVision(frameData);
        
        if (visionResult != null) {
            Log.i(TAG, "Objects detected: " + Arrays.toString(visionResult.detectedObjects));
            Log.i(TAG, "Scene type: " + visionResult.sceneType);
            
            // TODO: Send vision result to Cognitive Assembly
            // TODO: Update spatial memory with detected objects
        } else {
            Log.w(TAG, "Vision processing failed");
        }
    }
}
```

---

### Step 3.5: Start Model Fabric Service (1 hour)

**Steps:**

1. **Start SIGIL OS API Server**

```bash
# Navigate to sigil-core/api
cd sigil-core/api

# Start the API server (which includes Model Fabric)
cargo run

# Or use the provided script
cd ..
run-api.bat
```

2. **Verify Model Fabric is Running**

```bash
# Check health endpoint
curl http://localhost:8080/health

# Should return 200 OK with status information
```

3. **Configure Quest Runtime with Model Fabric URL**

Edit `experience-surfaces/quest/android/app/src/main/java/com/sigilos/quest/QuestRuntime.java`:

```java
public class QuestRuntime {
    private static final String MODEL_FABRIC_URL = "http://localhost:8080";
    private static final String MODEL_FABRIC_API_KEY = "your-api-key";
    
    public void initialize() {
        Log.i(TAG, "Initializing Quest Runtime");
        
        // Initialize runtime components with Model Fabric connection
        voiceAssistant = new VoiceAssistant(context, MODEL_FABRIC_URL, MODEL_FABRIC_API_KEY);
        visionProcessor = new VisionProcessor(context, MODEL_FABRIC_URL, MODEL_FABRIC_API_KEY);
        
        // ... rest of initialization
    }
}
```

---

### Step 3.6: Test Model Fabric Connection (1 hour)

**Steps:**

1. **Start Model Fabric Service** (see Step 3.5)

2. **Build and Deploy Quest App**

```bash
cd experience-surfaces/quest/android
./gradlew assembleDebug

cd ..
deploy-quest.bat
```

3. **Test Voice Intent Detection**

- Put on Quest 3 headset
- Launch SIGIL OS
- Speak a command: "SIGIL come here"
- Check logs: `adb logcat | grep VoiceAssistant`
- Verify intent is detected

4. **Test Vision Processing**

- Put on Quest 3 headset
- Launch SIGIL OS
- Grant camera permission
- Point camera at an object
- Check logs: `adb logcat | grep VisionProcessor`
- Verify objects are detected

**Completion Checklist:**

- [ ] Model Fabric HTTP client created
- [ ] Voice Assistant integrated with Model Fabric
- [ ] Vision Processor integrated with Model Fabric
- [ ] Model Fabric service started
- [ ] Voice intent detection tested
- [ ] Vision processing tested
- [ ] Logs show successful Model Fabric connections

**Estimated Total Time:** 6-7 hours

**Next:** Proceed to Task 4: SCA-1R Cognitive Services Connection

---

## Task 4: SCA-1R Cognitive Services Connection (Identity Vault, PCR, Cognitive Assembly, Planner)

### Overview

This task involves connecting the Quest runtime to SCA-1R cognitive services: Identity Vault, Persistent Context Router (PCR), Cognitive Assembly, and Planner.

---

### Step 4.1: Understand SCA-1R Cognitive Services (1 hour)

**Review Existing Code:**

```bash
# Read Identity Vault
read sigil-core/auth/src/lib.rs

# Read Persistent Context Router
read sigil-core/context/src/lib.rs

# Read SCA-1R specification
read docs/SIGIL_SCA1R_Cognitive_Architecture.md
```

**Key APIs to Use:**

1. **Identity Vault:**
```rust
identity_vault.authenticate_device(device_id)
identity_vault.get_capabilities(user_id)
identity_vault.check_permission(user_id, capability)
```

2. **Persistent Context Router (PCR):**
```rust
pcr.assemble_context(user_id, mission_id, spatial_data)
pcr.get_context_layers(user_id)
```

3. **Cognitive Assembly:**
```rust
cognitive_assembly.create_temporary_mind(context, task)
cognitive_assembly.reason(context, query)
```

4. **Planner:**
```rust
planner.plan_action(context, intent)
planner.update_mission(mission_id, action)
```

---

### Step 4.2: Create HTTP Clients for Cognitive Services (3 hours)

**File:** Create `experience-surfaces/quest/android/app/src/main/java/com/sigilos/quest/CognitiveServiceClient.java`

**What to Add:**

```java
package com.sigilos.quest;

import android.util.Log;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

/**
 * HTTP Client for SCA-1R Cognitive Services.
 * Connects Quest runtime to Identity Vault, PCR, Cognitive Assembly, and Planner.
 */
public class CognitiveServiceClient {
    private static final String TAG = "CognitiveServiceClient";
    
    private String baseUrl;
    private String apiKey;
    
    public CognitiveServiceClient(String baseUrl, String apiKey) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
    }
    
    // ==================== Identity Vault ====================
    
    /**
     * Authenticate Quest device.
     */
    public boolean authenticateDevice(String deviceId) {
        Log.i(TAG, "Authenticating device: " + deviceId);
        
        try {
            JSONObject requestBody = new JSONObject();
            requestBody.put("device_id", deviceId);
            requestBody.put("device_type", "quest3");
            
            HttpURLConnection conn = createConnection("/api/v1/identity/authenticate_device", "POST");
            conn.setDoOutput(true);
            
            OutputStream os = conn.getOutputStream();
            os.write(requestBody.toString().getBytes(StandardCharsets.UTF_8));
            os.flush();
            os.close();
            
            int responseCode = conn.getResponseCode();
            return responseCode == 200;
        } catch (Exception e) {
            Log.e(TAG, "Device authentication error", e);
            return false;
        }
    }
    
    /**
     * Get user capabilities.
     */
    public String[] getCapabilities(String userId) {
        Log.i(TAG, "Getting capabilities for user: " + userId);
        
        try {
            HttpURLConnection conn = createConnection("/api/v1/identity/capabilities?user_id=" + userId, "GET");
            
            int responseCode = conn.getResponseCode();
            if (responseCode == 200) {
                BufferedReader br = new BufferedReader(
                    new InputStreamReader(conn.getInputStream())
                );
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    response.append(line);
                }
                br.close();
                
                JSONObject json = new JSONObject(response.toString());
                JSONArray capabilities = json.getJSONArray("capabilities");
                String[] result = new String[capabilities.length()];
                for (int i = 0; i < capabilities.length(); i++) {
                    result[i] = capabilities.getString(i);
                }
                return result;
            }
        } catch (Exception e) {
            Log.e(TAG, "Get capabilities error", e);
        }
        
        return new String[0];
    }
    
    /**
     * Check permission.
     */
    public boolean checkPermission(String userId, String capability) {
        Log.i(TAG, "Checking permission: " + capability + " for user: " + userId);
        
        try {
            HttpURLConnection conn = createConnection(
                "/api/v1/identity/check_permission?user_id=" + userId + "&capability=" + capability, 
                "GET"
            );
            
            int responseCode = conn.getResponseCode();
            if (responseCode == 200) {
                BufferedReader br = new BufferedReader(
                    new InputStreamReader(conn.getInputStream())
                );
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    response.append(line);
                }
                br.close();
                
                JSONObject json = new JSONObject(response.toString());
                return json.getBoolean("allowed");
            }
        } catch (Exception e) {
            Log.e(TAG, "Check permission error", e);
        }
        
        return false;
    }
    
    // ==================== Persistent Context Router ====================
    
    /**
     * Assemble context.
     */
    public JSONObject assembleContext(String userId, String missionId, JSONObject spatialData) {
        Log.i(TAG, "Assembling context for user: " + userId + ", mission: " + missionId);
        
        try {
            JSONObject requestBody = new JSONObject();
            requestBody.put("user_id", userId);
            requestBody.put("mission_id", missionId);
            requestBody.put("spatial_data", spatialData);
            
            HttpURLConnection conn = createConnection("/api/v1/context/assemble", "POST");
            conn.setDoOutput(true);
            
            OutputStream os = conn.getOutputStream();
            os.write(requestBody.toString().getBytes(StandardCharsets.UTF_8));
            os.flush();
            os.close();
            
            int responseCode = conn.getResponseCode();
            if (responseCode == 200) {
                BufferedReader br = new BufferedReader(
                    new InputStreamReader(conn.getInputStream())
                );
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    response.append(line);
                }
                br.close();
                
                return new JSONObject(response.toString());
            }
        } catch (Exception e) {
            Log.e(TAG, "Assemble context error", e);
        }
        
        return null;
    }
    
    // ==================== Cognitive Assembly ====================
    
    /**
     * Create temporary mind.
     */
    public JSONObject createTemporaryMind(JSONObject context, String task) {
        Log.i(TAG, "Creating temporary mind for task: " + task);
        
        try {
            JSONObject requestBody = new JSONObject();
            requestBody.put("context", context);
            requestBody.put("task", task);
            
            HttpURLConnection conn = createConnection("/api/v1/cognitive/create_mind", "POST");
            conn.setDoOutput(true);
            
            OutputStream os = conn.getOutputStream();
            os.write(requestBody.toString().getBytes(StandardCharsets.UTF_8));
            os.flush();
            os.close();
            
            int responseCode = conn.getResponseCode();
            if (responseCode == 200) {
                BufferedReader br = new BufferedReader(
                    new InputStreamReader(conn.getInputStream())
                );
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    response.append(line);
                }
                br.close();
                
                return new JSONObject(response.toString());
            }
        } catch (Exception e) {
            Log.e(TAG, "Create temporary mind error", e);
        }
        
        return null;
    }
    
    /**
     * Reason about query.
     */
    public String reason(JSONObject context, String query) {
        Log.i(TAG, "Reasoning about: " + query);
        
        try {
            JSONObject requestBody = new JSONObject();
            requestBody.put("context", context);
            requestBody.put("query", query);
            
            HttpURLConnection conn = createConnection("/api/v1/cognitive/reason", "POST");
            conn.setDoOutput(true);
            
            OutputStream os = conn.getOutputStream();
            os.write(requestBody.toString().getBytes(StandardCharsets.UTF_8));
            os.flush();
            os.close();
            
            int responseCode = conn.getResponseCode();
            if (responseCode == 200) {
                BufferedReader br = new BufferedReader(
                    new InputStreamReader(conn.getInputStream())
                );
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    response.append(line);
                }
                br.close();
                
                JSONObject json = new JSONObject(response.toString());
                return json.getString("response");
            }
        } catch (Exception e) {
            Log.e(TAG, "Reason error", e);
        }
        
        return null;
    }
    
    // ==================== Planner ====================
    
    /**
     * Plan action.
     */
    public JSONObject planAction(JSONObject context, String intent) {
        Log.i(TAG, "Planning action for intent: " + intent);
        
        try {
            JSONObject requestBody = new JSONObject();
            requestBody.put("context", context);
            requestBody.put("intent", intent);
            
            HttpURLConnection conn = createConnection("/api/v1/planner/plan", "POST");
            conn.setDoOutput(true);
            
            OutputStream os = conn.getOutputStream();
            os.write(requestBody.toString().getBytes(StandardCharsets.UTF_8));
            os.flush();
            os.close();
            
            int responseCode = conn.getResponseCode();
            if (responseCode == 200) {
                BufferedReader br = new BufferedReader(
                    new InputStreamReader(conn.getInputStream())
                );
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    response.append(line);
                }
                br.close();
                
                return new JSONObject(response.toString());
            }
        } catch (Exception e) {
            Log.e(TAG, "Plan action error", e);
        }
        
        return null;
    }
    
    /**
     * Update mission.
     */
    public boolean updateMission(String missionId, JSONObject action) {
        Log.i(TAG, "Updating mission: " + missionId);
        
        try {
            JSONObject requestBody = new JSONObject();
            requestBody.put("mission_id", missionId);
            requestBody.put("action", action);
            
            HttpURLConnection conn = createConnection("/api/v1/planner/update_mission", "POST");
            conn.setDoOutput(true);
            
            OutputStream os = conn.getOutputStream();
            os.write(requestBody.toString().getBytes(StandardCharsets.UTF_8));
            os.flush();
            os.close();
            
            int responseCode = conn.getResponseCode();
            return responseCode == 200;
        } catch (Exception e) {
            Log.e(TAG, "Update mission error", e);
            return false;
        }
    }
    
    /**
     * Create HTTP connection.
     */
    private HttpURLConnection createConnection(String endpoint, String method) throws Exception {
        URL url = new URL(baseUrl + endpoint);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod(method);
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("Authorization", "Bearer " + apiKey);
        conn.setConnectTimeout(10000);
        conn.setReadTimeout(10000);
        return conn;
    }
}
```

---

### Step 4.3: Integrate Cognitive Services in Quest Runtime (2 hours)

**File:** `experience-surfaces/quest/android/app/src/main/java/com/sigilos/quest/QuestRuntime.java`

**What to Add:**

```java
public class QuestRuntime {
    private CognitiveServiceClient cognitiveClient;
    private static final String COGNITIVE_SERVICES_URL = "http://localhost:8080";
    private static final String COGNITIVE_SERVICES_API_KEY = "your-api-key";
    private String deviceId;
    private String userId;
    
    public QuestRuntime() {
        this.initialized = false;
        this.state = RuntimeState.IDLE;
        
        // Generate device ID
        this.deviceId = UUID.randomUUID().toString();
    }
    
    public void initialize() {
        Log.i(TAG, "Initializing Quest Runtime");
        
        // Initialize cognitive services client
        cognitiveClient = new CognitiveServiceClient(
            COGNITIVE_SERVICES_URL, 
            COGNITIVE_SERVICES_API_KEY
        );
        
        // Authenticate device with Identity Vault
        boolean authenticated = cognitiveClient.authenticateDevice(deviceId);
        if (!authenticated) {
            Log.e(TAG, "Device authentication failed");
            return;
        }
        
        Log.i(TAG, "Device authenticated successfully");
        
        // Get user ID (this would come from login/registration)
        this.userId = "user-123"; // TODO: Get from actual user session
        
        // Initialize runtime components
        voiceAssistant = new VoiceAssistant(context, MODEL_FABRIC_URL, MODEL_FABRIC_API_KEY);
        handTracking = new HandTracking();
        eyeTracking = new EyeTracking();
        spatialMapping = new SpatialMapping();
        mixedReality = new MixedReality();
        companion = new PersonalCompanion("SIGIL");
        presenceEngine = new PresenceEngine();
        
        // Start runtime components
        startComponents();
        
        this.initialized = true;
        this.state = RuntimeState.READY;
        
        Log.i(TAG, "Quest Runtime initialized successfully");
    }
    
    /**
     * Process voice command through SCA-1R stack.
     * Pipeline: Voice → Model Fabric → PCR → Cognitive Assembly → Planner → Avatar
     */
    public void processVoiceCommand(byte[] audio) {
        Log.i(TAG, "Processing voice command through SCA-1R stack");
        
        if (!initialized) {
            Log.e(TAG, "Runtime not initialized");
            return;
        }
        
        this.state = RuntimeState.PROCESSING;
        
        // Step 1: Voice recognition
        VoiceAssistant.VoiceCommand command = voiceAssistant.processCommand(audio);
        
        // Step 2: Intent detection via Model Fabric
        ModelFabricClient.IntentDetectionResult intentResult = 
            modelFabricClient.detectIntent(command.getCommand());
        
        if (intentResult == null) {
            Log.e(TAG, "Intent detection failed");
            this.state = RuntimeState.READY;
            return;
        }
        
        // Step 3: Assemble context via PCR
        JSONObject spatialData = getSpatialData();
        JSONObject context = cognitiveClient.assembleContext(userId, null, spatialData);
        
        if (context == null) {
            Log.e(TAG, "Context assembly failed");
            this.state = RuntimeState.READY;
            return;
        }
        
        // Step 4: Create cognitive assembly
        JSONObject mind = cognitiveClient.createTemporaryMind(context, "voice_command");
        
        if (mind == null) {
            Log.e(TAG, "Cognitive assembly creation failed");
            this.state = RuntimeState.READY;
            return;
        }
        
        // Step 5: Reason about command
        String reasoning = cognitiveClient.reason(context, command.getCommand());
        
        if (reasoning == null) {
            Log.e(TAG, "Reasoning failed");
            this.state = RuntimeState.READY;
            return;
        }
        
        Log.i(TAG, "Reasoning: " + reasoning);
        
        // Step 6: Plan action
        JSONObject actionPlan = cognitiveClient.planAction(context, intentResult.intent);
        
        if (actionPlan == null) {
            Log.e(TAG, "Action planning failed");
            this.state = RuntimeState.READY;
            return;
        }
        
        // Step 7: Execute via avatar
        executeAction(actionPlan);
        
        this.state = RuntimeState.READY;
    }
    
    /**
     * Get spatial data for context assembly.
     */
    private JSONObject getSpatialData() {
        JSONObject spatialData = new JSONObject();
        
        // Add room mapping data
        JSONArray meshes = new JSONArray();
        for (SpatialMapping.Mesh mesh : spatialMapping.getMeshes()) {
            JSONObject meshJson = new JSONObject();
            meshJson.put("id", mesh.getId());
            spatialData.put("meshes", meshes);
        }
        
        // Add current position
        JSONObject position = new JSONObject();
        position.put("x", 0.0f);
        position.put("y", 0.0f);
        position.put("z", 0.0f);
        spatialData.put("position", position);
        
        return spatialData;
    }
    
    /**
     * Execute action plan.
     */
    private void executeAction(JSONObject actionPlan) {
        Log.i(TAG, "Executing action plan");
        
        String actionType = actionPlan.optString("action_type", "unknown");
        
        switch (actionType) {
            case "walk_to":
                float[] destination = actionPlan.optJSONArray("destination").toString();
                // TODO: Implement avatar walk to destination
                break;
            case "speak":
                String text = actionPlan.optString("text", "");
                voiceAssistant.speak(text);
                break;
            case "gesture":
                String gesture = actionPlan.optString("gesture", "");
                // TODO: Implement avatar gesture
                break;
            default:
                Log.w(TAG, "Unknown action type: " + actionType);
        }
    }
}
```

---

### Step 4.4: Implement SCA-1R Interaction Modes (2 hours)

**File:** `experience-surfaces/quest/android/app/src/main/java/com/sigilos/quest/PersonalCompanion.java`

**What to Add:**

```java
public class PersonalCompanion {
    private CognitiveServiceClient cognitiveClient;
    
    public PersonalCompanion(String name, CognitiveServiceClient cognitiveClient) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.state = CompanionState.IDLE;
        this.mode = InteractionMode.VOICE_AND_GESTURE;
        this.cognitiveClient = cognitiveClient;
    }
    
    /**
     * Activate Companion Mode (SCA-1R).
     */
    public void activateCompanionMode() {
        Log.i(TAG, "Activating Companion Mode");
        this.state = CompanionState.ACTIVE;
        this.mode = InteractionMode.VOICE_AND_GESTURE;
        
        // Create companion-specific cognitive assembly
        JSONObject context = new JSONObject();
        context.put("mode", "companion");
        
        JSONObject mind = cognitiveClient.createTemporaryMind(context, "companion_mode");
        
        if (mind != null) {
            Log.i(TAG, "Companion mode cognitive assembly created");
        }
    }
    
    /**
     * Activate Collaboration Mode (SCA-1R).
     */
    public void activateCollaborationMode() {
        Log.i(TAG, "Activating Collaboration Mode");
        this.state = CompanionState.ACTIVE;
        this.mode = InteractionMode.VOICE_AND_GESTURE;
        
        // Create collaboration-specific cognitive assembly
        JSONObject context = new JSONObject();
        context.put("mode", "collaboration");
        
        JSONObject mind = cognitiveClient.createTemporaryMind(context, "collaboration_mode");
        
        if (mind != null) {
            Log.i(TAG, "Collaboration mode cognitive assembly created");
        }
    }
    
    /**
     * Activate Research Mode (SCA-1R).
     */
    public void activateResearchMode() {
        Log.i(TAG, "Activating Research Mode");
        this.state = CompanionState.PROCESSING;
        this.mode = InteractionMode.VOICE;
        
        // Create research-specific cognitive assembly
        JSONObject context = new JSONObject();
        context.put("mode", "research");
        
        JSONObject mind = cognitiveClient.createTemporaryMind(context, "research_mode");
        
        if (mind != null) {
            Log.i(TAG, "Research mode cognitive assembly created");
        }
    }
    
    /**
     * Activate Teaching Mode (SCA-1R).
     */
    public void activateTeachingMode() {
        Log.i(TAG, "Activating Teaching Mode");
        this.state = CompanionState.ACTIVE;
        this.mode = InteractionMode.VOICE_AND_GESTURE;
        
        // Create teaching-specific cognitive assembly
        JSONObject context = new JSONObject();
        context.put("mode", "teaching");
        
        JSONObject mind = cognitiveClient.createTemporaryMind(context, "teaching_mode");
        
        if (mind != null) {
            Log.i(TAG, "Teaching mode cognitive assembly created");
        }
    }
    
    /**
     * Activate Presentation Mode (SCA-1R).
     */
    public void activatePresentationMode() {
        Log.i(TAG, "Activating Presentation Mode");
        this.state = CompanionState.ACTIVE;
        this.mode = InteractionMode.VOICE;
        
        // Create presentation-specific cognitive assembly
        JSONObject context = new JSONObject();
        context.put("mode", "presentation");
        
        JSONObject mind = cognitiveClient.createTemporaryMind(context, "presentation_mode");
        
        if (mind != null) {
            Log.i(TAG, "Presentation mode cognitive assembly created");
        }
    }
}
```

---

### Step 4.5: Start Cognitive Services (1 hour)

**Steps:**

1. **Start SIGIL OS API Server**

The cognitive services are part of the SIGIL OS API server.

```bash
# Navigate to sigil-core/api
cd sigil-core/api

# Start the API server
cargo run

# Or use the provided script
cd ..
run-api.bat
```

2. **Verify Cognitive Services are Running**

```bash
# Check health endpoint
curl http://localhost:8080/health

# Check Identity Vault endpoint
curl http://localhost:8080/api/v1/identity/health

# Check PCR endpoint
curl http://localhost:8080/api/v1/context/health

# Check Cognitive Assembly endpoint
curl http://localhost:8080/api/v1/cognitive/health

# Check Planner endpoint
curl http://localhost:8080/api/v1/planner/health
```

---

### Step 4.6: Test Cognitive Services Connection (2 hours)

**Steps:**

1. **Start Cognitive Services** (see Step 4.5)

2. **Build and Deploy Quest App**

```bash
cd experience-surfaces/quest/android
./gradlew assembleDebug

cd ..
deploy-quest.bat
```

3. **Test Identity Vault**

- Put on Quest 3 headset
- Launch SIGIL OS
- Check logs: `adb logcat | grep QuestRuntime`
- Verify device authentication succeeds

4. **Test PCR**

- Check logs for context assembly
- Verify context includes spatial data

5. **Test Cognitive Assembly**

- Speak a command
- Check logs for cognitive assembly creation
- Verify reasoning occurs

6. **Test Planner**

- Speak a command
- Check logs for action planning
- Verify action is executed

**Completion Checklist:**

- [ ] Cognitive services HTTP client created
- [ ] Identity Vault integrated
- [ ] PCR integrated
- [ ] Cognitive Assembly integrated
- [ ] Planner integrated
- [ ] SCA-1R interaction modes implemented
- [ ] Cognitive services started
- [ ] Device authentication tested
- [ ] Context assembly tested
- [ ] Cognitive assembly tested
- [ ] Planner tested
- [ ] Logs show successful cognitive service connections

**Estimated Total Time:** 9-10 hours

**Next:** Proceed to Task 5: 3D Avatar Rendering

---

## Task 5: 3D Avatar Rendering (Avatar Loading and Rendering in XR)

### Overview

This task involves loading a 3D avatar model and rendering it in XR (mixed reality) on Quest 3.

---

### Step 5.1: Choose 3D Avatar Format (1 hour)

**Supported Formats:**

1. **GLB/GLTF** - Recommended, widely supported
2. **FBX** - Common in 3D modeling tools
3. **OBJ** - Simple mesh format
4. **USD** - Universal Scene Description (Pixar)

**Recommendation:** Use GLB/GLTF for Quest 3

**Why:**
- Open standard
- Compact binary format
- Widely supported by XR frameworks
- Includes textures, animations, materials

---

### Step 5.2: Create or Obtain 3D Avatar Model (4-8 hours)

**Option 1: Create Custom Avatar**

**Tools:**
- Blender (free)
- Maya (paid)
- 3DS Max (paid)
- Mixamo (free for basic avatars)

**Steps:**

1. **Download Blender** from https://www.blender.org/download/
2. **Create or Import Avatar:**
   - Create human model from scratch
   - Or import base model from Mixamo
3. **Rig the Avatar:**
   - Add armature (skeleton)
   - Bind mesh to armature
   - Set up IK chains
4. **Create Animations:**
   - Idle animation
   - Walking animation
   - Speaking animation
   - Gestures (nod, wave, point)
   - Breathing animation
   - Blinking animation
5. **Export as GLB:**
   - File → Export → glTF 2.0 (.glb/.gltf)
   - Select "Binary (.glb)"
   - Include animations
   - Include textures
   - Export

**Option 2: Use Pre-made Avatar**

**Sources:**
- Mixamo (free): https://www.mixamo.com/
- Ready Player Me (free): https://readyplayer.me/
- Sketchfab (paid/free): https://sketchfab.com/
- TurboSquid (paid): https://www.turbosquid.com/

**Steps:**

1. Go to Mixamo
2. Create account
3. Browse avatars
4. Select avatar
5. Add animations (idle, walk, talk, etc.)
6. Download as GLB

---

### Step 5.3: Add Avatar Model to Project (30 minutes)

**Steps:**

1. **Create Assets Directory**

```bash
mkdir -p experience-surfaces/quest/android/app/src/main/assets/models
mkdir -p experience-surfaces/quest/android/app/src/main/assets/textures
```

2. **Copy Avatar Model**

```bash
# Copy your avatar GLB file to assets directory
cp sigil_avatar.glb experience-surfaces/quest/android/app/src/main/assets/models/
```

3. **Verify File Structure**

```
experience-surfaces/quest/android/app/src/main/assets/
├── models/
│   └── sigil_avatar.glb
└── textures/
    └── (if textures are separate)
```

---

### Step 5.4: Choose XR Rendering Framework (2 hours)

**Options:**

1. **Unity** - Recommended, full-featured
2. **Unreal Engine** - Powerful, but heavier
3. **Custom OpenGL ES/Vulkan** - Maximum control, more work
4. **Google VR (GVR)** - Deprecated
5. **Oculus Integration** - Quest-specific

**Recommendation:** Use Unity for Quest 3

**Why:**
- Official Quest support
- Built-in XR integration
- Easy avatar system
- Large community
- Good performance

---

### Step 5.5: Create Unity Project for Quest 3 (4 hours)

**Steps:**

1. **Install Unity Hub** from https://unity.com/download
2. **Install Unity Editor** (2022.3 LTS or later)
3. **Install Quest Build Support** in Unity Hub
4. **Create New Project:**
   - Select "3D" template
   - Name: "SIGIL Quest 3"
   - Location: `experience-surfaces/quest/unity`
5. **Import Oculus XR Plugin:**
   - Window → Package Manager
   - Select "Unity Registry"
   - Search for "XR Plugin Management"
   - Install
   - Search for "Oculus XR Plugin"
   - Install
6. **Configure XR:**
   - Edit → Project Settings → XR Plug-in Management
   - Check "Oculus"
   - Set "Android" tab
   - Check "Oculus"
7. **Configure Android Build Settings:**
   - File → Build Settings
   - Platform: Android
   - Switch Platform
   - Texture Compression: ASTC
   - Graphics APIs: OpenGLES3
   - Minimum API Level: Android 12.0 (API Level 32)
   - Target API Level: Android 13.0 (API Level 33)

---

### Step 5.6: Import Avatar Model into Unity (1 hour)

**Steps:**

1. **Import GLB File:**
   - Drag `sigil_avatar.glb` into Unity Assets folder
   - Unity will automatically import
2. **Configure Import Settings:**
   - Select the imported asset
   - In Inspector:
     - Scale Factor: 1.0
     - Animation Compression: Off
     - Materials: Import Materials
3. **Create Prefab:**
   - Drag avatar model into scene
   - Add components:
     - Animator (for animations)
     - XR Origin (for tracking)
   - Drag from scene to Assets folder to create prefab
   - Delete from scene (will instantiate at runtime)

---

### Step 5.5: Implement Avatar Rendering System (6 hours)

**File:** Unity C# Script `AvatarController.cs`

**What to Add:**

```csharp
using UnityEngine;
using UnityEngine.XR;
using UnityEngine.XR.Interaction;

public class AvatarController : MonoBehaviour
{
    [Header("Avatar Settings")]
    public GameObject avatarPrefab;
    public Transform xrOrigin;
    
    [Header("Animation Settings")]
    public float walkingSpeed = 1.0f;
    public float rotationSpeed = 2.0f;
    
    private GameObject avatarInstance;
    private Animator animator;
    private Vector3 targetPosition;
    private bool isWalking;
    private bool isSpeaking;
    
    void Start()
    {
        // Instantiate avatar
        avatarInstance = Instantiate(avatarPrefab, xrOrigin);
        avatarInstance.transform.localPosition = new Vector3(0, 0, 1);
        avatarInstance.transform.localRotation = Quaternion.identity;
        
        // Get animator
        animator = avatarInstance.GetComponent<Animator>();
        
        // Set initial animation
        animator.SetBool("IsIdle", true);
    }
    
    void Update()
    {
        // Update avatar position
        if (isWalking)
        {
            Vector3 direction = (targetPosition - avatarInstance.transform.position).normalized;
            avatarInstance.transform.position += direction * walkingSpeed * Time.deltaTime;
            
            // Rotate towards target
            Quaternion targetRotation = Quaternion.LookRotation(direction);
            avatarInstance.transform.rotation = Quaternion.Slerp(
                avatarInstance.transform.rotation,
                targetRotation,
                rotationSpeed * Time.deltaTime
            );
            
            // Check if reached target
            if (Vector3.Distance(avatarInstance.transform.position, targetPosition) < 0.1f)
            {
                isWalking = false;
                animator.SetBool("IsWalking", false);
                animator.SetBool("IsIdle", true);
            }
        }
    }
    
    /**
     * Walk to specific position.
     */
    public void WalkTo(Vector3 position)
    {
        targetPosition = position;
        isWalking = true;
        animator.SetBool("IsIdle", false);
        animator.SetBool("IsWalking", true);
    }
    
    /**
     * Speak with animation.
     */
    public void Speak(string text)
    {
        isSpeaking = true;
        animator.SetBool("IsSpeaking", true);
        
        // TODO: Trigger TTS
        // When TTS completes, set isSpeaking = false
    }
    
    /**
     * Play gesture.
     */
    public void PlayGesture(string gestureName)
    {
        animator.SetTrigger(gestureName);
    }
    
    /**
     * Set expression.
     */
    public void SetExpression(string expressionName)
    {
        animator.SetTrigger(expressionName);
    }
}
```

---

### Step 5.6: Create Avatar Animation States (2 hours)

**Steps:**

1. **Open Animation Window:**
   - Window → Animation → Animation
2. **Create Animation Controller:**
   - Right-click in Assets → Create → Animator Controller
   - Name: "AvatarAnimatorController"
3. **Set Up Animation States:**
   - Create states: Idle, Walking, Speaking, Gestures
   - Create transitions between states
   - Add parameters: IsIdle, IsWalking, IsSpeaking, Gesture
4. **Assign Animations:**
   - Import avatar animations from GLB
   - Assign to states in Animator Controller
5. **Apply to Avatar:**
   - Select avatar prefab
   - Assign Animator Controller to Animator component

---

### Step 5.7: Integrate Avatar with Quest Runtime (2 hours)

**File:** `experience-surfaces/quest/android/app/src/main/java/com/sigilos/quest/QuestRuntime.java`

**What to Add:**

Since we're using Unity, we'll need to bridge between Java and Unity. Unity provides JNI bindings for this.

```java
public class QuestRuntime {
    /**
     * Walk avatar to position.
     */
    public void walkAvatarTo(float x, float y, float z) {
        Log.i(TAG, "Walking avatar to: " + x + ", " + y + ", " + z);
        
        // Call Unity method via JNI
        nativeWalkAvatarTo(x, y, z);
    }
    
    /**
     * Make avatar speak.
     */
    public void avatarSpeak(String text) {
        Log.i(TAG, "Avatar speaking: " + text);
        
        // Call Unity method via JNI
        nativeAvatarSpeak(text);
    }
    
    /**
     * Play avatar gesture.
     */
    public void playAvatarGesture(String gesture) {
        Log.i(TAG, "Playing gesture: " + gesture);
        
        // Call Unity method via JNI
        nativePlayAvatarGesture(gesture);
    }
    
    // Native method declarations
    private native void nativeWalkAvatarTo(float x, float y, float z);
    private native void nativeAvatarSpeak(String text);
    private native void nativePlayAvatarGesture(String gesture);
}
```

**Unity C# Bridge Script:**

```csharp
using UnityEngine;

public class AvatarBridge : MonoBehaviour
{
    public static AvatarBridge instance;
    public AvatarController avatarController;
    
    void Awake()
    {
        instance = this;
    }
    
    // Called from Java via JNI
    public void WalkAvatarTo(float x, float y, float z)
    {
        Vector3 position = new Vector3(x, y, z);
        avatarController.WalkTo(position);
    }
    
    public void AvatarSpeak(string text)
    {
        avatarController.Speak(text);
    }
    
    public void PlayAvatarGesture(string gesture)
    {
        avatarController.PlayGesture(gesture);
    }
}
```

---

### Step 5.8: Build Unity Project for Quest 3 (2 hours)

**Steps:**

1. **Configure Build Settings:**
   - File → Build Settings
   - Platform: Android
   - Texture Compression: ASTC
   - Graphics APIs: OpenGLES3
   - Minimum API Level: Android 12.0
   - Target API Level: Android 13.0
2. **Switch Platform** (if not already Android)
3. **Build:**
   - Click "Build"
   - Select output directory: `experience-surfaces/quest/android/app/libs/`
   - Wait for build to complete
4. **Integrate with Android Project:**
   - The Unity build will produce an AAR file
   - Add AAR to Android project dependencies

**Edit `experience-surfaces/quest/android/app/build.gradle`:**

```gradle
dependencies {
    // Add Unity AAR
    implementation files('libs/unity-2022.3.aar')
}
```

---

### Step 5.9: Test Avatar Rendering (2 hours)

**Steps:**

1. **Build APK**

```bash
cd experience-surfaces/quest/android
./gradlew assembleDebug
```

2. **Deploy to Quest 3**

```bash
cd ..
deploy-quest.bat
```

3. **Test Avatar**

- Put on Quest 3 headset
- Launch SIGIL OS
- Verify avatar appears in MR
- Test avatar walking
- Test avatar speaking
- Test avatar gestures
- Check performance (target 72fps)

**Completion Checklist:**

- [ ] 3D avatar model created or obtained
- [ ] Avatar model imported into Unity
- [ ] Unity project configured for Quest 3
- [ ] Avatar controller script created
- [ ] Animation controller set up
- [ ] Avatar rendering in XR working
- [ ] Avatar walking animation working
- [ ] Avatar speaking animation working
- [ ] Avatar gestures working
- [ ] Avatar integrated with Quest Runtime
- [ ] Unity project built for Quest 3
- [ ] Avatar tested on Quest 3 device
- [ ] Performance meets target (72fps)

**Estimated Total Time:** 20-28 hours

**Next:** Proceed to Task 6: Hardware Testing

---

## Task 6: Hardware Testing (Requires Quest 3 Device)

### Overview

This task involves comprehensive testing of all Quest 3 features on the actual hardware device.

---

### Step 6.1: Prepare Quest 3 Device (30 minutes)

**Steps:**

1. **Charge Quest 3** - Ensure battery is at least 50%
2. **Update Quest OS** - Ensure latest Quest OS version (v50+)
3. **Clear Storage** - Ensure at least 2GB free space
4. **Enable Developer Mode** - Already done in Task 1
5. **Enable USB Debugging** - Already done in Task 1
6. **Connect USB-C Cable** - Use USB 3.0+ cable

---

### Step 6.2: Deploy and Launch App (30 minutes)

**Steps:**

1. **Build APK**

```bash
cd experience-surfaces/quest/android
./gradlew assembleDebug
```

2. **Deploy to Quest 3**

```bash
cd ..
deploy-quest.bat
```

3. **Launch App**

```bash
# Launch via ADB
adb shell am start -n com.sigilos.quest/.MainActivity

# Or launch from Quest 3 library
```

4. **Grant Permissions**

- Camera permission
- Microphone permission
- Spatial data permission

---

### Step 6.3: Test Voice Runtime (2 hours)

**Test Cases:**

1. **Voice Recognition:**
   - Speak: "SIGIL come here"
   - Expected: Avatar walks to you
   - Verify: Avatar moves toward user

2. **Voice Recognition:**
   - Speak: "SIGIL follow me"
   - Expected: Avatar follows user
   - Verify: Avatar tracks user movement

3. **Voice Recognition:**
   - Speak: "SIGIL open coding mode"
   - Expected: Companion enters coding mode
   - Verify: Companion state changes

4. **Voice Recognition:**
   - Speak: "SIGIL remember this"
   - Expected: Memory created
   - Verify: Memory stored in system

5. **Voice Recognition:**
   - Speak: "SIGIL show active missions"
   - Expected: Missions displayed
   - Verify: Mission list appears

6. **Latency Test:**
   - Measure time from speech to response
   - Target: ≤ 1.5 seconds
   - Record: ___ seconds

**Pass Criteria:**
- [ ] Voice recognition accuracy ≥ 90%
- [ ] Latency ≤ 1.5s
- [ ] All commands execute correctly

---

### Step 6.4: Test Hand Runtime (2 hours)

**Test Cases:**

1. **Hand Tracking:**
   - Hold up hands
   - Expected: Hands detected and tracked
   - Verify: Hand models appear in MR

2. **Gesture Recognition:**
   - Pinch fingers
   - Expected: Pinch gesture detected
   - Verify: Pinch action executed

3. **Gesture Recognition:**
   - Point finger
   - Expected: Point gesture detected
   - Verify: Point action executed

4. **Gesture Recognition:**
   - Make fist
   - Expected: Fist gesture detected
   - Verify: Fist action executed

5. **Gesture Recognition:**
   - Open palm
   - Expected: Open palm gesture detected
   - Verify: Open palm action executed

6. **Gesture Recognition:**
   - Long hold
   - Expected: Long hold gesture detected
   - Verify: Memory created

7. **Latency Test:**
   - Measure time from gesture to response
   - Target: ≤ 100ms
   - Record: ___ ms

**Pass Criteria:**
- [ ] Hand tracking accuracy ≥ 95%
- [ ] Gesture recognition accuracy ≥ 90%
- [ ] Latency ≤ 100ms
- [ ] All gestures execute correctly

---

### Step 6.5: Test Eye Runtime (2 hours)

**Test Cases:**

1. **Eye Tracking:**
   - Look at object
   - Expected: Gaze detected
   - Verify: Gaze ray visible

2. **Gaze Command:**
   - Look at object, say "What am I looking at?"
   - Expected: Object identified
   - Verify: Object name spoken

3. **Gaze Command:**
   - Look at object, say "Remember this."
   - Expected: Object remembered
   - Verify: Memory created with spatial context

4. **Gaze Command:**
   - Look at object, say "Explain this."
   - Expected: Explanation provided
   - Verify: Explanation spoken

5. **Attention Detection:**
   - Look at different objects
   - Expected: Attention shifts detected
   - Verify: Avatar follows gaze

6. **Latency Test:**
   - Measure time from gaze to response
   - Target: ≤ 50ms
   - Record: ___ ms

**Pass Criteria:**
- [ ] Eye tracking accuracy ≥ 95%
- [ ] Gaze detection latency ≤ 50ms
- [ ] All gaze commands execute correctly

---

### Step 6.6: Test Spatial Runtime (2 hours)

**Test Cases:**

1. **Room Scanning:**
   - Walk around room
   - Expected: Room scanned
   - Verify: Mesh generated

2. **Spatial Mapping:**
   - Examine generated mesh
   - Expected: Accurate room representation
   - Verify: Walls, furniture detected

3. **Spatial Anchors:**
   - Create spatial anchor
   - Expected: Anchor created
   - Verify: Anchor persists across sessions

4. **Object Detection:**
   - Scan room
   - Expected: Objects detected
   - Verify: Desk, monitor, chair identified

5. **Scene Classification:**
   - Scan room
   - Expected: Scene type identified
   - Verify: "office", "living room", etc.

6. **Latency Test:**
   - Measure time to generate mesh
   - Target: ≤ 200ms per room scan
   - Record: ___ ms

**Pass Criteria:**
- [ ] Room scanning works
- [ ] Mesh accuracy ≥ 90%
- [ ] Spatial anchors persist
- [ ] Object detection accuracy ≥ 85%
- [ ] Latency ≤ 200ms

---

### Step 6.7: Test Avatar Runtime (2 hours)

**Test Cases:**

1. **Avatar Rendering:**
   - Launch app
   - Expected: Avatar appears in MR
   - Verify: Avatar visible and properly scaled

2. **Avatar Walking:**
   - Command avatar to walk
   - Expected: Avatar walks to destination
   - Verify: Walking animation plays

3. **Avatar Speaking:**
   - Command avatar to speak
   - Expected: Avatar speaks with animation
   - Verify: Lip sync works

4. **Avatar Gestures:**
   - Trigger avatar gesture
   - Expected: Gesture plays
   - Verify: Animation smooth

5. **Presence Engine:**
   - Observe avatar
   - Expected: Breathing, blinking, micro gestures
   - Verify: Presence animations play

6. **Avatar Positioning:**
   - Move around room
   - Expected: Avatar stays in correct position
   - Verify: Spatial anchoring works

**Pass Criteria:**
- [ ] Avatar renders correctly
- [ ] Walking animation smooth
- [ ] Speaking animation smooth
- [ ] Lip sync accurate
- [ ] Presence animations play
- [ ] Spatial positioning accurate

---

### Step 6.8: Test Mixed Reality Interface (2 hours)

**Test Cases:**

1. **Passthrough:**
   - Enable passthrough
   - Expected: Real world visible
   - Verify: MR rendering works

2. **MR Rendering:**
   - View avatar in MR
   - Expected: Avatar blends with real world
   - Verify: Occlusion correct

3. **UI Panels:**
   - Open UI panel
   - Expected: Panel appears in MR
   - Verify: Panel interactive

4. **Virtual Windows:**
   - Open virtual window
   - Expected: Window appears in MR
   - Verify: Window functional

5. **Performance:**
   - Measure frame rate
   - Target: 72fps minimum
   - Record: ___ fps

**Pass Criteria:**
- [ ] Passthrough works
- [ ] MR rendering correct
- [ ] UI panels functional
- [ ] Virtual windows functional
- [ ] Frame rate ≥ 72fps

---

### Step 6.9: Test Privacy Controls (1 hour)

**Test Cases:**

1. **Camera Permission:**
   - Request camera access
   - Expected: Permission dialog appears
   - Verify: Can grant or deny

2. **Microphone Permission:**
   - Request microphone access
   - Expected: Permission dialog appears
   - Verify: Can grant or deny

3. **Spatial Data Privacy:**
   - Delete spatial data
   - Expected: Data deleted
   - Verify: Anchors removed

4. **Privacy Indicators:**
   - Enable camera
   - Expected: Camera indicator visible
   - Verify: Indicator shows when active

5. **Data Deletion:**
   - Delete all data
   - Expected: All data removed
   - Verify: No residual data

**Pass Criteria:**
- [ ] Permission flows work
- [ ] Can grant/deny permissions
- [ ] Spatial data can be deleted
- [ ] Privacy indicators visible
- [ ] Data deletion complete

---

### Step 6.10: Test SCA-1R Cognitive Integration (2 hours)

**Test Cases:**

1. **Identity Vault:**
   - Authenticate device
   - Expected: Authentication succeeds
   - Verify: Device ID registered

2. **PCR:**
   - Assemble context
   - Expected: Context includes all layers
   - Verify: Identity, Memory, World, Spatial layers present

3. **Cognitive Assembly:**
   - Create temporary mind
   - Expected: Mind created
   - Verify: Mind responds to queries

4. **Planner:**
   - Plan action
   - Expected: Action plan generated
   - Verify: Plan executed correctly

5. **Interaction Modes:**
   - Switch to Companion Mode
   - Expected: Mode activated
   - Verify: Companion behavior changes

6. **Mission Updates:**
   - Execute action
   - Expected: Mission updated
   - Verify: Progress tracked

**Pass Criteria:**
- [ ] Identity Vault works
- [ ] PCR assembles context correctly
- [ ] Cognitive Assembly creates minds
- [ ] Planner generates action plans
- [ ] Interaction modes work
- [ ] Mission updates tracked

---

### Step 6.11: Performance Testing (2 hours)

**Metrics to Measure:**

1. **Frame Rate:**
   - Target: 72fps minimum
   - Test: Walk around room with avatar
   - Record: ___ fps

2. **Latency:**
   - Voice: ≤ 1.5s
   - Gesture: ≤ 100ms
   - Gaze: ≤ 50ms
   - Spatial: ≤ 200ms
   - Record actual latencies

3. **Memory Usage:**
   - Target: < 2GB
   - Test: Use app for 30 minutes
   - Record: ___ MB

4. **Battery Usage:**
   - Target: < 20%/hour
   - Test: Use app for 1 hour
   - Record: ___ %

5. **Thermal:**
   - Target: No overheating
   - Test: Use app for 1 hour
   - Record: Temperature ___ °C

**Pass Criteria:**
- [ ] Frame rate ≥ 72fps
- [ ] All latencies within targets
- [ ] Memory usage < 2GB
- [ ] Battery usage < 20%/hour
- [ ] No overheating

---

### Step 6.12: Stability Testing (2 hours)

**Test Cases:**

1. **Long Duration Test:**
   - Use app for 2 hours continuously
   - Expected: No crashes, no memory leaks
   - Verify: App remains stable

2. **Stress Test:**
   - Rapid voice commands
   - Rapid gestures
   - Rapid spatial mapping
   - Expected: No crashes
   - Verify: App handles load

3. **Edge Cases:**
   - Low battery
   - Poor lighting
   - No room scan
   - Expected: Graceful degradation
   - Verify: App handles gracefully

4. **Recovery Test:**
   - Force close app
   - Relaunch
   - Expected: State preserved
   - Verify: No data loss

**Pass Criteria:**
- [ ] No crashes during 2-hour test
- [ ] No memory leaks
- [ ] Handles stress gracefully
- [ ] Handles edge cases gracefully
- [ ] State preserved after relaunch

---

### Step 6.13: Document Test Results (1 hour)

**Create Test Report:**

```bash
# Create test report
cat > experience-surfaces/quest/TEST_REPORT_$(date +%Y-%m-%d).md << 'EOF'
# Quest 3 Hardware Test Report

**Date:** $(date +%Y-%m-%d)
**Tester:** [Your Name]
**Device:** Meta Quest 3
**OS Version:** [Quest OS Version]
**App Version:** 0.1.0

## Test Results

### Voice Runtime
- Recognition Accuracy: ___%
- Latency: ___s
- Status: PASS/FAIL

### Hand Runtime
- Tracking Accuracy: ___%
- Gesture Recognition: ___%
- Latency: ___ms
- Status: PASS/FAIL

### Eye Runtime
- Tracking Accuracy: ___%
- Latency: ___ms
- Status: PASS/FAIL

### Spatial Runtime
- Mesh Accuracy: ___%
- Object Detection: ___%
- Latency: ___ms
- Status: PASS/FAIL

### Avatar Runtime
- Rendering: PASS/FAIL
- Walking Animation: PASS/FAIL
- Speaking Animation: PASS/FAIL
- Presence Engine: PASS/FAIL
- Status: PASS/FAIL

### Mixed Reality Interface
- Passthrough: PASS/FAIL
- MR Rendering: PASS/FAIL
- UI Panels: PASS/FAIL
- Frame Rate: ___fps
- Status: PASS/FAIL

### Privacy Controls
- Permission Flows: PASS/FAIL
- Data Deletion: PASS/FAIL
- Indicators: PASS/FAIL
- Status: PASS/FAIL

### SCA-1R Integration
- Identity Vault: PASS/FAIL
- PCR: PASS/FAIL
- Cognitive Assembly: PASS/FAIL
- Planner: PASS/FAIL
- Status: PASS/FAIL

### Performance
- Frame Rate: ___fps (target: 72fps)
- Memory Usage: ___MB (target: < 2GB)
- Battery Usage: ___%/hour (target: < 20%/hour)
- Status: PASS/FAIL

### Stability
- 2-Hour Test: PASS/FAIL
- Stress Test: PASS/FAIL
- Edge Cases: PASS/FAIL
- Recovery: PASS/FAIL
- Status: PASS/FAIL

## Overall Status: PASS/FAIL

## Issues Found
1. [Describe any issues]
2. [Describe any issues]

## Recommendations
1. [Recommendations for fixes]
2. [Recommendations for improvements]
EOF
```

**Completion Checklist:**

- [ ] Quest 3 device prepared
- [ ] App deployed and launched
- [ ] Permissions granted
- [ ] Voice runtime tested
- [ ] Hand runtime tested
- [ ] Eye runtime tested
- [ ] Spatial runtime tested
- [ ] Avatar runtime tested
- [ ] MR interface tested
- [ ] Privacy controls tested
- [ ] SCA-1R integration tested
- [ ] Performance tested
- [ ] Stability tested
- [ ] Test report documented
- [ ] All pass criteria met

**Estimated Total Time:** 18-20 hours

---

## Overall Completion Summary

### Total Estimated Time

- **Task 1: SDK Installation:** 2-3 hours
- **Task 2: SDK Integration:** 17-20 hours
- **Task 3: Model Fabric Connection:** 6-7 hours
- **Task 4: SCA-1R Cognitive Services Connection:** 9-10 hours
- **Task 5: 3D Avatar Rendering:** 20-28 hours
- **Task 6: Hardware Testing:** 18-20 hours

**Total: 72-88 hours (9-11 days of full-time work)**

### Prerequisites

- Quest 3 device ($499 if not owned)
- Development machine with:
  - 16GB RAM minimum (32GB recommended)
  - 8+ CPU cores
  - 50GB free storage
  - USB 3.0+ port
- Meta Developer Account (free)
- Stable internet connection for SDK downloads

### Recommended Timeline

**Week 1:**
- Day 1-2: SDK Installation (Task 1)
- Day 3-5: SDK Integration (Task 2)

**Week 2:**
- Day 1-2: Model Fabric Connection (Task 3)
- Day 3-5: SCA-1R Cognitive Services Connection (Task 4)

**Week 3:**
- Day 1-5: 3D Avatar Rendering (Task 5)

**Week 4:**
- Day 1-3: Hardware Testing (Task 6)
- Day 4-5: Bug fixes and optimization

### Success Criteria

All 6 tasks complete when:
- [ ] All SDKs installed and configured
- [ ] All TODO comments replaced with actual SDK calls
- [ ] Model Fabric connected and working
- [ ] SCA-1R cognitive services connected and working
- [ ] 3D avatar renders in XR
- [ ] All features tested on Quest 3 device
- [ ] Performance meets targets (72fps, latency, memory, battery)
- [ ] Stability verified (no crashes, no memory leaks)

### Next Steps After Completion

1. **Quest Store Submission:**
   - Prepare store listing assets
   - Write privacy policy
   - Submit content rating
   - Submit for review

2. **Continuous Improvement:**
   - Collect user feedback
   - Optimize performance
   - Add new features
   - Fix bugs

3. **Documentation:**
   - Update user guide
   - Update developer guide
   - Create troubleshooting guide

---

**Document Created:** 2026-10-31
**Author:** Devin
**Version:** 1.0.0
