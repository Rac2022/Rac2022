export type Tab = 'today' | 'ledger' | 'insights' | 'settings'

const TABS: { id: Tab; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'ledger', label: 'Ledger' },
  { id: 'insights', label: 'Insights' },
  { id: 'settings', label: 'Settings' },
]

// Bottom tab bar on mobile, left rail on desktop.
export function Nav({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-card md:inset-x-auto md:inset-y-0 md:left-0 md:w-44 md:border-t-0 md:border-r"
    >
      <div className="hidden px-5 pt-6 pb-4 md:block">
        <div className="font-display text-h3 leading-tight text-red">The Failure Log</div>
      </div>
      <ul className="flex md:flex-col md:gap-1 md:px-3">
        {TABS.map(({ id, label }) => (
          <li key={id} className="flex-1 md:flex-none">
            <button
              onClick={() => onChange(id)}
              aria-current={tab === id ? 'page' : undefined}
              className={`w-full px-2 py-3 text-center font-mono text-caption uppercase tracking-[0.1em] transition-colors md:rounded-ledger md:px-3 md:py-2 md:text-left ${
                tab === id
                  ? 'border-t-2 border-red text-red md:border-t-0 md:border-l-2 md:bg-tint'
                  : 'border-t-2 border-transparent text-soft hover:text-ink md:border-t-0 md:border-l-2'
              }`}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
