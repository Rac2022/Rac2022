-- Morning Ledger schema. Applied idempotently on DB open.

CREATE TABLE IF NOT EXISTS feeds (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  url         TEXT NOT NULL UNIQUE,
  section     TEXT NOT NULL,
  enabled     INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS articles (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  feed_id       INTEGER NOT NULL REFERENCES feeds(id) ON DELETE CASCADE,
  source_name   TEXT NOT NULL,
  url           TEXT NOT NULL,
  canonical_url TEXT NOT NULL UNIQUE,
  title         TEXT NOT NULL,
  summary       TEXT,
  author        TEXT,
  published_at  TEXT,
  section       TEXT NOT NULL,
  lang          TEXT,
  raw_json      TEXT,
  ingested_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_section      ON articles(section);

-- Phase 2+: clustering
CREATE TABLE IF NOT EXISTS story_clusters (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  primary_article_id  INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  title               TEXT NOT NULL,
  one_liner           TEXT,
  why_it_matters      TEXT,
  section             TEXT NOT NULL,
  importance          REAL NOT NULL DEFAULT 0,
  created_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS cluster_items (
  cluster_id  INTEGER NOT NULL REFERENCES story_clusters(id) ON DELETE CASCADE,
  article_id  INTEGER NOT NULL REFERENCES articles(id)       ON DELETE CASCADE,
  PRIMARY KEY (cluster_id, article_id)
);

-- Editions: snapshot of which clusters appeared in a given run
CREATE TABLE IF NOT EXISTS editions (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  kind          TEXT NOT NULL CHECK (kind IN ('morning','evening')),
  window_start  TEXT NOT NULL,
  window_end    TEXT NOT NULL,
  generated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS edition_items (
  edition_id  INTEGER NOT NULL REFERENCES editions(id)       ON DELETE CASCADE,
  cluster_id  INTEGER NOT NULL REFERENCES story_clusters(id) ON DELETE CASCADE,
  rank        INTEGER NOT NULL,
  section     TEXT NOT NULL,
  PRIMARY KEY (edition_id, cluster_id)
);

-- Arbitrary preference kv (future admin UI writes here)
CREATE TABLE IF NOT EXISTS preferences (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
