import { NextRequest, NextResponse } from "next/server";

/*
 * Lead intake endpoint.
 *
 * The site's form POSTs here (same-origin, relative URL) instead of calling
 * the destination webhook directly. That means:
 *   - The webhook URL lives only in the LEAD_WEBHOOK_URL server env var —
 *     it is never sent to the browser, never appears in client JS, and never
 *     shows up in devtools/network tab. Set it in `.env.local` (gitignored)
 *     locally, and as a server-side environment variable in your host
 *     (Vercel/etc). Do NOT prefix it with NEXT_PUBLIC_.
 *   - This route validates and rate-limits requests before anything is
 *     forwarded, and never echoes the webhook's response (or its URL) back
 *     to the client — so nothing here can be used to discover or hit the
 *     webhook directly.
 *
 * Payload shape: kept 1:1 with the existing GoHighLevel-style webhook schema
 * already in use (see the sample JSON supplied when this was built), so the
 * receiving automation doesn't need to change its field mapping. Every key
 * from that schema is present; only the fields listed as "important" are
 * populated from the form, everything else is sent blank.
 */

export const runtime = "nodejs";

// ---------------------------------------------------------------------------
// Rate limiting (in-memory best effort)
//
// This blunts simple scripted abuse of THIS endpoint. It resets whenever the
// server process restarts and is NOT shared across multiple instances/regions
// on a serverless platform (each instance keeps its own counters) — so on
// Vercel-style deployments this is a soft speed bump, not a hard guarantee.
// For stronger protection, put a durable store (Upstash Redis / Vercel KV) or
// an edge-level rate limiter (Cloudflare, Vercel Firewall) in front of this.
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 8; // max submissions per IP per window
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  timestamps.push(now);
  hits.set(ip, timestamps);
  // Occasionally trim the map so it doesn't grow forever.
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

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------
type LeadInput = {
  fullName?: unknown;
  phone?: unknown;
  email?: unknown;
  state?: unknown;
  monthlyBill?: unknown;
  chargeTime?: unknown;
  propertyType?: unknown;
  language?: unknown;
  pageUrl?: unknown;
  referrer?: unknown;
};

function str(v: unknown, max = 200): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

function normalizePhone(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, "");
  if (!digits) return "";
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("60")) return "+" + digits;
  if (digits.startsWith("0")) return "+60" + digits.slice(1);
  return "+60" + digits;
}

function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// Best-effort UTM campaign extraction from the page URL the visitor was on.
function extractCampaignId(pageUrl: string): string {
  try {
    const u = new URL(pageUrl);
    return u.searchParams.get("utm_campaign") ?? u.searchParams.get("campaign_id") ?? "";
  } catch {
    return "";
  }
}

// ---------------------------------------------------------------------------
// Blank webhook payload template (1:1 with the existing schema)
// ---------------------------------------------------------------------------
const BLANK_ATTRIBUTION = {
  sessionSource: null,
  url: null,
  campaign: null,
  utmSource: null,
  utmMedium: null,
  utmContent: null,
  utmTerm: null,
  utmKeyword: null,
  utmMatchtype: null,
  referrer: null,
  gclid: null,
  fbp: null,
  userAgent: null,
  ip: null,
  gaClientId: null,
  gaSessionId: null,
  medium: null,
  mediumId: null,
  adName: null,
  adGroupId: null,
  adId: null,
  gbraid: null,
  wbraid: null,
} as const;

function buildBlankPayload() {
  return {
    MAQO: "",
    "Preferred Appointment Date:": "",
    "Marital Status:": "",
    "What makes you a suitable candidate for this position?": "",
    "Identification Card (IC) Upload ": "",
    " Description of the Issue:": "",
    "Do you have any specific health coverage needs or preferences?": "",
    "Electric Bill (RM)": "",
    "Billing Address - City": "",
    "Which services are you requesting?": "",
    "Date of Service:": "",
    "Billing Address - State": "",
    "Billing Address - Zip Code": "",
    "Upload Resume": "",
    "Type of Business": "",
    "Business Name": "",
    "Site Location": "",
    "Job Scope": "",
    "Preferred Communication Language 2": "",
    "Vehicle Make:": "",
    "Billing Address - Full Address": "",
    "Billing Address - Phone Number": "",
    "Preferred Contact Method:": "",
    "Monthly Electric Bill (RM)": "",
    "Attach any relevant photos or documents related to the service request (if applicable).": "",
    "What additional solar services are you interested in?": "",
    consultant: "",
    "Why do you want to work with our company?": "",
    "Gender:": "",
    "Do you currently have a solar system installed?": "",
    "Any Additional Comments, Questions Or Special Requests?": "",
    "How did you hear about us?": "",
    "Position Applied": "",
    " Type of Service Needed (Check all that apply):": "",
    follower: "",
    "Preferred Date:": "",
    "Type of Coverage Needed:": "",
    Occupation: "",
    "Identification Card (IC)": "",
    "Years in Operation": "",
    "Property Type (Condo/Apartment not suitable)": "",
    "What is your role in this  organization?": "",
    "What solution are you interested in?": "",
    "Brief description of your situation": "",
    "Location/Address": "",
    "Preferred Communication Language 1": "",
    salespartner: "",
    Details: "",
    "Tell Us Your Skincare Needs": "",
    "If yes, please specify:": "",
    Interested: "",
    " Type of Service Request:": "",
    "Existing Customer": "",
    "File Upload 498q": "",
    "Phone Number": "",
    "Position Applied For": "",
    "What best describes your current stage in the solar energy journey? ": "",
    "Do you have any pre-existing health conditions?": "",
    Message: "",
    "Multi Dropdown 1tw9": "",
    Remarks: "",
    "Preferred Appointment Time:": "",
    "Monthly Electric Bills (RM)": "",
    "Campaign ID": "",
    Location: "",
    "What type of real estate service are you interested in?": "",
    Position: "",
    "Billing Address - Country": "",
    sprecruit: "",
    "Signature 19ei": "",
    Salutation: "",
    Nationality: "",
    bizpartner: "",
    "If yes, please provide details:  System size, Installation date, & Manufacturer": "",
    "Billing Address - Full Name": "",
    "How can we help?": "",
    "Primary Care Physician:": "",
    "Description of Request:": "",
    "Vehicle Model:": "",
    "Graduation Date": "",
    "Vehicle Year:": "",
    "Preferred Communication Language": "",
    Industry: "",
    "Additional Notes": "",
    "Current Job Status": "",
    "Electric Supply": "",
    "Name of Company": "",
    referrer: "",
    Attachment: "",
    "Type of Service Needed - Check all that apply": "",
    staff: "",
    "Electric Bills (RM)": "",
    referer: "",
    "Preferred time slots": "",
    "Product Category": "",

    contact_id: "",
    first_name: "",
    last_name: "",
    full_name: "",
    email: "",
    phone: "",
    tags: "",
    country: "",
    timezone: "",
    date_created: "",
    contact_source: "",
    full_address: "",
    contact_type: "",
    gclid: "",
    location: {
      name: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      fullAddress: "",
      id: "",
    },
    workflow: { id: "", name: "" },
    triggerData: {},
    contact: {
      attributionSource: { ...BLANK_ATTRIBUTION },
      lastAttributionSource: { ...BLANK_ATTRIBUTION, fbc: null },
    },
    attributionSource: { ...BLANK_ATTRIBUTION },
    customData: {
      Name: "",
      Salutation: "",
      Phone: "",
      Email: "",
      Location: "",
      "Property Type": "",
      "Electric Supply": "",
      "Monthly TNB Bill": "",
      "Source of Leads": "",
      "Campaign ID": "",
    },
  };
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);

  // Soft origin check — reject only when an Origin header is present AND
  // doesn't match this deployment (blocks obvious cross-site abuse without
  // breaking legitimate same-origin fetches that omit the header).
  const origin = req.headers.get("origin");
  if (origin) {
    const selfOrigin = new URL(req.url).origin;
    if (origin !== selfOrigin) {
      return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
    }
  }

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 }
    );
  }

  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  let body: LeadInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const fullName = str(body.fullName, 120);
  const phone = normalizePhone(str(body.phone, 40));
  const email = str(body.email, 160);
  const state = str(body.state, 60);
  const monthlyBill = str(body.monthlyBill, 60);
  const propertyType = str(body.propertyType, 80);
  const language = str(body.language, 40);
  const pageUrl = str(body.pageUrl, 500);
  const referrer = str(body.referrer, 500);

  if (!fullName || !phone || !state || !monthlyBill || !propertyType) {
    return NextResponse.json(
      { ok: false, error: "missing_required_fields" },
      { status: 400 }
    );
  }
  if (email && !isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  if (!webhookUrl) {
    // Server misconfiguration — log for the operator, never leak details to the client.
    console.error("LEAD_WEBHOOK_URL is not set; dropping lead submission.");
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }

  const payload = buildBlankPayload();

  // --- Fields explicitly requested to be populated ---
  payload.phone = phone;
  payload.Location = state;
  payload["Property Type (Condo/Apartment not suitable)"] = propertyType;
  payload["Preferred Communication Language 2"] = language;
  // Electric Supply: no field on the site to source this from — left blank.

  payload.customData.Name = fullName;
  payload.customData.Email = email;
  payload.customData["Monthly TNB Bill"] = monthlyBill;
  payload.customData["Source of Leads"] = referrer;
  payload.customData["Campaign ID"] = extractCampaignId(pageUrl);
  // customData.Salutation: no field on the site to source this from — left blank.

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const webhookRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!webhookRes.ok) {
      console.error("Lead webhook responded with", webhookRes.status);
      return NextResponse.json({ ok: false, error: "webhook_error" }, { status: 502 });
    }
  } catch (err) {
    console.error("Failed to reach lead webhook:", err);
    return NextResponse.json({ ok: false, error: "webhook_unreachable" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

// Reject every other method explicitly rather than falling through to a
// framework default, so the only way to interact with this route is a
// same-origin POST.
export async function GET() {
  return NextResponse.json({ ok: false, error: "method_not_allowed" }, { status: 405 });
}
