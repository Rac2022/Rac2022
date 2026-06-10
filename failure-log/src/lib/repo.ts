import type { AppData, AppSettings, FailureEntry, ZeroDay, Category, Stakes } from './types'
import { CATEGORIES, DEFAULT_SETTINGS } from './types'
import { KEYS, readJson, writeJson, storage } from './storage'
import { isValidISODate } from './dates'

export function loadData(): AppData {
  return {
    entries: readJson<FailureEntry[]>(KEYS.entries, []),
    zeroDays: readJson<ZeroDay[]>(KEYS.zeroDays, []),
    settings: { ...DEFAULT_SETTINGS, ...readJson<Partial<AppSettings>>(KEYS.settings, {}) },
  }
}

export function saveEntries(entries: FailureEntry[]): void {
  writeJson(KEYS.entries, entries)
}

export function saveZeroDays(zeroDays: ZeroDay[]): void {
  writeJson(KEYS.zeroDays, zeroDays)
}

export function saveSettings(settings: AppSettings): void {
  writeJson(KEYS.settings, settings)
}

export function eraseAll(): void {
  storage.remove(KEYS.entries)
  storage.remove(KEYS.zeroDays)
  storage.remove(KEYS.settings)
}

export function makeId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

// ---- Export / import ----

export interface ExportFile {
  app: 'failure-log'
  version: 1
  exportedAt: string
  entries: FailureEntry[]
  zeroDays: ZeroDay[]
}

export function buildExport(data: AppData): ExportFile {
  return {
    app: 'failure-log',
    version: 1,
    exportedAt: new Date().toISOString(),
    entries: data.entries,
    zeroDays: data.zeroDays,
  }
}

export interface RejectedRecord {
  kind: 'entry' | 'zero day'
  index: number
  reason: string
}

export interface ImportResult {
  entries: FailureEntry[]
  zeroDays: ZeroDay[]
  rejected: RejectedRecord[]
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function validateEntry(raw: unknown, index: number): FailureEntry | RejectedRecord {
  const reject = (reason: string): RejectedRecord => ({ kind: 'entry', index, reason })
  if (!isRecord(raw)) return reject('not an object')
  if (typeof raw.id !== 'string' || raw.id === '') return reject('missing or invalid "id"')
  if (typeof raw.date !== 'string' || !isValidISODate(raw.date))
    return reject('"date" is not a valid yyyy-mm-dd date')
  if (typeof raw.attempt !== 'string' || raw.attempt.trim() === '')
    return reject('"attempt" is required and must be text')
  if (typeof raw.failure !== 'string' || raw.failure.trim() === '')
    return reject('"failure" is required and must be text')
  if (raw.lesson !== undefined && typeof raw.lesson !== 'string')
    return reject('"lesson" must be text')
  if (typeof raw.category !== 'string' || !CATEGORIES.includes(raw.category as Category))
    return reject(`"category" must be one of: ${CATEGORIES.join(', ')}`)
  if (raw.stakes !== 1 && raw.stakes !== 2 && raw.stakes !== 3)
    return reject('"stakes" must be 1, 2 or 3')
  if (typeof raw.rejectionFlag !== 'boolean') return reject('"rejectionFlag" must be true or false')
  return {
    id: raw.id,
    date: raw.date,
    attempt: raw.attempt,
    failure: raw.failure,
    lesson: typeof raw.lesson === 'string' ? raw.lesson : '',
    category: raw.category as Category,
    stakes: raw.stakes as Stakes,
    rejectionFlag: raw.rejectionFlag,
    backfilled: raw.backfilled === true ? true : undefined,
  }
}

function validateZeroDay(raw: unknown, index: number): ZeroDay | RejectedRecord {
  const reject = (reason: string): RejectedRecord => ({ kind: 'zero day', index, reason })
  if (!isRecord(raw)) return reject('not an object')
  if (typeof raw.id !== 'string' || raw.id === '') return reject('missing or invalid "id"')
  if (typeof raw.date !== 'string' || !isValidISODate(raw.date))
    return reject('"date" is not a valid yyyy-mm-dd date')
  if (raw.acknowledged !== true) return reject('"acknowledged" must be true')
  return { id: raw.id, date: raw.date, acknowledged: true }
}

// Parses and validates an import file. Throws with a plain message if the file
// itself is unreadable; per-record problems are returned in `rejected`.
export function parseImport(text: string): ImportResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('Not valid JSON. Export a file from Settings to see the expected format.')
  }
  if (!isRecord(parsed) || !Array.isArray(parsed.entries) || !Array.isArray(parsed.zeroDays)) {
    throw new Error('Wrong shape — expected an object with "entries" and "zeroDays" arrays.')
  }

  const rejected: RejectedRecord[] = []
  const entries: FailureEntry[] = []
  const zeroDays: ZeroDay[] = []
  const seenDates = new Set<string>()

  parsed.entries.forEach((raw, i) => {
    const result = validateEntry(raw, i)
    if ('reason' in result) {
      rejected.push(result)
    } else if (seenDates.has(result.date)) {
      rejected.push({ kind: 'entry', index: i, reason: `duplicate date ${result.date} in file` })
    } else {
      seenDates.add(result.date)
      entries.push(result)
    }
  })

  parsed.zeroDays.forEach((raw, i) => {
    const result = validateZeroDay(raw, i)
    if ('reason' in result) {
      rejected.push(result)
    } else if (seenDates.has(result.date)) {
      rejected.push({ kind: 'zero day', index: i, reason: `date ${result.date} already used in file` })
    } else {
      seenDates.add(result.date)
      zeroDays.push(result)
    }
  })

  return { entries, zeroDays, rejected }
}

// Merge imported records into existing data. Existing records win on date
// conflicts; skipped records are reported.
export function mergeImport(
  current: { entries: FailureEntry[]; zeroDays: ZeroDay[] },
  incoming: ImportResult,
): { entries: FailureEntry[]; zeroDays: ZeroDay[]; rejected: RejectedRecord[] } {
  const taken = new Set([...current.entries, ...current.zeroDays].map((r) => r.date))
  const rejected = [...incoming.rejected]
  const entries = [...current.entries]
  const zeroDays = [...current.zeroDays]

  incoming.entries.forEach((e, i) => {
    if (taken.has(e.date)) {
      rejected.push({ kind: 'entry', index: i, reason: `date ${e.date} already logged here — kept the existing record` })
    } else {
      taken.add(e.date)
      entries.push(e)
    }
  })
  incoming.zeroDays.forEach((z, i) => {
    if (taken.has(z.date)) {
      rejected.push({ kind: 'zero day', index: i, reason: `date ${z.date} already logged here — kept the existing record` })
    } else {
      taken.add(z.date)
      zeroDays.push(z)
    }
  })

  return { entries, zeroDays, rejected }
}
