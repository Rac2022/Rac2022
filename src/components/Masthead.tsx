import { formatEditionDate } from "@/lib/time";
import type { EditionKind } from "@/types/ledger";

interface Props {
  kind: EditionKind;
  date?: Date;
}

export function Masthead({ kind, date = new Date() }: Props) {
  const label = kind === "morning" ? "Morning Edition" : "Evening Edition";
  return (
    <header className="rule-double py-5 text-center">
      <div className="font-meta mb-2">
        {label} · Vol. I · No. {Math.floor(date.getTime() / 86_400_000) % 999}
      </div>
      <h1 className="font-display text-6xl md:text-7xl tracking-tight">
        Morning Ledger
      </h1>
      <div className="font-meta mt-3">
        {formatEditionDate(date)} · Finite by design
      </div>
    </header>
  );
}
