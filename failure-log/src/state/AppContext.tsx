/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { AppData, AppSettings, FailureEntry } from '../lib/types'
import {
  loadData,
  saveEntries,
  saveZeroDays,
  saveSettings,
  eraseAll,
  makeId,
  buildExport,
  parseImport,
  mergeImport,
} from '../lib/repo'
import type { RejectedRecord } from '../lib/repo'
import { StorageFullError } from '../lib/storage'
import { STORAGE_FULL_MESSAGE } from '../lib/copy'
import { todayISO, yesterdayISO } from '../lib/dates'
import { buildSeedData, stripSeedData, SEED_PREFIX } from '../lib/seed'

export interface EntryInput {
  attempt: string
  failure: string
  lesson: string
  category: FailureEntry['category']
  stakes: FailureEntry['stakes']
  rejectionFlag: boolean
}

export type LogOutcome = 'logged' | 'updated' | 'upgraded'

interface AppContextValue extends AppData {
  today: string
  yesterday: string
  storageError: string | null
  clearStorageError: () => void
  logEntry: (input: EntryInput, date: string) => LogOutcome | null
  deleteEntry: (id: string) => boolean
  logZeroDay: (date: string) => boolean
  updateSettings: (patch: Partial<AppSettings>) => boolean
  exportJson: () => string
  importJson: (text: string, mode: 'merge' | 'replace') => { imported: number; rejected: RejectedRecord[] }
  eraseEverything: () => void
  setDemoData: (on: boolean) => boolean
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(loadData)
  const [storageError, setStorageError] = useState<string | null>(null)
  const [today, setToday] = useState(todayISO)

  // Keep "today" honest across midnight while the app is open.
  useEffect(() => {
    const tick = setInterval(() => {
      const now = todayISO()
      setToday((prev) => (prev === now ? prev : now))
    }, 30_000)
    return () => clearInterval(tick)
  }, [])

  const persist = useCallback(
    (next: Partial<Pick<AppData, 'entries' | 'zeroDays'>> & { settings?: AppSettings }): boolean => {
      try {
        if (next.entries) saveEntries(next.entries)
        if (next.zeroDays) saveZeroDays(next.zeroDays)
        if (next.settings) saveSettings(next.settings)
      } catch (err) {
        if (err instanceof StorageFullError) {
          setStorageError(STORAGE_FULL_MESSAGE)
          return false
        }
        throw err
      }
      setData((prev) => ({ ...prev, ...next }))
      return true
    },
    [],
  )

  const logEntry = useCallback(
    (input: EntryInput, date: string): LogOutcome | null => {
      const existing = data.entries.find((e) => e.date === date)
      if (existing) {
        // One entry per day, hard limit — a second attempt updates the existing record.
        const entries = data.entries.map((e) => (e.id === existing.id ? { ...e, ...input } : e))
        return persist({ entries }) ? 'updated' : null
      }
      const wasZero = data.zeroDays.some((z) => z.date === date)
      const entry: FailureEntry = {
        id: makeId(),
        date,
        ...input,
        backfilled: date === yesterdayISO() ? true : undefined,
      }
      const ok = persist({
        entries: [...data.entries, entry],
        zeroDays: wasZero ? data.zeroDays.filter((z) => z.date !== date) : data.zeroDays,
      })
      if (!ok) return null
      return wasZero ? 'upgraded' : 'logged'
    },
    [data, persist],
  )

  const deleteEntry = useCallback(
    (id: string): boolean => persist({ entries: data.entries.filter((e) => e.id !== id) }),
    [data, persist],
  )

  const logZeroDay = useCallback(
    (date: string): boolean => {
      if (data.entries.some((e) => e.date === date) || data.zeroDays.some((z) => z.date === date)) {
        return false
      }
      return persist({ zeroDays: [...data.zeroDays, { id: makeId(), date, acknowledged: true }] })
    },
    [data, persist],
  )

  const updateSettings = useCallback(
    (patch: Partial<AppSettings>): boolean => persist({ settings: { ...data.settings, ...patch } }),
    [data, persist],
  )

  const exportJson = useCallback(() => JSON.stringify(buildExport(data), null, 2), [data])

  const importJson = useCallback(
    (text: string, mode: 'merge' | 'replace') => {
      const parsed = parseImport(text) // throws with a plain message on bad files
      const result =
        mode === 'replace'
          ? { entries: parsed.entries, zeroDays: parsed.zeroDays, rejected: parsed.rejected }
          : mergeImport(data, parsed)
      const ok = persist({ entries: result.entries, zeroDays: result.zeroDays })
      if (!ok) throw new Error(STORAGE_FULL_MESSAGE)
      const imported =
        mode === 'replace'
          ? result.entries.length + result.zeroDays.length
          : result.entries.length + result.zeroDays.length - data.entries.length - data.zeroDays.length
      return { imported, rejected: result.rejected }
    },
    [data, persist],
  )

  const eraseEverything = useCallback(() => {
    eraseAll()
    setData(loadData())
  }, [])

  const setDemoData = useCallback(
    (on: boolean): boolean => {
      if (on) {
        const seed = buildSeedData()
        const dates = new Set([...data.entries, ...data.zeroDays].map((r) => r.date))
        return persist({
          entries: [...data.entries, ...seed.entries.filter((e) => !dates.has(e.date))],
          zeroDays: [...data.zeroDays, ...seed.zeroDays.filter((z) => !dates.has(z.date))],
          settings: { ...data.settings, demoData: true },
        })
      }
      return persist({
        entries: stripSeedData(data.entries),
        zeroDays: stripSeedData(data.zeroDays),
        settings: { ...data.settings, demoData: false },
      })
    },
    [data, persist],
  )

  const value = useMemo<AppContextValue>(
    () => ({
      ...data,
      today,
      yesterday: yesterdayISO(),
      storageError,
      clearStorageError: () => setStorageError(null),
      logEntry,
      deleteEntry,
      logZeroDay,
      updateSettings,
      exportJson,
      importJson,
      eraseEverything,
      setDemoData,
    }),
    [data, today, storageError, logEntry, deleteEntry, logZeroDay, updateSettings, exportJson, importJson, eraseEverything, setDemoData],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}

export { SEED_PREFIX }
