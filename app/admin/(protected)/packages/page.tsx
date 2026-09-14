import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { createPackage, togglePackageActive } from "./actions";

export default async function PackagesPage() {
  await requireUser(["admin", "sales"]);
  const supabase = await createClient();

  const { data: packages } = await supabase
    .from("solar_packages")
    .select("*")
    .order("sort_order");

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Solar Packages</h1>
      <p style={{ color: "#64748b", marginBottom: 24 }}>Manage packages shown on the landing page.</p>

      <form action={createPackage} style={card}>
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>Add package</h2>
        <label style={label}>Name</label>
        <input name="name" required style={input} />
        <label style={label}>System size (kWp)</label>
        <input name="kwp" type="number" step="0.1" required style={input} />
        <label style={label}>Price (RM)</label>
        <input name="price" type="number" step="1" required style={input} />
        <label style={label}>Description</label>
        <textarea name="description" rows={3} style={input} />
        <button type="submit" style={button}>Add package</button>
      </form>

      <h2 style={{ fontSize: 16, margin: "24px 0 12px" }}>All packages</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {(packages ?? []).map((p) => (
          <div key={p.id} style={{ ...card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <strong>{p.name}</strong> — {p.kwp} kWp — RM{p.price}
              <div style={{ fontSize: 13, color: "#64748b" }}>{p.description}</div>
            </div>
            <form action={togglePackageActive}>
              <input type="hidden" name="id" value={p.id} />
              <input type="hidden" name="is_active" value={String(p.is_active)} />
              <button type="submit" style={{ ...button, background: p.is_active ? "#dc2626" : "#16a34a", marginTop: 0 }}>
                {p.is_active ? "Deactivate" : "Activate"}
              </button>
            </form>
          </div>
        ))}
        {(packages ?? []).length === 0 && <p style={{ color: "#94a3b8" }}>No packages yet.</p>}
      </div>
    </div>
  );
}

const card: React.CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: 20, maxWidth: 560 };
const label: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, margin: "12px 0 4px" };
const input: React.CSSProperties = { width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 };
const button: React.CSSProperties = { marginTop: 16, padding: "8px 16px", borderRadius: 6, border: "none", background: "#1d4ed8", color: "#fff", fontWeight: 600, cursor: "pointer" };
