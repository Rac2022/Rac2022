import { Skeleton, SignalCardSkeleton } from "@/components/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-2">
      <div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-2 h-4 w-24" />
      </div>
      <div className="py-3">
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-[58px] flex-1 min-w-[200px]" />
          <Skeleton className="h-[58px] w-32" />
          <Skeleton className="h-[58px] w-36" />
          <Skeleton className="h-[58px] w-24" />
          <Skeleton className="h-[58px] w-40" />
        </div>
      </div>
      <div className="grid gap-2 pt-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <SignalCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
