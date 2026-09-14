import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { updateEnquiryStatus } from "./actions";

const STATUSES = ["new", "contacted", "qualified", "converted", "closed"] as const;

export default async function EnquiriesPage() {
  await requireUser(["admin", "sales"]);
  const supabase = await createClient();

  const { data: enquiries } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Customer Enquiries</h1>
      <p style={{ color: "#64748b", marginBottom: 24 }}>Leads submitted from the landing page form.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {(enquiries ?? []).map((e) => (
          <div key={e.id} style={card}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>{e.name}</strong>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>
                {new Date(e.created_at).toLocaleString()}
              </span>
            </div>
            <div style={{ fontSize: 13, color: "#334155" }}>
              {e.email} {e.phone ? `· ${e.phone}` : ""}
            </div>
            {e.message && <p style={{ fontSize: 13, marginTop: 8 }}>{e.message}</p>}

            <form action={updateEnquiryStatus} style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <input type="hidden" name="id" value={e.id} />
              <select
                name="status"
                defaultValue={e.status}
                style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: "#1d4ed8", color: "#fff", fontSize: 13, cursor: "pointer" }}
              >
                Update
              </button>
            </form>
          </div>
        ))}
        {(enquiries ?? []).length === 0 && <p style={{ color: "#94a3b8" }}>No enquiries yet.</p>}
      </div>
    </div>
  );
}

const card: React.CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: 20, maxWidth: 640 };
