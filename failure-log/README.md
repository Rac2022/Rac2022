# The Failure Log

A local-first daily practice tool built on one premise: if you didn't fail at
anything today, you didn't push against any real resistance. One honest entry
per day — what you attempted, how it failed, what the miss tells you. It is a
ledger of attempts, not a journal.

## Running it

```bash
npm install
npm run dev      # dev server
npm run build    # production build to dist/
npm run lint     # eslint
```

## How it's put together

- **React + Vite + TypeScript**, Tailwind CSS v4, Recharts, date-fns.
- All data lives in `localStorage` behind a storage abstraction
  (`src/lib/storage.ts`) so a backend can be swapped in later. The repository
  layer (`src/lib/repo.ts`) handles persistence, validation and import/export.
- Pure logic — streaks, milestones, the rule-based patterns engine, seed
  data — lives in `src/lib/` with no React dependencies.
- Design tokens, typefaces and the aesthetic rationale are documented in
  [DESIGN.md](./DESIGN.md) and implemented as a Tailwind theme in
  `src/index.css`.

## Concepts

- A day is either logged with a **failure entry**, logged as an acknowledged
  **Zero Day** ("I didn't try anything hard today"), or blank.
- The **streak** counts consecutive days of honesty — either entry type.
- One entry per day, hard limit. Backfilling is allowed for yesterday only and
  is marked. Entries lock from editing at local midnight.
- ~40 days of demo data (with Zero Days and gaps) can be toggled from Settings.

## Export format

Settings → Export produces JSON with `entries` and `zeroDays` arrays. Import
validates every record and reports exactly which were rejected and why, with a
merge-or-replace choice.
