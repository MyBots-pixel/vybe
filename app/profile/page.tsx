import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { updateProfile } from "../actions/profile";
import { signOut } from "../actions/auth";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
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

  const inputStyle = {
    width: "100%",
    padding: "15px",
    marginTop: "9px",
    borderRadius: "10px",
    border: "1px solid #39304F",
    background: "#090A14",
    color: "#FFFFFF",
    outline: "none",
    boxSizing: "border-box" as const,
    fontSize: "15px",
  };

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

        <h1 style={{ fontSize: "36px", marginTop: "12px" }}>
          Edit your profile
        </h1>

        {params.error && (
          <p style={{
            background: "#451D2B",
            color: "#FF9BAF",
            padding: "13px",
            borderRadius: "9px"
          }}>
            {params.error}
          </p>
        )}

        {params.success && (
          <p style={{
            background: "#12352D",
            color: "#75E6B7",
            padding: "13px",
            borderRadius: "9px"
          }}>
            {params.success}
          </p>
        )}

        <form action={updateProfile} style={{ marginTop: "30px" }}>
          <label style={{ color: "#BDB9D3" }}>
            Username
            <input
              name="username"
              defaultValue={profile?.username || ""}
              placeholder="e.g. vybeuser"
              minLength={3}
              maxLength={20}
              required
              pattern="[a-zA-Z0-9_]+"
              style={inputStyle}
            />
          </label>

          <p style={{ color: "#77778E", fontSize: "12px" }}>
            3–20 characters. Letters, numbers and underscores only.
          </p>

          <label style={{ display: "block", marginTop: "25px", color: "#BDB9D3" }}>
            Display name
            <input
              name="display_name"
              defaultValue={profile?.display_name || ""}
              placeholder="Your name"
              maxLength={40}
              required
              style={inputStyle}
            />
          </label>

          <label style={{ display: "block", marginTop: "25px", color: "#BDB9D3" }}>
            Bio
            <textarea
              name="bio"
              defaultValue={profile?.bio || ""}
              placeholder="Tell the VYBE community about yourself..."
              maxLength={160}
              rows={4}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </label>

          <button type="submit" style={{
            width: "100%",
            marginTop: "30px",
            padding: "16px",
            border: "none",
            borderRadius: "10px",
            background: "linear-gradient(90deg, #8B5CF6, #22D3EE)",
            color: "#FFFFFF",
            fontWeight: 800,
            fontSize: "15px",
            cursor: "pointer"
          }}>
            SAVE PROFILE
          </button>
        </form>

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
