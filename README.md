# Trend Radar

A local MVP web app for collecting, scoring, filtering, and reviewing early trend signals for business opportunities.

## Tech Stack

- **Next.js 15** (App Router, server-first)
- **TypeScript**
- **Tailwind CSS v4**
- **Prisma** with **SQLite**
- No auth, no external APIs

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard — signal cards with inline status controls, sticky filters |
| `/signals/new` | Add a new trend signal with scores |
| `/signals/[id]` | Signal detail — score breakdown, explanation, notes editor |
| `/digest` | Weekly digest — strongest, niche, easy-money, and crowded opportunities |
| `/review` | Analytics — charts for score distribution, source types, status breakdown |
| `/import` | CSV bulk import for trend signals |

## Getting Started

### Prerequisites

- Node.js 18+

### Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Create / sync the SQLite database
npx prisma db push

# Seed with sample data
npx tsx prisma/seed.ts

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Useful Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npx prisma studio` | Browse database in a GUI |
| `npx prisma db push` | Push schema changes to the database |
| `npx prisma generate` | Regenerate the Prisma client |
| `npx tsx prisma/seed.ts` | Seed the database with sample signals |

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Dashboard
│   ├── digest/               # Weekly digest page
│   ├── review/               # Analytics page
│   ├── import/               # CSV import page
│   └── signals/
│       ├── new/              # Add signal form
│       └── [id]/             # Signal detail + notes + status
├── components/
│   ├── Charts.tsx            # Score, source type, status charts
│   ├── InlineStatusControl   # Dashboard status toggle
│   ├── ScoreExplanation      # Weighted score formula display
│   └── ...                   # Nav, SignalCard, Filters, etc.
├── lib/
│   ├── prisma.ts             # Prisma client singleton
│   ├── scoring.ts            # Score weights, helpers, types
│   └── actions.ts            # Shared server actions
└── generated/                # Auto-generated Prisma client (gitignored)
prisma/
├── schema.prisma
├── seed.ts
└── dev.db                    # SQLite database (gitignored)
```
