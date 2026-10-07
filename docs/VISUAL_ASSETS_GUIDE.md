# Visual Assets Creation Guide

**Version:** 1.0.0
**Last Updated:** 2026-10-07

---

## Table of Contents

1. [App Icon Design](#app-icon-design)
2. [Screenshots](#screenshots)
3. [Promotional Images](#promotional-images)
4. [Video Trailer](#video-trailer)
5. [Tools and Resources](#tools-and-resources)
6. [File Formats and Specifications](#file-formats-and-specifications)

---

## App Icon Design

### Specifications

**Required Sizes:**
- 1024x1024 pixels (primary)
- 512x512 pixels (Google Play)
- 180x180 pixels (iOS)
- 192x192 pixels (Android adaptive icon)
- 48x48 pixels (favicon)

**Requirements:**
- PNG format (no transparency for app stores)
- RGB color space
- No alpha channel (except for adaptive icons)
- Rounded corners applied automatically by stores

### Design Process

#### Step 1: Concept Development

**Theme Ideas:**
- Brain/neural network pattern
- SIGIL symbol (geometric)
- Purple/blue gradient background
- Clean, modern aesthetic
- Recognizable at small sizes

**Color Palette:**
```
Primary Purple: #6B46C1
Secondary Blue: #3182CE
Accent Pink: #D53F8C
Background: #1A202C
White: #FFFFFF
```

#### Step 2: Design Tools

**Option 1: Professional Design Software**
- Adobe Illustrator (vector)
- Adobe Photoshop (raster)
- Figma (free, web-based)
- Sketch (Mac only)

**Option 2: Free Tools**
- Inkscape (free vector editor)
- GIMP (free raster editor)
- Canva (free web-based)
- Figma (free tier)

#### Step 3: Create the Design

**Using Figma (Recommended Free Option):**

1. Create a new file (1024x1024)
2. Create a geometric SIGIL symbol:
   - Draw a hexagon or octagon
   - Add internal circuit-like patterns
   - Use gradient fills (purple to blue)
3. Add background:
   - Solid dark color (#1A202C)
   - Subtle gradient
4. Add subtle glow effect:
   - Layer style → Outer Glow
   - Purple color, 20% opacity
5. Test at small sizes:
   - Zoom out to 25%
   - Ensure still recognizable

**Using Inkscape (Free Vector Editor):**

```bash
# Install Inkscape
# Windows: Download from https://inkscape.org/
# Linux: sudo apt install inkscape
# macOS: brew install --cask inkscape
```

1. Create new document (1024x1024)
2. Use the polygon tool to create the SIGIL symbol
3. Apply gradients using the Fill and Stroke dialog
4. Export as PNG: File → Export PNG Image

#### Step 4: Export Variants

**From Figma:**
1. Right-click the icon frame
2. Export → Add Export
3. Set sizes: 1024, 512, 180, 192, 48
4. Click Export

**From Inkscape:**
```bash
# Export at different sizes
inkscape icon.svg --export-filename=icon-1024.png --export-width=1024 --export-height=1024
inkscape icon.svg --export-filename=icon-512.png --export-width=512 --export-height=512
inkscape icon.svg --export-filename=icon-180.png --export-width=180 --export-height=180
```

#### Step 5: Quality Check

**Checklist:**
- [ ] No visible artifacts at 100% zoom
- [ ] Recognizable at 48x48 pixels
- [ ] Color contrast sufficient (WCAG AA)
- [ ] No transparency (except adaptive icons)
- [ ] File size < 1MB

---

## Screenshots

### Specifications

**Apple App Store:**
- iPhone 6.7" Display: 1290x2796 (landscape), 2796x1290 (portrait)
- iPad Pro 12.9": 2048x2732 (landscape), 2732x2048 (portrait)

**Google Play Store:**
- Phone: 1024x500 (landscape), 500x1024 (portrait)
- Tablet: 1808x992 (landscape), 992x1808 (portrait)

**Meta Quest Store:**
- Store Listing: 1920x1080 (landscape), 1080x1920 (portrait)

### Screenshot Descriptions

#### Screenshot 1: Main Chat Interface

**Content:**
- Avatar on left side (realistic style)
- Chat history in center
- "Hello! How can I help you today?" message
- Input field at bottom
- Dark theme with purple accents

**Creating the Screenshot:**

1. **Build and Run SIGIL OS:**
   ```bash
   cargo build --release
   ./target/release/sigil-ui
   ```

2. **Set Up the Scene:**
   - Open the chat interface
   - Type "Hello" to get a response
   - Set theme to Dark
   - Ensure avatar is visible

3. **Capture the Screenshot:**

   **Windows:**
   ```powershell
   # Use Snipping Tool or Win+Shift+S
   # Select the app window
   # Save as PNG
   ```

   **macOS:**
   ```bash
   # Use Cmd+Shift+4
   # Select the app window
   # Saves to Desktop
   ```

   **Linux:**
   ```bash
   # Use gnome-screenshot
   gnome-screenshot -w -f screenshot.png
   ```

4. **Resize to Specifications:**
   ```bash
   # Using ImageMagick
   convert screenshot.png -resize 1290x2796^ -gravity center -extent 1290x2796 ios-landscape.png
   convert screenshot.png -resize 2796x1290^ -gravity center -extent 2796x1290 ios-portrait.png
   ```

#### Screenshot 2: Avatar Customization

**Content:**
- Avatar customization panel
- Face shape options
- Hair style options
- Eye color picker
- Skin tone slider
- Clothing selector
- Preview on right side

**Creating the Screenshot:**

1. Open Avatar settings in SIGIL OS
2. Expand all customization options
3. Show a preview avatar
4. Capture screenshot
5. Resize to store specifications

#### Screenshot 3: Dream Weaving Dashboard

**Content:**
- Dream cycles visualization
- Insights generated list
- Evolutionary history graph
- Safeguard settings panel
- "Dream Weaving Active" indicator

**Creating the Screenshot:**

1. Enable Dream Weaving in settings
2. Run a dream cycle
3. Open Dream Weaving dashboard
4. Capture with visualization active
5. Resize to specifications

#### Screenshot 4: Theme Selection

**Content:**
- Theme selector showing 5 themes
- Live preview of each theme
- "Apply" button
- Current theme highlighted

**Creating the Screenshot:**

1. Open Theme settings
2. Show all 5 themes in grid
3. Capture with live preview
4. Resize to specifications

#### Screenshot 5: Meta Quest 3 Mixed Reality

**Content:**
- SIGIL OS avatar in MR environment
- Floating in a real room
- Spatial anchors visible
- Hand tracking indicators
- Passthrough mode active

**Creating the Screenshot:**

**Note:** This requires actual Quest 3 device and SDK installation.

1. Connect Quest 3 to development machine
2. Deploy SIGIL OS to Quest 3
3. Enable mixed reality mode
4. Position avatar in a real room
5. Use Quest screenshot feature (Oculus button + R1)
5. Transfer screenshots to PC
6. Resize to specifications

#### Screenshot 6: Voice Assistant

**Content:**
- Voice input interface
- Microphone button active (pulsing)
- Waveform visualization
- Real-time transcription
- "Listening..." indicator

**Creating the Screenshot:**

1. Enable voice input
2. Start speaking
3. Capture during transcription
4. Show waveform animation
5. Resize to specifications

### Screenshot Enhancement

**Adding UI Overlays (Optional):**

Use Figma to add explanatory text overlays:

1. Import screenshot to Figma
2. Add text labels for key features
3. Use arrows to point to UI elements
4. Export as PNG

**Adding Device Frames (Optional):**

Use device frame generators:
- Smartmockups.com
- Deviceframes.com
- Pexels mockup templates

---

## Promotional Images

### Specifications

**Apple App Store:**
- iPad Pro 10.9": 1200x900 (landscape), 900x1200 (portrait)
- iPad Pro 12.9": 2048x2732 (landscape), 2732x2048 (portrait)

**Google Play Store:**
- Phone: 1024x500 (landscape), 500x1024 (portrait)
- Tablet: 1808x992 (landscape), 992x1808 (portrait)

**Meta Quest Store:**
- Store Listing: 1920x1080 (landscape), 1080x1920 (portrait)

### Design Concepts

#### Concept 1: Feature Highlight

**Layout:**
- Left side: App screenshot
- Right side: Feature text
- Background: Gradient (purple to blue)
- Text: "Dream Weaving™ - Self-Evolving Intelligence"

**Creating in Figma:**

1. Create canvas at required size
2. Add gradient background
3. Import app screenshot
4. Add text overlay
5. Add SIGIL OS logo
6. Export as PNG

#### Concept 2: Lifestyle Shot

**Layout:**
- Person using SIGIL OS on device
- Avatar visible in background
- Text: "Your AI Companion"
- Modern, clean aesthetic

**Creating:**

1. Use stock photo from Pexels/Unsplash
2. Composite SIGIL OS UI overlay
3. Add text overlay
4. Export at required sizes

#### Concept 3: Abstract Visualization

**Layout:**
- Neural network visualization
- SIGIL symbol prominent
- Particle effects
- Text: "Intelligence Evolves"

**Creating:**

1. Use Adobe After Effects or Blender
2. Create 3D neural network animation
3. Render at high resolution
4. Export as PNG sequence
5. Composite with text

### Tools for Promotional Images

**Free Options:**
- Figma (design)
- Canva (templates)
- GIMP (image editing)
- Pexels (stock photos)
- Unsplash (stock photos)

**Paid Options:**
- Adobe Creative Cloud (Photoshop, Illustrator, After Effects)
- Sketch (Mac design tool)
- Shutterstock (stock photos)

---

## Video Trailer

### Specifications

**Apple App Store:**
- Duration: 15-30 seconds
- Format: M4V, MP4, or MOV
- Codec: H.264 or H.265
- FPS: Up to 30
- Resolution: 1080p or 720p

**Google Play Store:**
- Duration: 15-30 seconds
- Format: MP4 or MOV
- Codec: H.264
- FPS: Up to 30
- Resolution: 1080p or 720p

**Meta Quest Store:**
- Duration: 30-60 seconds
- Format: MP4
- Codec: H.264
- FPS: Up to 60
- Resolution: 1080p or higher

### Video Script

**Scene 1 (0-5s): Title Card**
```
Visual: SIGIL OS logo on dark background
Audio: Ambient electronic music
Text: "SIGIL OS"
Subtitle: "Your AI Companion with Self-Evolving Intelligence"
Transition: Smooth fade
```

**Scene 2 (5-10s): Chat Interface**
```
Visual: Chat interface with typing animation
Audio: Voiceover: "SIGIL OS learns from every conversation"
Action: User types "Hello", avatar responds with emotion
Transition: Slide from right
```

**Scene 3 (10-15s): Dream Weaving**
```
Visual: Dream Weaving dashboard animation
Audio: Voiceover: "Dream Weaving™ - It evolves with you"
Action: Evolutionary history visualization, insights appearing
Transition: Zoom in
```

**Scene 4 (15-20s): Customization**
```
Visual: Avatar customization screen, theme switching
Audio: Voiceover: "Customize everything"
Action: Avatar morphing, theme switching animation
Transition: Swipe
```

**Scene 5 (20-25s): Quest 3**
```
Visual: Quest 3 mixed reality footage
Audio: Voiceover: "Experience it in Mixed Reality"
Action: Hand gesture interaction, spatial anchors
Transition: Dissolve
```

**Scene 6 (25-30s): Call to Action**
```
Visual: App store buttons, website URL
Audio: Voiceover: "Download SIGIL OS today"
Text: "Available on App Store, Google Play, Meta Quest"
Action: Fade to black with logo
```

### Production Tools

**Free Options:**
- DaVinci Resolve (video editing)
- OBS Studio (screen recording)
- Audacity (audio editing)
- Blender (3D animation)

**Paid Options:**
- Adobe Premiere Pro (video editing)
- Final Cut Pro (Mac video editing)
- Adobe After Effects (motion graphics)
- Logic Pro (audio editing)

### Step-by-Step Production

#### Step 1: Screen Recording

**Recording the UI:**

```bash
# Using OBS Studio (Free)
# 1. Download and install OBS
# 2. Set up scene with app window
# 3. Configure recording:
#    - Resolution: 1920x1080
#    - FPS: 30
#    - Format: MP4
# 4. Record each scene separately
```

**Recording Quest 3:**

1. Use Oculus built-in recording
2. Press Oculus button + R1
3. Record 30-60 seconds of MR interaction
4. Transfer to PC via Oculus app

#### Step 2: Audio Recording

**Voiceover:**

```bash
# Using Audacity (Free)
# 1. Download and install Audacity
# 2. Connect microphone
# 3. Record voiceover for each scene
# 4. Apply noise reduction
# 5. Normalize audio
# 6. Export as WAV
```

**Music:**

Use royalty-free music:
- YouTube Audio Library
- Freesound.org
- Incompetech (Kevin MacLeod)
- Bensound

#### Step 3: Video Editing

**Using DaVinci Resolve (Free):**

1. **Import Media:**
   - File → Import Media
   - Import screen recordings
   - Import audio files

2. **Create Timeline:**
   - Create new timeline at 1920x1080, 30fps
   - Add video clips in order
   - Add audio tracks

3. **Edit Clips:**
   - Trim to 15-30 seconds
   - Add transitions between scenes
   - Sync audio with video

4. **Add Text:**
   - Add text overlays for titles
   - Use SIGIL OS brand colors
   - Ensure readability

5. **Export:**
   - Deliver settings → YouTube 1080p
   - Or custom: H.264, 30fps, 1080p
   - Export as MP4

#### Step 4: Quality Check

**Checklist:**
- [ ] Duration 15-30 seconds (30-60 for Quest)
- [ ] Resolution 1080p minimum
- [ ] Audio clear and balanced
- [ ] Text readable
- [ ] Smooth transitions
- [ ] No compression artifacts
- [ ] File size < 50MB

---

## Tools and Resources

### Design Tools

**Free:**
- Figma: https://www.figma.com/
- Inkscape: https://inkscape.org/
- GIMP: https://www.gimp.org/
- Canva: https://www.canva.com/
- DaVinci Resolve: https://www.blackmagicdesign.com/products/davinciresolve

**Paid:**
- Adobe Creative Cloud: https://www.adobe.com/creativecloud.html
- Sketch: https://www.sketch.com/
- Affinity Designer: https://affinity.serif.com/designer

### Stock Resources

**Free:**
- Pexels: https://www.pexels.com/
- Unsplash: https://unsplash.com/
- Pixabay: https://pixabay.com/
- Freesound: https://freesound.org/

**Paid:**
- Shutterstock: https://www.shutterstock.com/
- Getty Images: https://www.gettyimages.com/
- AudioJungle: https://audiojungle.net/

### Icon Resources

- Flaticon: https://www.flaticon.com/
- IconFinder: https://www.iconfinder.com/
- Noun Project: https://thenounproject.com/

### Device Frames

- Smartmockups: https://smartmockups.com/
- Deviceframes: https://deviceframes.com/
- Pexels Mockups: https://www.pexels.com/mockups/

---

## File Formats and Specifications

### Image Formats

**PNG:**
- Best for: Icons, screenshots, UI elements
- Supports: Transparency
- Quality: Lossless
- Use for: All app store assets

**JPG:**
- Best for: Photos, promotional images
- Supports: No transparency
- Quality: Lossy (adjustable)
- Use for: Some promotional images

**SVG:**
- Best for: Vector graphics, icons
- Supports: Scalable
- Quality: Lossless
- Use for: Source files, icons

### Video Formats

**MP4:**
- Best for: General video
- Codec: H.264
- Use for: All app store videos

**MOV:**
- Best for: Apple-specific
- Codec: H.264 or ProRes
- Use for: Apple App Store

**M4V:**
- Best for: Apple App Store
- Codec: H.264
- Use for: Apple App Store

### Color Profiles

**sRGB:**
- Use for: All web and app store assets
- Ensures consistent colors across devices

**P3:**
- Use for: iOS-specific assets
- Wider color gamut

### File Size Limits

**Apple App Store:**
- Icon: < 1MB
- Screenshots: < 10MB each
- Video: < 50MB

**Google Play Store:**
- Icon: < 1MB
- Screenshots: < 10MB each
- Video: < 50MB

**Meta Quest Store:**
- Icon: < 5MB
- Screenshots: < 20MB each
- Video: < 100MB

---

## Budget Estimates

### DIY (Free Tools)
- Icons: $0 (your time)
- Screenshots: $0 (your time)
- Promotional images: $0 (your time)
- Video: $0 (your time)
- **Total: $0**

### Freelance Design
- Icons: $300-500
- Screenshots: $200-300
- Promotional images: $300-500
- Video: $800-1200
- **Total: $1,600-2,500**

### Professional Agency
- Full package: $3,000-5,000
- Includes: Strategy, design, production

---

## Timeline

### DIY Timeline (2-3 weeks)
- Week 1: Icon design, screenshot capture
- Week 2: Promotional images, video production
- Week 3: Quality check, final touches

### Freelance Timeline (3-4 weeks)
- Week 1: Brief, concept development
- Week 2: Design production
- Week 3: Revisions, finalization
- Week 4: Delivery

---

## Next Steps

1. Choose design approach (DIY vs freelance)
2. Set up design tools
3. Create icon first (most critical)
4. Capture screenshots
5. Create promotional images
6. Produce video trailer
7. Quality check all assets
8. Prepare for app store submission

---

*For specific questions or issues, open a GitHub issue or email design@sigil-os.com (coming soon)*
