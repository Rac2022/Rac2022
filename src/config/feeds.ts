import type { FeedConfig } from "@/types/ledger";

/**
 * The canonical list of feeds for Morning Ledger.
 * Edit this file to add or remove sources. The ingest script will
 * upsert changes into the `feeds` table on the next run.
 */
export const FEEDS: FeedConfig[] = [
  // World
  { name: "BBC World",        url: "https://feeds.bbci.co.uk/news/world/rss.xml",            section: "World" },
  { name: "Reuters World",    url: "https://feeds.reuters.com/reuters/worldNews",            section: "World" },
  { name: "Al Jazeera",       url: "https://www.aljazeera.com/xml/rss/all.xml",              section: "World" },

  // U.S.
  { name: "NPR News",         url: "https://feeds.npr.org/1001/rss.xml",                     section: "U.S." },
  { name: "AP Top News",      url: "https://feeds.apnews.com/rss/apf-topnews",               section: "U.S." },

  // Business
  { name: "Reuters Business", url: "https://feeds.reuters.com/reuters/businessNews",         section: "Business" },
  { name: "FT Top Stories",   url: "https://www.ft.com/?format=rss",                         section: "Business" },

  // Science & AI
  { name: "Ars Technica",     url: "https://feeds.arstechnica.com/arstechnica/index",        section: "Science & AI" },
  { name: "MIT Tech Review",  url: "https://www.technologyreview.com/feed/",                 section: "Science & AI" },
  { name: "Quanta Magazine",  url: "https://www.quantamagazine.org/feed/",                   section: "Science & AI" },

  // Health
  { name: "NPR Health",       url: "https://feeds.npr.org/1128/rss.xml",                     section: "Health" },
  { name: "STAT News",        url: "https://www.statnews.com/feed/",                         section: "Health" },

  // Culture
  { name: "The Atlantic",     url: "https://www.theatlantic.com/feed/all/",                  section: "Culture" },
  { name: "The New Yorker",   url: "https://www.newyorker.com/feed/everything",              section: "Culture" },
];
