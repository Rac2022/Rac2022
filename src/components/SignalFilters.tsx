"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { STATUS_OPTIONS, SOURCE_TYPE_OPTIONS, SOURCE_TYPE_LABELS, STATUS_CONFIG } from "@/lib/scoring";

export function SignalFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") ?? "";
  const currentSourceType = searchParams.get("sourceType") ?? "";
  const currentMinScore = searchParams.get("minScore") ?? "";
  const currentSearch = searchParams.get("q") ?? "";

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex-1 min-w-[200px]">
        <label className="mb-1 block text-xs text-[var(--muted)]">Search</label>
        <input
          type="text"
          placeholder="Title, tags, keywords..."
          defaultValue={currentSearch}
          onChange={(e) => updateParam("q", e.target.value)}
          className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-[var(--muted)]">Status</label>
        <select
          value={currentStatus}
          onChange={(e) => updateParam("status", e.target.value)}
          className="rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {STATUS_CONFIG[s].label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs text-[var(--muted)]">Source Type</label>
        <select
          value={currentSourceType}
          onChange={(e) => updateParam("sourceType", e.target.value)}
          className="rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
        >
          <option value="">All sources</option>
          {SOURCE_TYPE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {SOURCE_TYPE_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs text-[var(--muted)]">Min Score</label>
        <input
          type="number"
          min={0}
          max={100}
          placeholder="0"
          defaultValue={currentMinScore}
          onChange={(e) => updateParam("minScore", e.target.value)}
          className="w-20 rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
        />
      </div>

      {(currentStatus || currentSourceType || currentMinScore || currentSearch) && (
        <button
          onClick={() => router.push("/")}
          className="rounded-lg px-3 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
}
