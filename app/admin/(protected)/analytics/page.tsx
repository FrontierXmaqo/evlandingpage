import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AnalyticsPage() {
  await requireUser();
  const supabase = await createClient();

  const [{ count: totalEnquiries }, { count: newEnquiries }, { count: closedEnquiries }, { data: packages }] =
    await Promise.all([
      supabase.from("enquiries").select("id", { count: "exact", head: true }),
      supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "closed"),
      supabase.from("solar_packages").select("id", { count: "exact" }).eq("is_active", true),
    ]);

  const stats = [
    { label: "Total enquiries", value: totalEnquiries ?? 0 },
    { label: "New (unactioned)", value: newEnquiries ?? 0 },
    { label: "Closed", value: closedEnquiries ?? 0 },
    { label: "Active packages", value: packages?.length ?? 0 },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Performance Analytics</h1>
      <p style={{ color: "#64748b", marginBottom: 24 }}>Enquiry pipeline overview.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: 20 }}>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "#64748b" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
