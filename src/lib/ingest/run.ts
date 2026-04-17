import { FEEDS } from "@/config/feeds";
import { PREFERENCES } from "@/config/preferences";
import { insertArticle, upsertFeed } from "@/lib/queries";
import type { NormalizedArticle, Section } from "@/types/ledger";
import { fetchFeed, type RawFeedItem } from "./rss";
import { canonicalizeUrl, hostnameOf, stripHtml, truncate } from "./normalize";

export interface IngestReport {
  feedsProcessed: number;
  itemsSeen: number;
  articlesInserted: number;
  errors: { feed: string; message: string }[];
}

function parseDate(item: RawFeedItem): string | null {
  const raw = item.isoDate ?? item.pubDate ?? null;
  if (!raw) return null;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function normalizeItem(
  item: RawFeedItem,
  feedId: number,
  sourceName: string,
  section: Section,
): NormalizedArticle | null {
  const link = item.link?.trim();
  const title = stripHtml(item.title);
  if (!link || !title) return null;

  const canonicalUrl = canonicalizeUrl(link);
  const host = hostnameOf(canonicalUrl);
  if (PREFERENCES.blockedDomains.includes(host)) return null;

  const summary = truncate(
    stripHtml(item.contentSnippet ?? item.summary ?? item.content ?? ""),
    400,
  );

  return {
    feedId,
    sourceName,
    url: link,
    canonicalUrl,
    title,
    summary: summary || null,
    author: (item.creator ?? item.author ?? null) as string | null,
    publishedAt: parseDate(item),
    section,
    lang: null,
    raw: item,
  };
}

export async function runIngest(): Promise<IngestReport> {
  const report: IngestReport = {
    feedsProcessed: 0,
    itemsSeen: 0,
    articlesInserted: 0,
    errors: [],
  };

  for (const feed of FEEDS) {
    if (feed.enabled === false) continue;
    const feedId = upsertFeed(feed);

    try {
      const raw = await fetchFeed(feed.url);
      report.feedsProcessed += 1;
      for (const item of raw.items ?? []) {
        report.itemsSeen += 1;
        const normalized = normalizeItem(item, feedId, feed.name, feed.section);
        if (!normalized) continue;
        const id = insertArticle(normalized);
        if (id !== null) report.articlesInserted += 1;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      report.errors.push({ feed: feed.name, message });
    }
  }

  return report;
}
