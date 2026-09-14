"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export async function saveSection(formData: FormData) {
  const user = await requireUser(["admin", "editor"]);
  const supabase = await createClient();

  const sectionKey = String(formData.get("section_key") ?? "");
  const contentText = String(formData.get("content") ?? "");
  const seoTitle = String(formData.get("seo_title") ?? "");
  const seoDescription = String(formData.get("seo_description") ?? "");

  if (!sectionKey) return;

  let content: unknown;
  try {
    content = contentText ? JSON.parse(contentText) : {};
  } catch {
    return; // invalid JSON — silently ignore rather than corrupt stored content
  }

  // RLS also enforces admin/editor-only writes here — this call fails safely
  // for any other role even if this action were somehow reached directly.
  await supabase.from("website_content").upsert(
    {
      section_key: sectionKey,
      content,
      seo_title: seoTitle || null,
      seo_description: seoDescription || null,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "section_key" }
  );

  revalidatePath("/admin/website-editor");
}
