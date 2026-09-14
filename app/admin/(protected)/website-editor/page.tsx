import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { saveSection } from "./actions";

export default async function WebsiteEditorPage() {
  await requireUser(["admin", "editor"]);
  const supabase = await createClient();

  const { data: sections } = await supabase
    .from("website_content")
    .select("*")
    .order("section_key");

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Website Editor</h1>
      <p style={{ color: "#64748b", marginBottom: 24 }}>
        Edit landing page section content and SEO metadata. Content is stored as JSON.
      </p>

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
