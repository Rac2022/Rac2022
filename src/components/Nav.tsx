import Link from "next/link";

export function Nav() {
  return (
    <nav className="sticky top-0 z-40 border-b border-[var(--card-border)] bg-[var(--background)]/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-base font-semibold tracking-tight">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent)] text-xs font-bold text-white">
              TR
            </span>
            Trend Radar
          </Link>
          <div className="flex items-center gap-0.5">
            <NavLink href="/">Dashboard</NavLink>
            <NavLink href="/digest">Digest</NavLink>
            <NavLink href="/review">Analytics</NavLink>
            <NavLink href="/import">Import</NavLink>
            <Link
              href="/signals/new"
              className="ml-2 rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
            >
              + Add
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-1.5 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--card)] hover:text-[var(--foreground)]"
    >
      {children}
    </Link>
  );
}
