import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

const CHANNEL_LABELS: Record<string, string> = {
  google: "Google",
  social: "Social media",
  direct: "Direct",
};

function channelLabel(channel: string): string {
  return CHANNEL_LABELS[channel] ?? (channel.charAt(0).toUpperCase() + channel.slice(1));
}

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  converted: "Converted",
  closed: "Closed",
};
const STATUS_ORDER = ["new", "contacted", "qualified", "converted", "closed"];

function startOfMonthIso(): string {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
}

function pct(numerator: number, denominator: number): string {
  if (denominator <= 0) return "—";
  return ((numerator / denominator) * 100).toFixed(2) + "%";
}

function countBy<T extends string>(rows: (T | null)[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const row of rows) {
    if (!row) continue;
    counts[row] = (counts[row] ?? 0) + 1;
  }
  return counts;
}

export default async function AnalyticsPage() {
  await requireUser();
  const supabase = await createClient();
  const monthStart = startOfMonthIso();

  const [
    { data: enquiryRows },
    { count: pageViewsMonth },
    { count: calculatorUsesMonth },
    { data: activePackages },
  ] = await Promise.all([
    supabase.from("enquiries").select("status, state, lead_channel, created_at").limit(5000),
    supabase
      .from("analytics_events")
      .select("id", { count: "exact", head: true })
      .eq("event_type", "page_view")
      .gte("created_at", monthStart),
    supabase
      .from("analytics_events")
      .select("id", { count: "exact", head: true })
      .eq("event_type", "calculator_use")
      .gte("created_at", monthStart),
    supabase.from("solar_packages").select("price").eq("is_active", true),
  ]);

  const rows = enquiryRows ?? [];
  const totalEnquiries = rows.length;
  const enquiriesThisMonth = rows.filter((r) => r.created_at >= monthStart).length;
  const visitors = pageViewsMonth ?? 0;
  const calculatorUsers = calculatorUsesMonth ?? 0;

  const statusCounts = countBy(rows.map((r) => r.status));
  const stateCounts = countBy(rows.map((r) => r.state));
  const channelCounts = countBy(rows.map((r) => r.lead_channel));

  const topStates = Object.entries(stateCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const maxStateCount = topStates[0]?.[1] ?? 0;

  const channelEntries = Object.entries(channelCounts).sort((a, b) => b[1] - a[1]);
  const maxChannelCount = channelEntries[0]?.[1] ?? 0;

  const maxStatusCount = Math.max(1, ...STATUS_ORDER.map((s) => statusCounts[s] ?? 0));

  const avgPackagePrice =
    activePackages && activePackages.length > 0
      ? Math.round(activePackages.reduce((sum, p) => sum + Number(p.price), 0) / activePackages.length)
      : null;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Performance Analytics</h1>
      <p style={{ color: "#64748b", marginBottom: 28 }}>Solar enquiry performance.</p>

      {/* Enquiry funnel */}
      <h2 style={sectionTitle}>Enquiry funnel — This month</h2>
      <div style={{ ...card, maxWidth: 640, marginBottom: 12 }}>
        <FunnelBar label="Website visitors" value={visitors} max={Math.max(1, visitors)} color="#1d4ed8" />
        <FunnelBar label="Calculator users" value={calculatorUsers} max={Math.max(1, visitors)} color="#2563eb" />
        <FunnelBar label="Submitted enquiries" value={enquiriesThisMonth} max={Math.max(1, visitors)} color="#16a34a" />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 16,
          maxWidth: 640,
          marginBottom: 32,
        }}
      >
        <Stat label="Enquiry conversion" value={pct(enquiriesThisMonth, visitors)} />
        <Stat label="Calculator completion" value={pct(enquiriesThisMonth, calculatorUsers)} />
      </div>
      <p style={{ fontSize: 12, color: "#94a3b8", marginTop: -20, marginBottom: 32 }}>
        Visitors and calculator users are counted from anonymous page/interaction
        beacons collected since this feature was added — historical totals from
        before that won&apos;t be included.
      </p>

      {/* Status breakdown */}
      <h2 style={sectionTitle}>Enquiries by stage</h2>
      <div style={{ ...card, maxWidth: 480, marginBottom: 32 }}>
        <Stat label="Total enquiries (all time)" value={String(totalEnquiries)} />
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
          {STATUS_ORDER.map((s) => (
            <BarRow
              key={s}
              label={STATUS_LABELS[s]}
              value={statusCounts[s] ?? 0}
              max={maxStatusCount}
              color="#1d4ed8"
            />
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {/* By location */}
        <div>
          <h2 style={sectionTitle}>Enquiries by location</h2>
          <div style={{ ...card, width: 320 }}>
            {topStates.length === 0 && <p style={{ color: "#94a3b8", fontSize: 13 }}>No location data yet.</p>}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {topStates.map(([state, count]) => (
                <BarRow key={state} label={state} value={count} max={maxStateCount} color="#0891b2" />
              ))}
            </div>
          </div>
        </div>

        {/* By channel */}
        <div>
          <h2 style={sectionTitle}>Leads by channel</h2>
          <div style={{ ...card, width: 320 }}>
            {channelEntries.length === 0 && <p style={{ color: "#94a3b8", fontSize: 13 }}>No channel data yet.</p>}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {channelEntries.map(([channel, count]) => (
                <BarRow key={channel} label={channelLabel(channel)} value={count} max={maxChannelCount} color="#d97706" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Packages */}
      <h2 style={sectionTitle}>Solar packages</h2>
      <div style={{ ...card, maxWidth: 480 }}>
        <Stat label="Active packages" value={String(activePackages?.length ?? 0)} />
        <Stat
          label="Average active package price"
          value={avgPackagePrice !== null ? `RM ${avgPackagePrice.toLocaleString()}` : "—"}
        />
        <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>
          The lead form doesn&apos;t currently ask visitors to pick a package, so
          &quot;most selected package&quot; and per-package enquiry counts aren&apos;t
          trackable yet.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 13, color: "#64748b" }}>{label}</div>
    </div>
  );
}

function BarRow({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const widthPercent = max > 0 ? Math.max(2, (value / max) * 100) : 0;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div style={{ background: "#f1f5f9", borderRadius: 4, height: 8 }}>
        <div style={{ width: `${widthPercent}%`, background: color, height: "100%", borderRadius: 4 }} />
      </div>
    </div>
  );
}

function FunnelBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const widthPercent = max > 0 ? Math.max(3, (value / max) * 100) : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
        <span>{label}</span>
        <strong style={{ fontSize: 18 }}>{value.toLocaleString()}</strong>
      </div>
      <div style={{ background: "#f1f5f9", borderRadius: 6, height: 14 }}>
        <div style={{ width: `${widthPercent}%`, background: color, height: "100%", borderRadius: 6 }} />
      </div>
    </div>
  );
}

const sectionTitle: React.CSSProperties = { fontSize: 16, fontWeight: 700, margin: "0 0 12px" };
const card: React.CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: 20 };
