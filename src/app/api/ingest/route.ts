import { NextResponse } from "next/server";
import { runIngest } from "@/lib/ingest/run";

export const runtime = "nodejs";

export async function POST() {
  try {
    const report = await runIngest();
    return NextResponse.json({ ok: true, report });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
