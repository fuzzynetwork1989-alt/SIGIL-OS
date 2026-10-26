# NEXORA Omega Web Console

Next.js production web application for NEXORA Omega.

## Features

- Streaming conversational workspace
- Projects, workspaces, and organization membership
- User-controlled memory management
- Task runs, approvals, artifacts, and activity history
- Connector and capability-permission management
- Usage, account, and billing controls
- Administrative and operator interfaces
- Next-generation sidebar with workspace awareness
- Theme packs and icon packs support
- Advanced settings for model routing and policies

## Routes

```text
/app
/app/home
/app/chat
/app/workspaces
/app/projects
/app/cognitive-processes
/app/world-state
/app/memory
/app/artifacts
/app/automations
/app/skills
/app/models
/app/tools
/app/integrations
/app/evaluations
/app/observability
/app/security
/app/approvals
/app/notifications
/app/billing
/app/settings
/app/admin
```

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with design system tokens
- **State**: React Context + server state
- **API**: Fetch with typed contracts
- **Deployment**: Vercel

## Local Development

```bash
pnpm install
pnpm dev
```

## Production Deployment

Deployed via Vercel with environment-specific configuration.

## Requirements

Every route must have:
- Authenticated data loading
- Authorization checks
- Empty/error/loading states
- Telemetry
- Accessibility
- Responsive behavior
- Deep linking
- Keyboard control
- Functional actions

No static screens or placeholder routes allowed.