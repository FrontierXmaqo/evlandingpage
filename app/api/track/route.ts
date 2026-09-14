import { NextRequest, NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";

/*
 * Lightweight analytics beacon for the Performance Analytics admin page.
 * Records only a bare event type + timestamp — no PII, no cookies, no
 * cross-site tracking. Powers "Website visitors" / "Calculator users" on
 * /admin/analytics.
 */

export const runtime = "nodejs";

const ALLOWED_EVENTS = new Set(["page_view", "calculator_use"]);

// Same soft in-memory rate limit pattern as /api/lead — a speed bump against
// scripted abuse of this endpoint, not a hard guarantee under load.
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 30;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  hits.set(ip, timestamps);
  if (hits.size > 5000) {
    for (const [key, arr] of hits) {
      if (arr.every((t) => now - t > RATE_LIMIT_WINDOW_MS)) hits.delete(key);
    }
  }
  return timestamps.length > RATE_LIMIT_MAX;
}

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  if (isRateLimited(clientIp(req))) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let body: { event?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const event = typeof body.event === "string" ? body.event : "";
  if (!ALLOWED_EVENTS.has(event)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = createPublicClient();
    await supabase.from("analytics_events").insert({ event_type: event });
  }

  // Always 204 regardless of insert outcome — this is best-effort telemetry,
  // never something the client should retry or surface an error for.
  return new NextResponse(null, { status: 204 });
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "method_not_allowed" }, { status: 405 });
}
