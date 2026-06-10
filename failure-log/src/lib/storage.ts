// Storage abstraction. Everything below the repo layer talks to a StorageAdapter,
// so localStorage can be swapped for a backend later without touching the app.

export class StorageFullError extends Error {
  constructor() {
    super('Storage is full')
    this.name = 'StorageFullError'
  }
}

export interface StorageAdapter {
  read(key: string): string | null
  write(key: string, value: string): void
  remove(key: string): void
}

function isQuotaError(err: unknown): boolean {
  return (
    err instanceof DOMException &&
    (err.name === 'QuotaExceededError' || err.name === 'NS_ERROR_DOM_QUOTA_REACHED')
  )
}

export class LocalStorageAdapter implements StorageAdapter {
  read(key: string): string | null {
    return localStorage.getItem(key)
  }

  write(key: string, value: string): void {
    try {
      localStorage.setItem(key, value)
    } catch (err) {
      if (isQuotaError(err)) throw new StorageFullError()
      throw err
    }
  }

  remove(key: string): void {
    localStorage.removeItem(key)
  }
}

export const KEYS = {
  entries: 'failurelog.entries',
  zeroDays: 'failurelog.zerodays',
  settings: 'failurelog.settings',
} as const

export const storage: StorageAdapter = new LocalStorageAdapter()

export function readJson<T>(key: string, fallback: T): T {
  const raw = storage.read(key)
  if (raw === null) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJson(key: string, value: unknown): void {
  storage.write(key, JSON.stringify(value))
}
