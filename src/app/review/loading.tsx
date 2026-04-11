import { Skeleton, SignalCardSkeleton } from "@/components/Skeleton";

export default function ReviewLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4"
          >
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-2 h-8 w-12" />
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5"
          >
            <Skeleton className="h-3 w-32" />
            <Skeleton className="mt-4 h-28 w-full" />
          </div>
        ))}
      </div>

      {/* Lists */}
      <div>
        <Skeleton className="h-6 w-32" />
        <div className="mt-3 space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <SignalCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
