# SIGIL OS - User Manual

**Version:** 1.0.0
**Last Updated:** 2026-10-07

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [The Chat Interface](#the-chat-interface)
3. [Model Fabric](#model-fabric)
4. [Dream Weaving](#dream-weaving)
5. [Avatar System](#avatar-system)
6. [Theme Customization](#theme-customization)
7. [Meta Quest 3 Integration](#meta-quest-3-integration)
8. [Advanced Features](#advanced-features)
9. [Keyboard Shortcuts](#keyboard-shortcuts)
10. [FAQ](#faq)

---

## Getting Started

### First Launch

When you first launch SIGIL OS, you'll see:

1. **Welcome Screen** - Introduction to SIGIL OS
2. **Configuration Wizard** - Set up your preferences
3. **Model Selection** - Choose your AI model
4. **Avatar Customization** - Create your digital companion

### Basic Workflow

1. **Start the API Server** (if not auto-started)
2. **Launch the UI** - `sigil-ui` or click the desktop icon
3. **Begin Chatting** - Type your message in the chat interface
4. **Customize** - Adjust themes, avatars, and settings as needed

---

## The Chat Interface

### Main Components

```
┌─────────────────────────────────────────────┐
│ SIGIL OS  [Settings] [Dream Weaving] [Avatar]│
├─────────────────────────────────────────────┤
│                                             │
│  Avatar Display (left side)                 │
│  ┌─────────┐                                │
│  │         │                                │
│  │  🤖     │                                │
│  │         │                                │
│  └─────────┘                                │
│                                             │
│  Chat History (center)                      │
│  ┌───────────────────────────────────────┐  │
│  │ User: Hello!                          │  │
│  │ ───────────────────────────────────   │  │
│  │ SIGIL: Hello! How can I help you      │  │
│  │       today?                          │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  Input Area (bottom)                        │
│  ┌───────────────────────────────────────┐  │
│  │ Type your message...          [Send]   │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### Chat Features

**Message Types:**
- **User Messages** - Your questions and commands
- **Assistant Messages** - AI responses
- **System Messages** - Notifications and status updates
- **Dream Messages** - Insights from Dream Weaving (if enabled)

**Message Controls:**
- **Copy** - Copy message to clipboard
- **Regenerate** - Ask for a different response
- **Edit** - Edit your previous message
- **Delete** - Remove message from history

**Voice Input:**
- Click the microphone icon to use voice input
- Supports speech-to-text
- Requires microphone permission

---

## Model Fabric

### Understanding Models

SIGIL OS supports multiple AI models through the Model Fabric layer:

**Current Models:**
- **Qwen 7B** - Primary model (Alibaba)
- **Qwen 14B** - Larger variant (coming soon)
- **Custom Models** - Add your own via Modelfile

### Model Selection

1. Open **Settings** → **Model Fabric**
2. Select your preferred model from the dropdown
3. Click **Apply**
4. Restart the service if prompted

### Modelfile Format

Create custom model configurations using Modelfile:

```toml
# Modelfile for custom model
[model]
name = "my-custom-model"
family = "custom"
version = "1.0"

[parameters]
temperature = 0.7
top_p = 0.9
top_k = 40
max_tokens = 2048

[capabilities]
text_generation = true
code_generation = true
multilingual = true
```

Place your Modelfile in `~/.sigil-os/models/` and SIGIL OS will detect it.

---

## Dream Weaving

### What is Dream Weaving?

Dream Weaving is SIGIL OS's revolutionary self-evolving cognitive system. It enables the system to:

- Enter dream-like states for unconstrained association
- Reflect on its own reasoning patterns
- Evolve cognitive pathways through controlled mutation
- Generate novel insights through cross-pollination
- Remember every evolutionary step with full provenance

### Activating Dream Weaving

1. Click the **Dream Weaving** button in the toolbar
2. Enable **Dream State** toggle
3. Configure your preferences:
   - **Dream Cycle Duration** - How long each dream lasts
   - **Association Depth** - How deep associations go
   - **Insight Threshold** - Minimum confidence for insights

### Dream Weaving Features

**Dream Cycles:**
- SIGIL OS enters "dream states" between conversations
- Generates associations and insights
- Cross-pollinates ideas from different contexts

**Self-Reflection:**
- Analyzes reasoning patterns
- Detects potential biases
- Suggests cognitive improvements

**Cognitive Evolution:**
- Proposes pathway mutations
- Requires your approval for changes
- Full rollback capability

**Evolutionary History:**
- Every change is tracked
- Full provenance chain
- Revert to any previous generation

### Safeguards

Dream Weaving includes built-in safeguards:

- **Evolutionary Bounds** - Maximum mutation magnitude
- **Approval Required** - All mutations need your approval
- **Rollback Mechanism** - Revert any unwanted changes
- **Provenance Tracking** - Every step is recorded

---

## Avatar System

### Avatar Types

SIGIL OS supports multiple avatar styles:

1. **Realistic** - Photorealistic digital humans
2. **Stylized** - Cartoon/anime style
3. **Procedural** - Algorithmically generated
4. **Custom** - Upload your own avatar

### Avatar Customization

1. Click the **Avatar** button in the toolbar
2. Choose your avatar style
3. Customize features:
   - **Face Shape** - Select from presets
   - **Hair Style** - Choose hair options
   - **Eye Color** - Select eye color
   - **Skin Tone** - Adjust skin tone
   - **Clothing** - Choose outfit
4. Click **Apply**

### Avatar Morphing

Avatars can morph in real-time based on:

- **Emotion** - Avatar expresses current emotion
- **Topic** - Avatar changes based on conversation topic
- **Voice** - Avatar lip-syncs with voice output
- **User Preference** - Morph based on your style

Enable avatar morphing in **Settings** → **Avatar** → **Enable Morphing**.

---

## Theme Customization

### Built-in Themes

SIGIL OS includes 5 pre-configured themes:

1. **Light** - Clean, bright interface
2. **Dark** - Easy on the eyes, low light
3. **Blue** - Calming blue tones
4. **Green** - Nature-inspired green
5. **Purple** - Creative purple shades

### Applying Themes

1. Click **Settings** → **Themes**
2. Select your preferred theme
3. Preview in real-time
4. Click **Apply**

### Custom Themes

Create custom themes using YAML:

```yaml
# custom-theme.yaml
name: "My Custom Theme"
colors:
  background: "#1a1a2e"
  foreground: "#eaeaea"
  primary: "#16213e"
  secondary: "#0f3460"
  accent: "#e94560"
fonts:
  primary: "Arial"
  monospace: "Consolas"
  size: 14
```

Place your theme file in `~/.sigil-os/themes/` and it will appear in the theme selector.

---

## Meta Quest 3 Integration

### Setting Up Quest 3

**Prerequisites:**
- Meta Quest 3 headset
- Developer account with Meta
- Quest SDK installed (see Installation Guide)
- USB cable for connection

**Setup Steps:**

1. **Enable Developer Mode on Quest 3:**
   - Open Meta Quest app on phone
   - Go to Settings → Your Headset
   - Enable Developer Mode

2. **Install SIGIL OS on Quest 3:**
   - Connect Quest 3 via USB
   - Enable USB debugging
   - Run deployment script (coming soon)

3. **Configure SIGIL OS for Quest:**
   - Open SIGIL OS on desktop
   - Go to Settings → Quest 3
   - Enable "Connect to Quest"
   - Click "Pair Device"

### Quest 3 Features

**TrueHD Avatar Voice Assistant:**
- Voice recognition in MR
- Text-to-speech with realistic voice
- Avatar responds to voice commands

**Mixed Reality Interface:**
- Passthrough mode - See your real environment
- Spatial anchors - Pin UI to real-world locations
- Gesture controls - Use hand gestures to interact

**Personal Companion:**
- Your avatar follows you in MR
- Responds to voice and gestures
- Remembers context across sessions

**Spatial Mapping:**
- Automatic room scanning
- Environment understanding
- Adaptive UI placement

### Using Quest 3

1. **Launch SIGIL OS** on your Quest 3
2. **Put on headset** - Avatar appears in MR
3. **Voice Commands:**
   - "SIGIL, tell me about..."
   - "SIGIL, what's the weather?"
   - "SIGIL, start dream weaving"
4. **Gesture Controls:**
   - Point to select
   - Pinch to confirm
   - Wave to dismiss

---

## Advanced Features

### API Access

SIGIL OS provides a REST API for programmatic access:

**Health Check:**
```bash
curl http://127.0.0.1:8080/health
```

**Chat Endpoint:**
```bash
curl -X POST http://127.0.0.1:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello SIGIL!"}'
```

**Dream Weaving Endpoint:**
```bash
curl -X POST http://127.0.0.1:8080/api/dream/activate \
  -H "Content-Type: application/json" \
  -d '{"duration": 60}'
```

### CLI Usage

Command-line interface for power users:

```bash
# Start API server
sigil-api

# Start UI
sigil-ui

# Run in CLI mode
sigil-cli --interactive

# Query model directly
sigil-cli --query "What is SIGIL OS?"

# Enable dream weaving
sigil-cli --dream-enable

# Get system status
sigil-cli --status
```

### Configuration Files

Edit `~/.sigil-os/config.yaml` for advanced configuration:

```yaml
# Advanced configuration options
api:
  cors_origins:
    - "http://localhost:3000"
    - "https://yourdomain.com"
  rate_limit:
    requests_per_minute: 60

model:
  cache_size_gb: 10
  max_concurrent_requests: 4

dream_weaving:
  max_mutations_per_session: 5
  auto_apply_safe_mutations: false

logging:
  level: "info"
  file: "~/.sigil-os/logs/sigil.log"
```

---

## Keyboard Shortcuts

### Global Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Q` | Quit SIGIL OS |
| `Ctrl/Cmd + ,` | Open Settings |
| `Ctrl/Cmd + /` | Show keyboard shortcuts |

### Chat Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Send message |
| `Shift + Enter` | New line in message |
| `Ctrl/Cmd + ↑` | Previous message |
| `Ctrl/Cmd + ↓` | Next message |
| `Ctrl/Cmd + K` | Clear chat history |

### Dream Weaving Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + D` | Toggle Dream Weaving |
| `Ctrl/Cmd + R` | Trigger reflection |
| `Ctrl/Cmd + E` | View evolutionary history |

---

## FAQ

### General

**Q: Is SIGIL OS free?**
A: Yes, SIGIL OS is open-source and free to use.

**Q: What models does SIGIL OS support?**
A: Currently Qwen 7B. More models coming soon.

**Q: Can I use my own models?**
A: Yes, via the Modelfile format.

**Q: Does SIGIL OS require internet?**
A: Only for initial model download. Can run offline after.

### Dream Weaving

**Q: Is Dream Weaving safe?**
A: Yes, all mutations require approval and can be rolled back.

**Q: Can Dream Weaving modify system files?**
A: No, it's sandboxed and bounded by safeguards.

**Q: How do I disable Dream Weaving?**
A: Toggle it off in Settings → Dream Weaving.

### Quest 3

**Q: Do I need a Quest 3 to use SIGIL OS?**
A: No, it works on desktop too. Quest 3 is optional.

**Q: Will there be a mobile app?**
A: Coming soon!

**Q: Can I use SIGIL OS on other VR headsets?**
A: Currently Quest 3 only. More platforms planned.

### Troubleshooting

**Q: SIGIL OS won't start. What do I do?**
A: Check the logs in `~/.sigil-os/logs/` and see Installation Guide.

**Q: Model is slow. How can I speed it up?**
A: Use a GPU with CUDA support, or reduce model size.

**Q: Avatar doesn't appear.**
A: Ensure graphics drivers are up to date and Slint is properly initialized.

---

## Support

- **Documentation:** https://github.com/fuzzynetwork1989-alt/SIGIL-OS/tree/main/docs
- **GitHub Issues:** https://github.com/fuzzynetwork1989-alt/SIGIL-OS/issues
- **Discord:** (Coming soon)
- **Email:** support@sigil-os.com (Coming soon)

---

## Privacy & Security

SIGIL OS is designed with privacy in mind:

- All data stored locally by default
- No telemetry without consent
- Open-source code for transparency
- Cryptographic signing for all operations
- Dream Weaving mutations are warranted and auditable

For more details, see [SECURITY_MODEL.md](docs/SECURITY_MODEL.md).

---

Enjoy using SIGIL OS! 🚀
