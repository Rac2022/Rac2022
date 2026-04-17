import { PREFERENCES } from "@/config/preferences";
import type { EditionKind } from "@/types/ledger";
import { clusterArticles } from "./cluster";
import { getDb } from "./db";
import {
  getArticlesInWindow,
  insertCluster,
  insertClusterItem,
  insertEdition,
  insertEditionItem,
  type CachedSummary,
} from "./queries";
import { rankClusters, type RankedCluster } from "./rank";
import {
  clusterSignature,
  summarizeClusters,
  type SummarizeReport,
} from "./summarize";
import { currentEditionKind, editionWindow } from "./time";

/** Number of selected clusters echoed in the CLI report. Display only. */
const REPORT_TOP_N = 8;

export interface GenerateReport {
  editionId: number;
  kind: EditionKind;
  windowStart: string;
  windowEnd: string;
  articlesConsidered: number;
  clustersBuilt: number;
  clustersSelected: number;
  summarize: SummarizeReport;
  top: { rank: number; title: string; importance: number; sources: number }[];
}

/**
 * Build a reproducible edition snapshot from whatever is currently in the DB.
 *
 *   1. Articles inside the edition's time window.
 *   2. Cluster them.
 *   3. Rank clusters by the importance formula.
 *   4. Resolve summaries (cache + Anthropic). Skipped when the key is unset.
 *   5. Inside one transaction, persist the clusters and the edition row.
 *
 * A failure anywhere in step 5 leaves the DB untouched.
 * Per-cluster summary failures degrade gracefully: the cluster is persisted
 * with null oneLiner / whyItMatters and the homepage falls back to the
 * article's RSS summary.
 */
export async function generateEdition(
  kind: EditionKind = currentEditionKind(),
  now = new Date(),
): Promise<GenerateReport> {
  const { start, end } = editionWindow(kind, now);
  const windowStart = start.toISOString();
  const windowEnd = end.toISOString();

  const articles = getArticlesInWindow(windowStart, windowEnd);
  const drafts = clusterArticles(articles);
  const ranked = rankClusters(drafts, now);
  const selected = ranked.slice(0, PREFERENCES.maxClustersPerEdition);

  const { summaries, report: summarize } = await summarizeClusters(selected);

  const editionId = getDb().transaction(() => {
    const id = insertEdition({ kind, windowStart, windowEnd });
    selected.forEach((cluster, i) => {
      const summary = summaries.get(clusterSignature(cluster)) ?? null;
      persistCluster(id, i + 1, cluster, summary);
    });
    return id;
  })();

  return {
    editionId,
    kind,
    windowStart,
    windowEnd,
    articlesConsidered: articles.length,
    clustersBuilt: drafts.length,
    clustersSelected: selected.length,
    summarize,
    top: selected.slice(0, REPORT_TOP_N).map((c, i) => ({
      rank: i + 1,
      title: c.title,
      importance: Number(c.importance.toFixed(3)),
      sources: c.articles.length,
    })),
  };
}

/** Write one cluster plus its articles plus its edition-item row. Must run inside a transaction. */
function persistCluster(
  editionId: number,
  rank: number,
  cluster: RankedCluster,
  summary: CachedSummary | null,
): void {
  const clusterId = insertCluster({
    primaryArticleId: cluster.primaryArticle.id,
    title: cluster.title,
    section: cluster.section,
    importance: cluster.importance,
    oneLiner: summary?.oneLiner ?? null,
    whyItMatters: summary?.whyItMatters ?? null,
  });
  for (const article of cluster.articles) insertClusterItem(clusterId, article.id);
  insertEditionItem({ editionId, clusterId, rank, section: cluster.section });
}
