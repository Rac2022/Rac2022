import { Skeleton } from "@/components/Skeleton";

export default function DigestLoading() {
  return (
    <div className="space-y-10">
      <div>
        <Skeleton className="h-8 w-44" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>
      {Array.from({ length: 4 }).map((_, section) => (
        <div key={section}>
          <div className="mb-4">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="mt-2 h-3 w-64" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4"
              >
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
