import { STATUS_CONFIG, type SignalStatus } from "@/lib/scoring";

export function StatusBadge({ status }: { status: SignalStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
      style={{
        backgroundColor: `${config.color}15`,
        color: config.color,
        border: `1px solid ${config.color}25`,
      }}
    >
      {config.label}
    </span>
  );
}
