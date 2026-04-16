import Parser from "rss-parser";

export interface RawFeedItem {
  title?: string;
  link?: string;
  isoDate?: string;
  pubDate?: string;
  creator?: string;
  author?: string;
  contentSnippet?: string;
  content?: string;
  summary?: string;
  categories?: string[];
  [key: string]: unknown;
}

export interface RawFeed {
  title?: string;
  link?: string;
  description?: string;
  items: RawFeedItem[];
}

const parser = new Parser<RawFeed, RawFeedItem>({
  timeout: 15_000,
  headers: {
    "User-Agent": "MorningLedger/0.1 (+personal aggregator)",
  },
});

export async function fetchFeed(url: string): Promise<RawFeed> {
  return parser.parseURL(url);
}
