import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { saveCalculatorSettings } from "./actions";

export default async function CalculatorSettingsPage() {
  await requireUser(["admin", "editor"]);
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("calculator_settings")
    .select("*")
    .eq("id", 1)
    .single();

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Solar Calculator Settings</h1>
      <p style={{ color: "#64748b", marginBottom: 24 }}>
        Controls the assumptions used by the public landing page's savings calculator.
      </p>

      <form action={saveCalculatorSettings} style={card}>
        <label style={label}>TNB rate per kWh (RM)</label>
        <input
          name="rate_per_kwh"
          type="number"
          step="0.001"
          defaultValue={settings?.rate_per_kwh ?? 0.571}
          required
          style={input}
        />

        <label style={label}>Other assumptions (JSON)</label>
        <textarea
          name="assumptions"
          rows={8}
          defaultValue={JSON.stringify(settings?.assumptions ?? {}, null, 2)}
          style={{ ...input, fontFamily: "monospace" }}
        />

        <button type="submit" style={button}>
          Save settings
        </button>
      </form>
    </div>
  );
}

const card: React.CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: 20, maxWidth: 560 };
const label: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, margin: "12px 0 4px" };
const input: React.CSSProperties = { width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 };
const button: React.CSSProperties = { marginTop: 16, padding: "8px 16px", borderRadius: 6, border: "none", background: "#1d4ed8", color: "#fff", fontWeight: 600, cursor: "pointer" };
