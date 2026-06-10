import { useState } from 'react'
import { AppProvider, useApp } from './state/AppContext'
import { Nav } from './components/Nav'
import type { Tab } from './components/Nav'
import { Today } from './pages/Today'
import { Ledger } from './pages/Ledger'
import { Insights } from './pages/Insights'
import { Settings } from './pages/Settings'
import { Onboarding } from './pages/Onboarding'

function Shell() {
  const { settings, updateSettings, storageError, clearStorageError } = useApp()
  const [tab, setTab] = useState<Tab>('today')

  if (!settings.onboarded) {
    return <Onboarding onDone={() => updateSettings({ onboarded: true })} />
  }

  return (
    <div className="min-h-dvh bg-paper">
      {storageError && (
        <div
          role="alert"
          className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 border-b border-red bg-tint px-4 py-3 text-small text-ink md:left-44"
        >
          <span>{storageError}</span>
          <button
            onClick={clearStorageError}
            className="shrink-0 font-mono text-caption text-red underline underline-offset-4"
          >
            Dismiss
          </button>
        </div>
      )}
      <Nav tab={tab} onChange={setTab} />
      <main className="mx-auto w-full max-w-xl px-4 pt-8 pb-28 md:ml-44 md:pt-12 md:pb-12 lg:mx-auto">
        {tab === 'today' && <Today />}
        {tab === 'ledger' && <Ledger />}
        {tab === 'insights' && <Insights />}
        {tab === 'settings' && <Settings />}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
