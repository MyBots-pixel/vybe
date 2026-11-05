
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import ImageEditor from "./image-editor";
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

  if (!user) redirect("/login");

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
    border: "1px solid var(--border)",
    background: "var(--input-background)",
    color: "var(--text)",
    boxSizing: "border-box" as const,
    fontSize: "15px",
    fontFamily: "inherit",
  };

  const sectionStyle = {
    maxWidth: "750px",
    margin: "0 auto 35px",
    background: "var(--card-background)",
    border: "1px solid var(--border)",
    borderRadius: "18px",
    padding: "30px",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--background)",
        color: "var(--text)",
        padding: "35px 7%",
        fontFamily: "inherit",
      }}
    >
      <style>{`
        .vybe-profile-muted {
          color: var(--muted);
        }

        .vybe-profile-input::placeholder {
          color: var(--muted);
          opacity: 0.8;
        }

        .vybe-profile-input:focus {
          outline: 2px solid var(--purple);
          outline-offset: 2px;
        }

        .vybe-profile-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border);
          padding-bottom: 25px;
          gap: 15px;
        }

        .vybe-profile-card {
          max-width: 750px;
          margin: 55px auto;
          background: var(--card-background);
          border: 1px solid var(--border);
          border-radius: 22px;
          overflow: hidden;
        }

        @media (max-width: 520px) {
          .vybe-profile-card {
            margin: 35px auto;
          }

          .vybe-profile-section {
            padding: 22px !important;
          }
        }
      `}</style>

      <nav className="vybe-profile-nav">
        <Link
          href="/"
          style={{
            color: "var(--text)",
            fontSize: "30px",
            fontWeight: 900,
            textDecoration: "none",
          }}
        >
          VYBE<span style={{ color: "var(--cyan)" }}>.</span>
        </Link>

        <Link
          href="/dashboard"
          style={{
            color: "var(--purple)",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Dashboard →
        </Link>
      </nav>

      <section className="vybe-profile-card">
        <div
          style={{
            height: "150px",
            background: profile?.banner_url
              ? `url("${profile.banner_url}") center/cover`
              : "linear-gradient(120deg, #5424A8, #151629 65%, #087F91)",
          }}
        />

        <div style={{ padding: "0 30px 35px" }}>
          <div
            style={{
              width: "100px",
              height: "100px",
              marginTop: "-50px",
              borderRadius: "50%",
              border: "5px solid var(--card-background)",
              background: profile?.avatar_url
                ? `url("${profile.avatar_url}") center/cover`
                : "linear-gradient(135deg, var(--purple), var(--cyan))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
              fontWeight: 900,
              color: "#FFFFFF",
            }}
          >
            {!profile?.avatar_url &&
              (profile?.display_name || user.email || "V")
                .charAt(0)
                .toUpperCase()}
          </div>

          <h1 style={{ fontSize: "32px", marginBottom: "5px" }}>
            {profile?.display_name || "Your profile"}
          </h1>

          <p style={{ color: "var(--cyan)" }}>
            {profile?.username
              ? `@${profile.username}`
              : "Choose your username"}
          </p>

          <p className="vybe-profile-muted">
            {profile?.bio || "You haven't added a bio yet."}
          </p>
        </div>
      </section>

      <section className="vybe-profile-section" style={sectionStyle}>
        <h2 style={{ fontSize: "23px" }}>VYBE Image Studio</h2>

        <p className="vybe-profile-muted" style={{ fontSize: "13px" }}>
          Edit, crop and position your profile pictures and banners before
          uploading them.
        </p>

        <ImageEditor />
      </section>

      <section className="vybe-profile-section" style={sectionStyle}>
        <h2 style={{ fontSize: "23px" }}>Edit your details</h2>

        {params.error && (
          <p
            style={{
              background: "#451D2B",
              color: "#FFB6C5",
              padding: "13px",
              borderRadius: "9px",
            }}
          >
            {params.error}
          </p>
        )}

        {params.success && (
          <p
            style={{
              background: "#12352D",
              color: "#75E6B7",
              padding: "13px",
              borderRadius: "9px",
            }}
          >
            {params.success}
          </p>
        )}

        <form action={updateProfile} style={{ marginTop: "25px" }}>
          <label>
            Username
            <input
              className="vybe-profile-input"
              name="username"
              defaultValue={profile?.username || ""}
              placeholder="Your username"
              minLength={3}
              maxLength={20}
              pattern="[a-zA-Z0-9_]+"
              required
              style={inputStyle}
            />
          </label>

          <label style={{ display: "block", marginTop: "22px" }}>
            Display name
            <input
              className="vybe-profile-input"
              name="display_name"
              defaultValue={profile?.display_name || ""}
              placeholder="Your name"
              maxLength={40}
              required
              style={inputStyle}
            />
          </label>

          <label style={{ display: "block", marginTop: "22px" }}>
            Bio
            <textarea
              className="vybe-profile-input"
              name="bio"
              defaultValue={profile?.bio || ""}
              placeholder="Tell everyone about yourself..."
              maxLength={160}
              rows={4}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </label>

          <button
            type="submit"
            style={{
              width: "100%",
              marginTop: "25px",
              padding: "15px",
              border: "none",
              borderRadius: "10px",
              background: "linear-gradient(90deg, var(--purple), var(--cyan))",
              color: "#FFFFFF",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            SAVE PROFILE
          </button>
        </form>

        <div
          style={{
            marginTop: "25px",
            padding: "18px",
            background: "var(--input-background)",
            borderRadius: "10px",
          }}
        >
          <p className="vybe-profile-muted" style={{ fontSize: "12px" }}>
            ACCOUNT EMAIL
          </p>
          {user.email}
        </div>
      </section>

      <form
        action={signOut}
        style={{ textAlign: "center", marginTop: "30px" }}
      >
        <button
          type="submit"
          style={{
            background: "var(--card-background)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            color: "var(--text)",
            padding: "13px 22px",
            cursor: "pointer",
          }}
        >
          Log out
        </button>
      </form>
    </main>
  );
}
