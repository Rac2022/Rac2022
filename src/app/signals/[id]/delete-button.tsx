"use client";

import { useState } from "react";
import { deleteSignal } from "./actions";

export function DeleteButton({ signalId, title }: { signalId: string; title: string }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-lg border border-[var(--card-border)] px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)] hover:border-[var(--danger)] hover:text-[var(--danger)] transition-colors"
      >
        Delete
      </button>
    );
  }

  return (
    <form action={deleteSignal} className="flex items-center gap-2">
      <input type="hidden" name="id" value={signalId} />
      <span className="text-xs text-[var(--muted-foreground)]">
        Delete &quot;{title.length > 30 ? title.slice(0, 30) + "..." : title}&quot;?
      </span>
      <button
        type="submit"
        className="rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-colors"
        style={{ backgroundColor: "var(--danger)" }}
      >
        Confirm delete
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
      >
        Cancel
      </button>
    </form>
  );
}
