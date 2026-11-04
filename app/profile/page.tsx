import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { signOut } from "../actions/auth";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <main style={{
      minHeight: "100vh",
      background: "#090A14",
      color: "#F4F4FF",
      padding: "35px 7%",
      fontFamily: "Arial, sans-serif"
    }}>
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #25243B",
        paddingBottom: "25px"
      }}>
        <Link href="/" style={{
          color: "#FFFFFF",
          fontSize: "30px",
          fontWeight: 900,
          textDecoration: "none"
        }}>
          VYBE<span style={{ color: "#22D3EE" }}>.</span>
        </Link>

        <Link href="/dashboard" style={{
          color: "#B99BFF",
          textDecoration: "none"
        }}>
          Dashboard →
        </Link>
      </nav>

      <section style={{
        maxWidth: "750px",
        margin: "65px auto",
        background: "#151629",
        border: "1px solid #302B4C",
        borderRadius: "22px",
        padding: "35px"
      }}>
        <p style={{
          color: "#22D3EE",
          fontSize: "12px",
          fontWeight: 800,
          letterSpacing: "3px"
        }}>
          YOUR VYBE IDENTITY
        </p>

        <h1 style={{
          fontSize: "36px",
          marginTop: "12px"
        }}>
          Your profile
        </h1>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginTop: "35px"
        }}>
          <div style={{
            width: "85px",
            height: "85px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #8B5CF6, #22D3EE)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
            fontWeight: 900
          }}>
            {(profile?.display_name || user.email || "V").charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 style={{ fontSize: "23px", margin: 0 }}>
              {profile?.display_name || "Your display name"}
            </h2>
            <p style={{ color: "#9996B5", marginTop: "7px" }}>
              {profile?.username ? `@${profile.username}` : "Choose your username"}
            </p>
          </div>
        </div>

        <div style={{
          marginTop: "35px",
          padding: "20px",
          background: "#090A14",
          borderRadius: "12px"
        }}>
          <p style={{ color: "#9996B5", fontSize: "12px" }}>
            ACCOUNT EMAIL
          </p>
          <p>{user.email}</p>
        </div>

        <div style={{
          marginTop: "20px",
          padding: "20px",
          background: "#090A14",
          borderRadius: "12px"
        }}>
          <p style={{ color: "#9996B5", fontSize: "12px" }}>
            ABOUT YOU
          </p>
          <p>{profile?.bio || "You haven't added a bio yet."}</p>
        </div>

        <p style={{
          color: "#77778E",
          fontSize: "13px",
          marginTop: "30px"
        }}>
          Your profile is connected to your VYBE account.
        </p>
      </section>

      <form action={signOut} style={{ textAlign: "center" }}>
        <button type="submit" style={{
          background: "#151629",
          border: "1px solid #39304F",
          borderRadius: "10px",
          color: "#FFFFFF",
          padding: "13px 22px",
          cursor: "pointer"
        }}>
          Log out
        </button>
      </form>
    </main>
  );
}
