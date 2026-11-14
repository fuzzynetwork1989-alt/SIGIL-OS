# SIGIL OS - Build Instructions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI (for mobile)
- Git

## 🌐 Web Console Setup

### 1. Install Dependencies
```bash
cd web-console
npm install
```

### 2. Development Server
```bash
npm run dev
```
Access at: http://localhost:3000

### 3. Production Build
```bash
npm run build
npm start
```

### 4. Linting
```bash
npm run lint
```

## 📱 Mobile App Setup (React Native + Expo)

### 1. Install Dependencies
```bash
cd sigil-mobile
npm install
```

### 2. Start Development Server
```bash
npx expo start
```

### 3. Run on Specific Platform
```bash
# iOS Simulator
npx expo start --ios

# Android Emulator
npx expo start --android

# Web Browser
npx expo start --web
```

### 4. Build for Production
```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

## 🖥️ Desktop Client Setup

### 1. Install Dependencies
```bash
cd desktop-client
npm install
```

### 2. Development
```bash
npm run dev
```

### 3. Build
```bash
npm run build
```

## 🧩 Shared Package Setup

The shared package contains types and utilities used across all platforms.

```bash
cd packages/shared
npm install
npm run build
```

## 🏗️ Project Structure

```
SIGIL OS/
├── web-console/          # Next.js web application
│   ├── src/
│   │   ├── app/         # Next.js app router
│   │   ├── components/  # React components
│   │   └── lib/         # Utilities
│   └── package.json
├── sigil-mobile/        # React Native mobile app
│   ├── src/
│   │   ├── screens/     # Screen components
│   │   ├── services/    # API & auth services
│   │   └── navigation/  # Navigation config
│   └── package.json
├── desktop-client/      # Electron desktop app
│   ├── src/
│   └── package.json
├── packages/
│   └── shared/          # Shared types & utilities
├── sigil-core/          # Rust core (cognitive runtime)
├── noetic-substrate/    # Noetic substrate modules
├── anchor-governance/   # Governance modules
└── inference-kernel/    # Inference kernel
```

## 🔧 Environment Configuration

### Web Console (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

### Mobile App (app.config.js)
```javascript
export default {
  extra: {
    apiUrl: process.env.API_URL || 'http://localhost:3001',
  },
};
```

## 🧪 Testing

### Web Console
```bash
cd web-console
npm test
```

### Mobile App
```bash
cd sigil-mobile
npm test
```

## 🚢 Deployment

### Web Console (Vercel)
```bash
npm install -g vercel
vercel
```

### Mobile App (App Store / Play Store)
```bash
# Configure EAS
eas build:configure

# Build for distribution
eas build --platform ios --profile production
eas build --platform android --profile production
```

## 🔐 Security Notes

- Never commit `.env` files
- Use environment variables for sensitive data
- Enable 2FA on all production accounts
- Review dependencies regularly with `npm audit`

## 📊 Performance Optimization

### Web Console
- Enable Next.js Image optimization
- Use dynamic imports for code splitting
- Implement caching strategies

### Mobile App
- Use Hermes JavaScript engine
- Enable FlashList for long lists
- Optimize bundle size with tree shaking

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Clear Cache
```bash
# Web
rm -rf .next

# Mobile
npx expo start -c
```

### Dependency Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [Tailwind CSS](https://tailwindcss.com)

## 🆘 Support

For issues or questions:
1. Check the AGENTS.md file for agent instructions
2. Review the ARCHITECTURE.md for system design
3. Consult PROJECT_CONTRACT.md for requirements

---

**Note**: This is a Post-AI Operating System with Cryptographic Warrant. Ensure you understand the governance and security models before making changes to the core systems.
