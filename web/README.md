# SIGIL OS Web UI

## Files

- `index.html` - Landing page with features and use cases
- `app.html` - Main web application interface
- `onboarding.html` - First-time user onboarding flow
- `themes.css` - Theme system with 5 color schemes
- `manifest.json` - PWA manifest

## Onboarding Flow

### First-Time User Experience

When a user first accesses SIGIL OS, they will see the onboarding flow:

1. **Welcome Slide** - Introduction to SIGIL OS
   - Explains cryptographic warrants
   - Highlights key features (Dream Weaving, TrueHD Avatar, Privacy-First)
   - Animated icon and modern design

2. **Features Slide** - Detailed feature explanation
   - Every action is cryptographically signed
   - Full rollback capability
   - Device-attested identity
   - No API keys or secrets
   - Self-evolving intelligence
   - Multi-platform support

3. **Get Started Slide** - Platform overview
   - Desktop Application
   - Web Interface
   - Mobile Apps (Coming Soon)
   - Meta Quest 3 MR

4. **Pricing Plans** - Choose a tier
   - **Free** ($0/mo) - Basic features
   - **Pro** ($19/mo) - Advanced features
   - **Enterprise** ($99/mo) - Team features

5. **Sign Up / Login** - Authentication
   - Email/password signup
   - Passkey (WebAuthn) for keyless authentication
   - No API keys

### Pricing Plans

#### Free ($0/month)
- Basic chat interface
- Single avatar
- 5 dream cycles/day
- Local processing
- Perfect for getting started

#### Pro ($19/month)
- Everything in Free
- Unlimited dream cycles
- Advanced Dream Weaving
- 5 custom avatars
- All themes
- Email support
- Most popular for individuals

#### Enterprise ($99/month)
- Everything in Pro
- Unlimited avatars
- Full API access
- Custom model training
- Dedicated support
- SLA guarantee
- Team collaboration
- For teams and organizations

### Authentication

**Keyless Cryptographic Warrant System:**

- **Sign Up:** Email/password or Passkey (WebAuthn)
- **Login:** Email/password or Passkey (WebAuthn)
- **No API Keys:** Uses Ed25519 cryptographic signatures
- **Device-Attested:** Your device proves its identity
- **Capability Leases:** Temporary authorizations that decay
- **Full Provenance:** Every action is traceable and reversible

### Skip Onboarding

Users can skip the onboarding flow by clicking "Skip" on any slide. The onboarding flow will only show once (stored in localStorage).

## Main Web App (app.html)

### Features

- **Chat Interface** - Real-time conversation with AI
- **Avatar Customization** - Customize avatar appearance
- **Dream Weaving Dashboard** - Monitor cognitive evolution
- **Sigil Explorer** - View cryptographic warrants
- **Settings Panel** - Configure all settings
- **Theme Switcher** - 5 themes (Light, Dark, Blue, Green, Purple)

### Pages

1. **Chat** - Main conversation interface
2. **Avatar** - Avatar customization controls
3. **Dream Weaving** - Evolution dashboard
4. **Sigil Explorer** - Cryptographic proof viewer
5. **Settings** - Configuration panel

### Theme System

Available themes:
- **Light** - Clean and bright
- **Dark** - Dark theme (default)
- **Blue** - Ocean blue calming
- **Green** - Forest green natural
- **Purple** - Royal purple elegant

## Landing Page (index.html)

### Sections

1. **Hero** - Introduction and call-to-action
2. **Features** - Core features with detailed descriptions
3. **Use Cases** - Real-world scenarios
4. **Architecture** - System architecture diagram
5. **Platforms** - Supported platforms
6. **Installation** - Quick installation guides

### Use Cases Covered

- Education & Learning
- Professional Development
- Healthcare Support
- Creative Collaboration
- Research & Analysis
- Smart Home Integration

## PWA Support

The web UI is PWA-ready with:
- Web manifest (`manifest.json`)
- Icon definitions (192x192, 512x512)
- Theme colors
- Shortcuts for Chat and Settings
- Standalone display mode

## Accessing the Web UI

### Development

1. Start the API server:
   ```bash
   # Windows
   run-api.bat
   
   # Linux/macOS
   make run
   
   # Docker
   docker-compose up -d
   ```

2. Open in browser:
   - Landing page: `web/index.html`
   - Web app: `web/app.html`
   - Onboarding: `web/onboarding.html`

### Production

When the API server is running, the web UI will be available at:
- `http://127.0.0.1:8080` (or configured host/port)

## Customization

### Themes

Edit `config/themes.yaml` to customize:
- Color palettes
- Avatar styles
- Icon packs
- Platform-specific overrides

### Onboarding

Edit `web/onboarding.html` to customize:
- Slide content
- Pricing plans
- Feature descriptions
- Authentication flow

### App UI

Edit `web/app.html` to customize:
- Page layouts
- Component styles
- Theme switcher
- Navigation

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

- [ ] Integrate with actual API server
- [ ] Implement real ML inference responses
- [ ] Add actual Dream Weaving data
- [ ] Implement Sigil Explorer with real data
- [ ] Add avatar rendering
- [ ] Implement actual authentication
- [ ] Add subscription management
- [ ] Add payment integration
