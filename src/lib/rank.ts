import { PREFERENCES } from "@/config/preferences";
import type { DraftCluster } from "./cluster";

export const RANKING = {
  /** Half-life of the recency decay, in hours. */
  recencyHalfLifeHours: 18,
  /** Multiplier applied when avoidContentTypes terms appear in title/summary. */
  avoidPenalty: 0.6,
};

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function ageHours(iso: string | null, now: Date): number {
  if (!iso) return 48;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return 48;
  return Math.max(0, (now.getTime() - t) / 3_600_000);
}

function hasAvoidTerms(cluster: DraftCluster): boolean {
  const avoid = PREFERENCES.avoidContentTypes;
  if (avoid.length === 0) return false;
  const haystack = [
    cluster.title,
    cluster.primary.summary ?? "",
    ...cluster.members.map((m) => m.title),
  ]
    .join(" ")
    .toLowerCase();
  return avoid.some((t) => haystack.includes(t.toLowerCase()));
}

export interface RankedCluster extends DraftCluster {
  importance: number;
  /** Kept for debugging/logging. */
  signals: {
    sourceCount: number;
    sourceDiversity: number;
    recency: number;
    sectionWeight: number;
    avoidPenalty: number;
  };
}

/**
 * Score a draft cluster. The formula is:
 *
 *   importance = sourceCount * sqrt(diversity) * recency * sectionWeight * avoidPenalty
 *
 * All inputs are plain numbers, so the result is easy to log and tune.
 */
export function scoreCluster(cluster: DraftCluster, now = new Date()): RankedCluster {
  const sourceCount = cluster.members.length;
  const hosts = new Set(cluster.members.map((m) => hostnameOf(m.canonicalUrl)));
  const sourceDiversity = hosts.size;

  const primaryAge = ageHours(cluster.primary.publishedAt, now);
  const recency = Math.pow(0.5, primaryAge / RANKING.recencyHalfLifeHours);

  const sectionWeight = PREFERENCES.sectionWeights[cluster.section] ?? 1;
  const avoidPenalty = hasAvoidTerms(cluster) ? RANKING.avoidPenalty : 1;

  const importance =
    sourceCount *
    Math.sqrt(sourceDiversity) *
    recency *
    sectionWeight *
    avoidPenalty;

  return {
    ...cluster,
    importance,
    signals: {
      sourceCount,
      sourceDiversity,
      recency,
      sectionWeight,
      avoidPenalty,
    },
  };
}

export function rankClusters(clusters: DraftCluster[], now = new Date()): RankedCluster[] {
  return clusters
    .map((c) => scoreCluster(c, now))
    .sort((a, b) => b.importance - a.importance);
}
