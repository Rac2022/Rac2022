import { NextResponse } from "next/server";
import { generateEdition } from "@/lib/generateEdition";
import type { EditionKind } from "@/types/ledger";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const kindParam = url.searchParams.get("kind");
    const kind: EditionKind | undefined =
      kindParam === "morning" || kindParam === "evening" ? kindParam : undefined;
    const report = await generateEdition(kind);
    return NextResponse.json({ ok: true, report });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
