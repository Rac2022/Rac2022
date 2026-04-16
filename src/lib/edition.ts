import {
  ALL_SECTIONS,
  type EditionKind,
  type Section,
  type StoredArticle,
} from "@/types/ledger";
import {
  getRecentArticles,
  getRecentArticlesBySection,
} from "./queries";

export interface EditionView {
  kind: EditionKind;
  date: Date;
  hero: StoredArticle | null;
  topStories: StoredArticle[];
  sections: { name: Section; articles: StoredArticle[] }[];
  totalArticles: number;
}

/**
 * Decide whether to render the morning or evening edition based on local time.
 * Before 15:00 local = morning, afterward = evening. Callers may override.
 */
export function currentEditionKind(now = new Date()): EditionKind {
  return now.getHours() < 15 ? "morning" : "evening";
}

/**
 * Build the edition view from whatever is currently in the DB.
 * This is Phase 1 behavior: no clustering yet, just "recent articles per section."
 */
export function buildEditionView(kind: EditionKind = currentEditionKind()): EditionView {
  const recent = getRecentArticles(80);
  const hero = recent[0] ?? null;
  const topStories = recent.slice(1, 6);

  const sections: { name: Section; articles: StoredArticle[] }[] = ALL_SECTIONS
    .filter((s) => s !== "Briefs")
    .map((name) => ({
      name,
      articles: getRecentArticlesBySection(name, 5),
    }));

  // Briefs = everything left over, shortest form.
  sections.push({ name: "Briefs", articles: recent.slice(6, 18) });

  return {
    kind,
    date: new Date(),
    hero,
    topStories,
    sections,
    totalArticles: recent.length,
  };
}
