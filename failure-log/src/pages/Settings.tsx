import { useRef, useState } from 'react'
import { useApp } from '../state/AppContext'
import type { RejectedRecord } from '../lib/repo'
import { THESIS } from '../lib/copy'
import { todayISO } from '../lib/dates'
import { Button, Modal, SectionLabel } from '../components/ui'

export function Settings() {
  const { settings, updateSettings, exportJson, importJson, eraseEverything, setDemoData } = useApp()
  const fileRef = useRef<HTMLInputElement>(null)
  const [pendingImport, setPendingImport] = useState<string | null>(null)
  const [importReport, setImportReport] = useState<{ imported: number; rejected: RejectedRecord[] } | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [eraseText, setEraseText] = useState('')
  const [erased, setErased] = useState(false)

  function downloadExport() {
    const blob = new Blob([exportJson()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `failure-log-${todayISO()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function onFilePicked(file: File | undefined) {
    if (!file) return
    setImportError(null)
    setImportReport(null)
    setPendingImport(await file.text())
  }

  function runImport(mode: 'merge' | 'replace') {
    if (pendingImport === null) return
    try {
      setImportReport(importJson(pendingImport, mode))
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Import failed.')
    }
    setPendingImport(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="flex flex-col gap-10">
      <h1 className="font-display text-h2">Settings</h1>

      <section aria-label="Reminder">
        <SectionLabel>Daily reminder</SectionLabel>
        <p className="mt-2 text-small text-soft">
          When the ledger should expect you. Stored locally — this build doesn't send notifications yet.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <input
            type="time"
            aria-label="Reminder time"
            value={settings.reminderTime ?? ''}
            onChange={(e) => updateSettings({ reminderTime: e.target.value || null })}
            className="rounded-ledger border border-rule bg-card px-3 py-2 font-mono text-base"
          />
          {settings.reminderTime && (
            <Button variant="ghost" onClick={() => updateSettings({ reminderTime: null })}>
              Clear
            </Button>
          )}
        </div>
      </section>

      <section aria-label="Data">
        <SectionLabel>Your data</SectionLabel>
        <p className="mt-2 text-small text-soft">
          Everything lives in this browser. Export before clearing it, switching devices, or trusting fate.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button variant="quiet" onClick={downloadExport}>
            Export as JSON
          </Button>
          <Button variant="quiet" onClick={() => fileRef.current?.click()}>
            Import JSON
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => onFilePicked(e.target.files?.[0])}
          />
        </div>

        {importError && (
          <p role="alert" className="mt-3 text-small text-red">
            Couldn't import — {importError}
          </p>
        )}
        {importReport && (
          <div className="mt-3 border border-rule bg-card px-3 py-3 text-small">
            <p>
              {importReport.imported} {importReport.imported === 1 ? 'record' : 'records'} imported.
              {importReport.rejected.length > 0 &&
                ` ${importReport.rejected.length} rejected:`}
            </p>
            {importReport.rejected.length > 0 && (
              <ul className="mt-2 flex flex-col gap-1 font-mono text-caption text-soft">
                {importReport.rejected.map((r, i) => (
                  <li key={i}>
                    {r.kind} #{r.index + 1}: {r.reason}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      <section aria-label="Demo data">
        <SectionLabel>Demo data</SectionLabel>
        <p className="mt-2 text-small text-soft">
          About 40 days of plausible failures, Zero Days and gaps, for kicking the tires. Removable
          without touching your real entries.
        </p>
        <div className="mt-3">
          <Button variant="quiet" onClick={() => setDemoData(!settings.demoData)}>
            {settings.demoData ? 'Remove demo data' : 'Load demo data'}
          </Button>
        </div>
      </section>

      <section aria-label="Erase everything">
        <SectionLabel>Erase everything</SectionLabel>
        <p className="mt-2 text-small text-soft">
          Deletes every entry, Zero Day and setting from this browser. There is no undo and no
          backup unless you exported one. Type <span className="font-mono text-ink">erase</span> to
          arm the button.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={eraseText}
            onChange={(e) => setEraseText(e.target.value)}
            placeholder="erase"
            aria-label="Type erase to confirm"
            className="w-32 rounded-ledger border border-rule bg-card px-3 py-2 font-mono text-base placeholder:text-soft/50"
          />
          <Button
            variant="danger"
            disabled={eraseText.trim().toLowerCase() !== 'erase'}
            onClick={() => {
              eraseEverything()
              setEraseText('')
              setErased(true)
            }}
          >
            Erase everything
          </Button>
        </div>
        {erased && <p className="mt-2 text-small text-soft">Erased. The ledger starts blank again.</p>}
      </section>

      <p className="border-t border-rule pt-4 font-mono text-caption text-soft">{THESIS}</p>

      {pendingImport !== null && (
        <Modal title="How should this import land" onClose={() => setPendingImport(null)}>
          <p className="text-base">
            Merge keeps what's here and adds the file's records — existing days win on conflicts.
            Replace throws out everything here first.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => runImport('merge')}>
              Merge
            </Button>
            <Button variant="danger" onClick={() => runImport('replace')}>
              Replace
            </Button>
            <Button variant="ghost" onClick={() => setPendingImport(null)}>
              Cancel
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
