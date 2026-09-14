import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AppRole = "admin" | "editor" | "sales";

export type CurrentUser = {
  id: string;
  email: string;
  fullName: string | null;
  role: AppRole;
};

/**
 * Server-side guard for /admin pages. Confirms a live Supabase session AND
 * loads the caller's role from `profiles`. This is defense-in-depth on top
 * of RLS (the real enforcement layer) and middleware (route redirect) —
 * never the only check relied on for data access.
 */
export async function requireUser(allowedRoles?: AppRole[]): Promise<CurrentUser> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/admin/login");
  }

  const currentUser: CurrentUser = {
    id: user.id,
    email: user.email ?? "",
    fullName: profile.full_name,
    role: profile.role as AppRole,
  };

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    redirect("/admin/dashboard?error=forbidden");
  }

  return currentUser;
}
