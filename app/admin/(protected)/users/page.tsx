import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { updateUserRole } from "./actions";

const ROLES = ["admin", "editor", "sales"] as const;

export default async function UsersPage() {
  const currentUser = await requireUser(["admin"]);
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at")
    .order("created_at");

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>User Management</h1>
      <p style={{ color: "#64748b", marginBottom: 24 }}>
        Admin only. To add a new internal user, create their account in the Supabase
        Dashboard (Authentication → Add user) — a profile row is created automatically
        with the <code>sales</code> role; assign the correct role below.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {(profiles ?? []).map((p) => (
          <div
            key={p.id}
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 10,
              padding: 16,
              maxWidth: 560,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong>{p.full_name ?? p.email}</strong>
              <div style={{ fontSize: 13, color: "#64748b" }}>{p.email}</div>
            </div>

            <form action={updateUserRole} style={{ display: "flex", gap: 8 }}>
              <input type="hidden" name="id" value={p.id} />
              <select
                name="role"
                defaultValue={p.role}
                disabled={p.id === currentUser.id}
                style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={p.id === currentUser.id}
                style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: "#1d4ed8", color: "#fff", fontSize: 13, cursor: "pointer" }}
              >
                Update
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
