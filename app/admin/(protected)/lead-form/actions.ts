"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

function linesToArray(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function saveLeadFormOptions(formData: FormData) {
  const user = await requireUser(["admin"]);
  const supabase = await createClient();

  const salutations = linesToArray(String(formData.get("salutations") ?? ""));
  const states = linesToArray(String(formData.get("states") ?? ""));
  const propertyTypes = linesToArray(String(formData.get("property_types") ?? ""));
  const billRanges = linesToArray(String(formData.get("bill_ranges") ?? ""));
  const electricSupplyOptions = linesToArray(String(formData.get("electric_supply_options") ?? ""));
  const languages = linesToArray(String(formData.get("languages") ?? ""));

  if (
    !salutations.length ||
    !states.length ||
    !propertyTypes.length ||
    !billRanges.length ||
    !electricSupplyOptions.length ||
    !languages.length
  ) {
    return; // never leave the public form with an empty dropdown
  }

  // RLS also restricts this update to admins — this is defense in depth,
  // not the actual access boundary.
  await supabase
    .from("lead_form_options")
    .update({
      salutations,
      states,
      property_types: propertyTypes,
      bill_ranges: billRanges,
      electric_supply_options: electricSupplyOptions,
      languages,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  // The public landing page reads this table with a 60s ISR revalidate
  // window (see app/page.tsx) — force it to pick up the change immediately.
  revalidatePath("/admin/lead-form");
  revalidatePath("/");
}
