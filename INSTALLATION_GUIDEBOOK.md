# SIGIL OS — First-Time Builder Installation Guidebook

**Goal:** Take SIGIL OS from "code on your computer" to "running online" to "ready for app stores," step by step. No prior experience assumed.

**Time estimate:** First pass ~2–4 hours (mostly downloads and waiting for builds). Store submissions take days–weeks of review after that.

---

## Part 0 — What You Are Installing

SIGIL OS has four pieces. You only need some of them depending on your goal:
.

| File | Purpose |
|---|---|
| `web-console/package.json` | Dependencies + scripts (`dev`, `build`, `start`) |
| `web-console/next.config.js` | Next.js configuration |
| `web-console/Dockerfile` | Container build for the web app |
| `web-console/src/` | All pages, components, API routes |
| `infra-platform/vercel/vercel.json` | ⚠️ Vercel deploy config — **contains placeholder URLs (`nexora.omega`) that must be fixed** |

### 4.2 Easiest path: Vercel (free, made for Next.js)

1. Go to https://vercel.com → sign up with GitHub.
2. **Add New → Project** → import `SIGIL-OS` → set **Root Directory** to `web-console`.
3. Framework preset: Next.js (auto-detected). Click **Deploy**.
4. After deploy, go to **Project → Settings → Environment Variables** and add:
   - `NEXT_PUBLIC_API_URL` = your API URL from Part 3 (e.g. `https://sigil-os-api.onrender.com`)
   - `NEXT_PUBLIC_APP_URL` = your Vercel URL (e.g. `https://sigil-os.vercel.app`)
5. Redeploy (Deployments → ⋯ → Redeploy) so the env vars take effect.

### 4.3 Fix the stale vercel.json (do this first)

`infra-platform/vercel/vercel.json` still points at old "nexora.omega" URLs. Either delete that file or update its `env` values to your real URLs before deploying via that path. If you deploy through the Vercel dashboard as above, you can ignore it.

**Online checklist:**
- [ ] Web console loads at your Vercel/Render URL
- [ ] Chat features that call the API actually reach `https://<api>/health`
- [ ] No CORS errors in the browser console (if you see them, the API needs a CORS entry for your web domain — check `sigil-core/api`)

---

## Part 5 — App Store Readiness (Mobile: iOS + Android)

The mobile app lives in `sigil-mobile/` (Expo). App stores reject apps missing icons, screenshots, privacy info, or a working build.

### 5.1 Files you MUST have/fix first

| File | Status | Action needed |
|---|---|---|
| `sigil-mobile/app.json` | ✅ Updated | Name `SIGIL OS`, bundle ID `com.sigilos.app`, splash moved to `expo-splash-screen` plugin (SDK 58 format) — keep or change before first submission (bundle IDs can't change later) |
| `sigil-mobile/assets/icon.png` | ✅ Generated | 1024×1024 store icon ("Sigil Eye" mark) |
| `sigil-mobile/assets/splash.png` | ✅ Generated | Splash logo, transparent PNG |
| `sigil-mobile/assets/adaptive-icon.png` | ✅ Generated | Android adaptive foreground (safe-zone padded) |
| `sigil-mobile/assets/favicon.png` | ✅ Generated | 48×48 PNG |
| `sigil-mobile/package.json` | ✅ Upgraded | Now Expo SDK 58 / RN 0.88 / React 19 — current as of Nov 2026 |
| `sigil-mobile/eas.json` | ✅ Created | EAS Build profiles (development/preview/production) — fill in store credentials before `eas submit` |
| Screenshots | ❌ Missing | 6.7" iPhone + 6.5" iPhone + iPad + Android phone screenshots (see 5.4) |
| Privacy policy URL | ❌ Missing | **Required by both stores.** Host a simple page on your website (`website/index.html` exists — add a privacy section) |

### 5.2 Icons — already generated ✅

The "Sigil Eye" icon set was generated on 2026-11-17 and all required files now exist in `sigil-mobile/assets/`. To regenerate or tweak the design:

```bash
cd assets/icons
npm install sharp          # one-time
node render-store-assets.mjs
```

Sources: `sigil-mark.svg` (full icon) and `sigil-mark-foreground.svg` (transparent mark for adaptive/splash). Edit those SVGs and re-run the script to restyle every asset at once. (`generate-icons.py`/`generate-icons.bat` is the older CairoSVG-based variant — it needs `pip install cairosvg pillow` plus a native Cairo library, which isn't installed on Windows by default.)

### 5.3 Build and submit with EAS (Expo's free-ish build service)

```bash
cd sigil-mobile
npm install
npm install -g eas-cli
npx eas login                  # free Expo account
eas init                       # links project to your Expo account (eas.json already exists)
```

`eas.json` already exists with development/preview/production build profiles. Before your first submit, edit `submit.production`:
- Android: set `serviceAccountKeyPath` to your Google Play service-account JSON (download from Play Console → Setup → API access), or remove the `submit` block and upload manually in Play Console.
- iOS: set `ascAppId` to your App Store Connect app ID (created in Part 5.4).

Then:

```bash
eas build --platform android --profile production   # ~15–30 min, gives you an .aab
eas build --platform ios --profile production       # needs Apple Developer account ($99/yr)
eas submit --platform android                       # uploads to Play Console
eas submit --platform ios                           # uploads to App Store Connect
```

### 5.4 Store listing assets checklist

**Both stores require:**
- [ ] App icon (1024×1024, no transparency for iOS)
- [ ] 4–8 screenshots per device size
- [ ] App name (≤30 chars), short description (≤80 chars), full description
- [ ] Category selection (e.g. "Productivity" or "Lifestyle")
- [ ] Privacy policy URL (publicly reachable)
- [ ] Content rating questionnaire (answer honestly)
- [ ] Data safety / privacy nutrition labels (declare what data the app collects — the app uses `expo-secure-store`, so declare "data stored on device")
- [ ] Working demo account if the app requires login

**Google Play extras:**
- [ ] Signed AAB (EAS does this automatically)
- [ ] Target API level must be recent (another reason to upgrade Expo SDK)
- [ ] Play Console app created, store listing filled, release promoted to production

**Apple extras:**
- [ ] Mac computer required for final submission steps (or use EAS Submit which handles most of it)
- [ ] App Store Connect app record created with same bundle ID `com.sigilos.app`
- [ ] Privacy "nutrition labels" completed
- [ ] Review notes explaining what the app does

**Realistic timeline:** Google Play review ~hours–7 days. Apple review ~24–48 hours typically, first app sometimes longer.

---

## Part 6 — Desktop App Store / Distribution

The desktop app is in `desktop-client/` (React + Tauri 2.0). Docs claim installers were built at `desktop-client/src-tauri/target/release/bundle/` — **check if those files still exist; `target/` folders are usually gitignored and may be gone.**

### 6.1 Files that matter

| File | Purpose |
|---|---|
| `desktop-client/package.json` | Frontend deps + `tauri:build` script |
| `desktop-client/src-tauri/tauri.conf.json` | App ID `com.sigil-os.desktop`, window config, icon list |
| `desktop-client/src-tauri/icons/` | `.ico`, `.png`, `.icns` bundle icons — verify all three exist |
| `desktop-client/src-tauri/Cargo.toml` | Rust side of the app |

### 6.2 Build installers — already built ✅ (2026-11-17)

Fresh installers were produced and verified at:

- `desktop-client/src-tauri/target/release/bundle/nsis/SIGIL OS_0.1.0_x64-setup.exe` (2.52 MiB)
- `desktop-client/src-tauri/target/release/bundle/msi/SIGIL OS_0.1.0_x64_en-US.msi` (3.79 MiB)

To rebuild after changes:

```bash
cd desktop-client
npm install
npm run tauri:build
```

Icons were regenerated with `npx tauri icon ../../assets/icons/sigil-icon-1024.png` (run inside `src-tauri/`) — this produced `icon.ico`, `icon.icns`, `icon.png`, and refreshed the Android/iOS icon sets. Requires Rust + Visual Studio Build Tools (Part 1). First build: ~15–60 min.

### 6.3 Distribution options (pick one)

1. **Direct download (easiest):** Host the `.exe`/`.msi` on your website (`website/index.html`) or GitHub Releases. Add code-signing later if Windows SmartScreen warns (cert costs ~$200–400/yr; unsigned apps show a scary warning but still install).
2. **Microsoft Store:** https://partner.microsoft.com — submit the MSIX/APPX package. Tauri can produce MSIX via `tauri build` with the right config, or use the Microsoft Store's desktop bridge. Free account, ~3-day certification.
3. **Mac/Linux:** `npm run tauri:build` on those OSes produces `.dmg`/`.AppImage`/`.deb`. macOS builds really should be done on a Mac.

**Desktop checklist:**
- [ ] `npm run tauri:build` completes
- [ ] Installer runs on a clean machine
- [ ] App icon shows correctly (not a default icon)
- [ ] App connects to your live API URL (check `desktop-client/src` for hardcoded `localhost` URLs — replace with the Part 3 URL)

---

## Part 7 — Master File Checklist ("Did I activate everything?")

### Must exist and be correct
- [ ] `Cargo.toml`, `Cargo.lock` — Rust workspace
- [ ] `Dockerfile` — API container image
- [ ] `render.yaml` — Render deploy config
- [ ] `docker-compose.yml` — local full-stack (optional but useful: `docker compose up` runs API + web + databases together)
- [ ] `web-console/package.json`, `next.config.js` — web app
- [ ] `sigil-mobile/app.json`, `package.json`, `App.tsx` — mobile app
- [x] `sigil-mobile/assets/icon.png`, `splash.png`, `adaptive-icon.png`, `favicon.png` — generated ("Sigil Eye" mark)
- [x] `sigil-mobile/eas.json` — created (fill in credentials before submit)
- [ ] `desktop-client/src-tauri/tauri.conf.json`, `icons/*` — desktop app
- [ ] `assets/icons/sigil-icon.svg` + `generate-icons.py` — icon source

### Must be created during this process
- [ ] `.env` files with real values (API keys if any features need them — check `web-console/src/lib/llm-provider.ts` and `src/app/api/*` routes)
- [ ] Privacy policy page (required by both app stores)
- [ ] Store listing text + screenshots (Part 5.4)
- [ ] GitHub repo pushed and public (or private + deploy integrations authorized)

### Known issues to fix before submission
- [x] `infra-platform/vercel/vercel.json` — fixed to SIGIL OS URLs (2026-11-17)
- [x] `sigil-mobile` upgraded to Expo SDK 58 / RN 0.88 / React 19 — `expo-doctor` 20/20, `expo export` bundles clean for iOS+Android
- [x] Desktop installers rebuilt with the real React UI — **note:** `desktop-client/index.html` previously shipped a vanilla-JS demo instead of the React app; it now uses the proper Vite entry (`src/main.tsx`)
- [ ] `docker-compose.yml` references services that may not all exist (`neo4j`, `qdrant`, `redis` images, `infra/database/init`) — verify before relying on it
- [ ] Some docs reference the old project name "NEXORA Omega" — cosmetic, but confusing; the canonical repo is SIGIL-OS
- [ ] `web-console/src/app/page.tsx` has mock/hardcoded "recent conversations" data — fine for demo, replace with real API data before calling it production

### Accounts you must create
- [ ] GitHub (have it)
- [ ] Render or other API host
- [ ] Vercel (or other web host)
- [ ] Expo account (free) — for EAS builds
- [ ] Google Play Console ($25) — for Android
- [ ] Apple Developer Program ($99/yr) — for iOS (requires a Mac for submission)
- [ ] Microsoft Partner Center (free) — optional, for Microsoft Store
- [ ] Domain name (optional, ~$10/yr) — e.g. `sigil-os.com`, for privacy policy + website + professional URLs

---

## Quick Reference — Commands Cheat Sheet

```bash
# Local dev (from repo root)
cargo build --release && ./target/release/api          # API on :8080
cd web-console && npm install && npm run dev          # Web on :3000
cd sigil-mobile && npm install && npx expo start      # Mobile dev

# Production builds
cd web-console && npm run build && npm start          # Web prod build
cd desktop-client && npm run tauri:build              # Desktop installers
cd sigil-mobile && eas build --platform all --profile production

# Health checks
curl http://localhost:8080/health                     # Local API
curl https://<your-api>.onrender.com/health           # Live API
```

---

## If You Only Do Three Things Today

1. **Run Part 2** — get `cargo build` + `npm run dev` working locally. Everything else builds on this.
2. **Deploy the API to Render** (Part 3) — 20 minutes, mostly waiting.
3. **Generate the mobile icons** (Part 5.2) — without them the app literally cannot be submitted to any store.

Everything else in this guide is filling in details around those three wins.

---

*Guide compiled from the actual repo contents on 2026-11-17. Files marked ❌/⚠️ were verified missing or stale at that date — re-check before you start.*
