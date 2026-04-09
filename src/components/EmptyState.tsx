export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--card-border)] px-6 py-20 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--card)]">
        <span className="text-lg text-[var(--muted)]">?</span>
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-[var(--muted)]">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
