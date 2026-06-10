import type { Category, Stakes } from '../lib/types'
import { CATEGORY_LABELS, STAKES_LABELS } from '../lib/types'

// Ledger markers: everything mono, everything quiet. Red is used as data ink.

export function CategoryTag({ category, muted = false }: { category: Category; muted?: boolean }) {
  return (
    <span
      className={`font-mono text-caption uppercase tracking-[0.08em] ${muted ? 'text-zero' : 'text-soft'}`}
    >
      {CATEGORY_LABELS[category]}
    </span>
  )
}

// Stakes as roman numerals, the way a ledger would abbreviate a column.
export function StakesMark({ stakes }: { stakes: Stakes }) {
  return (
    <span
      className="font-mono text-caption font-medium text-red"
      title={STAKES_LABELS[stakes]}
      aria-label={STAKES_LABELS[stakes]}
    >
      {'I'.repeat(stakes)}
    </span>
  )
}

// A human said no.
export function RejectionMark() {
  return (
    <span
      className="rounded-ledger border border-red px-1 font-mono text-caption font-medium text-red"
      title="A human told me no"
    >
      NO
    </span>
  )
}

export function BackfilledMark() {
  return (
    <span className="font-mono text-caption uppercase tracking-[0.08em] text-zero" title="Logged after the fact">
      Backfilled
    </span>
  )
}
