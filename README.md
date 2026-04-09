# Trend Radar

A local MVP web app for collecting, scoring, filtering, and reviewing early trend signals for business opportunities.

## Tech Stack

- **Next.js 15** (App Router, server-first)
- **TypeScript**
- **Tailwind CSS v4**
- **Prisma** with **SQLite**
- No auth, no external APIs

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
├── app/            # Next.js App Router pages and layouts
├── components/     # Reusable React components
├── lib/            # Utilities and shared logic (Prisma client, helpers)
└── generated/      # Auto-generated Prisma client (gitignored)
prisma/
├── schema.prisma   # Database schema
└── dev.db          # SQLite database (gitignored)
```
