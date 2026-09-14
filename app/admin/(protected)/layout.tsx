import Link from "next/link";
import { requireUser } from "@/lib/supabase/auth";
import { logout } from "../login/actions";

const NAV_ITEMS: { href: string; label: string; roles?: Array<"admin" | "editor" | "sales"> }[] = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/website-editor", label: "Website Editor", roles: ["admin", "editor"] },
  { href: "/admin/packages", label: "Solar Packages", roles: ["admin", "sales"] },
  { href: "/admin/calculator-settings", label: "Calculator Settings", roles: ["admin", "editor"] },
  { href: "/admin/enquiries", label: "Customer Enquiries", roles: ["admin", "sales"] },
  { href: "/admin/analytics", label: "Performance Analytics" },
  { href: "/admin/users", label: "User Management", roles: ["admin"] },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Login page is outside this layout's route group protection deliberately —
  // every other /admin/* page renders inside here, so this one check covers
  // session + role load for the whole section.
  const user = await requireUser();

  const visibleNav = NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(user.role));

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif" }}>
      <aside
        style={{
          width: 240,
          background: "#0f172a",
          color: "#e2e8f0",
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Maqo CMS</div>
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 24 }}>
          {user.email} · {user.role}
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {visibleNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                color: "#e2e8f0",
                textDecoration: "none",
                padding: "8px 10px",
                borderRadius: 6,
                fontSize: 14,
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form action={logout}>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid #334155",
              background: "transparent",
              color: "#e2e8f0",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Sign out
          </button>
        </form>
      </aside>

      <main style={{ flex: 1, background: "#f8fafc", padding: "32px 40px" }}>{children}</main>
    </div>
  );
}
