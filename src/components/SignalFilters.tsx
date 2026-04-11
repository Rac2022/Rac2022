"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { STATUS_OPTIONS, SOURCE_TYPE_OPTIONS, SOURCE_TYPE_LABELS, STATUS_CONFIG } from "@/lib/scoring";

const SORT_OPTIONS = [
  { value: "score-desc", label: "Highest score" },
  { value: "score-asc", label: "Lowest score" },
  { value: "date-desc", label: "Newest" },
  { value: "date-asc", label: "Oldest" },
  { value: "novelty-desc", label: "Most novel" },
  { value: "monetization-desc", label: "Easiest monetization" },
] as const;

export function SignalFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") ?? "";
  const currentSourceType = searchParams.get("sourceType") ?? "";
  const currentMinScore = searchParams.get("minScore") ?? "";
  const currentSearch = searchParams.get("q") ?? "";
  const currentSort = searchParams.get("sort") ?? "score-desc";

  const hasFilters =
    currentStatus || currentSourceType || currentMinScore || currentSearch || currentSort !== "score-desc";

  const updateParam = useCallback(
    (key: string, value: string, defaultValue = "") => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== defaultValue) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/?${params.toString()}`);
    },
    [router, searchParams],
  );

  // --- Debounced search ---
  const [searchValue, setSearchValue] = useState(currentSearch);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep local state in sync when the URL param changes externally (e.g. Clear button)
  useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const onSearchChange = (value: string) => {
    setSearchValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParam("q", value);
    }, 250);
  };

  return (
    <div className="sticky top-14 z-30 -mx-4 bg-[var(--background)]/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
            Search
          </label>
          <input
            type="text"
            placeholder="Title, tags, keywords..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
            Status
          </label>
          <select
            value={currentStatus}
            onChange={(e) => updateParam("status", e.target.value)}
            className="input-field"
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
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
            Source Type
          </label>
          <select
            value={currentSourceType}
            onChange={(e) => updateParam("sourceType", e.target.value)}
            className="input-field"
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
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
            Min Score
          </label>
          <input
            type="number"
            min={0}
            max={100}
            placeholder="0"
            defaultValue={currentMinScore}
            onChange={(e) => updateParam("minScore", e.target.value)}
            className="input-field w-20"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
            Sort
          </label>
          <select
            value={currentSort}
            onChange={(e) => updateParam("sort", e.target.value, "score-desc")}
            className="input-field"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <button
            onClick={() => router.push("/")}
            className="rounded-lg px-3 py-2 text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
