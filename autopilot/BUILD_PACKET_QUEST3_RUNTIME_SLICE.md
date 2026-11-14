# Build Packet — Quest 3 Android Runtime Slice (Phase 11 prep)

**Date:** 2026-11-11
**Scope:** Make the Quest 3 Android app actually build and installable; wire real
voice I/O; produce install + user manuals.

## Goal

`experience-surfaces/quest/android` produces a debug APK
(`app-debug.apk`, arm64-v8a) containing `libsigil_quest.so` (OpenXR instance
bootstrap) plus working Android `SpeechRecognizer`/`TextToSpeech` voice path.

## Non-goals

- Meta XR SDK integration (hand/eye/passthrough/spatial anchors) — stubs remain,
  documented as scaffold.
- Avatar rendering — `PresenceEngine` state machine only.
- On-device verification — no Quest 3 hardware attached in this session.

## Changes

- `XRActivity.java` — rewritten: permission flow (RECORD_AUDIO, CAMERA),
  background runtime init, status TextView, native lifecycle calls.
- `QuestRuntime.java` — `backendConnected` flag, `isBackendConnected()`,
  offline-mode status surfaced to UI.
- `VoiceAssistant.java` — rewritten: real `SpeechRecognizer` +
  `TextToSpeech` (was placeholder SDK wrappers returning simulated text);
  `OnCommandListener` callback into `QuestRuntime.handleVoiceCommand`;
  utterance progress listener resets `speaking`.
- `CognitiveServiceClient.java` — added missing `org.json.JSONArray` import.
- `ModelFabricClient.java` — null-safe `optJSONArray` parsing (was NPE +
  checked-exception compile error).
- `AndroidManifest.xml` — `@drawable/sigil_icon`, `usesCleartextTraffic`
  (dev only).
- `app/build.gradle` — consolidated buildTypes, `buildToolsVersion 36.0.0`,
  `externalNativeBuild` CMake 3.22.1, `abiFilters arm64-v8a`,
  `buildFeatures.prefab`, OpenXR loader AAR **1.1.42**, removed unused
  `fbjni` (prefab STL conflict), removed broken debug signingConfig.
- `cpp/CMakeLists.txt` — `find_package(OpenXR REQUIRED CONFIG)` +
  `OpenXR::openxr_loader` (prefab); fixed duplicate `add_library`.
- `cpp/native-lib.cpp` — added `<cstring>`.
- `res/drawable/sigil_icon.xml`, `res/values/styles.xml` — new resources.
- Root `build.gradle` — plugins DSL (AGP 8.1.4 / Kotlin 1.9.20) to satisfy
  `FAIL_ON_PROJECT_REPOS`.
- `gradlew`, `gradlew.bat`, `gradle/wrapper/*` — generated (Gradle 8.3).
- `deploy-quest.bat` — path fix (`%~dp0android`).
- Docs: `QUEST3_INSTALL_MANUAL.md`, `QUEST3_USER_MANUAL.md` (new).

## Environment fixes (this machine)

- Android SDK: installed `platforms;android-34`, `build-tools;34.0.0`,
  `ndk;25.1.8937393`+`25.2.9519653`, `cmake;3.22.1` via sdkmanager.
- JDK 17 (Temurin) installed to `C:\Users\Corey Smith\dev-tools\jdk17` —
  Android Studio JBR is Java 25, incompatible with Gradle 8.3.
- **Disk was 100% full** — freed ~5.6 GB by deleting Rust `target/` build
  cache (regenerable). Gradle build needs ~2 GB headroom.
- Temp-dir cleaner corrupted first JDK extract; re-installed outside Temp.

## Evidence

- `observed`: `gradle assembleDebug` → **BUILD SUCCESSFUL** (multiple
  iterations; final run 8m43s).
- `observed`: `app-debug.apk` = 11,624,990 bytes at
  `app/build/outputs/apk/debug/app-debug.apk`; `unzip -l` shows
  `lib/arm64-v8a/libsigil_quest.so` packaged.
- `observed`: native compile + link succeeded via prefab
  `OpenXR::openxr_loader`.
- `missing`: on-device install/launch — no Quest 3 attached; no
  `adb install` evidence. Feature functionality on hardware: `missing`.

## Risks

- OpenXR instance creation untested on-device (loader/runtime negotiation).
- `localhost:8080` backend URL requires `adb reverse tcp:8080 tcp:8080`.
- Cleartext HTTP enabled — dev only.
- Hand/eye/MR/vision/anchor classes are stubs pending Meta XR SDK.
- Gradle wrapper first run downloads gradle-8.3-bin (~130 MB).

## Rollback

All changes are additive or confined to `experience-surfaces/quest/`;
revert via git. APK can be uninstalled with `adb uninstall com.sigilos.quest`.

## Stop conditions

- No headset attached → device verification stops here (documented, not claimed).
