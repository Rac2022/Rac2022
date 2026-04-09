"use client";

import { useActionState } from "react";
import { updateNotes } from "./actions";

export function NotesEditor({ signalId, initialNotes }: { signalId: string; initialNotes: string }) {
  const [state, formAction, isPending] = useActionState(updateNotes, null);

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="id" value={signalId} />
      <textarea
        name="notes"
        rows={3}
        defaultValue={initialNotes}
        placeholder="Add private notes, research links, follow-up reminders..."
        className="input-field resize-none"
      />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-[var(--card-border)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)] disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Notes"}
        </button>
        {state?.saved && (
          <span className="text-xs text-[var(--success)]">Saved</span>
        )}
      </div>
    </form>
  );
}
