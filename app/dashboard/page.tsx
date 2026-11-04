import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { signOut } from "../actions/auth";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#090914",
        color: "#f5f3ff",
        padding: "50px 7%",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Link
        href="/"
        style={{
          color: "#fff",
          fontSize: "30px",
          fontWeight: 800,
          textDecoration: "none",
        }}
      >
        VYBE<span style={{ color: "#a477ff" }}>.</span>
      </Link>

      <section style={{ marginTop: "100px", maxWidth: "650px" }}>
        <p
          style={{
            color: "#b99bff",
            letterSpacing: "2px",
            fontSize: "12px",
            fontWeight: 700,
          }}
        >
          YOUR VYBE STARTS HERE
        </p>

        <h1 style={{ fontSize: "42px", marginTop: "15px" }}>
          Welcome to VYBE.
        </h1>

        <p style={{ color: "#a09db8", marginTop: "18px" }}>
          You're successfully logged in as:
        </p>

        <p style={{ color: "#22d3ee", marginTop: "8px" }}>
          {user.email}
        </p>

        <form action={signOut}>
          <button
            type="submit"
            style={{
              marginTop: "35px",
              padding: "14px 22px",
              border: "1px solid #ffffff25",
              borderRadius: "10px",
              background: "#151529",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Log out
          </button>
        </form>
      </section>
    </main>
  );
}
