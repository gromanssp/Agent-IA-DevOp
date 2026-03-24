# Agent-IA-DevOp

A modern Angular 21 chat application that allows users to manage VPS infrastructure through natural language conversations (Spanish). An AI agent powered by N8n webhooks interprets commands and executes server operations like rebooting, monitoring, and power management.

## Quick Start

```bash
npm install
ng serve
```

Open http://localhost:4200

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Angular | 21.2.4 |
| Language | TypeScript | 5.9 |
| Reactive | RxJS | 7.8.0 |
| Charts | Chart.js + ng2-charts | 4.3 / 10.0 |
| Styling | CSS Custom Properties + Glassmorphism | — |
| Font | Google Fonts (Outfit) | — |
| Backend | N8n Webhook | — |
| Testing | Karma + Jasmine | 6.4 / 5.2 |
| Build | Angular CLI | 21.2.2 |

## Architecture Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        User (Browser)                       │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              ChatComponent (Angular 21)                │  │
│  │  - Captures natural language input                     │  │
│  │  - Maintains conversation history (last 10 messages)   │  │
│  │  - Renders messages, VPS cards, confirm dialogs        │  │
│  └──────────────────────┬────────────────────────────────┘  │
│                         │                                    │
│                         ▼                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   AgentService                         │  │
│  │  - sendMessage()     → POST /webhook/chat              │  │
│  │  - confirmAction()   → POST /webhook/chat (confirmed)  │  │
│  └──────────────────────┬────────────────────────────────┘  │
└─────────────────────────┼────────────────────────────────────┘
                          │ HTTP POST
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    N8n Webhook Server                        │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  /webhook/chat                                         │  │
│  │  - Receives user message + conversation context        │  │
│  │  - Processes with LLM (AI Agent)                       │  │
│  │  - Returns structured N8nResponse:                     │  │
│  │      { output, action?, vps_id?, confirm_required? }   │  │
│  └──────────────────────┬────────────────────────────────┘  │
└─────────────────────────┼────────────────────────────────────┘
                          │ JSON Response
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Response Handling                          │
│                                                             │
│  ┌─ confirm_required? ──────────┐                           │
│  │  YES → ConfirmDialogComponent│                           │
│  │         User confirms/cancels│                           │
│  │         ↓ (if confirmed)     │                           │
│  │         AgentService.confirm │                           │
│  └──────────────────────────────┘                           │
│                                                             │
│  ┌─ action present? ────────────┐                           │
│  │  YES → VpsCardComponent      │                           │
│  │         Shows action + VPS ID│                           │
│  └──────────────────────────────┘                           │
│                                                             │
│  ┌─ default ────────────────────┐                           │
│  │  Display AI response message │                           │
│  └──────────────────────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

## Project Structure

```
src/
├── app/
│   ├── models/
│   │   └── agent.models.ts           # ChatMessage, N8nRequest/Response, VpsInfo
│   ├── services/
│   │   ├── agent.service.ts          # N8n webhook HTTP communication
│   │   ├── theme.service.ts          # 12-color theme system
│   │   └── sidebar.service.ts        # Sidebar UI state
│   ├── pages/
│   │   ├── chat/                     # Main AI chat interface
│   │   └── not-found/                # 404 page
│   ├── layouts/
│   │   └── dashboard.component.ts    # Main layout (sidebar + navbar + content)
│   ├── components/
│   │   ├── sidebar/                  # Collapsible navigation sidebar
│   │   ├── navbar/                   # Header with theme switching
│   │   ├── vps-card/                 # VPS action result display
│   │   ├── confirm-dialog/           # Dangerous action confirmation
│   │   └── stat-card/                # Statistics display
│   ├── shared/components/            # 10 reusable UI components
│   ├── directives/                   # Tooltip & Collapse directives
│   └── environments/                 # Environment config
├── styles.css                        # Global styles & design system
└── index.html                        # Entry point
```

## Features

- **Natural Language Chat** — Interact with VPS servers using conversational Spanish
- **Confirmation Dialogs** — Double-check for dangerous operations (reboot, delete, power off)
- **VPS Action Cards** — Visual display of server operation results
- **Dark Glassmorphism UI** — Modern frosted glass aesthetic with backdrop blur
- **12 Color Themes** — 6 dark navbar + 6 colored navbar variants
- **Signal-based State** — Angular 21 signals for reactive state management
- **Standalone Components** — No NgModules, fully standalone architecture
- **OnPush Change Detection** — Performance optimized across all components
- **Suggestion Chips** — Preset command examples when chat is empty
- **10 Reusable Components** — Badge, Modal, Collapse, Progress, Table, Code Snippet, Spinner, Date Picker, Carousel
- **Chart.js Integration** — Data visualization ready
