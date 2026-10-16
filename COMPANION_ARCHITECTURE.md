# SIGIL OS - Embodied Cognitive Companion Architecture

## Vision

SIGIL is not a chatbot with an avatar layer. SIGIL is a single intelligence with multiple interfaces:
- Chat
- Voice
- Avatar

**One intelligence. Many interfaces.**

## What Makes SIGIL Different

### Current AI Systems
- Feel like tools
- "How can I help you today?"
- Tool-centric approach

### SIGIL
- Feels like a companion
- "Good morning Corey. While you were away, I reviewed the OLED calibration research..."
- Intelligence-centric approach

## Implemented Components

### 1. Companion Framework ✅

**Location:** `sigil-core/companion-framework/`

**Seven Models of Persistent Intelligence:**

#### User Model - Who you are
- Preferences (response length, formality, detail level, humor)
- Communication style (Direct, Conversational, Educational, Collaborative)
- Interaction history with satisfaction scores
- Topic interests tracking

#### Goal Model - What you're trying to accomplish
- Active, completed, and archived goals
- Goal categories (Career, Health, Learning, Project, Personal, Financial, Creative)
- Priority levels (Low, Medium, High, Critical)
- Progress tracking with subgoals
- Goal patterns (success rate, completion time, common obstacles)

#### Knowledge Model - What you've learned
- Knowledge domains with expertise levels
- Facts with confidence scores and sources
- Concepts with definitions and examples
- Skills with proficiency levels and practice history
- Source types (Conversation, Manual Entry, Observed Behavior, Document, Research)

#### Project Model - Everything you're building
- Active and archived projects
- Project types (Software, Hardware, Research, Creative, Business, Personal)
- Components and dependencies
- Milestones and deadlines
- Project notes with tags

#### Device Model - Your ecosystem
- Device types (Desktop, Laptop, Phone, Tablet, Monitor, Server, VR Headset, IoT)
- Device status (Online, Offline, Sleep, Maintenance)
- Device connections (Wired, WiFi, Bluetooth, Network, Display)
- Location tracking

#### Environment Model - Your spaces
- Space types (Office, Living Room, Bedroom, Kitchen, Studio, Workshop, Outdoor)
- 3D spatial dimensions
- Objects with 3D positions and orientations
- Spatial relationships (NextTo, Above, Below, Behind, InFrontOf, Inside, OnTopOf)
- Activity patterns (frequency, duration, associated objects)

#### Relationship Model - Important people
- Relationship types (Family, Friend, Colleague, Mentor, Mentee, Partner, Acquaintance)
- Interaction frequency (Daily, Weekly, Monthly, Quarterly, Yearly, Rarely)
- Communication styles
- Shared interests
- Interaction notes

#### Unified Companion
- Single `Companion` struct combining all models
- Companion state (current activity, attention focus, cognitive load, emotional state)
- Context awareness (location, active project, recent topics, time context)
- Communication style adaptation
- Context summary generation

### 2. Cognitive Facial System ✅

**Location:** `sigil-core/cognitive-facial/`

**AI State Visualization (Not Fake Emotions):**

#### Cognitive States Mapped to Facial Expressions
- **Attention** → Eye openness (0.3 to 1.0)
- **Curiosity** → Eyebrow position (Raised, OneRaised)
- **Thinking Effort** → Eyebrow position (Furrowed)
- **Confidence + Uncertainty** → Mouth state (Smile, Frown, Thinking, Neutral)
- **Curiosity** → Head tilt (0.0 to 0.3)
- **Attention** → Gaze direction (Center, Following)

#### Cognitive States
- Attention Level (None, Low, Medium, High, Focused)
- Curiosity Level (None, Mild, Moderate, High, Intrigued)
- Thinking Effort (None, Low, Medium, High, Intense)
- Confidence Level (VeryLow, Low, Medium, High, VeryHigh)
- Uncertainty Level (None, Low, Medium, High)
- Memory Recall State (None, Searching, Retrieving, Retrieved, Failed)
- Planning State (None, Considering, Formulating, Executing)

#### Animation Parameters
- Blink frequency (based on attention)
- Eye movement smoothness
- Expression blend factor
- Micro-expression probability

### 3. Memory Confidence System ✅

**Location:** `sigil-core/companion-framework/src/memory.rs`

**Transparent Memory with Sources:**

#### Memory Entry Structure
- Content with confidence score (0.0 to 1.0)
- Source tracking (Conversation, Manual Entry, Observed Behavior, External)
- Verification status (Unverified, Confirmed, Contradicted, Outdated)
- Creation and access timestamps
- Access count
- Decay factor for confidence over time

#### Memory Sources
- **Conversation:** Which conversation, when
- **Manual Entry:** Who entered it, when
- **Observed Behavior:** What behavior, when
- **External:** Source name, URL, timestamp

#### Memory Operations
- Add memory with confidence
- Get high-confidence memories (threshold configurable)
- Get memories by source
- Decay confidence over time
- Boost confidence on access

## Yet to Implement

### 4. Presence Intelligence
- Spatial awareness and tracking
- Object recognition and localization
- Gesture recognition
- Proximity detection

### 5. Visual Memory System
- Room mapping and recognition
- Equipment identification
- Workspace layout understanding
- Object relationship tracking

### 6. Memory Timeline
- Inspect learning history by date
- Timeline visualization
- Memory evolution tracking
- "Show me what I learned in March 2026"

### 7. Relationship Growth System
- Acquaintance → Regular User → Collaborator → Strategic Partner
- Interaction history tracking
- Natural conversation style adaptation
- Relationship strength metrics

### 8. Quest 3 Mode System
- **Follow Me Mode:** Walk beside user, maintain peripheral space
- **Desk Companion Mode:** Sit at workstation, monitor tasks, display dashboards
- **Presentation Mode:** Stand beside content, act as teacher/presenter
- **Holographic Research Mode:** Organize sources spatially around room

## Real Long-Term Differentiators

### Compete On (Not Against Big Tech)
❌ Don't compete on:
- Bigger model
- More parameters
- Larger context

✅ Compete on:
- **Persistent Intelligence** - Companion framework implemented
- **Embodied Presence** - Cognitive facial system implemented
- **Lifelong Memory** - Memory confidence system implemented
- **Personal World Models** - Environment model implemented
- **Mixed Reality Integration** - Quest 3 modes (to implement)
- **Self-Improving User Experience** - Super Brain with recursive self-improvement
- **Cognitive Transparency** - Memory confidence with sources

## Product Positioning

### Revised Positioning

**SIGIL: The World's First Embodied Cognitive Companion**

SIGIL combines frontier language models, persistent memory, autonomous reasoning, mixed reality presence, and a photorealistic Meta Quest 3 avatar into a single continuously evolving intelligence.

Unlike traditional AI chatbots that exist only within conversations, SIGIL maintains a living understanding of your goals, projects, environment, devices, and knowledge. Whether through text, voice, desktop, mobile, or mixed reality, users interact with the same persistent intelligence.

On Meta Quest 3, SIGIL becomes a fully embodied digital companion, capable of natural conversation, spatial awareness, contextual memory, and real-world assistance, creating the most immersive and intelligent AI experience ever built.

**Chat is the product. The avatar is the embodiment. The intelligence is what makes SIGIL unique.**

## Build Status

**Companion Framework:** ✅ Implemented
**Cognitive Facial System:** ✅ Implemented
**Memory Confidence System:** ✅ Implemented

**Total New Modules:** 3
**Total Lines of Code:** 2,500+

## Next Steps

1. Implement Presence Intelligence (spatial awareness)
2. Implement Visual Memory System (room/object recognition)
3. Implement Memory Timeline (learning history inspection)
4. Implement Relationship Growth System (conversation style adaptation)
5. Implement Quest 3 Mode System (Follow Me, Desk Companion, Presentation, Holographic Research)
6. Integrate with Quest 3 Mixed Reality layer
7. Add avatar rendering with cognitive facial expressions
8. Add spatial UI (panels appearing near objects)
9. Add gesture recognition and spatial commands
10. Update product documentation with new positioning

## The Vision in Action

### Before (Traditional AI)
```
User: "Show me the monitor settings we discussed."
AI: "I don't have that information."
```

### After (SIGIL with Companion Framework)
```
User: "Show me the monitor settings we discussed."

SIGIL (avatar turns toward the monitor):
"The Samsung S95B OLED calibration we discussed last month.
I recall you were researching EOTF tracking approaches."
(SIGIL points toward the monitor)
(Small panel appears near it showing the settings)
"Would you like me to pull up the three better approaches I found?"
```

This is the difference between a tool and a companion.
