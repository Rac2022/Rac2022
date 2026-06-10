export type Category = 'rejection' | 'execution' | 'judgment' | 'courage' | 'other'
export type Stakes = 1 | 2 | 3

export interface FailureEntry {
  id: string
  date: string // ISO date (yyyy-MM-dd), one entry max per day
  attempt: string // what you tried (required, short)
  failure: string // what actually happened (required)
  lesson: string // what the miss tells you (optional but nudged)
  category: Category
  stakes: Stakes // how much it cost to try: low / real / high
  rejectionFlag: boolean // was another human involved in saying no
  backfilled?: boolean // logged for yesterday, after the fact
}

export interface ZeroDay {
  id: string
  date: string
  acknowledged: true // user explicitly logged "I didn't try anything hard today"
}

export interface AppSettings {
  onboarded: boolean
  reminderTime: string | null // "HH:mm", stored preference; notifications are a stub
  demoData: boolean
}

export interface AppData {
  entries: FailureEntry[]
  zeroDays: ZeroDay[]
  settings: AppSettings
}

export const CATEGORIES: Category[] = ['rejection', 'execution', 'judgment', 'courage', 'other']

export const CATEGORY_LABELS: Record<Category, string> = {
  rejection: 'Rejection',
  execution: 'Execution',
  judgment: 'Judgment',
  courage: 'Courage',
  other: 'Other',
}

export const STAKES_LABELS: Record<Stakes, string> = {
  1: 'Low stakes',
  2: 'Real stakes',
  3: 'High stakes',
}

export const DEFAULT_SETTINGS: AppSettings = {
  onboarded: false,
  reminderTime: null,
  demoData: false,
}
