import Link from "next/link";

export function Nav() {
  return (
    <nav className="border-b border-[var(--card-border)] bg-[var(--card)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Trend Radar
          </Link>
          <div className="flex items-center gap-1">
            <NavLink href="/">Dashboard</NavLink>
            <NavLink href="/signals/new">Add Signal</NavLink>
            <NavLink href="/review">Weekly Review</NavLink>
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
      className="rounded-md px-3 py-1.5 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--card-border)] hover:text-[var(--foreground)]"
    >
      {children}
    </Link>
  );
}
