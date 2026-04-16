import { getDb } from "./db";
import type {
  FeedConfig,
  NormalizedArticle,
  Section,
  StoredArticle,
} from "@/types/ledger";

interface FeedRow {
  id: number;
  name: string;
  url: string;
  section: string;
  enabled: number;
}

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

export function listEnabledFeeds(): FeedRow[] {
  return getDb()
    .prepare(`SELECT * FROM feeds WHERE enabled = 1 ORDER BY id`)
    .all() as FeedRow[];
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

export function getRecentArticles(limit = 60): StoredArticle[] {
  const rows = getDb()
    .prepare(
      `SELECT * FROM articles
       ORDER BY COALESCE(published_at, ingested_at) DESC
       LIMIT ?`,
    )
    .all(limit) as ArticleRow[];
  return rows.map(rowToArticle);
}

export function getRecentArticlesBySection(
  section: Section,
  limit = 6,
): StoredArticle[] {
  const rows = getDb()
    .prepare(
      `SELECT * FROM articles
       WHERE section = ?
       ORDER BY COALESCE(published_at, ingested_at) DESC
       LIMIT ?`,
    )
    .all(section, limit) as ArticleRow[];
  return rows.map(rowToArticle);
}

export function countArticles(): number {
  const row = getDb()
    .prepare(`SELECT COUNT(*) AS n FROM articles`)
    .get() as { n: number };
  return row.n;
}
