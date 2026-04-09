"use client";

import { useActionState } from "react";
import { importSignalsFromCsv } from "@/lib/actions";

type FormState = { success?: number; error?: string } | null;

export function CsvImportForm() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(importSignalsFromCsv, null);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{
            color: "var(--danger)",
            border: "1px solid var(--danger)",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
          }}
        >
          {state.error}
        </div>
      )}

      {state?.success !== undefined && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{
            color: "var(--success)",
            border: "1px solid var(--success)",
            backgroundColor: "rgba(34, 197, 94, 0.1)",
          }}
        >
          Successfully imported {state.success} signal{state.success !== 1 ? "s" : ""}.
        </div>
      )}

      <div className="rounded-2xl border border-dashed border-[var(--card-border)] bg-[var(--card)] p-8 text-center">
        <label className="cursor-pointer space-y-3 block">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background)]">
              <span className="text-lg text-[var(--muted)]">&uarr;</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Choose a CSV file</p>
            <p className="text-xs text-[var(--muted)]">or drag and drop</p>
          </div>
          <input
            type="file"
            name="file"
            accept=".csv,text/csv"
            className="hidden"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-50"
      >
        {isPending ? "Importing..." : "Import CSV"}
      </button>
    </form>
  );
}
