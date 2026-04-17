import type { Section, StoredArticle } from "@/types/ledger";
import { hostnameOf } from "./ingest/normalize";

/**
 * A cluster built in memory by the clustering step, before persistence.
 * Field names mirror StoryCluster (the persisted shape) so the two are
 * interchangeable in helpers.
 */
export interface DraftCluster {
  primaryArticle: StoredArticle;
  /** Every article in the cluster, including the primary. */
  articles: StoredArticle[];
  section: Section;
  title: string;
}

/** Tunable thresholds. Kept together at the top of the file for easy tweaking. */
export const CLUSTERING = {
  /** Overall pair score >= this collapses the pair into one cluster. */
  mergeThreshold: 0.45,
  /** Time proximity bonus decays linearly to 0 at timeWindowHours. */
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
  "so", "also", "which", "who", "what", "when", "why", "how",
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

function distinctiveOverlap(a: Set<string>, b: Set<string>): number {
  let n = 0;
  for (const t of a) {
    if (t.length >= CLUSTERING.distinctiveMinLength && b.has(t)) n += 1;
  }
  return n;
}

function hoursBetween(aIso: string | null, bIso: string | null): number {
  if (!aIso || !bIso) return Number.POSITIVE_INFINITY;
  const a = Date.parse(aIso);
  const b = Date.parse(bIso);
  if (Number.isNaN(a) || Number.isNaN(b)) return Number.POSITIVE_INFINITY;
  return Math.abs(a - b) / 3_600_000;
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

  if (hostnameOf(a.canonicalUrl) === hostnameOf(b.canonicalUrl)) {
    score += CLUSTERING.sameHostBonus;
  }

  const dt = hoursBetween(a.publishedAt, b.publishedAt);
  if (dt < CLUSTERING.timeWindowHours) {
    score += CLUSTERING.maxTimeBonus * (1 - dt / CLUSTERING.timeWindowHours);
  }

  return score;
}

/** Disjoint-set / union-find over small integer indices. */
class DSU {
  private parent: number[];
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
 *   1. Partition by section (we only compare within a section).
 *   2. Within each partition, score every pair of titles.
 *   3. Union-find merges any pair at or above CLUSTERING.mergeThreshold.
 *   4. Each component becomes one DraftCluster; the primary article is the
 *      most recently published (newspaper convention).
 *
 * O(n^2) per section. Fine for a personal edition (tens to low hundreds).
 */
export function clusterArticles(articles: StoredArticle[]): DraftCluster[] {
  const sections = groupBy(articles, (a) => a.section);
  const clusters: DraftCluster[] = [];

  for (const [section, items] of sections) {
    if (items.length === 0) continue;
    const titleTokens = items.map((a) => tokenize(a.title));
    const dsu = new DSU(items.length);

    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        if (
          pairScore(items[i], titleTokens[i], items[j], titleTokens[j]) >=
          CLUSTERING.mergeThreshold
        ) {
          dsu.union(i, j);
        }
      }
    }

    const components = new Map<number, StoredArticle[]>();
    for (let i = 0; i < items.length; i++) {
      const root = dsu.find(i);
      const bucket = components.get(root) ?? [];
      bucket.push(items[i]);
      components.set(root, bucket);
    }

    for (const bucket of components.values()) {
      const primaryArticle = pickPrimary(bucket);
      clusters.push({
        primaryArticle,
        articles: bucket,
        section,
        title: primaryArticle.title,
      });
    }
  }

  return clusters;
}

function groupBy<T, K>(items: T[], key: (t: T) => K): Map<K, T[]> {
  const out = new Map<K, T[]>();
  for (const item of items) {
    const k = key(item);
    const bucket = out.get(k) ?? [];
    bucket.push(item);
    out.set(k, bucket);
  }
  return out;
}

function pickPrimary(articles: StoredArticle[]): StoredArticle {
  // Newest publish time wins; newspapers lead with the latest update, not
  // the original break. Fall back to ingestedAt, then to id as a stable tie.
  return [...articles].sort((a, b) => {
    const ta = Date.parse(a.publishedAt ?? a.ingestedAt);
    const tb = Date.parse(b.publishedAt ?? b.ingestedAt);
    if (ta !== tb) return tb - ta;
    return a.id - b.id;
  })[0];
}
