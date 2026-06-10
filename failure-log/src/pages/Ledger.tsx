import { useMemo, useState } from 'react'
import type { Category, FailureEntry, Stakes, ZeroDay } from '../lib/types'
import { CATEGORIES, CATEGORY_LABELS, STAKES_LABELS } from '../lib/types'
import { useApp } from '../state/AppContext'
import { daysBetween, formatLedgerDate, formatLedgerYear } from '../lib/dates'
import { EntryForm } from '../components/EntryForm'
import { BackfilledMark, CategoryTag, RejectionMark, StakesMark } from '../components/markers'
import { Button, Modal, SectionLabel } from '../components/ui'

type Row = { kind: 'entry'; record: FailureEntry } | { kind: 'zero'; record: ZeroDay }

export function Ledger() {
  const { entries, zeroDays, today, deleteEntry } = useApp()
  const [category, setCategory] = useState<Category | null>(null)
  const [stakes, setStakes] = useState<Stakes | null>(null)
  const [rejectionOnly, setRejectionOnly] = useState(false)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<FailureEntry | null>(null)

  const filtering = category !== null || stakes !== null || rejectionOnly || search.trim() !== ''

  const rows = useMemo<Row[]>(() => {
    const q = search.trim().toLowerCase()
    const filteredEntries = entries.filter((e) => {
      if (category && e.category !== category) return false
      if (stakes && e.stakes !== stakes) return false
      if (rejectionOnly && !e.rejectionFlag) return false
      if (q && ![e.attempt, e.failure, e.lesson].some((t) => t.toLowerCase().includes(q))) return false
      return true
    })
    // Zero Days only appear in the unfiltered ledger — they have nothing to match on.
    const zeros: Row[] = filtering ? [] : zeroDays.map((z) => ({ kind: 'zero' as const, record: z }))
    return [...filteredEntries.map((e) => ({ kind: 'entry' as const, record: e })), ...zeros].sort(
      (a, b) => b.record.date.localeCompare(a.record.date),
    )
  }, [entries, zeroDays, category, stakes, rejectionOnly, search, filtering])

  const chipClass = (active: boolean) =>
    `rounded-ledger border px-2.5 py-1 font-mono text-caption uppercase tracking-[0.08em] transition-colors ${
      active ? 'border-red bg-tint text-red' : 'border-rule bg-card text-soft hover:border-soft'
    }`

  return (
    <div>
      <h1 className="mb-1 font-display text-h2">The ledger</h1>
      <p className="mb-5 font-mono text-caption text-soft">
        {entries.length} {entries.length === 1 ? 'entry' : 'entries'} · {zeroDays.length} zero{' '}
        {zeroDays.length === 1 ? 'day' : 'days'}
      </p>

      {/* Filter bar */}
      <div className="mb-5 flex flex-col gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search attempts, failures, lessons"
          aria-label="Search entries"
          className="w-full rounded-ledger border border-rule bg-card px-3 py-2 text-base placeholder:text-soft/70"
        />
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(category === c ? null : c)}
              aria-pressed={category === c}
              className={chipClass(category === c)}
            >
              {CATEGORY_LABELS[c]}
            </button>
          ))}
          <span aria-hidden="true" className="h-4 w-px bg-rule" />
          {([1, 2, 3] as Stakes[]).map((s) => (
            <button
              key={s}
              onClick={() => setStakes(stakes === s ? null : s)}
              aria-pressed={stakes === s}
              title={STAKES_LABELS[s]}
              className={chipClass(stakes === s)}
            >
              {'I'.repeat(s)}
            </button>
          ))}
          <span aria-hidden="true" className="h-4 w-px bg-rule" />
          <button
            onClick={() => setRejectionOnly((v) => !v)}
            aria-pressed={rejectionOnly}
            className={chipClass(rejectionOnly)}
          >
            Rejections only
          </button>
        </div>
      </div>

      {rows.length === 0 && (
        <p className="border-t border-rule py-8 text-small text-soft">
          {filtering
            ? 'Nothing matches. Loosen the filters.'
            : 'The ledger is empty. The Today page is where it starts.'}
        </p>
      )}

      <ol className="border-t border-rule">
        {rows.map((row, i) => {
          // Thin gap indicator for unaccounted days — including between the
          // newest row and today.
          const laterDate = i === 0 ? today : rows[i - 1].record.date
          const gap = daysBetween(row.record.date, laterDate) - 1
          return (
            <li key={row.record.id}>
              {!filtering && gap > 0 && (
                <div className="border-b border-rule py-1.5 text-center font-mono text-caption text-zero">
                  — {gap} {gap === 1 ? 'day' : 'days'} unaccounted for —
                </div>
              )}
              {row.kind === 'zero' ? (
                <ZeroRow zero={row.record} />
              ) : editing === row.record.id ? (
                <div className="border-b border-rule py-4">
                  <EntryForm
                    date={row.record.date}
                    initial={row.record}
                    onSaved={() => setEditing(null)}
                    onCancel={() => setEditing(null)}
                  />
                </div>
              ) : (
                <EntryRow
                  entry={row.record}
                  expanded={expanded === row.record.id}
                  editable={row.record.date === today}
                  onToggle={() => setExpanded(expanded === row.record.id ? null : row.record.id)}
                  onEdit={() => setEditing(row.record.id)}
                  onDelete={() => setDeleting(row.record)}
                />
              )}
            </li>
          )
        })}
      </ol>

      {deleting && (
        <Modal title="Delete this entry" onClose={() => setDeleting(null)}>
          <p className="text-base">
            Removing "{deleting.attempt}" from {formatLedgerDate(deleting.date)}{' '}
            {formatLedgerYear(deleting.date)}. The record will not show the day existed.
          </p>
          <div className="mt-5 flex gap-3">
            <Button
              variant="danger"
              onClick={() => {
                deleteEntry(deleting.id)
                setDeleting(null)
                setExpanded(null)
              }}
            >
              Delete it
            </Button>
            <Button variant="ghost" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function ZeroRow({ zero }: { zero: ZeroDay }) {
  return (
    <div className="flex items-baseline gap-3 border-b border-rule bg-zerobg px-2 py-3">
      <span className="w-16 shrink-0 font-mono text-caption text-zero">
        {formatLedgerDate(zero.date)}
      </span>
      <span className="text-small text-zero">Zero Day — no attempts logged.</span>
    </div>
  )
}

function EntryRow({
  entry,
  expanded,
  editable,
  onToggle,
  onEdit,
  onDelete,
}: {
  entry: FailureEntry
  expanded: boolean
  editable: boolean
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="border-b border-rule">
      <button
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-baseline gap-3 px-2 py-3 text-left hover:bg-card"
      >
        <span className="w-16 shrink-0 font-mono text-caption font-medium text-red">
          {formatLedgerDate(entry.date)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-base text-ink">{entry.attempt}</span>
          <span className="mt-0.5 flex flex-wrap items-center gap-2">
            <CategoryTag category={entry.category} />
            {entry.rejectionFlag && <RejectionMark />}
            {entry.backfilled && <BackfilledMark />}
          </span>
        </span>
        <StakesMark stakes={entry.stakes} />
      </button>

      {expanded && (
        <div className="flex flex-col gap-3 px-2 pb-4 pl-[4.75rem]">
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
          <div className="flex items-center gap-4">
            {editable ? (
              <Button variant="quiet" onClick={onEdit}>
                Edit
              </Button>
            ) : (
              <span className="font-mono text-caption text-soft">Locked at midnight — the record stands.</span>
            )}
            <Button variant="ghost" onClick={onDelete}>
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
