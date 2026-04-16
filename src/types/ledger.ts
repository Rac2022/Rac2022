export type Section =
  | "World"
  | "U.S."
  | "Business"
  | "Science & AI"
  | "Health"
  | "Culture"
  | "Briefs";

export const ALL_SECTIONS: Section[] = [
  "World",
  "U.S.",
  "Business",
  "Science & AI",
  "Health",
  "Culture",
  "Briefs",
];

export type EditionKind = "morning" | "evening";

export interface FeedConfig {
  name: string;
  url: string;
  section: Section;
  enabled?: boolean;
}

export interface NormalizedArticle {
  feedId: number;
  sourceName: string;
  url: string;
  canonicalUrl: string;
  title: string;
  summary: string | null;
  author: string | null;
  publishedAt: string | null;
  section: Section;
  lang: string | null;
  raw: unknown;
}

export interface StoredArticle extends NormalizedArticle {
  id: number;
  ingestedAt: string;
}

export interface StoryCluster {
  id: number;
  title: string;
  oneLiner: string | null;
  whyItMatters: string | null;
  section: Section;
  importance: number;
  primaryArticle: StoredArticle;
  relatedArticles: StoredArticle[];
}

export interface Edition {
  id: number;
  kind: EditionKind;
  windowStart: string;
  windowEnd: string;
  generatedAt: string;
  clusters: StoryCluster[];
}
