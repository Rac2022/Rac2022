import { format, parseISO, subDays } from 'date-fns'
import type { FailureEntry, ZeroDay } from './types'
import { todayISO, yesterdayISO, daysBetween } from './dates'

// The streak counts consecutive days of honesty — a failure entry OR an
// acknowledged Zero Day — not consecutive failures.

function loggedDates(entries: FailureEntry[], zeroDays: ZeroDay[]): string[] {
  return [...new Set([...entries.map((e) => e.date), ...zeroDays.map((z) => z.date)])].sort()
}

// Current streak: consecutive logged days ending today, or ending yesterday if
// today hasn't been logged yet (the streak is alive until midnight).
export function currentStreak(entries: FailureEntry[], zeroDays: ZeroDay[]): number {
  const dates = new Set(loggedDates(entries, zeroDays))
  const start = dates.has(todayISO()) ? todayISO() : dates.has(yesterdayISO()) ? yesterdayISO() : null
  if (!start) return 0

  const sorted = [...dates].sort().reverse()
  let streak = 0
  let expected = start
  for (const d of sorted) {
    if (d > expected) continue
    if (d === expected) {
      streak++
      expected = shiftBack(d)
    } else {
      break
    }
  }
  return streak
}

function shiftBack(iso: string): string {
  return format(subDays(parseISO(iso), 1), 'yyyy-MM-dd')
}

export function longestStreak(entries: FailureEntry[], zeroDays: ZeroDay[]): number {
  const dates = loggedDates(entries, zeroDays)
  if (dates.length === 0) return 0
  let best = 1
  let run = 1
  for (let i = 1; i < dates.length; i++) {
    if (daysBetween(dates[i - 1], dates[i]) === 1) {
      run++
      best = Math.max(best, run)
    } else {
      run = 1
    }
  }
  return best
}
