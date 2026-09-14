import { login } from "./actions";

const ERROR_MESSAGES: Record<string, string> = {
  missing_fields: "Please enter both email and password.",
  invalid_credentials: "Incorrect email or password.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const errorMessage = params.error ? ERROR_MESSAGES[params.error] ?? "Something went wrong." : null;

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <form
        action={login}
        style={{
          width: 340,
          background: "#fff",
          borderRadius: 12,
          padding: "32px 28px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
          Maqo Internal CMS
        </h1>
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>
          Sign in with your company account.
        </p>

        {errorMessage && (
          <div
            style={{
              background: "#fef2f2",
              color: "#b91c1c",
              fontSize: 13,
              padding: "8px 12px",
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            {errorMessage}
          </div>
        )}

        <input type="hidden" name="next" value={params.next ?? "/admin/dashboard"} />

        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
          Email
        </label>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          style={inputStyle}
        />

        <label style={{ display: "block", fontSize: 13, fontWeight: 600, margin: "16px 0 6px" }}>
          Password
        </label>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          Sign in
        </button>
      </form>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #cbd5e1",
  fontSize: 14,
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  marginTop: 24,
  padding: "10px 12px",
  borderRadius: 8,
  border: "none",
  background: "#1d4ed8",
  color: "#fff",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
};
