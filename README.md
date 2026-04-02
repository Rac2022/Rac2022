# CE Strategy Snapshot

An interactive, consultative web app that helps therapy team decision-makers visualize what a cleaner, more centralized continuing education strategy could look like.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
npm start
```

Deploys seamlessly to Vercel — fully static-compatible.

## Project Structure

```
src/
├── app/
│   ├── page.tsx            # Main single-page app
│   ├── layout.tsx          # Root layout with metadata
│   └── globals.css         # Global styles
├── components/
│   ├── sections/           # Hero, HowItWorks
│   ├── stepper/            # Wizard, StepIndicator, 4 step forms
│   ├── results/            # All result display cards
│   └── ui/                 # Reusable UI primitives (Card, Badge, Button, Meter, Modal)
├── data/
│   ├── states.ts           # State config (easy to expand)
│   ├── exampleScenario.ts  # Pre-built demo scenario
│   └── options.ts          # Dropdown/multi-select labels
├── lib/
│   ├── scoring.ts          # Admin burden, fragmentation, blind spots
│   └── recommendations.ts  # Path selection, value cards, comparison, results generator
└── types/
    └── index.ts            # All TypeScript interfaces
```

## Customization Guide

### Recommendation Logic
Edit `src/lib/recommendations.ts`:
- `selectPath()` — adjust which recommendation path is chosen based on inputs
- `recommendationContent` — edit titles, rationales, bullets, and "why this fits" copy
- `generateValueCards()` — tune the value band thresholds
- `generateComparison()` — modify the side-by-side comparison rows

### Scoring Thresholds
Edit `src/lib/scoring.ts`:
- `scoreAdminBurden()` — adjust point values and risk level thresholds (0-3 Low, 4-6 Moderate, 7+ High)
- `scoreFragmentationRisk()` — same structure
- `generateBlindSpots()` — add/remove/edit conditional blind spot bullets

### State Metadata
Edit `src/data/states.ts`:
- Add new states by adding entries to the `stateConfigs` object
- Each state has: `label`, `abbreviation`, `renewalNote`, `liveHoursRelevant`, `resultNote`
- Data is illustrative — not compliance advice

### Example Scenario
Edit `src/data/exampleScenario.ts` to change the pre-built demo data.

### UI Copy & Labels
Edit `src/data/options.ts` to change dropdown labels and display text.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React icons
- No backend, no database, no auth — all client-side
