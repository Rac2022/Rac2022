import type { StoryCluster } from "@/types/ledger";
import { ClusterCard } from "./ClusterCard";

export function Briefs({ clusters }: { clusters: StoryCluster[] }) {
  if (clusters.length === 0) return null;
  return (
    <section className="py-10 rule-top">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="font-display text-3xl">Briefs</h2>
        <span className="font-meta">
          {clusters.length} {clusters.length === 1 ? "item" : "items"}
        </span>
      </div>
      <div className="grid gap-x-10 md:grid-cols-3">
        {clusters.map((c) => (
          <ClusterCard key={c.id} cluster={c} variant="brief" />
        ))}
      </div>
    </section>
  );
}
