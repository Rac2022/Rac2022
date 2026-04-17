import type {
  EditionKind,
  StoredArticle,
  StoryCluster,
} from "@/types/ledger";
import { assembleLayout, type EditionSnapshot } from "./edition";

function article(
  id: number,
  section: StoredArticle["section"],
  source: string,
  title: string,
  summary: string,
): StoredArticle {
  return {
    id,
    feedId: 0,
    sourceName: source,
    url: "#",
    canonicalUrl: `#${id}`,
    title,
    summary,
    author: null,
    publishedAt: new Date().toISOString(),
    section,
    lang: "en",
    raw: null,
    ingestedAt: new Date().toISOString(),
  };
}

function cluster(
  id: number,
  rank: number,
  primary: StoredArticle,
  related: StoredArticle[] = [],
  importance = 0,
): StoryCluster {
  return {
    id,
    rank,
    title: primary.title,
    oneLiner: null,
    whyItMatters: null,
    section: primary.section,
    importance,
    primaryArticle: primary,
    relatedArticles: related,
  };
}

export function sampleEdition(kind: EditionKind): EditionSnapshot {
  const clusters: StoryCluster[] = [
    cluster(
      1,
      1,
      article(
        1,
        "World",
        "Sample Wire",
        "Diplomats gather in Geneva as ceasefire talks enter a decisive week",
        "Negotiators from four governments convened behind closed doors on Monday. Envoys described the atmosphere as guarded but more constructive than last month. Analysts caution that monitoring and prisoner exchanges remain unresolved.",
      ),
      [
        article(101, "World", "Sample Desk", "Geneva talks reach key week", ""),
        article(102, "World", "Sample Globe", "Ceasefire negotiators meet again", ""),
      ],
    ),
    cluster(2, 2, article(2, "Business", "Sample Markets", "Central bank holds rates steady, signals patience on inflation", "Policymakers left the benchmark unchanged for a third straight meeting.")),
    cluster(3, 3, article(3, "Science & AI", "Sample Science", "Researchers report reproducible room-temperature catalysis", "The group's follow-up study used three independent labs to replicate last year's result.")),
    cluster(4, 4, article(4, "Health", "Sample Health", "RSV season winds down weeks earlier than last year, CDC data show", "Hospitalization rates fell across every surveilled region in March.")),
    cluster(5, 5, article(5, "Culture", "Sample Review", "A quiet novel about translators becomes the season's surprise hit", "Critics credit its patient structure and unshowy prose.")),
    cluster(10, 6, article(10, "World", "Sample Wire", "Heavy rains flood three coastal provinces", "Emergency crews evacuated several thousand residents overnight.")),
    cluster(11, 7, article(11, "World", "Sample Wire", "Parliament passes long-delayed judicial reform", "The vote fell largely along expected coalition lines.")),
    cluster(20, 8, article(20, "U.S.", "Sample Desk", "Senate advances infrastructure funding package", "The measure now heads to committee markup.")),
    cluster(21, 9, article(21, "U.S.", "Sample Desk", "Wildfire containment improves in the Pacific Northwest", "Cooler temperatures helped crews establish lines overnight.")),
    cluster(30, 10, article(30, "Business", "Sample Markets", "Shipping rates fall as container glut eases", "Analysts expect prices to stabilize through Q2.")),
    cluster(40, 11, article(40, "Science & AI", "Sample Science", "New open benchmark tests reasoning in long documents", "The dataset spans fourteen languages and two hundred domains.")),
    cluster(50, 12, article(50, "Health", "Sample Health", "Long-term study finds modest benefit from Mediterranean diet", "Researchers tracked cardiovascular outcomes over twelve years.")),
    cluster(60, 13, article(60, "Culture", "Sample Review", "Museum reopens after a four-year restoration", "The redesign restores the original 1901 skylight.")),
    cluster(70, 14, article(70, "World", "Sample Wire", "Power restored to the eastern grid", "")),
    cluster(71, 15, article(71, "U.S.", "Sample Wire", "Rail strike averted at the last minute", "")),
    cluster(72, 16, article(72, "Culture", "Sample Wire", "City unveils a new public library branch", "")),
  ];

  const now = new Date();
  return {
    id: 0,
    kind,
    date: now,
    windowStart: now.toISOString(),
    windowEnd: now.toISOString(),
    generatedAt: now.toISOString(),
    clusters,
    layout: assembleLayout(clusters),
  };
}
