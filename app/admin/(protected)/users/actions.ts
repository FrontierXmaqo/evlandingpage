"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export async function updateUserRole(formData: FormData) {
  await requireUser(["admin"]);
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "");
  const role = String(formData.get("role") ?? "");
  if (!id || !["admin", "editor", "sales"].includes(role)) return;

  // RLS restricts this update to admins regardless of this check, but we
  // guard here too so a non-admin gets a clean redirect instead of a
  // silent no-op write.
  await supabase.from("profiles").update({ role }).eq("id", id);
  revalidatePath("/admin/users");
}
