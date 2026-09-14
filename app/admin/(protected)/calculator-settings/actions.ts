"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export async function saveCalculatorSettings(formData: FormData) {
  const user = await requireUser(["admin"]);
  const supabase = await createClient();

  const ratePerKwh = Number(formData.get("rate_per_kwh"));
  const assumptionsText = String(formData.get("assumptions") ?? "");

  if (!Number.isFinite(ratePerKwh)) return;

  let assumptions: unknown = {};
  try {
    assumptions = assumptionsText ? JSON.parse(assumptionsText) : {};
  } catch {
    return;
  }

  await supabase
    .from("calculator_settings")
    .update({
      rate_per_kwh: ratePerKwh,
      assumptions,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  revalidatePath("/admin/calculator-settings");
}
