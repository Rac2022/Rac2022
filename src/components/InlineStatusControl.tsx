"use client";

import { STATUS_OPTIONS, STATUS_CONFIG, type SignalStatus } from "@/lib/scoring";
import { updateSignalStatus } from "@/lib/actions";

export function InlineStatusControl({
  signalId,
  currentStatus,
}: {
  signalId: string;
  currentStatus: SignalStatus;
}) {
  return (
    <div
      className="flex gap-1"
      onClick={(e) => e.preventDefault()}
    >
      {STATUS_OPTIONS.map((status) => {
        const isActive = status === currentStatus;
        const config = STATUS_CONFIG[status];
        return (
          <form key={status} action={updateSignalStatus}>
            <input type="hidden" name="id" value={signalId} />
            <input type="hidden" name="status" value={status} />
            <button
              type="submit"
              disabled={isActive}
              className="rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide transition-all disabled:cursor-default"
              style={{
                backgroundColor: isActive ? `${config.color}20` : "transparent",
                color: isActive ? config.color : "var(--muted)",
                border: `1px solid ${isActive ? config.color + "30" : "transparent"}`,
              }}
              title={`Set status to ${config.label}`}
            >
              {config.label}
            </button>
          </form>
        );
      })}
    </div>
  );
}
