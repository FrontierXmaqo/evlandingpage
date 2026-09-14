"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export async function createPackage(formData: FormData) {
  await requireUser(["admin", "sales"]);
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const kwp = Number(formData.get("kwp"));
  const price = Number(formData.get("price"));
  const description = String(formData.get("description") ?? "");

  if (!name || !Number.isFinite(kwp) || !Number.isFinite(price)) return;

  await supabase.from("solar_packages").insert({ name, kwp, price, description });
  revalidatePath("/admin/packages");
}

export async function togglePackageActive(formData: FormData) {
  await requireUser(["admin", "sales"]);
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "");
  const isActive = formData.get("is_active") === "true";
  if (!id) return;

  await supabase.from("solar_packages").update({ is_active: !isActive }).eq("id", id);
  revalidatePath("/admin/packages");
}
