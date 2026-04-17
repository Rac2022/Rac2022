import type { Section, StoredArticle } from "@/types/ledger";

/**
 * An in-memory story cluster produced by the clustering step.
 * Persisted later by the edition generator.
 */
export interface DraftCluster {
  primary: StoredArticle;
  members: StoredArticle[];
  section: Section;
  title: string;
}

/**
 * Token-level stopwords. Intentionally small; we're matching short headlines,
 * not indexing documents.
 */
const STOPWORDS = new Set([
  "the", "a", "an", "of", "in", "on", "at", "to", "for", "and", "or", "but",
  "with", "from", "by", "is", "are", "was", "were", "as", "be", "been", "has",
  "have", "had", "this", "that", "these", "those", "it", "its", "his", "her",
  "their", "our", "your", "my", "says", "said", "new", "amid", "after",
  "before", "over", "under", "up", "down", "into", "out", "than", "then",
  "so", "also", "which", "who", "what", "when", "why", "how", "amid",
]);

function tokenize(text: string): Set<string> {
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t));
  return new Set(tokens);
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersect = 0;
  for (const t of a) if (b.has(t)) intersect += 1;
  const union = a.size + b.size - intersect;
  return union === 0 ? 0 : intersect / union;
}

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function hoursBetween(aIso: string | null, bIso: string | null): number {
  if (!aIso || !bIso) return Number.POSITIVE_INFINITY;
  const a = Date.parse(aIso);
  const b = Date.parse(bIso);
  if (Number.isNaN(a) || Number.isNaN(b)) return Number.POSITIVE_INFINITY;
  return Math.abs(a - b) / 3_600_000;
}

/** Tunable thresholds. Kept together at the top of the file for easy tweaking. */
export const CLUSTERING = {
  /** Overall pair score >= this collapses the pair into one cluster. */
  mergeThreshold: 0.45,
  /** Time proximity bonus, maxed at maxTimeBonus within timeWindowHours. */
  timeWindowHours: 36,
  maxTimeBonus: 0.08,
  /** Flat bonus if both articles share a hostname (wire reprints, syndication). */
  sameHostBonus: 0.05,
  /**
   * A token is "distinctive" if it's at least this long. Two distinctive
   * tokens shared across titles is a strong same-story signal even when
   * Jaccard overlap is modest.
   */
  distinctiveMinLength: 6,
  /** Applied per distinctive overlap, capped at maxDistinctiveBonus. */
  distinctiveTokenBonus: 0.12,
  maxDistinctiveBonus: 0.3,
};

function distinctiveOverlap(a: Set<string>, b: Set<string>): number {
  let n = 0;
  for (const t of a) {
    if (t.length >= CLUSTERING.distinctiveMinLength && b.has(t)) n += 1;
  }
  return n;
}

/**
 * Score how likely two articles describe the same story.
 * Return is on a 0..~1 scale; threshold comparisons use mergeThreshold.
 * Only called for same-section pairs.
 */
function pairScore(
  a: StoredArticle,
  aTitleTokens: Set<string>,
  b: StoredArticle,
  bTitleTokens: Set<string>,
): number {
  if (a.canonicalUrl === b.canonicalUrl) return 1;

  let score = jaccard(aTitleTokens, bTitleTokens);

  // Distinctive-token bonus: "geneva" + "ceasefire" across three headlines
  // is the canonical cue for same-story wire coverage.
  const distinctive = distinctiveOverlap(aTitleTokens, bTitleTokens);
  if (distinctive > 0) {
    score += Math.min(
      distinctive * CLUSTERING.distinctiveTokenBonus,
      CLUSTERING.maxDistinctiveBonus,
    );
  }

  // Small nudge for same host (wire syndication, reprints).
  if (hostnameOf(a.canonicalUrl) === hostnameOf(b.canonicalUrl)) {
    score += CLUSTERING.sameHostBonus;
  }

  // Time-proximity nudge: decays linearly to 0 at timeWindowHours.
  const dt = hoursBetween(a.publishedAt, b.publishedAt);
  if (dt < CLUSTERING.timeWindowHours) {
    score += CLUSTERING.maxTimeBonus * (1 - dt / CLUSTERING.timeWindowHours);
  }

  return score;
}

/** Union-find helpers. */
class DSU {
  parent: number[];
  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
  }
  find(x: number): number {
    while (this.parent[x] !== x) {
      this.parent[x] = this.parent[this.parent[x]];
      x = this.parent[x];
    }
    return x;
  }
  union(a: number, b: number) {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra !== rb) this.parent[ra] = rb;
  }
}

/**
 * Cluster the given articles into story groups.
 *
 * Approach:
 *   1. Partition by section (we only compare within the same section).
 *   2. For each partition, compare all pairs. O(n^2) per partition is fine
 *      for a personal edition (a few hundred items at most).
 *   3. Union-find merges any pair above threshold.
 *   4. For each component, the primary is the earliest-published article,
 *      with article id as a stable tiebreaker.
 */
export function clusterArticles(articles: StoredArticle[]): DraftCluster[] {
  const bySection = new Map<Section, StoredArticle[]>();
  for (const a of articles) {
    const list = bySection.get(a.section) ?? [];
    list.push(a);
    bySection.set(a.section, list);
  }

  const clusters: DraftCluster[] = [];

  for (const [section, items] of bySection) {
    const n = items.length;
    if (n === 0) continue;
    // Titles only. Summaries add noise that hurts short-headline clustering.
    const titleTokens = items.map((a) => tokenize(a.title));
    const dsu = new DSU(n);

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const s = pairScore(items[i], titleTokens[i], items[j], titleTokens[j]);
        if (s >= CLUSTERING.mergeThreshold) dsu.union(i, j);
      }
    }

    const groups = new Map<number, number[]>();
    for (let i = 0; i < n; i++) {
      const r = dsu.find(i);
      const g = groups.get(r) ?? [];
      g.push(i);
      groups.set(r, g);
    }

    for (const [, indices] of groups) {
      const members = indices.map((i) => items[i]);
      const primary = pickPrimary(members);
      clusters.push({
        primary,
        members,
        section,
        title: primary.title,
      });
    }
  }

  return clusters;
}

function pickPrimary(members: StoredArticle[]): StoredArticle {
  // Most recent published_at wins. Newspapers lead with the latest update,
  // not the original break. Fall back to ingested_at, then to id as a stable
  // tiebreaker.
  return [...members].sort((a, b) => {
    const ta = Date.parse(a.publishedAt ?? a.ingestedAt);
    const tb = Date.parse(b.publishedAt ?? b.ingestedAt);
    if (ta !== tb) return tb - ta;
    return a.id - b.id;
  })[0];
}
