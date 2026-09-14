"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export async function updateEnquiryStatus(formData: FormData) {
  await requireUser(["admin", "sales"]);
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !status) return;

  await supabase.from("enquiries").update({ status }).eq("id", id);
  revalidatePath("/admin/enquiries");
}
