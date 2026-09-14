import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { saveCalculatorSettings } from "./actions";

export default async function CalculatorSettingsPage() {
  await requireUser(["admin"]);
  const supabase = await createClient();

  const { data: s } = await supabase
    .from("calculator_settings")
    .select("*")
    .eq("id", 1)
    .single();

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Solar Calculator Settings</h1>
      <p style={{ color: "#64748b", marginBottom: 24 }}>
        Controls the numbers behind the &quot;See My Savings&quot; calculator on the
        public landing page. Just fill in the numbers — no code or special
        formatting needed.
      </p>

      <form action={saveCalculatorSettings} style={card}>
        <label style={label}>TNB electricity rate (RM per kWh)</label>
        <input name="rate_per_kwh" type="number" step="0.001" defaultValue={s?.rate_per_kwh ?? 0.44} required style={input} />

        <label style={label}>Average electricity use per kWp of solar (kWh per month)</label>
        <input name="avg_kwh_per_kwp_month" type="number" step="1" defaultValue={s?.avg_kwh_per_kwp_month ?? 1463} required style={input} />

        <label style={label}>Reference system size used for sizing (kWp)</label>
        <input name="reference_system_kwp" type="number" step="0.1" defaultValue={s?.reference_system_kwp ?? 14.3} required style={input} />

        <label style={label}>Size of one solar panel (kWp per panel)</label>
        <input name="kwp_per_panel" type="number" step="0.01" defaultValue={s?.kwp_per_panel ?? 0.65} required style={input} />

        <label style={label}>Bill offset when charging mostly during the day (%)</label>
        <input name="offset_day_percent" type="number" step="1" min={0} max={100} defaultValue={s?.offset_day_percent ?? 80} required style={input} />

        <label style={label}>Bill offset when charging mostly at night (%)</label>
        <input name="offset_night_percent" type="number" step="1" min={0} max={100} defaultValue={s?.offset_night_percent ?? 90} required style={input} />

        <label style={label}>Bill offset when charging is mixed day/night (%)</label>
        <input name="offset_mixed_percent" type="number" step="1" min={0} max={100} defaultValue={s?.offset_mixed_percent ?? 85} required style={input} />

        <button type="submit" style={button}>
          Save settings
        </button>
      </form>
    </div>
  );
}

const card: React.CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: 20, maxWidth: 480 };
const label: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, margin: "12px 0 4px" };
const input: React.CSSProperties = { width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 };
const button: React.CSSProperties = { marginTop: 16, padding: "8px 16px", borderRadius: 6, border: "none", background: "#1d4ed8", color: "#fff", fontWeight: 600, cursor: "pointer" };
