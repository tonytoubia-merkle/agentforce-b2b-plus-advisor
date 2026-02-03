# Agentforce B2B Plus Advisor

AI-powered B2B renewable energy advisor built with React, TypeScript, and Salesforce Agentforce. The application connects to an Agentforce agent to deliver conversational equipment recommendations for wind turbine components, solar panels, energy storage, and balance-of-system equipment — with generative AI scene backgrounds and product-in-scene compositing.

## Key Capabilities

- **Agentforce Chat** — Real-time conversational agent via Salesforce Einstein AI Agent API
- **Generative Scene Backgrounds** — AI-generated backgrounds via Google Imagen 4 or Adobe Firefly
- **Product-in-Scene Compositing** — Products staged into scenes using Imagen edit API
- **Salesforce CMS Persistence** — Generated images saved to CMS for reuse across sessions
- **Identity Capture** — Anonymous visitors can identify themselves mid-conversation
- **Activity Toasts** — Visual feedback for background data captures (contacts, events, profile enrichment)
- **Mock Mode** — Built-in mock agent for demo without Salesforce connection

## Quick Start

```bash
npm install
cp .env.example .env.local
# Fill in .env.local with your credentials (or leave VITE_USE_MOCK_DATA=true for demo mode)
npm run dev
```

The app runs at `http://localhost:5173`.

### Mock Mode

Set `VITE_USE_MOCK_DATA=true` in `.env.local` to use the built-in mock agent — no Salesforce connection needed. The mock agent responds to renewable energy keywords (solar, turbine, inverter, storage, etc.).

### Live Mode

Set `VITE_USE_MOCK_DATA=false` and configure the Agentforce environment variables. See [INSTRUCTIONS.md](INSTRUCTIONS.md) for full configuration details.

## Tech Stack

- **Frontend** — React 18, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend** — Express proxy server for API routing (+ Vercel serverless functions)
- **AI** — Salesforce Agentforce, Google Imagen 4, Adobe Firefly
- **Platform** — Salesforce CMS, Commerce Cloud, Data Cloud

## Documentation

- [Architecture & Setup Instructions](INSTRUCTIONS.md)
- [Agentforce API Setup Guide](AGENTFORCE_SETUP_GUIDE.md)
- [Troubleshooting](AGENTFORCE_TROUBLESHOOTING.md)
- [Quick Start API Setup](QUICK_START_API_SETUP.md)

## Environment Variables

Copy `.env.example` to `.env.local`. Key variables:

| Variable | Description |
|---|---|
| `VITE_USE_MOCK_DATA` | `true` for demo mode, `false` for live Agentforce |
| `VITE_AGENTFORCE_CLIENT_ID` | Salesforce Connected App consumer key |
| `VITE_AGENTFORCE_CLIENT_SECRET` | Connected App consumer secret |
| `VITE_AGENTFORCE_INSTANCE_URL` | Your Salesforce instance URL |
| `VITE_IMAGE_PROVIDER` | `imagen`, `firefly`, `cms-only`, or `none` |
| `VITE_IMAGEN_API_KEY` | Google AI API key (for Imagen) |

See [INSTRUCTIONS.md](INSTRUCTIONS.md) for the full list.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server + Express proxy |
| `npm run build` | TypeScript check + Vite build |
| `npm run test` | Run tests with Vitest |
| `npm run lint` | ESLint check |

## Vercel Deployment

The project is pre-configured for Vercel with serverless API functions.

### Deploy with Vercel CLI

```bash
npm install -g vercel
vercel
```

### Deploy via Vercel Dashboard

1. Import the GitHub repository at [vercel.com/new](https://vercel.com/new)
2. Vercel auto-detects the Vite framework
3. Add environment variables in Project Settings → Environment Variables

### Environment Variables for Vercel

Add these in the Vercel dashboard (Project Settings → Environment Variables):

| Variable | Required | Description |
|---|---|---|
| `VITE_USE_MOCK_DATA` | Yes | Set to `true` for demo, `false` for live |
| `VITE_AGENTFORCE_CLIENT_ID` | For live mode | Salesforce Connected App consumer key |
| `VITE_AGENTFORCE_CLIENT_SECRET` | For live mode | Connected App consumer secret |
| `VITE_AGENTFORCE_INSTANCE_URL` | For live mode | Your Salesforce instance URL |
| `VITE_AGENTFORCE_AGENT_ID` | For live mode | Your Agentforce agent ID |
| `VITE_IMAGE_PROVIDER` | No | `imagen`, `firefly`, `cms-only`, or `none` |
| `VITE_IMAGEN_API_KEY` | For Imagen | Google AI API key |

The serverless proxy (`api/proxy.js`) handles all API routing on Vercel, replacing the local Express server.
