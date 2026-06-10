import type { FailureEntry } from './types'
import { todayISO } from './dates'

export interface Milestone {
  threshold: number
  name: string
}

export const MILESTONES: Milestone[] = [
  { threshold: 7, name: 'One Week of Honesty' },
  { threshold: 30, name: 'The Thirty-Day Ledger' },
  { threshold: 100, name: 'One Hundred Misses' },
  { threshold: 365, name: 'A Year in the Red' },
]

export function unlockedMilestones(entryCount: number): Milestone[] {
  return MILESTONES.filter((m) => entryCount >= m.threshold)
}

// A milestone is acknowledged with one quiet line on the Today page, only on
// the day it unlocks: the Nth entry (N = threshold) is dated today.
export function milestoneUnlockedToday(entries: FailureEntry[]): Milestone | null {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))
  for (const m of MILESTONES) {
    if (sorted.length >= m.threshold && sorted[m.threshold - 1].date === todayISO()) {
      return m
    }
  }
  return null
}
