"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

function num(formData: FormData, key: string): number | null {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : null;
}

export async function saveCalculatorSettings(formData: FormData) {
  const user = await requireUser(["admin"]);
  const supabase = await createClient();

  const ratePerKwh = num(formData, "rate_per_kwh");
  const avgKwhPerKwpMonth = num(formData, "avg_kwh_per_kwp_month");
  const referenceSystemKwp = num(formData, "reference_system_kwp");
  const kwpPerPanel = num(formData, "kwp_per_panel");
  const offsetDayPercent = num(formData, "offset_day_percent");
  const offsetNightPercent = num(formData, "offset_night_percent");
  const offsetMixedPercent = num(formData, "offset_mixed_percent");

  if (
    ratePerKwh === null ||
    avgKwhPerKwpMonth === null ||
    referenceSystemKwp === null ||
    kwpPerPanel === null ||
    offsetDayPercent === null ||
    offsetNightPercent === null ||
    offsetMixedPercent === null
  ) {
    return;
  }

  await supabase
    .from("calculator_settings")
    .update({
      rate_per_kwh: ratePerKwh,
      avg_kwh_per_kwp_month: avgKwhPerKwpMonth,
      reference_system_kwp: referenceSystemKwp,
      kwp_per_panel: kwpPerPanel,
      offset_day_percent: offsetDayPercent,
      offset_night_percent: offsetNightPercent,
      offset_mixed_percent: offsetMixedPercent,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  // The public landing page reads this table with a 60s ISR revalidate
  // window (see app/page.tsx) — force it to pick up the change immediately.
  revalidatePath("/admin/calculator-settings");
  revalidatePath("/");
}
