import { PREFERENCES } from "@/config/preferences";
import type { EditionKind } from "@/types/ledger";

export function editionWindow(kind: EditionKind, now = new Date()) {
  const hours = PREFERENCES.editionWindowHours[kind];
  const end = new Date(now);
  const start = new Date(now.getTime() - hours * 3_600_000);
  return { start, end };
}

export function formatEditionDate(date = new Date()): string {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTimestamp(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  });
}
