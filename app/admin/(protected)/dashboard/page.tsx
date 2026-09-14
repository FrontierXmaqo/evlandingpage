import Link from "next/link";
import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

const CARDS: { href: string; title: string; roles?: Array<"admin" | "sales"> }[] = [
  { href: "/admin/lead-form", title: "Lead Form", roles: ["admin"] },
  { href: "/admin/calculator-settings", title: "Solar Calculator Settings", roles: ["admin"] },
  { href: "/admin/enquiries", title: "Customer Enquiries", roles: ["admin", "sales"] },
  { href: "/admin/analytics", title: "Performance Analytics" },
  { href: "/admin/users", title: "User Management", roles: ["admin"] },
];

export default async function DashboardPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const { count: newEnquiries } = await supabase
    .from("enquiries")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");

  const visibleCards = CARDS.filter((c) => !c.roles || c.roles.includes(user.role));

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
        Welcome, {user.fullName ?? user.email}
      </h1>
      <p style={{ color: "#64748b", marginBottom: 24 }}>
        Role: <strong>{user.role}</strong>
        {typeof newEnquiries === "number" && (
          <> · {newEnquiries} new enquir{newEnquiries === 1 ? "y" : "ies"}</>
        )}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        {visibleCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            style={{
              display: "block",
              padding: 20,
              borderRadius: 10,
              background: "#fff",
              border: "1px solid #e2e8f0",
              textDecoration: "none",
              color: "#0f172a",
              fontWeight: 600,
            }}
          >
            {card.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
