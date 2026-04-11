import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SignalCard } from "@/components/SignalCard";
import { SignalFilters } from "@/components/SignalFilters";
import { EmptyState } from "@/components/EmptyState";
import type { Prisma } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  status?: string;
  sourceType?: string;
  minScore?: string;
  q?: string;
  sort?: string;
}>;

const SORT_MAP: Record<string, Prisma.TrendSignalOrderByWithRelationInput> = {
  "score-desc": { overallScore: "desc" },
  "score-asc": { overallScore: "asc" },
  "date-desc": { createdAt: "desc" },
  "date-asc": { createdAt: "asc" },
  "novelty-desc": { noveltyScore: "desc" },
  "monetization-desc": { monetizationEaseScore: "desc" },
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const where: Prisma.TrendSignalWhereInput = {};

  if (params.status) where.status = params.status;
  if (params.sourceType) where.sourceType = params.sourceType;
  if (params.minScore) where.overallScore = { gte: Number(params.minScore) };
  if (params.q) {
    const q = params.q;
    where.OR = [
      { title: { contains: q } },
      { tags: { contains: q } },
      { summary: { contains: q } },
    ];
  }

  const orderBy = SORT_MAP[params.sort ?? "score-desc"] ?? SORT_MAP["score-desc"];

  const [signals, totalCount] = await Promise.all([
    prisma.trendSignal.findMany({ where, orderBy }),
    prisma.trendSignal.count(),
  ]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-0.5 text-sm text-[var(--muted)]">
            {signals.length === totalCount
              ? `${totalCount} signal${totalCount !== 1 ? "s" : ""}`
              : `${signals.length} of ${totalCount} signals`}
          </p>
        </div>
      </div>

      <Suspense fallback={null}>
        <SignalFilters />
      </Suspense>

      {signals.length === 0 ? (
        <EmptyState
          title="No signals found"
          description={
            totalCount === 0
              ? "Add your first trend signal to get started."
              : "Try adjusting your filters."
          }
          action={
            totalCount === 0 ? (
              <Link
                href="/signals/new"
                className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white"
              >
                Add Signal
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-2 pt-2">
          {signals.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      )}
    </div>
  );
}
