# Website Setup Guide

**Version:** 1.0.0
**Last Updated:** 2026-10-07

---

## Table of Contents

1. [Overview](#overview)
2. [Domain Registration](#domain-registration)
3. [Hosting Setup](#hosting-setup)
4. [Privacy Policy Website](#privacy-policy-website)
5. [Support Website](#support-website)
6. [Marketing Website](#marketing-website)
7. [Content Management](#content-management)
8. [Analytics and SEO](#analytics-and-seo)
9. [Budget Estimates](#budget-estimates)

---

## Overview

SIGIL OS requires three websites for app store submission:

1. **Privacy Policy** - privacy.sigil-os.com
2. **Support** - support.sigil-os.com
3. **Marketing** - sigil-os.com

This guide covers setting up all three websites with minimal cost and technical overhead.

---

## Domain Registration

### Domain Selection

**Primary Domain:**
- sigil-os.com (main marketing site)

**Subdomains:**
- privacy.sigil-os.com (privacy policy)
- support.sigil-os.com (support page)

**Alternative Domains (optional):**
- sigilos.com
- get-sigil-os.com
- sigil-os.app

### Registration Process

**Option 1: Namecheap (Recommended)**
1. Go to https://www.namecheap.com/
2. Search for "sigil-os.com"
3. Add to cart ($8-12/year)
4. Create account
5. Complete purchase
6. Enable WHOIS privacy (free)

**Option 2: Cloudflare (Best Value)**
1. Go to https://www.cloudflare.com/products/registrar/
2. Search for "sigil-os.com"
3. Register ($8-10/year)
4. Includes free WHOIS privacy
5. Includes free SSL
6. Includes free CDN

**Option 3: Google Domains**
1. Go to https://domains.google/
2. Search for "sigil-os.com"
3. Register ($12/year)
4. Free WHOIS privacy
5. Integration with Google services

### DNS Configuration

After registration, configure DNS:

```
A Records:
- sigil-os.com → 192.0.2.1 (your hosting IP)
- www.sigil-os.com → 192.0.2.1

CNAME Records:
- privacy.sigil-os.com → sigil-os.com
- support.sigil-os.com → sigil-os.com
```

---

## Hosting Setup

### Option 1: GitHub Pages (Free, Recommended)

**Pros:**
- Free hosting
- SSL included
- Custom domain support
- Easy deployment via Git
- Great for static sites

**Cons:**
- No backend/databases
- Limited to static sites

**Setup Steps:**

1. **Create GitHub Repository:**
   ```bash
   # Create repo: sigil-os-website
   git clone https://github.com/fuzzynetwork1989-alt/sigil-os-website.git
   cd sigil-os-website
   ```

2. **Choose Static Site Generator:**

   **Option A: Hugo (Fast, Simple)**
   ```bash
   # Install Hugo
   # Windows: choco install hugo-extended
   # macOS: brew install hugo
   # Linux: sudo apt install hugo

   # Create new site
   hugo new site sigil-os-website
   cd sigil-os-website
   ```

   **Option B: Jekyll (Ruby-based)**
   ```bash
   # Install Jekyll
   gem install jekyll bundler

   # Create new site
   jekyll new sigil-os-website
   cd sigil-os-website
   ```

   **Option C: Next.js (React-based)**
   ```bash
   # Install Node.js first
   npx create-next-app@latest sigil-os-website
   cd sigil-os-website
   ```

3. **Configure GitHub Pages:**

   In your GitHub repository:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: /docs or /root

4. **Add Custom Domain:**

   In GitHub Pages settings:
   - Add custom domain: sigil-os.com
   - DNS will be provided
   - Add CNAME records to your domain registrar

5. **Deploy:**

   ```bash
   git add .
   git commit -m "Initial website"
   git push origin main
   ```

   GitHub Pages will automatically deploy.

### Option 2: Vercel (Free, Easiest)

**Pros:**
- Free tier
- Automatic SSL
- Custom domains
- Fast deployment
- Great for Next.js

**Cons:**
- Vendor lock-in

**Setup Steps:**

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd sigil-os-website
   vercel
   ```

3. **Add Custom Domain:**
   - Go to Vercel dashboard
   - Add domain: sigil-os.com
   - Update DNS as instructed

### Option 3: Netlify (Free, Popular)

**Pros:**
- Free tier
- Automatic SSL
- Custom domains
- Fast CDN
- Great for static sites

**Cons:**
- Vendor lock-in

**Setup Steps:**

1. **Sign up at https://www.netlify.com/**

2. **Connect GitHub:**
   - Authorize Netlify to access GitHub
   - Select your repository

3. **Add Custom Domain:**
   - Go to Domain settings
   - Add sigil-os.com
   - Update DNS as instructed

---

## Privacy Policy Website

### URL: privacy.sigil-os.com

### Content Structure

```markdown
# Privacy Policy

Last Updated: October 7, 2026

## 1. Introduction

SIGIL OS is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your information.

## 2. Data We Collect

### 2.1 Local Data
- Chat history (stored locally on your device)
- Avatar preferences (stored locally)
- Settings and configurations (stored locally)
- Model weights (stored locally, ~13GB)

### 2.2 Optional Data
- Crash reports (with your consent)
- Usage analytics (with your consent)
- Cloud sync data (if you enable cloud sync)

### 2.3 Data We Don't Collect
- Voice data (processed locally)
- Biometric data (processed locally)
- Location data (not collected)
- Personal identification information (not collected)

## 3. How We Use Your Data

### 3.1 Local Processing
All AI processing happens locally on your device. Your data never leaves your device unless you explicitly enable cloud features.

### 3.2 Optional Cloud Features
If you enable cloud sync:
- Data is encrypted before upload
- Stored in secure cloud storage
- You can delete anytime

## 4. Data Sharing

We do not share your data with third parties for marketing purposes.

### 4.1 Third-Party Services
We may use:
- Crashlytics (for crash reports, with consent)
- Analytics services (with consent)
- Cloud storage providers (if you enable cloud sync)

## 5. Data Security

- Encryption at rest (user-managed)
- Encryption in transit (TLS 1.3)
- Secure key storage
- Regular security updates

## 6. Your Rights

### 6.1 Access
You can access all your data through the app settings.

### 6.2 Deletion
You can delete all data with one click in settings.

### 6.3 Export
You can export your data in JSON format.

### 6.4 Opt-Out
You can opt-out of crash reports and analytics in settings.

## 7. Children's Privacy

SIGIL OS is not intended for children under 13. We do not knowingly collect data from children.

## 8. International Transfers

SIGIL OS is designed to operate locally. Data is not transferred internationally unless you enable cloud sync.

## 9. Changes to This Policy

We will notify you of significant changes via:
- In-app notification
- Email (if provided)
- Website update

## 10. Contact Us

For privacy-related questions:
- Email: privacy@sigil-os.com
- GitHub: https://github.com/fuzzynetwork1989-alt/SIGIL-OS/issues

## 11. Compliance

This Privacy Policy complies with:
- GDPR (General Data Protection Regulation)
- CCPA (California Consumer Privacy Act)
- COPPA (Children's Online Privacy Protection Act)
```

### Implementation

**Using Hugo:**

```bash
# Create privacy policy page
hugo new privacy.md

# Add content (using the structure above)
```

**Using Jekyll:**

```bash
# Create privacy policy page
touch _pages/privacy.md

# Add content
```

**Using Next.js:**

```bash
# Create privacy policy page
mkdir -p app/privacy
touch app/privacy/page.tsx

# Add content as JSX
```

---

## Support Website

### URL: support.sigil-os.com

### Content Structure

```markdown
# Support Center

## Getting Started

### Installation
- [Installation Guide](https://github.com/fuzzynetwork1989-alt/SIGIL-OS/blob/main/INSTALLATION_GUIDE.md)
- [System Requirements](https://github.com/fuzzynetwork1989-alt/SIGIL-OS/blob/main/INSTALLATION_GUIDE.md#system-requirements)
- [Prerequisites](https://github.com/fuzzynetwork1989-alt/SIGIL-OS/blob/main/INSTALLATION_GUIDE.md#prerequisites)

### First Steps
- [Quick Start](https://github.com/fuzzynetwork1989-alt/SIGIL-OS#quick-start)
- [User Manual](https://github.com/fuzzynetwork1989-alt/SIGIL-OS/blob/main/USER_MANUAL.md)
- [Configuration](https://github.com/fuzzynetwork1989-alt/SIGIL-OS/blob/main/INSTALLATION_GUIDE.md#configuration)

## Documentation

### Core Features
- [Chat Interface](https://github.com/fuzzynetwork1989-alt/SIGIL-OS/blob/main/USER_MANUAL.md#the-chat-interface)
- [Model Fabric](https://github.com/fuzzynetwork1989-alt/SIGIL-OS/blob/main/USER_MANUAL.md#model-fabric)
- [Dream Weaving](https://github.com/fuzzynetwork1989-alt/SIGIL-OS/blob/main/USER_MANUAL.md#dream-weaving)
- [Avatar System](https://github.com/fuzzynetwork1989-alt/SIGIL-OS/blob/main/USER_MANUAL.md#avatar-system)
- [Quest 3 Integration](https://github.com/fuzzynetwork1989-alt/SIGIL-OS/blob/main/USER_MANUAL.md#meta-quest-3-integration)

### Advanced
- [API Access](https://github.com/fuzzynetwork1989-alt/SIGIL-OS/blob/main/USER_MANUAL.md#api-access)
- [CLI Usage](https://github.com/fuzzynetwork1989-alt/SIGIL-OS/blob/main/USER_MANUAL.md#cli-usage)
- [Configuration](https://github.com/fuzzynetwork1989-alt/SIGIL-OS/blob/main/USER_MANUAL.md#configuration-files)

## Troubleshooting

### Common Issues

#### Build Errors
- [Cannot find -lsqlite3](https://github.com/fuzzynetwork1989-alt/SIGIL-OS/blob/main/INSTALLATION_GUIDE.md#build-errors)
- [Candle dependency conflict](https://github.com/fuzzynetwork1989-alt/SIGIL-OS/blob/main/FINAL_COMPLETION_REPORT.md#known-limitations)

#### Runtime Errors
- [Model not found](https://github.com/fuzzynetwork1989-alt/SIGIL-OS/blob/main/INSTALLATION_GUIDE.md#runtime-errors)
- [Permission denied](https://github.com/fuzzynetwork1989-alt/SIGIL-OS/blob/main/INSTALLATION_GUIDE.md#runtime-errors)
- [Quest device not connected](https://github.com/fuzzynetwork1989-alt/SIGIL-OS/blob/main/INSTALLATION_GUIDE.md#runtime-errors)

### Get More Help

- [FAQ](https://github.com/fuzzynetwork1989-alt/SIGIL-OS/blob/main/USER_MANUAL.md#faq)
- [GitHub Issues](https://github.com/fuzzynetwork1989-alt/SIGIL-OS/issues)
- [Contact Support](#contact-support)

## Community

- [GitHub Discussions](https://github.com/fuzzynetwork1989-alt/SIGIL-OS/discussions)
- [Discord Server](https://discord.gg/sigilos) (Coming soon)
- [Twitter](https://twitter.com/SIGIL_OS) (Coming soon)

## Report a Bug

1. Check existing [GitHub Issues](https://github.com/fuzzynetwork1989-alt/SIGIL-OS/issues)
2. Create a new issue using the [bug report template](https://github.com/fuzzynetwork1989-alt/SIGIL-OS/blob/main/.github/ISSUE_TEMPLATE/bug_report.md)
3. Include:
   - OS and version
   - SIGIL OS version
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Logs/error messages

## Request a Feature

1. Check existing [feature requests](https://github.com/fuzzynetwork1989-alt/SIGIL-OS/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)
2. Create a new issue using the [feature request template](https://github.com/fuzzynetwork1989-alt/SIGIL-OS/blob/main/.github/ISSUE_TEMPLATE/feature_request.md)
3. Include:
   - Problem description
   - Proposed solution
   - Alternatives considered
   - Priority

## Security Issues

For security vulnerabilities, do NOT open a public issue.

Email: security@sigil-os.com (coming soon)

See [Security Policy](https://github.com/fuzzynetwork1989-alt/SIGIL-OS/blob/main/SECURITY.md)

## Contact Support

### Email
support@sigil-os.com (coming soon)

### GitHub
https://github.com/fuzzynetwork1989-alt/SIGIL-OS/issues

### Response Time
- Critical issues: 24 hours
- High priority: 48 hours
- Normal: 1 week
```

### Implementation

Similar to privacy policy, create a support page with:
- Navigation menu
- Search functionality
- FAQ accordion
- Contact form (coming soon)

---

## Marketing Website

### URL: sigil-os.com

### Content Structure

#### Hero Section

```html
<section class="hero">
  <h1>Your AI Companion with Self-Evolving Intelligence</h1>
  <p>SIGIL OS learns, reflects, and evolves with you. Powered by Dream Weaving™ technology.</p>
  <div class="cta-buttons">
    <a href="/download" class="btn-primary">Download Now</a>
    <a href="/learn-more" class="btn-secondary">Learn More</a>
  </div>
  <div class="hero-image">
    <!-- App screenshot or animated visualization -->
  </div>
</section>
```

#### Features Section

```html
<section class="features">
  <h2>Why SIGIL OS?</h2>
  <div class="feature-grid">
    <div class="feature">
      <icon>🤖</icon>
      <h3>TrueHD Avatar</h3>
      <p>Lifelike digital companion with real-time emotion expression</p>
    </div>
    <div class="feature">
      <icon>🧠</icon>
      <h3>Dream Weaving™</h3>
      <p>Self-evolving intelligence that learns from every conversation</p>
    </div>
    <div class="feature">
      <icon>🎨</icon>
      <h3>Beautiful UI</h3>
      <p>5 stunning themes with customizable avatars</p>
    </div>
    <div class="feature">
      <icon>🥽</icon>
      <h3>Quest 3 MR</h3>
      <p>Experience SIGIL OS in full mixed reality</p>
    </div>
    <div class="feature">
      <icon>🔒</icon>
      <h3>Privacy-First</h3>
      <p>All data stored locally by default</p>
    </div>
    <div class="feature">
      <icon>🚀</icon>
      <h3>Open Source</h3>
      <p>Fully inspectable code, community-driven</p>
    </div>
  </div>
</section>
```

#### How It Works Section

```html
<section class="how-it-works">
  <h2>How SIGIL OS Works</h2>
  <div class="steps">
    <div class="step">
      <div class="step-number">1</div>
      <h3>Download & Install</h3>
      <p>Get SIGIL OS for Windows, macOS, Linux, or Quest 3</p>
    </div>
    <div class="step">
      <div class="step-number">2</div>
      <h3>Customize</h3>
      <p>Create your avatar, choose your theme, set preferences</p>
    </div>
    <div class="step">
      <div class="step-number">3</div>
      <h3>Start Chatting</h3>
      <p>Begin your journey with your AI companion</p>
    </div>
    <div class="step">
      <div class="step-number">4</div>
      <h3>Watch It Evolve</h3>
      <p>Dream Weaving™ learns and adapts over time</p>
    </div>
  </div>
</section>
```

#### Screenshots Section

```html
<section class="screenshots">
  <h2>Beautiful Interface</h2>
  <div class="screenshot-carousel">
    <!-- 6 screenshots from VISUAL_ASSETS_GUIDE.md -->
  </div>
</section>
```

#### Testimonials Section (Future)

```html
<section class="testimonials">
  <h2>What Users Say</h2>
  <div class="testimonial-grid">
    <div class="testimonial">
      <p>"SIGIL OS feels like having a real companion. The evolution feature is amazing!"</p>
      <cite>- Sarah, Software Engineer</cite>
    </div>
    <!-- More testimonials -->
  </div>
</section>
```

#### Download Section

```html
<section class="download">
  <h2>Download SIGIL OS</h2>
  <div class="download-buttons">
    <a href="#" class="download-btn">
      <icon>🪟</icon>
      <span>Windows</span>
    </a>
    <a href="#" class="download-btn">
      <icon>🍎</icon>
      <span>macOS</span>
    </a>
    <a href="#" class="download-btn">
      <icon>🐧</icon>
      <span>Linux</span>
    </a>
    <a href="#" class="download-btn">
      <icon>🥽</icon>
      <span>Quest 3</span>
    </a>
  </div>
  <p class="version-info">Version 1.0.0 | Released October 7, 2026</p>
</section>
```

#### Footer

```html
<footer>
  <div class="footer-links">
    <a href="/privacy">Privacy Policy</a>
    <a href="/support">Support</a>
    <a href="https://github.com/fuzzynetwork1989-alt/SIGIL-OS">GitHub</a>
    <a href="https://twitter.com/SIGIL_OS">Twitter</a>
    <a href="https://discord.gg/sigilos">Discord</a>
  </div>
  <p>© 2026 SIGIL OS. All rights reserved.</p>
</footer>
```

### Implementation with Next.js (Recommended)

```bash
# Create Next.js project
npx create-next-app@latest sigil-os-website
cd sigil-os-website

# Install dependencies
npm install @heroicons/react framer-motion

# Create components
mkdir -p components
touch components/Hero.tsx
touch components/Features.tsx
touch components/Download.tsx

# Create pages
mkdir -p app
touch app/page.tsx
touch app/privacy/page.tsx
touch app/support/page.tsx
```

**Example Hero Component:**

```tsx
// components/Hero.tsx
import { ArrowRight } from '@heroicons/react/24/outline';

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <h1>Your AI Companion with Self-Evolving Intelligence</h1>
        <p>SIGIL OS learns, reflects, and evolves with you. Powered by Dream Weaving™ technology.</p>
        <div className="cta-buttons">
          <a href="/download" className="btn-primary">
            Download Now
            <ArrowRight className="icon" />
          </a>
          <a href="/learn-more" className="btn-secondary">
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
```

### Styling

**Option 1: Tailwind CSS (Recommended)**

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Option 2: CSS Modules**

```css
/* components/Hero.module.css */
.hero {
  padding: 100px 20px;
  text-align: center;
  background: linear-gradient(135deg, #6B46C1 0%, #3182CE 100%);
  color: white;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 20px;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 40px;
}
```

---

## Content Management

### Option 1: Static Site (Simplest)

**Pros:**
- Fast
- Secure
- Free hosting
- Version control

**Cons:**
- Requires technical knowledge
- No CMS

**Best for:** Initial launch

### Option 2: Headless CMS (Recommended)

**Options:**
- Sanity.io (free tier)
- Contentful (free tier)
- Strapi (self-hosted, free)

**Setup with Sanity.io:**

```bash
# Install Sanity CLI
npm install -g @sanity/cli

# Create project
sanity init

# Define schema
# studio/schemas/document.js
export default {
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
    },
  ],
}
```

### Option 3: WordPress (Traditional)

**Pros:**
- Easy to use
- Many plugins
- Large community

**Cons:**
- Requires hosting
- Security concerns
- Slower

**Best for:** Non-technical users

---

## Analytics and SEO

### Google Analytics

1. **Create GA4 Property:**
   - Go to https://analytics.google.com/
   - Create account
   - Add property: sigil-os.com

2. **Add to Website:**

   **Next.js:**
   ```tsx
   // app/layout.tsx
   import Script from 'next/script';

   export default function RootLayout({ children }) {
     return (
       <html>
         <head>
           <Script
             src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
             strategy="afterInteractive"
           />
           <Script id="google-analytics" strategy="afterInteractive">
             {`
               window.dataLayer = window.dataLayer || [];
               function gtag(){dataLayer.push(arguments);}
               gtag('js', new Date());
               gtag('config', 'G-XXXXXXXXXX');
             `}
           </Script>
         </head>
         <body>{children}</body>
       </html>
     );
   }
   ```

### SEO Optimization

**Meta Tags:**

```tsx
// app/layout.tsx
export const metadata = {
  title: 'SIGIL OS - Your AI Companion with Self-Evolving Intelligence',
  description: 'SIGIL OS is a revolutionary AI companion that learns, reflects, and evolves with you. Powered by Dream Weaving™ technology.',
  keywords: 'AI assistant, companion, dream weaving, self-evolving AI, mixed reality, Quest 3',
  openGraph: {
    title: 'SIGIL OS',
    description: 'Your AI Companion with Self-Evolving Intelligence',
    url: 'https://sigil-os.com',
    siteName: 'SIGIL OS',
    images: [
      {
        url: 'https://sigil-os.com/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
};
```

**Sitemap:**

```bash
# Generate sitemap
npm install next-sitemap

# next-sitemap.config.js
module.exports = {
  siteUrl: 'https://sigil-os.com',
  generateRobotsTxt: true,
};
```

---

## Budget Estimates

### Domain Registration
- sigil-os.com: $8-12/year
- WHOIS privacy: Free (included)

### Hosting
- GitHub Pages: Free
- Vercel: Free tier
- Netlify: Free tier
- **Total: $0**

### CMS (Optional)
- Sanity.io: Free tier
- Contentful: Free tier
- Strapi: Free (self-hosted)
- **Total: $0**

### SSL Certificate
- Included with GitHub Pages/Vercel/Netlify
- **Total: $0**

### Analytics
- Google Analytics: Free
- **Total: $0**

### **Total Annual Cost: $8-12 (domain only)**

---

## Timeline

### Week 1: Setup
- Register domain
- Set up hosting
- Configure DNS

### Week 2: Content
- Create privacy policy page
- Create support page
- Create marketing site structure

### Week 3: Design
- Design marketing site
- Create visual assets
- Implement responsive design

### Week 4: Launch
- Quality check
- Set up analytics
- Launch websites

**Total: 4 weeks**

---

## Next Steps

1. Register domain (sigil-os.com)
2. Choose hosting platform (GitHub Pages recommended)
3. Create privacy policy page
4. Create support page
5. Build marketing website
6. Set up analytics
7. Launch

---

*For specific questions, open a GitHub issue or email web@sigil-os.com (coming soon)*
