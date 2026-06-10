import { useMemo } from 'react'
import { format, parseISO, startOfWeek, subWeeks } from 'date-fns'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import { useApp } from '../state/AppContext'
import { CATEGORIES, CATEGORY_LABELS } from '../lib/types'
import { currentStreak, longestStreak } from '../lib/streaks'
import { MILESTONES } from '../lib/milestones'
import { computePatterns } from '../lib/patterns'
import { SectionLabel } from '../components/ui'

// Chart ink, from the design tokens.
const RED = '#b3382c'
const ZERO = '#8a8f93'
const RULE = '#d8dbda'
const SOFT = '#565b5c'

const MONO_TICK = { fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, fill: SOFT }

function weekKey(dateISO: string): string {
  return format(startOfWeek(parseISO(dateISO), { weekStartsOn: 1 }), 'yyyy-MM-dd')
}

export function Insights() {
  const { entries, zeroDays } = useApp()

  const weekly = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const start = startOfWeek(subWeeks(new Date(), 11 - i), { weekStartsOn: 1 })
      const key = format(start, 'yyyy-MM-dd')
      const weekEntries = entries.filter((e) => weekKey(e.date) === key)
      return {
        label: format(start, 'dd MMM').toUpperCase(),
        entries: weekEntries.length,
        zeroDays: zeroDays.filter((z) => weekKey(z.date) === key).length,
        avgStakes:
          weekEntries.length > 0
            ? weekEntries.reduce((s, e) => s + e.stakes, 0) / weekEntries.length
            : null,
      }
    })
  }, [entries, zeroDays])

  const mix = useMemo(() => {
    const counts = CATEGORIES.map((c) => ({
      category: c,
      count: entries.filter((e) => e.category === c).length,
    }))
    const max = Math.max(1, ...counts.map((c) => c.count))
    return { counts, max }
  }, [entries])

  const rejections = entries.filter((e) => e.rejectionFlag).length
  const patterns = useMemo(() => computePatterns(entries, zeroDays), [entries, zeroDays])
  const enough = entries.length >= 5

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="mb-1 font-display text-h2">Insights</h1>
        <p className="text-small text-soft">Am I actually taking more and better shots?</p>
      </div>

      {/* The record — streaks & milestones live here rather than on a fifth
          page: same question, and the tab bar stays honest at four. */}
      <section aria-label="The record">
        <SectionLabel>The record</SectionLabel>
        <dl className="mt-3 grid grid-cols-2 gap-px border border-rule bg-rule sm:grid-cols-4">
          {[
            ['Current streak', currentStreak(entries, zeroDays)],
            ['Longest streak', longestStreak(entries, zeroDays)],
            ['Entries', entries.length],
            ['Zero days', zeroDays.length],
          ].map(([label, value]) => (
            <div key={label} className="bg-card px-3 py-3">
              <dt className="font-mono text-caption text-soft">{label}</dt>
              <dd className="font-display text-display text-red tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
        <ul className="mt-3 flex flex-col gap-1">
          {MILESTONES.map((m) => {
            const unlocked = entries.length >= m.threshold
            return (
              <li
                key={m.threshold}
                className={`flex items-baseline justify-between border-b border-rule py-1.5 font-mono text-caption ${
                  unlocked ? 'text-red' : 'text-soft'
                }`}
              >
                <span>{m.name}</span>
                <span>{unlocked ? 'Reached' : `${m.threshold - entries.length} entries away`}</span>
              </li>
            )
          })}
        </ul>
      </section>

      {!enough ? (
        <p className="border border-rule bg-card px-4 py-6 text-base text-soft">
          Not enough data to see patterns yet. That's a volume problem. Fix it on the Today page.
        </p>
      ) : (
        <>
          <section aria-label="Attempt volume">
            <SectionLabel>Attempt volume — last 12 weeks</SectionLabel>
            <div className="mt-3 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekly} margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
                  <CartesianGrid stroke={RULE} vertical={false} />
                  <XAxis dataKey="label" tick={MONO_TICK} interval={2} tickLine={false} axisLine={{ stroke: RULE }} />
                  <YAxis tick={MONO_TICK} allowDecimals={false} tickLine={false} axisLine={false} />
                  <Bar dataKey="entries" stackId="a" fill={RED} isAnimationActive={false} />
                  <Bar dataKey="zeroDays" stackId="a" fill={ZERO} fillOpacity={0.35} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 font-mono text-caption text-soft">
              Red is attempts. Ghost grey is Zero Days.
            </p>
          </section>

          <section aria-label="Stakes drift">
            <SectionLabel>Stakes drift</SectionLabel>
            <div className="mt-3 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weekly} margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
                  <CartesianGrid stroke={RULE} vertical={false} />
                  <XAxis dataKey="label" tick={MONO_TICK} interval={2} tickLine={false} axisLine={{ stroke: RULE }} />
                  <YAxis domain={[1, 3]} ticks={[1, 2, 3]} tick={MONO_TICK} tickLine={false} axisLine={false} />
                  <Line
                    dataKey="avgStakes"
                    stroke={RED}
                    strokeWidth={2}
                    dot={{ r: 2.5, fill: RED, strokeWidth: 0 }}
                    connectNulls
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 font-mono text-caption text-soft">
              Average stakes per week. The goal is up and to the right.
            </p>
          </section>

          <section aria-label="Failure mix">
            <SectionLabel>Failure mix</SectionLabel>
            <ul className="mt-3 flex flex-col gap-2">
              {mix.counts.map(({ category, count }) => (
                <li key={category} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 font-mono text-caption uppercase tracking-[0.08em] text-soft">
                    {CATEGORY_LABELS[category]}
                  </span>
                  <span className="h-4 flex-1 bg-zerobg">
                    <span
                      className="block h-full bg-red"
                      style={{ width: `${(count / mix.max) * 100}%` }}
                    />
                  </span>
                  <span className="w-8 shrink-0 text-right font-mono text-caption text-red tabular-nums">
                    {count}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-label="Rejections collected">
            <div className="border border-rule bg-card px-4 py-5">
              <div className="font-display text-number text-red tabular-nums">{rejections}</div>
              <SectionLabel>Rejections collected</SectionLabel>
              <p className="mt-2 text-small text-soft">
                Every one is a human you actually asked. The collection only grows.
              </p>
            </div>
          </section>

          {patterns.length > 0 && (
            <section aria-label="Patterns">
              <SectionLabel>Patterns</SectionLabel>
              <ul className="mt-3 flex flex-col gap-3">
                {patterns.map((p) => (
                  <li key={p} className="border-l-2 border-red pl-3 text-base">
                    {p}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  )
}
