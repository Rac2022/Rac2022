import type { FailureEntry } from '../lib/types'
import { formatLedgerDate, formatLedgerYear } from '../lib/dates'
import { BackfilledMark, CategoryTag, RejectionMark, StakesMark } from './markers'
import { SectionLabel } from './ui'

// A single entry rendered as a full ledger card. This is the artifact that
// "stamps" in on submit — the parent applies the stamp-in class.
export function LedgerCard({ entry, className = '' }: { entry: FailureEntry; className?: string }) {
  return (
    <article className={`rounded-ledger border border-rule bg-card ${className}`}>
      <div className="flex items-baseline justify-between border-b border-rule px-4 py-2.5">
        <div className="font-mono text-caption text-soft">
          <span className="font-medium text-red">{formatLedgerDate(entry.date)}</span>{' '}
          {formatLedgerYear(entry.date)}
        </div>
        <div className="flex items-center gap-2.5">
          {entry.backfilled && <BackfilledMark />}
          {entry.rejectionFlag && <RejectionMark />}
          <CategoryTag category={entry.category} />
          <StakesMark stakes={entry.stakes} />
        </div>
      </div>
      <div className="flex flex-col gap-4 px-4 py-4">
        <div>
          <SectionLabel>The attempt</SectionLabel>
          <p className="mt-1 font-display text-h3 text-ink">{entry.attempt}</p>
        </div>
        <div>
          <SectionLabel>The failure</SectionLabel>
          <p className="mt-1 text-base whitespace-pre-wrap">{entry.failure}</p>
        </div>
        <div>
          <SectionLabel>The lesson</SectionLabel>
          {entry.lesson ? (
            <p className="mt-1 text-base whitespace-pre-wrap">{entry.lesson}</p>
          ) : (
            <p className="mt-1 text-small text-soft">None recorded.</p>
          )}
        </div>
      </div>
    </article>
  )
}
