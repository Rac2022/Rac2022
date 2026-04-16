import type { EditionKind, StoredArticle } from "@/types/ledger";
import type { EditionView } from "./edition";

function a(
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

export function sampleEdition(kind: EditionKind): EditionView {
  const hero = a(
    1,
    "World",
    "Sample Wire",
    "Diplomats gather in Geneva as ceasefire talks enter a decisive week",
    "Negotiators from four governments convened behind closed doors on Monday, with envoys describing the atmosphere as guarded but more constructive than last month's round. Analysts caution that the hardest issues — monitoring and prisoner exchanges — remain unresolved.",
  );

  const topStories = [
    a(2, "Business", "Sample Markets", "Central bank holds rates steady, signals patience on inflation", "Policymakers left the benchmark unchanged for a third straight meeting."),
    a(3, "Science & AI", "Sample Science", "Researchers report reproducible room-temperature catalysis", "The group's follow-up study used three independent labs to replicate last year's result."),
    a(4, "Health", "Sample Health", "RSV season winds down weeks earlier than last year, CDC data show", "Hospitalization rates fell across every surveilled region in March."),
    a(5, "Culture", "Sample Review", "A quiet novel about translators becomes the season's surprise hit", "Critics credit its patient structure and unshowy prose."),
  ];

  const sections: EditionView["sections"] = [
    {
      name: "World",
      articles: [
        a(10, "World", "Sample Wire", "Heavy rains flood three coastal provinces", "Emergency crews evacuated several thousand residents overnight."),
        a(11, "World", "Sample Wire", "Parliament passes long-delayed judicial reform", "The vote fell largely along expected coalition lines."),
      ],
    },
    {
      name: "U.S.",
      articles: [
        a(20, "U.S.", "Sample Desk", "Senate advances infrastructure funding package", "The measure now heads to committee markup."),
        a(21, "U.S.", "Sample Desk", "Wildfire containment improves in the Pacific Northwest", "Cooler temperatures helped crews establish lines overnight."),
      ],
    },
    {
      name: "Business",
      articles: [
        a(30, "Business", "Sample Markets", "Shipping rates fall as container glut eases", "Analysts expect prices to stabilize through Q2."),
      ],
    },
    {
      name: "Science & AI",
      articles: [
        a(40, "Science & AI", "Sample Science", "New open benchmark tests reasoning in long documents", "The dataset spans fourteen languages and two hundred domains."),
      ],
    },
    {
      name: "Health",
      articles: [
        a(50, "Health", "Sample Health", "Long-term study finds modest benefit from Mediterranean diet", "Researchers tracked cardiovascular outcomes over twelve years."),
      ],
    },
    {
      name: "Culture",
      articles: [
        a(60, "Culture", "Sample Review", "Museum reopens after a four-year restoration", "The redesign restores the original 1901 skylight."),
      ],
    },
    {
      name: "Briefs",
      articles: [
        a(70, "Briefs", "Sample Wire", "Power restored to the eastern grid", ""),
        a(71, "Briefs", "Sample Wire", "Rail strike averted at the last minute", ""),
        a(72, "Briefs", "Sample Wire", "City unveils a new public library branch", ""),
      ],
    },
  ];

  return {
    kind,
    date: new Date(),
    hero,
    topStories,
    sections,
    totalArticles: 1 + topStories.length + sections.reduce((n, s) => n + s.articles.length, 0),
  };
}
