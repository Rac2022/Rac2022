import { useState } from 'react'
import type { FailureEntry, Category, Stakes } from '../lib/types'
import { CATEGORIES, CATEGORY_LABELS, STAKES_LABELS } from '../lib/types'
import { useApp } from '../state/AppContext'
import type { LogOutcome } from '../state/AppContext'
import { Button, SectionLabel } from './ui'

const STAKES: Stakes[] = [1, 2, 3]

export function EntryForm({
  date,
  initial,
  onSaved,
  onCancel,
}: {
  date: string
  initial?: FailureEntry
  onSaved: (outcome: LogOutcome) => void
  onCancel?: () => void
}) {
  const { logEntry, yesterday } = useApp()
  const [attempt, setAttempt] = useState(initial?.attempt ?? '')
  const [failure, setFailure] = useState(initial?.failure ?? '')
  const [lesson, setLesson] = useState(initial?.lesson ?? '')
  const [category, setCategory] = useState<Category>(initial?.category ?? 'execution')
  const [stakes, setStakes] = useState<Stakes>(initial?.stakes ?? 1)
  const [rejectionFlag, setRejectionFlag] = useState(initial?.rejectionFlag ?? false)
  const [error, setError] = useState<string | null>(null)

  function submit() {
    if (attempt.trim() === '') {
      setError('The attempt is required — one line on what you tried.')
      return
    }
    if (failure.trim() === '') {
      setError('The failure is required — what actually happened.')
      return
    }
    setError(null)
    const outcome = logEntry(
      {
        attempt: attempt.trim(),
        failure: failure.trim(),
        lesson: lesson.trim(),
        category,
        stakes,
        rejectionFlag,
      },
      date,
    )
    if (outcome) onSaved(outcome)
  }

  const inputClasses =
    'w-full rounded-ledger border border-rule bg-card px-3 py-2.5 text-base text-ink placeholder:text-soft/70'

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      {date === yesterday && !initial && (
        <p className="border-l-2 border-zero pl-3 font-mono text-caption text-zero">
          Logging for yesterday. This will be marked as backfilled.
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="attempt">
          <SectionLabel>The attempt</SectionLabel>
        </label>
        <input
          id="attempt"
          type="text"
          maxLength={120}
          value={attempt}
          onChange={(e) => setAttempt(e.target.value)}
          placeholder="What you tried, in one line."
          className={inputClasses}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="failure">
          <SectionLabel>The failure</SectionLabel>
        </label>
        <textarea
          id="failure"
          rows={3}
          value={failure}
          onChange={(e) => setFailure(e.target.value)}
          placeholder="What actually happened — no spin."
          className={`${inputClasses} resize-y`}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="lesson">
          <SectionLabel>The lesson</SectionLabel>
        </label>
        <textarea
          id="lesson"
          rows={2}
          value={lesson}
          onChange={(e) => setLesson(e.target.value)}
          placeholder="Optional. But the lesson is the whole point."
          className={`${inputClasses} resize-y`}
        />
      </div>

      <fieldset className="flex flex-col gap-1.5">
        <legend className="mb-1.5">
          <SectionLabel>What kind of miss</SectionLabel>
        </legend>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
              className={`rounded-ledger border px-3 py-1.5 font-mono text-caption uppercase tracking-[0.08em] transition-colors ${
                category === c
                  ? 'border-red bg-tint text-red'
                  : 'border-rule bg-card text-soft hover:border-soft'
              }`}
            >
              {CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-1.5">
        <legend className="mb-1.5">
          <SectionLabel>What it cost to try</SectionLabel>
        </legend>
        <div className="grid grid-cols-3 gap-2">
          {STAKES.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={stakes === s}
              onClick={() => setStakes(s)}
              className={`rounded-ledger border px-2 py-2 text-small transition-colors ${
                stakes === s
                  ? 'border-red bg-tint text-red'
                  : 'border-rule bg-card text-soft hover:border-soft'
              }`}
            >
              <span className="font-mono font-medium">{'I'.repeat(s)}</span>
              <span className="mt-0.5 block">{STAKES_LABELS[s]}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <button
        type="button"
        role="switch"
        aria-checked={rejectionFlag}
        onClick={() => setRejectionFlag((v) => !v)}
        className="flex items-center justify-between rounded-ledger border border-rule bg-card px-3 py-2.5 text-left text-base"
      >
        <span>A human told me no</span>
        <span
          aria-hidden="true"
          className={`relative inline-block h-5 w-9 rounded-full border transition-colors ${
            rejectionFlag ? 'border-red bg-red' : 'border-rule bg-paper'
          }`}
        >
          <span
            className={`absolute top-0.5 h-3.5 w-3.5 rounded-full bg-card transition-transform ${
              rejectionFlag ? 'translate-x-[18px] border border-card' : 'translate-x-0.5 border border-rule'
            }`}
          />
        </span>
      </button>

      {error && (
        <p role="alert" className="text-small text-red">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" variant="primary" className="font-display text-lede tracking-wide">
          {initial ? 'Save changes' : 'Log it.'}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
