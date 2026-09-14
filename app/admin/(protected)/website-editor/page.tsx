import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { saveSection, saveLeadFormOptions } from "./actions";

export default async function WebsiteEditorPage() {
  await requireUser(["admin", "editor"]);
  const supabase = await createClient();

  const [{ data: sections }, { data: leadFormOptions }] = await Promise.all([
    supabase.from("website_content").select("*").order("section_key"),
    supabase.from("lead_form_options").select("*").eq("id", 1).single(),
  ]);

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Website Editor</h1>
      <p style={{ color: "#64748b", marginBottom: 24 }}>
        Edit landing page section content and SEO metadata. Content is stored as JSON.
      </p>

      <h2 style={{ fontSize: 16, marginBottom: 12 }}>Lead form dropdown options</h2>
      <p style={{ color: "#64748b", marginBottom: 12, fontSize: 13 }}>
        One option per line. These populate the dropdowns in the &quot;Free Home
        Assessment&quot; form on the public landing page.
      </p>
      <form action={saveLeadFormOptions} style={{ ...card, marginBottom: 32 }}>
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

      <form action={saveSection} style={card}>
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>Add / update a section</h2>
        <label style={label}>Section key</label>
        <input name="section_key" placeholder="e.g. hero" required style={input} />

        <label style={label}>Content (JSON)</label>
        <textarea name="content" rows={6} placeholder='{"heading": "..."}' style={{ ...input, fontFamily: "monospace" }} />

        <label style={label}>SEO title</label>
        <input name="seo_title" style={input} />

        <label style={label}>SEO description</label>
        <textarea name="seo_description" rows={2} style={input} />

        <button type="submit" style={button}>
          Save section
        </button>
      </form>

      <h2 style={{ fontSize: 16, margin: "24px 0 12px" }}>Existing sections</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {(sections ?? []).map((s) => (
          <div key={s.section_key} style={card}>
            <strong>{s.section_key}</strong>
            <pre style={{ fontSize: 12, background: "#f1f5f9", padding: 8, borderRadius: 6, overflowX: "auto" }}>
              {JSON.stringify(s.content, null, 2)}
            </pre>
            {s.seo_title && <div style={{ fontSize: 13 }}>SEO title: {s.seo_title}</div>}
          </div>
        ))}
        {(sections ?? []).length === 0 && <p style={{ color: "#94a3b8" }}>No sections yet.</p>}
      </div>
    </div>
  );
}

const card: React.CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: 20, maxWidth: 560 };
const label: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, margin: "12px 0 4px" };
const input: React.CSSProperties = { width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 };
const button: React.CSSProperties = { marginTop: 16, padding: "8px 16px", borderRadius: 6, border: "none", background: "#1d4ed8", color: "#fff", fontWeight: 600, cursor: "pointer" };
