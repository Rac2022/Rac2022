import { useEffect, useMemo, useRef, useState } from 'react'
import { useApp } from '../state/AppContext'
import type { LogOutcome } from '../state/AppContext'
import { currentStreak } from '../lib/streaks'
import { milestoneUnlockedToday } from '../lib/milestones'
import { affirmationFor } from '../lib/copy'
import { formatFullDate } from '../lib/dates'
import { EntryForm } from '../components/EntryForm'
import { LedgerCard } from '../components/LedgerCard'
import { Button, Modal, SectionLabel } from '../components/ui'

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// The streak counter ticking up is half of the one motion moment.
function StreakTicker({ value, animate }: { value: number; animate: boolean }) {
  const [shown, setShown] = useState(animate && !prefersReducedMotion() ? Math.max(0, value - 1) : value)

  useEffect(() => {
    if (shown === value) return
    const delay = animate && !prefersReducedMotion() ? 420 : 0
    const timer = setTimeout(() => setShown(value), delay)
    return () => clearTimeout(timer)
  }, [value, animate, shown])

  return (
    <span className="font-display text-number text-red tabular-nums" aria-label={`Streak: ${value} days`}>
      {shown}
    </span>
  )
}

export function Today() {
  const { entries, zeroDays, today, yesterday, logZeroDay } = useApp()
  const todayEntry = entries.find((e) => e.date === today)
  const todayZero = zeroDays.find((z) => z.date === today)
  const yesterdayLogged =
    entries.some((e) => e.date === yesterday) || zeroDays.some((z) => z.date === yesterday)

  const [editing, setEditing] = useState(false)
  const [backfilling, setBackfilling] = useState(false)
  const [zeroModal, setZeroModal] = useState(false)
  const [outcome, setOutcome] = useState<LogOutcome | 'zero' | null>(null)

  const streak = currentStreak(entries, zeroDays)
  const milestone = useMemo(() => milestoneUnlockedToday(entries), [entries])

  // Reset transient state when the date rolls over at midnight.
  const lastDate = useRef(today)
  useEffect(() => {
    if (lastDate.current !== today) {
      lastDate.current = today
      setEditing(false)
      setBackfilling(false)
      setOutcome(null)
    }
  }, [today])

  const heading = (
    <header className="mb-6">
      <div className="font-mono text-caption text-soft">{formatFullDate(today)}</div>
    </header>
  )

  // --- Logged: today's entry as a ledger card ---
  if (todayEntry && !editing) {
    const justLogged = outcome === 'logged' || outcome === 'upgraded'
    return (
      <div>
        {heading}
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <SectionLabel>Honesty streak</SectionLabel>
            <div className="flex items-baseline gap-2">
              <StreakTicker value={streak} animate={justLogged} />
              <span className="font-mono text-caption text-soft">{streak === 1 ? 'day' : 'days'}</span>
            </div>
          </div>
          <Button variant="ghost" onClick={() => setEditing(true)}>
            Edit until midnight
          </Button>
        </div>

        <LedgerCard entry={todayEntry} className={justLogged ? 'stamp-in' : ''} />

        <p className="mt-4 text-small text-soft">{affirmationFor(today)}</p>
        {outcome === 'upgraded' && (
          <p className="mt-1 text-small text-red">Zero Day converted. The attempt counts instead.</p>
        )}
        {milestone && (
          <p className="mt-1 font-mono text-caption text-red">
            Milestone reached: {milestone.name}. Noted in the record.
          </p>
        )}
      </div>
    )
  }

  // --- Editing today's entry ---
  if (todayEntry && editing) {
    return (
      <div>
        {heading}
        <h1 className="mb-6 font-display text-h2">Edit today's entry</h1>
        <EntryForm
          date={today}
          initial={todayEntry}
          onSaved={() => {
            setEditing(false)
            setOutcome('updated')
          }}
          onCancel={() => setEditing(false)}
        />
      </div>
    )
  }

  // --- Backfilling yesterday ---
  if (backfilling) {
    return (
      <div>
        {heading}
        <h1 className="mb-6 font-display text-h2">What did you fail at yesterday?</h1>
        <EntryForm
          date={yesterday}
          onSaved={() => setBackfilling(false)}
          onCancel={() => setBackfilling(false)}
        />
      </div>
    )
  }

  // --- Zero Day already acknowledged ---
  if (todayZero) {
    return (
      <div>
        {heading}
        <div className="mb-5">
          <SectionLabel>Honesty streak</SectionLabel>
          <div className="flex items-baseline gap-2">
            <StreakTicker value={streak} animate={outcome === 'zero'} />
            <span className="font-mono text-caption text-soft">{streak === 1 ? 'day' : 'days'}</span>
          </div>
        </div>
        <div className="rounded-ledger border border-rule bg-zerobg px-4 py-5">
          <p className="font-display text-h3 text-zero">Zero Day — no attempts logged.</p>
          <p className="mt-2 text-small text-zero">
            The day is on the record. Honest, at least.
          </p>
        </div>
        <div className="mt-5">
          <p className="mb-2 text-small text-soft">Something failed after all? The day can still be upgraded.</p>
          <EntryFormToggle onSaved={(o) => setOutcome(o)} />
        </div>
      </div>
    )
  }

  // --- Unlogged: the entry form IS the page ---
  return (
    <div>
      {heading}
      <h1 className="mb-6 font-display text-display text-ink">What did you fail at today?</h1>
      <EntryForm date={today} onSaved={(o) => setOutcome(o)} />

      <div className="mt-10 border-t border-rule pt-5">
        <button
          onClick={() => setZeroModal(true)}
          className="text-small text-soft underline decoration-rule underline-offset-4 hover:text-ink hover:decoration-soft"
        >
          I didn't attempt anything hard today
        </button>
        {!yesterdayLogged && (
          <div className="mt-3">
            <button
              onClick={() => setBackfilling(true)}
              className="font-mono text-caption text-zero underline decoration-rule underline-offset-4 hover:text-ink"
            >
              Yesterday went unaccounted for — backfill it
            </button>
          </div>
        )}
      </div>

      {zeroModal && (
        <Modal title="Logging a Zero Day" onClose={() => setZeroModal(false)}>
          <p className="text-base">Logging a Zero Day. Honest, at least.</p>
          <div className="mt-5 flex gap-3">
            <Button
              variant="primary"
              onClick={() => {
                if (logZeroDay(today)) setOutcome('zero')
                setZeroModal(false)
              }}
            >
              Log the Zero Day
            </Button>
            <Button variant="ghost" onClick={() => setZeroModal(false)}>
              Cancel
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// Inline form reveal used on the Zero Day state: logging a real failure on a
// Zero Day's date (same day) converts it, and the user is told so in one line
// back on the logged view.
function EntryFormToggle({ onSaved }: { onSaved: (o: LogOutcome) => void }) {
  const { today } = useApp()
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <Button variant="quiet" onClick={() => setOpen(true)}>
        Log a failure instead
      </Button>
    )
  }
  return (
    <div className="mt-2">
      <EntryForm date={today} onSaved={onSaved} onCancel={() => setOpen(false)} />
    </div>
  )
}
