// All recurring copy lives here. Voice: dry, direct, never cruel, never cheerleading.

export const THESIS = "If nothing went wrong today, you didn't try anything hard enough."

const AFFIRMATIONS = [
  'Entry recorded. Calibration improving.',
  'Another data point. Good.',
  'Logged. The ledger does not judge; it only accumulates.',
  'On the record. That was the hard part.',
  'Filed. Tomorrow needs its own miss.',
]

// Stable per day, varies across days.
export function affirmationFor(dateISO: string): string {
  let hash = 0
  for (const ch of dateISO) hash = (hash * 31 + ch.charCodeAt(0)) % 997
  return AFFIRMATIONS[hash % AFFIRMATIONS.length]
}

export const STORAGE_FULL_MESSAGE =
  "Couldn't save — storage is full. Export your data from Settings, then try again."
