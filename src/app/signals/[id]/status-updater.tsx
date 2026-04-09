"use client";

import { useActionState } from "react";
import { updateStatus } from "./actions";
import { STATUS_OPTIONS, STATUS_CONFIG, type SignalStatus } from "@/lib/scoring";

export function StatusUpdater({
  signalId,
  currentStatus,
}: {
  signalId: string;
  currentStatus: SignalStatus;
}) {
  const [, formAction, isPending] = useActionState(updateStatus, null);

  return (
    <form action={formAction} className="flex items-center gap-3">
      <input type="hidden" name="id" value={signalId} />
      <span className="text-sm text-[var(--muted)]">Update status:</span>
      <div className="flex gap-2">
        {STATUS_OPTIONS.map((status) => {
          const isActive = status === currentStatus;
          const config = STATUS_CONFIG[status];
          return (
            <button
              key={status}
              type="submit"
              name="status"
              value={status}
              disabled={isPending || isActive}
              className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
              style={{
                backgroundColor: isActive ? `${config.color}25` : "transparent",
                color: isActive ? config.color : "var(--muted)",
                border: `1px solid ${isActive ? config.color + "40" : "var(--card-border)"}`,
              }}
            >
              {config.label}
            </button>
          );
        })}
      </div>
    </form>
  );
}
