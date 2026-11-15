# SIGIL OS Quest 3 — Installation Manual

**Version:** 1.0
**Date:** 2026-11-11
**Target:** Meta Quest 3 (Quest OS v50+), Windows development machine
**App:** `com.sigilos.quest` — SIGIL OS companion runtime

This manual walks you through **everything** needed to build and install the
SIGIL OS Quest 3 app on a physical headset, start to finish.

---

## Part 1 — Accounts and Headset Prep

### 1.1 Meta Developer Account

1. Go to <https://developer.oculus.com/> and sign in with your Meta account.
2. Complete developer verification (free for individuals).
3. You need this account to enable Developer Mode and to download the
   Meta XR SDK (formerly Oculus Mobile SDK) if you enable advanced features
   later (passthrough, hand tracking, eye tracking, spatial anchors).

### 1.2 Enable Developer Mode on the Quest 3

1. Install the **Meta Quest** app on your phone (iOS/Android).
2. Put on the headset and pair it with the phone app.
3. In the phone app: **Menu → Devices → your Quest 3 → Headset Settings →
   Developer Mode → toggle ON**.
4. Put the headset on again if asked; accept the developer terms.

### 1.3 Enable USB Debugging on the Quest 3

1. Put on the headset.
2. **Settings → System → Developer** (this menu only appears when Developer
   Mode is ON).
3. Enable **USB Connection** and choose **File Transfer / ADB** when prompted.

### 1.4 Connect and verify ADB

1. Connect the Quest 3 to your PC with a **USB-C cable** (USB 3.x recommended;
   charge-only cables will not work).
2. Put on the headset and **accept the "Allow USB debugging?" prompt**
   (check "Always allow from this computer").
3. On your PC, verify the device is visible:

```bat
adb devices
```

Expected output:

```
List of devices attached
<your-device-serial>    device
```

If the device shows `unauthorized`, reconnect and accept the prompt again.
If it does not appear at all, try a different cable/port and re-run
`adb kill-server && adb start-server`.

> **ADB location:** `C:\Users\<you>\AppData\Local\Android\Sdk\platform-tools\adb.exe`
> Add `%LOCALAPPDATA%\Android\Sdk\platform-tools` to your user `PATH`.

---

## Part 2 — SDKs and Tools to Download

You need **all** of the following. Versions are the ones this project is
configured for.

| # | Component | Version | Where to get it | Required? |
|---|-----------|---------|-----------------|-----------|
| 1 | Android Studio | Latest (Hedgehog or newer) | <https://developer.android.com/studio> | Recommended (includes SDK Manager + JBR) |
| 2 | Android SDK Platform | **android-34** (API 34) | Android Studio → SDK Manager → SDK Platforms | **Yes** |
| 3 | Android SDK Build-Tools | **36.0.0** (or 34.0.0) | SDK Manager → SDK Tools | **Yes** |
| 4 | Android SDK Platform-Tools | Latest | SDK Manager → SDK Tools (provides `adb`) | **Yes** |
| 5 | Android NDK (Side by side) | **25.1.8937393** (AGP 8.1.4 default) or 25.2.9519653 | SDK Manager → SDK Tools → NDK | **Yes** (native OpenXR layer) |
| 6 | CMake | **3.22.1** | SDK Manager → SDK Tools → CMake | **Yes** (native build) |
| 7 | JDK 17 | Temurin 17 or any JDK 17 | <https://adoptium.net/> | **Yes** (Gradle) — **note:** Android Studio's bundled JBR is Java 25 and does NOT work with Gradle 8.3/AGP 8.1.4 |
| 8 | Gradle | **8.3+** | Project wrapper `gradlew.bat` (generated) or <https://gradle.org> | **Yes** |
| 9 | OpenXR Loader for Android | **1.1.42** | Auto-fetched by Gradle: `org.khronos.openxr:openxr_loader_for_android` | **Yes** |
| 10 | Meta XR SDK (Oculus Mobile SDK) | Latest (v6x) | <https://developer.oculus.com/downloads/package/oculus-mobile-sdk/> — **requires developer account** | Only for advanced features (hand/eye/passthrough/spatial anchors) |
| 11 | Meta Quest Developer Hub (MQDH) | Latest | <https://developers.meta.com/horizon/documentation/unity/ts-mqdh-get-started/> | Optional (device manager GUI) |

### 2.1 Installing SDK components via sdkmanager (command line)

If you already have Android Studio, use **Tools → SDK Manager** and tick the
items above. Alternatively, from a terminal with `JAVA_HOME` set:

```bat
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk

"%ANDROID_HOME%\cmdline-tools\latest\bin\sdkmanager.bat" ^
  --sdk_root="%ANDROID_HOME%" ^
  "platforms;android-34" "build-tools;34.0.0" ^
  "ndk;25.1.8937393" "cmake;3.22.1"
```

Accept all licenses when prompted (`y`).

### 2.2 Environment variables (Windows)

Set these in **System Properties → Environment Variables** (User variables):

```
ANDROID_HOME   = C:\Users\<you>\AppData\Local\Android\Sdk
ANDROID_NDK_HOME = %ANDROID_HOME%\ndk\25.1.8937393
JAVA_HOME      = C:\Users\<you>\dev-tools\jdk17   (your JDK 17 install)
PATH           += %ANDROID_HOME%\platform-tools;%ANDROID_HOME%\cmdline-tools\latest\bin
```

> `sdkmanager` itself tolerates the newer Android Studio JBR, but **Gradle
> builds require JDK 17** — keep `JAVA_HOME` pointed at a JDK 17 for
> `gradlew` commands.

Restart your terminal after setting them.

---

## Part 3 — Build the App

### 3.1 Get the code

```bat
cd "C:\Users\Corey Smith\Devin Projects\SIGIL OS"
cd experience-surfaces\quest\android
```

### 3.2 Generate the Gradle wrapper (first time only)

If `gradlew.bat` is missing, generate it with a local Gradle 8.3+:

```bat
gradle wrapper --gradle-version 8.3
```

### 3.3 Build the debug APK

```bat
gradlew.bat assembleDebug
```

First build downloads dependencies and takes a while. Output:

```
app\build\outputs\apk\debug\app-debug.apk
```

The native library (`libsigil_quest.so`, arm64) is built by CMake/NDK and
contains the OpenXR instance bootstrap. If the NDK is missing the build
fails at the `externalNativeBuild` step — install item #5 above.

### 3.4 One-command deploy (optional)

From the repo root:

```bat
experience-surfaces\quest\deploy-quest.bat
```

This checks `adb devices`, builds the APK, uninstalls any old version,
installs, and launches `com.sigilos.quest/.MainActivity`.

---

## Part 4 — Connect SIGIL OS Backend (optional but recommended)

The app talks to the SIGIL OS API for device auth, context assembly, intent
detection, reasoning, and action planning. By default it uses
`http://localhost:8080`.

`localhost` on the **headset** is the headset itself — to reach the SIGIL OS
API running on your **PC**, forward the port over USB:

```bat
adb reverse tcp:8080 tcp:8080
```

Then start the SIGIL OS API on your PC (`cargo run -p api` or the `sigil`
CLI `serve` command). The app will then authenticate and use the full
SCA-1R pipeline. Without the backend it runs in **offline mode** (voice and
presence still work; cognitive services are skipped).

> Cleartext HTTP is enabled in the manifest (`usesCleartextTraffic`) for
> local development only. Remove it before any store submission.

---

## Part 5 — First Launch Checklist

1. `adb devices` shows your Quest 3 as `device`.
2. `adb reverse tcp:8080 tcp:8080` (if using the backend).
3. Install: `adb install -r app\build\outputs\apk\debug\app-debug.apk`
4. Launch: `adb shell am start -n com.sigilos.quest/.MainActivity`
   (or find **SIGIL OS Quest 3** in the headset library).
5. On first launch, grant **Microphone** and **Camera** permissions when the
   system dialog appears.
6. You should see a black screen with green status text:
   - `SIGIL OS is ready.` → backend connected.
   - `SIGIL OS running in offline mode.` → no backend; voice still works.

Verify logs any time with:

```bat
adb logcat -s MainActivity XRActivity QuestRuntime VoiceAssistant SIGIL_Quest_Native
```

---

## Part 6 — What Works Today vs. What Needs the Meta XR SDK

| Feature | Status | Notes |
|---------|--------|-------|
| App install/launch on Quest 3 | ✅ Works | Debug APK, arm64 |
| OpenXR instance creation | ✅ Native layer | `libsigil_quest.so` creates instance + system |
| Voice recognition (speech-to-text) | ✅ Works | Android `SpeechRecognizer` — say a command, it is transcribed |
| Text-to-speech replies | ✅ Works | Android `TextToSpeech` |
| Model Fabric intent detection | ✅ Wired | Calls `/api/v1/intent/detect` when backend is up |
| SCA-1R pipeline (PCR → mind → reason → plan → act) | ✅ Wired | `QuestRuntime.runVoicePipeline` |
| Offline mode | ✅ Works | Runtime continues without backend |
| Hand tracking / gestures | 🟡 Stub | Needs Meta XR SDK or OpenXR `EXT_hand_tracking` implementation |
| Eye tracking / gaze | 🟡 Stub | Needs Meta XR SDK eye tracking |
| Passthrough / MR | 🟡 Stub | Needs Meta XR SDK passthrough or OpenXR compositor layers |
| Spatial mapping / anchors | 🟡 Stub | Needs Meta XR SDK spatial anchor APIs |
| Spatial audio | 🟡 Stub | Needs Meta XR SDK spatializer |
| Avatar rendering | 🟡 Scaffold | `MRAvatarAssistant` Rust model exists; needs a renderer (Unity/Unreal/OpenXR) |
| Presence animations | 🟡 Scaffold | State machine exists; needs avatar renderer to display |
| Quest Store release build | 🟡 Partial | Release signing + store assets still needed |

The stub classes (`QuestHandTrackingSDK`, `QuestPassthroughSDK`,
`QuestEyeTrackingSDK`, `QuestSpatialMappingSDK`, `QuestCameraSDK`) are
clearly marked `// TODO:` placeholders inside each Java file — replace them
with the real Meta XR SDK calls once that SDK is installed. The surrounding
Java logic (gesture classification, anchor management, pipeline wiring) is
already in place.

---

## Part 7 — Troubleshooting

| Symptom | Fix |
|---------|-----|
| `adb devices` empty | Different USB-C cable (must be data, not charge-only); try another port; `adb kill-server && adb start-server`; re-accept USB debugging prompt |
| `unauthorized` | Reconnect, accept "Always allow" prompt in headset |
| Build fails: "failed to find Build Tools" | Install `build-tools;34.0.0` via sdkmanager or set `buildToolsVersion` in `app/build.gradle` |
| Build fails: "NDK not configured" | Install `ndk;25.2.9519653`; check `ANDROID_NDK_HOME` |
| `externalNativeBuild` CMake error | Install `cmake;3.22.1`; ensure NDK + CMake versions match `app/build.gradle` |
| `INSTALL_FAILED_UPDATE_INCOMPATIBLE` | `adb uninstall com.sigilos.quest` then reinstall |
| App installs but black screen, no status text | Check `adb logcat`; native lib may have failed — verify `libsigil_quest.so` packaged: `unzip -l app-debug.apk \| grep sigil_quest` |
| Voice does nothing | Grant Microphone permission; check `SpeechRecognizer.isRecognitionAvailable` in logcat; some regions lack Google speech service — sideload a speech service APK if needed |
| Backend calls fail | Run `adb reverse tcp:8080 tcp:8080`; confirm `curl http://localhost:8080/health` on PC returns OK |
| Cleartext HTTP blocked | Already allowed via manifest for dev; do NOT ship this to the store |

---

## Part 8 — Updating the App

```bat
cd experience-surfaces\quest\android
gradlew.bat assembleDebug
adb install -r app\build\outputs\apk\debug\app-debug.apk
```

Data (anchors, preferences) persists across `-r` reinstalls; use
`adb uninstall` for a clean slate.

---

## SDK Download Links (summary)

- Android Studio: <https://developer.android.com/studio>
- Android SDK downloads: <https://developer.android.com/studio#command-line-tools-only>
- Meta developer account: <https://developer.oculus.com/>
- Meta XR / Oculus Mobile SDK: <https://developer.oculus.com/downloads/package/oculus-mobile-sdk/>
- Meta Quest Developer Hub: <https://developers.meta.com/horizon/downloads/package/meta-quest-developer-hub/>
- OpenXR spec & headers: <https://www.khronos.org/openxr/> (headers already vendored in `app/src/main/cpp/openxr/`)
- OpenXR Loader for Android (Gradle): `org.khronos.openxr:openxr_loader_for_android:1.1.42` — provides `libopenxr_loader.so` **and** the OpenXR headers as a CMake prefab package (`find_package(OpenXR)` in `CMakeLists.txt`). `android.buildFeatures.prefab` is enabled in `app/build.gradle`.
