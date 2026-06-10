import type { Category, FailureEntry, ZeroDay } from './types'
import { CATEGORY_LABELS } from './types'
import { todayISO, daysBetween } from './dates'

// Plainly computed observations — simple rules over the data, no AI.
// Each rule returns a line or null; the highest-priority 3 are surfaced.

interface RuleResult {
  priority: number // higher = more relevant
  text: string
}

type Rule = (entries: FailureEntry[], zeroDays: ZeroDay[]) => RuleResult | null

const CATEGORY_COMMENT: Record<Category, string> = {
  execution: "You're trying things you already know how to attempt.",
  rejection: "You're putting yourself in front of people who can say no. That's the hard kind.",
  judgment: 'Your calls are wrong more often than your hands. Worth noticing.',
  courage: 'The misses are happening before the attempt even lands. The block is at the start line.',
  other: 'They resist categorization. Either the taxonomy is wrong or the attempts are scattered.',
}

const dominantCategory: Rule = (entries) => {
  if (entries.length < 5) return null
  const counts = new Map<Category, number>()
  for (const e of entries) counts.set(e.category, (counts.get(e.category) ?? 0) + 1)
  const [top, count] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]
  const share = count / entries.length
  if (share < 0.4) return null
  return {
    priority: 60 + share * 20,
    text: `Most of your failures are ${CATEGORY_LABELS[top].toLowerCase()} failures. ${CATEGORY_COMMENT[top]}`,
  }
}

const highStakesDrought: Rule = (entries) => {
  if (entries.length < 5) return null
  const high = entries.filter((e) => e.stakes === 3).sort((a, b) => b.date.localeCompare(a.date))
  if (high.length === 0) {
    return { priority: 80, text: "You've never logged a high-stakes attempt. The ledger is waiting." }
  }
  const days = daysBetween(high[0].date, todayISO())
  if (days < 14) return null
  return { priority: 70 + Math.min(days, 60) / 10, text: `You haven't logged a high-stakes attempt in ${days} days.` }
}

const stakesTrend: Rule = (entries) => {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))
  if (sorted.length < 10) return null
  const half = Math.floor(sorted.length / 2)
  const avg = (xs: FailureEntry[]) => xs.reduce((s, e) => s + e.stakes, 0) / xs.length
  const earlier = avg(sorted.slice(0, half))
  const later = avg(sorted.slice(half))
  const delta = later - earlier
  if (delta >= 0.3) {
    return { priority: 65, text: 'Your average stakes are rising. The attempts are getting more expensive. Good.' }
  }
  if (delta <= -0.3) {
    return { priority: 75, text: "Your average stakes are falling. You're aiming lower than you were." }
  }
  return null
}

const fewRejections: Rule = (entries) => {
  if (entries.length < 10) return null
  const ratio = entries.filter((e) => e.rejectionFlag).length / entries.length
  if (ratio >= 0.2) return null
  return {
    priority: 55,
    text: 'Few of your failures involve another human saying no. Rejection may be the resistance you are avoiding.',
  }
}

const zeroHeavy: Rule = (entries, zeroDays) => {
  const recentCutoff = todayISO()
  const recentZeros = zeroDays.filter((z) => daysBetween(z.date, recentCutoff) <= 30)
  const recentEntries = entries.filter((e) => daysBetween(e.date, recentCutoff) <= 30)
  const total = recentZeros.length + recentEntries.length
  if (total < 6) return null
  if (recentZeros.length / total < 0.3) return null
  return {
    priority: 72,
    text: `${recentZeros.length} of your last ${total} logged days were Zero Days. Honest, but the ledger wants attempts.`,
  }
}

const missingLessons: Rule = (entries) => {
  if (entries.length < 5) return null
  const blank = entries.filter((e) => e.lesson.trim() === '').length
  if (blank / entries.length < 0.6) return null
  return {
    priority: 50,
    text: 'Most of your entries have no lesson. The data is there; the analysis is not.',
  }
}

const volumeUp: Rule = (entries) => {
  if (entries.length < 8) return null
  const last7 = entries.filter((e) => daysBetween(e.date, todayISO()) <= 6).length
  const prior21 = entries.filter((e) => {
    const d = daysBetween(e.date, todayISO())
    return d >= 7 && d <= 27
  }).length
  const weeklyAvg = prior21 / 3
  if (weeklyAvg === 0 || last7 < weeklyAvg * 1.5 || last7 < 3) return null
  return {
    priority: 58,
    text: `${last7} attempts this week against a recent average of ${weeklyAvg.toFixed(1)}. Volume is the lever.`,
  }
}

const goneQuiet: Rule = (entries, zeroDays) => {
  const all = [...entries.map((e) => e.date), ...zeroDays.map((z) => z.date)].sort()
  if (all.length === 0) return null
  const days = daysBetween(all[all.length - 1], todayISO())
  if (days < 4) return null
  return {
    priority: 85,
    text: `Nothing logged in ${days} days. Blank days say less than Zero Days do.`,
  }
}

// Low-priority fallbacks so the section always has something true to say.
const stakesProfile: Rule = (entries) => {
  if (entries.length < 5) return null
  const avg = entries.reduce((s, e) => s + e.stakes, 0) / entries.length
  const reading =
    avg < 1.5
      ? 'Mostly low-stakes attempts. Cheap shots are still shots, but the ledger notices.'
      : avg < 2.2
        ? 'Most attempts cost you something real. That is the working range.'
        : 'You are operating high-stakes. Expect the misses to sting accordingly.'
  return { priority: 20, text: `Average stakes across the ledger: ${avg.toFixed(1)} of 3. ${reading}` }
}

const rejectionTally: Rule = (entries) => {
  if (entries.length < 5) return null
  const count = entries.filter((e) => e.rejectionFlag).length
  if (count === 0) return null
  return {
    priority: 15,
    text: `${count} of ${entries.length} failures involved a human saying no. Each one was an ask that actually left your head.`,
  }
}

const RULES: Rule[] = [
  goneQuiet,
  highStakesDrought,
  stakesTrend,
  zeroHeavy,
  dominantCategory,
  volumeUp,
  fewRejections,
  missingLessons,
  stakesProfile,
  rejectionTally,
]

export function computePatterns(entries: FailureEntry[], zeroDays: ZeroDay[]): string[] {
  return RULES.map((rule) => rule(entries, zeroDays))
    .filter((r): r is RuleResult => r !== null)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3)
    .map((r) => r.text)
}
