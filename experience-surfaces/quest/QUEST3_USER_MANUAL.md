# SIGIL OS Quest 3 — User Manual

**Version:** 1.0
**Date:** 2026-11-11
**App:** SIGIL OS Quest 3 (`com.sigilos.quest`)

This manual explains how to set up and use the SIGIL OS companion on a Meta
Quest 3 headset — the avatar/presence system, voice assistant, interaction
modes, and spatial features.

> **Honesty note:** Features marked *(implemented)* work in the current
> build. Features marked *(scaffold)* have working logic but need the Meta
> XR SDK and/or an avatar renderer before they are visible on-device.
> See the status table at the end of each section.

---

## 1. Getting Started

### 1.1 Launch the app

- Put on the Quest 3, open **Library → My Apps → SIGIL OS Quest 3**.
- Or launch from a PC: `adb shell am start -n com.sigilos.quest/.MainActivity`
- On first launch, **accept the Microphone and Camera permissions** — voice
  recognition and vision processing require them.

### 1.2 The status screen

The app starts on a status screen showing one of:

| Message | Meaning | What to do |
|---------|---------|------------|
| `SIGIL OS is ready.` | Connected to the SIGIL OS backend | Everything is available |
| `SIGIL OS running in offline mode.` | No backend reachable | Voice + presence still work; cognitive services are skipped |

Tap anywhere or wait — the runtime initializes automatically after
permissions are granted.

### 1.3 Connecting to the backend (optional)

SIGIL OS runs a cognitive backend on your PC (`sigil-core/api`). To let the
Quest 3 use the full pipeline (perception → cognition → reasoning →
action planning):

```bat
:: on the PC, while the Quest is connected by USB
adb reverse tcp:8080 tcp:8080

:: then start the SIGIL OS API
cd sigil-core\api
cargo run
```

Without this, the app runs in offline mode and still handles voice commands
locally (transcription and speech work; reasoning does not).

---

## 2. The Companion Avatar

SIGIL's companion is a **spatial presence** — a sigil-driven entity that
occupies your physical space, not a flat chat window. *(scaffold — needs the
avatar renderer + Meta XR SDK)*

### 2.1 How the avatar works

The `PresenceEngine` maintains a continuous presence state:

- **Presence states:** `DORMANT → ATTENTIVE → ENGAGED → FOCUSED`
- **Emotions:** `NEUTRAL, HAPPY, THINKING, SURPRISED, CONCERNED, EXCITED`
- **Interaction distance:** personal (~1–2 m), social (~2–4 m), presentation
  (~4+ m)

The avatar reacts to what you say and do: it turns toward your gaze, holds
eye contact during conversation, shifts posture when it starts reasoning,
and returns to a resting state when idle.

### 2.2 Avatar setup

Avatar customization (name, appearance, voice) is managed by the SIGIL OS
API — companion profiles are stored server-side via
`POST /api/v1/companion/profiles`. In the current Quest build the avatar is
created automatically on first launch with the name **"SIGIL"**.

To give it a name or change profile settings, use the SIGIL OS API or a
future settings UI (settings surface is a later phase).

### 2.3 What the avatar does for you

| Behavior | Trigger | Status |
|----------|---------|--------|
| Greets you on launch | App start | *(scaffold — presence state works, animation needs renderer)* |
| Turns head/body toward your gaze | Eye tracking (when enabled) | *(scaffold)* |
| Shows "thinking" posture | During reasoning pipeline | *(scaffold)* |
| Speaks replies via spatial audio | Voice command response | ✅ TTS works; spatial audio *(scaffold)* |
| Blinks, breathes, idles | Always-on presence | *(scaffold)* |
| Emotes on emotional cues | Detected sentiment | *(scaffold)* |

---

## 3. Voice Assistant

The voice assistant uses Android's `SpeechRecognizer` (speech-to-text) and
`TextToSpeech` — no cloud speech SDK required beyond what Android/Quest OS
provides.

### 3.1 Talking to SIGIL

1. Put on the headset and make sure the mic permission is granted.
2. **Speak a command** — the assistant is always listening (push-to-talk
   style wake is a future refinement).
3. SIGIL transcribes your speech, runs it through the intent pipeline, and
   speaks a response.

**Try saying:**

- *"SIGIL, what time is it?"*
- *"SIGIL, tell me about this room."* (vision pipeline)
- *"SIGIL, research quantum computing."*
- *"SIGIL, help me prepare a presentation."*

### 3.2 How a voice command flows

```
you speak
  → SpeechRecognizer transcribes
  → ModelFabricClient.detectIntent()   → /api/v1/intent/detect
  → CognitiveServiceClient pipeline    → perception → cognition → reasoning → action
  → TextToSpeech speaks the response
```

In **offline mode**, steps 2–3 are skipped and you get a spoken
acknowledgment that the backend is unreachable.

### 3.3 Voice settings

- Language follows the headset's system language (default `en-US`).
- TTS rate/pitch use Android defaults.
- Wake-word detection ("Hey SIGIL") is not yet implemented — the assistant
  processes each recognized utterance. *(scaffold)*

---

## 4. Interaction Modes

The companion supports five modes, each creating a different cognitive
assembly ("mind") on the backend:

| Mode | How to activate | What it does |
|------|-----------------|--------------|
| **Companion** | Default on launch | Casual conversation, personal assistance |
| **Collaboration** | Voice: *"SIGIL, let's collaborate"* | Joint problem-solving, shared tasks |
| **Research** | Voice: *"SIGIL, research mode"* | Deep-dive queries, literature-style answers |
| **Teaching** | Voice: *"SIGIL, teach me"* | Step-by-step explanations, Socratic style |
| **Presentation** | Voice: *"SIGIL, presentation mode"* | Audience-facing delivery, structured output |

*(Mode switching is wired in `PersonalCompanion`; voice triggers for mode
switching are scaffold — call the mode methods from the action plan or a
future UI.)*

---

## 5. Hand Tracking & Gestures

*(scaffold — requires Meta XR SDK or OpenXR `EXT_hand_tracking`)*

Planned gestures:

| Gesture | Action |
|---------|--------|
| Point at object | Vision query ("what is this?") |
| Pinch / grab | Select or manipulate virtual objects |
| Wave | Get SIGIL's attention |
| Thumbs up | Confirm an action |
| Open palm | Pause / hold |

The Java-side gesture classification and pipeline wiring already exist in
`HandTracking.java` — the device SDK calls are the remaining piece.

---

## 6. Eye Tracking & Gaze

*(scaffold — requires Meta XR SDK or OpenXR eye tracking extension)*

When enabled, SIGIL uses your gaze to:

- **Know what you're looking at** — vision queries run on the object in
  your gaze direction.
- **Drive avatar eye contact** — the companion looks at you when you look
  at it, and looks where you're looking during shared attention.
- **Reduce UI clutter** — panels fade in only when you look at them.

Enable eye tracking in **Quest Settings → Movement Tracking → Eye
Tracking** (requires the headset to have completed eye-tracking
calibration).

---

## 7. Passthrough & Mixed Reality

*(scaffold — requires Meta XR SDK passthrough or OpenXR compositor layers)*

SIGIL is designed as a **mixed-reality companion** — it lives in your real
room, not a void. Planned MR behaviors:

- The avatar stands in your physical space at a comfortable distance.
- **Spatial anchors** let you place SIGIL in a fixed spot — it stays there
  when you take the headset off and put it back on.
- Passthrough layers let virtual UI panels sit on real walls and tables.
- Hand-tracked interaction works in MR without controllers.

### Anchors

| Action | Status |
|--------|--------|
| Create anchor at current position | *(scaffold — `SpatialMapping.java` logic exists)* |
| Persist anchor across sessions | *(scaffold)* |
| Re-localize after room change | *(scaffold)* |

---

## 8. Vision Processing

*(scaffold — camera permission is granted; pipeline is wired)*

When you look at something and ask about it, SIGIL:

1. Captures a frame from the passthrough camera.
2. Sends it to `VisionProcessor` for scene analysis.
3. Feeds the result into the cognitive pipeline.
4. Speaks or displays what it found.

**Try:** *"SIGIL, what am I looking at?"* after granting Camera permission.

---

## 9. Spatial Audio

*(scaffold — needs Meta XR SDK spatializer)*

SIGIL's voice is intended to be **spatially anchored** — the companion's
voice comes from the direction of the avatar, not from everywhere at once.
Currently TTS plays through the standard Android audio path (works, but
not yet spatialized).

---

## 10. Privacy & Permissions

| Permission | Why | Can you deny? |
|------------|-----|---------------|
| Microphone | Voice commands | Yes — voice won't work |
| Camera | Vision queries, MR | Yes — vision/MR won't work |
| Internet | Backend connection | Required |
| Hand tracking | Gestures | Optional |
| Eye tracking | Gaze interaction | Optional |
| Face tracking | Expressions | Optional |
| Body tracking | Full-body presence | Optional |
| Spatial anchor | Persistent placement | Optional |

All sensor data is processed locally on the device or sent to **your** SIGIL
OS backend — nothing goes to third-party cloud services by default.

---

## 11. Status Summary

| Feature | Status | What works now |
|---------|--------|----------------|
| App launch & permissions | ✅ Implemented | Install, launch, grant mic/camera |
| Voice recognition (STT) | ✅ Implemented | Android SpeechRecognizer |
| Text-to-speech (TTS) | ✅ Implemented | Android TextToSpeech |
| Intent detection | ✅ Implemented | Model Fabric `/api/v1/intent/detect` |
| SCA-1R pipeline | ✅ Implemented | Perception→cognition→reasoning→action via backend |
| Offline mode | ✅ Implemented | Graceful degradation without backend |
| Companion modes | ✅ Implemented | 5 modes wired; voice triggers *(scaffold)* |
| Avatar rendering | 🟡 Scaffold | State machine exists; needs renderer |
| Presence animations | 🟡 Scaffold | States defined; needs renderer |
| Hand tracking | 🟡 Scaffold | Logic exists; needs Meta XR SDK |
| Eye tracking | 🟡 Scaffold | Logic exists; needs Meta XR SDK |
| Passthrough / MR | 🟡 Scaffold | Logic exists; needs Meta XR SDK |
| Spatial mapping / anchors | 🟡 Scaffold | Logic exists; needs Meta XR SDK |
| Spatial audio | 🟡 Scaffold | TTS works; spatializer needed |
| Vision processing | 🟡 Scaffold | Pipeline wired; camera capture needs Meta XR SDK |
| Wake word | 🟡 Scaffold | Not implemented |
| Store release | 🟡 Partial | Release signing + store assets needed |

---

## 12. Troubleshooting

| Problem | Fix |
|---------|-----|
| No response to voice | Check mic permission; check logcat `VoiceAssistant`; some regions need a speech service — see install manual Part 7 |
| Avatar invisible | Expected — renderer is scaffold; you're hearing voice + seeing status text |
| "Offline mode" | Run `adb reverse tcp:8080 tcp:8080` and start the API |
| Companion ignores gestures | Expected — hand tracking needs Meta XR SDK |
| Companion ignores gaze | Expected — eye tracking needs Meta XR SDK |
| Can't see passthrough | Expected — MR needs Meta XR SDK |

See `QUEST3_INSTALL_MANUAL.md` Part 7 for build/deploy troubleshooting.
