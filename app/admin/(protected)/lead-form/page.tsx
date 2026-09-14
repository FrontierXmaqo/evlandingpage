import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { saveLeadFormOptions } from "./actions";

export default async function LeadFormPage() {
  await requireUser(["admin"]);
  const supabase = await createClient();

  const { data: leadFormOptions } = await supabase
    .from("lead_form_options")
    .select("*")
    .eq("id", 1)
    .single();

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Lead Form</h1>
      <p style={{ color: "#64748b", marginBottom: 24 }}>
        One option per line. These populate the dropdowns in the &quot;Free Home
        Assessment&quot; form on the public landing page.
      </p>

      <form action={saveLeadFormOptions} style={card}>
        <label style={label}>Title (salutation)</label>
        <textarea
          name="salutations"
          rows={4}
          defaultValue={(leadFormOptions?.salutations ?? []).join("\n")}
          style={input}
        />

        <label style={label}>State</label>
        <textarea
          name="states"
          rows={6}
          defaultValue={(leadFormOptions?.states ?? []).join("\n")}
          style={input}
        />

        <label style={label}>Property type</label>
        <textarea
          name="property_types"
          rows={4}
          defaultValue={(leadFormOptions?.property_types ?? []).join("\n")}
          style={input}
        />

        <label style={label}>Average monthly TNB bill</label>
        <textarea
          name="bill_ranges"
          rows={5}
          defaultValue={(leadFormOptions?.bill_ranges ?? []).join("\n")}
          style={input}
        />

        <label style={label}>Electric supply</label>
        <textarea
          name="electric_supply_options"
          rows={3}
          defaultValue={(leadFormOptions?.electric_supply_options ?? []).join("\n")}
          style={input}
        />

        <label style={label}>Preferred language</label>
        <textarea
          name="languages"
          rows={3}
          defaultValue={(leadFormOptions?.languages ?? []).join("\n")}
          style={input}
        />

        <button type="submit" style={button}>
          Save lead form options
        </button>
      </form>
    </div>
  );
}

const card: React.CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: 20, maxWidth: 560 };
const label: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, margin: "12px 0 4px" };
const input: React.CSSProperties = { width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 };
const button: React.CSSProperties = { marginTop: 16, padding: "8px 16px", borderRadius: 6, border: "none", background: "#1d4ed8", color: "#fff", fontWeight: 600, cursor: "pointer" };
