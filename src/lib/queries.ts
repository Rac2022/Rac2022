import { getDb } from "./db";
import type {
  EditionKind,
  FeedConfig,
  NormalizedArticle,
  Section,
  StoredArticle,
  StoryCluster,
} from "@/types/ledger";

interface ArticleRow {
  id: number;
  feed_id: number;
  source_name: string;
  url: string;
  canonical_url: string;
  title: string;
  summary: string | null;
  author: string | null;
  published_at: string | null;
  section: string;
  lang: string | null;
  raw_json: string | null;
  ingested_at: string;
}

function rowToArticle(r: ArticleRow): StoredArticle {
  return {
    id: r.id,
    feedId: r.feed_id,
    sourceName: r.source_name,
    url: r.url,
    canonicalUrl: r.canonical_url,
    title: r.title,
    summary: r.summary,
    author: r.author,
    publishedAt: r.published_at,
    section: r.section as Section,
    lang: r.lang,
    raw: r.raw_json ? JSON.parse(r.raw_json) : null,
    ingestedAt: r.ingested_at,
  };
}

export function upsertFeed(feed: FeedConfig): number {
  const db = getDb();
  const stmt = db.prepare(
    `INSERT INTO feeds (name, url, section, enabled)
     VALUES (@name, @url, @section, @enabled)
     ON CONFLICT(url) DO UPDATE SET
       name = excluded.name,
       section = excluded.section,
       enabled = excluded.enabled
     RETURNING id`,
  );
  const row = stmt.get({
    name: feed.name,
    url: feed.url,
    section: feed.section,
    enabled: feed.enabled === false ? 0 : 1,
  }) as { id: number };
  return row.id;
}

/**
 * Insert an article, ignoring duplicates by canonical_url.
 * Returns the article id (existing or new).
 */
export function insertArticle(a: NormalizedArticle): number | null {
  const db = getDb();
  const stmt = db.prepare(
    `INSERT INTO articles
      (feed_id, source_name, url, canonical_url, title, summary,
       author, published_at, section, lang, raw_json)
     VALUES
      (@feedId, @sourceName, @url, @canonicalUrl, @title, @summary,
       @author, @publishedAt, @section, @lang, @raw)
     ON CONFLICT(canonical_url) DO NOTHING
     RETURNING id`,
  );
  const row = stmt.get({
    feedId: a.feedId,
    sourceName: a.sourceName,
    url: a.url,
    canonicalUrl: a.canonicalUrl,
    title: a.title,
    summary: a.summary,
    author: a.author,
    publishedAt: a.publishedAt,
    section: a.section,
    lang: a.lang,
    raw: a.raw ? JSON.stringify(a.raw) : null,
  }) as { id: number } | undefined;
  return row?.id ?? null;
}

/** Articles whose published_at (or ingested_at if missing) falls in [startIso, endIso). */
export function getArticlesInWindow(
  startIso: string,
  endIso: string,
): StoredArticle[] {
  const rows = getDb()
    .prepare(
      `SELECT * FROM articles
       WHERE COALESCE(published_at, ingested_at) >= ?
         AND COALESCE(published_at, ingested_at) <  ?
       ORDER BY COALESCE(published_at, ingested_at) DESC`,
    )
    .all(startIso, endIso) as ArticleRow[];
  return rows.map(rowToArticle);
}

// ---------- clusters ----------

export function insertCluster(args: {
  primaryArticleId: number;
  title: string;
  section: Section;
  importance: number;
  oneLiner?: string | null;
  whyItMatters?: string | null;
}): number {
  const row = getDb()
    .prepare(
      `INSERT INTO story_clusters
        (primary_article_id, title, section, importance, one_liner, why_it_matters)
       VALUES (@primaryArticleId, @title, @section, @importance, @oneLiner, @whyItMatters)
       RETURNING id`,
    )
    .get({
      primaryArticleId: args.primaryArticleId,
      title: args.title,
      section: args.section,
      importance: args.importance,
      oneLiner: args.oneLiner ?? null,
      whyItMatters: args.whyItMatters ?? null,
    }) as { id: number };
  return row.id;
}

export function insertClusterItem(clusterId: number, articleId: number): void {
  getDb()
    .prepare(
      `INSERT OR IGNORE INTO cluster_items (cluster_id, article_id) VALUES (?, ?)`,
    )
    .run(clusterId, articleId);
}

// ---------- editions ----------

export interface EditionHead {
  id: number;
  kind: EditionKind;
  windowStart: string;
  windowEnd: string;
  generatedAt: string;
}

interface EditionRow {
  id: number;
  kind: EditionKind;
  window_start: string;
  window_end: string;
  generated_at: string;
}

export function insertEdition(args: {
  kind: EditionKind;
  windowStart: string;
  windowEnd: string;
}): number {
  const row = getDb()
    .prepare(
      `INSERT INTO editions (kind, window_start, window_end)
       VALUES (@kind, @windowStart, @windowEnd)
       RETURNING id`,
    )
    .get(args) as { id: number };
  return row.id;
}

export function insertEditionItem(args: {
  editionId: number;
  clusterId: number;
  rank: number;
  section: Section;
}): void {
  getDb()
    .prepare(
      `INSERT INTO edition_items (edition_id, cluster_id, rank, section)
       VALUES (@editionId, @clusterId, @rank, @section)`,
    )
    .run(args);
}

export function getLatestEdition(): EditionHead | null {
  const row = getDb()
    .prepare(
      `SELECT id, kind, window_start, window_end, generated_at
         FROM editions ORDER BY id DESC LIMIT 1`,
    )
    .get() as EditionRow | undefined;
  if (!row) return null;
  return {
    id: row.id,
    kind: row.kind,
    windowStart: row.window_start,
    windowEnd: row.window_end,
    generatedAt: row.generated_at,
  };
}

interface ClusterJoinRow {
  id: number;
  primary_article_id: number;
  title: string;
  one_liner: string | null;
  why_it_matters: string | null;
  section: string;
  importance: number;
  rank: number;
}

/**
 * Load the clusters for an edition, ordered by rank, with all member articles
 * hydrated. Two queries total.
 */
export function getEditionClusters(editionId: number): StoryCluster[] {
  const db = getDb();

  const clusterRows = db
    .prepare(
      `SELECT c.id, c.primary_article_id, c.title, c.one_liner, c.why_it_matters,
              ei.section AS section, c.importance, ei.rank AS rank
         FROM edition_items ei
         JOIN story_clusters c ON c.id = ei.cluster_id
        WHERE ei.edition_id = ?
        ORDER BY ei.rank ASC`,
    )
    .all(editionId) as ClusterJoinRow[];

  if (clusterRows.length === 0) return [];

  const clusterIds = clusterRows.map((c) => c.id);
  const placeholders = clusterIds.map(() => "?").join(",");
  const itemRows = db
    .prepare(
      `SELECT ci.cluster_id, a.*
         FROM cluster_items ci
         JOIN articles a ON a.id = ci.article_id
        WHERE ci.cluster_id IN (${placeholders})`,
    )
    .all(...clusterIds) as (ArticleRow & { cluster_id: number })[];

  const articlesByCluster = new Map<number, StoredArticle[]>();
  for (const { cluster_id, ...rest } of itemRows) {
    const list = articlesByCluster.get(cluster_id) ?? [];
    list.push(rowToArticle(rest as ArticleRow));
    articlesByCluster.set(cluster_id, list);
  }

  return clusterRows.map((row) => {
    const articles = articlesByCluster.get(row.id) ?? [];
    const primaryArticle =
      articles.find((a) => a.id === row.primary_article_id) ?? articles[0];
    const relatedArticles = articles.filter((a) => a.id !== primaryArticle?.id);
    return {
      id: row.id,
      title: row.title,
      oneLiner: row.one_liner,
      whyItMatters: row.why_it_matters,
      section: row.section as Section,
      importance: row.importance,
      rank: row.rank,
      primaryArticle,
      relatedArticles,
    };
  });
}

// ---------- summary cache ----------

export interface CachedSummary {
  oneLiner: string;
  whyItMatters: string;
}

export function getCachedSummary(signature: string): CachedSummary | null {
  const row = getDb()
    .prepare(
      `SELECT one_liner, why_it_matters FROM cluster_summaries WHERE signature = ?`,
    )
    .get(signature) as
    | { one_liner: string; why_it_matters: string }
    | undefined;
  if (!row) return null;
  return { oneLiner: row.one_liner, whyItMatters: row.why_it_matters };
}

export function putCachedSummary(args: {
  signature: string;
  oneLiner: string;
  whyItMatters: string;
  model: string;
}): void {
  getDb()
    .prepare(
      `INSERT INTO cluster_summaries (signature, one_liner, why_it_matters, model)
       VALUES (@signature, @oneLiner, @whyItMatters, @model)
       ON CONFLICT(signature) DO UPDATE SET
         one_liner = excluded.one_liner,
         why_it_matters = excluded.why_it_matters,
         model = excluded.model`,
    )
    .run(args);
}
