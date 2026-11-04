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
    border: "1px solid #39304F",
    background: "#090A14",
    color: "#FFFFFF",
    boxSizing: "border-box" as const,
    fontSize: "15px",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#090A14",
        color: "#F4F4FF",
        padding: "35px 7%",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #25243B",
          paddingBottom: "25px",
        }}
      >
        <Link
          href="/"
          style={{
            color: "#FFFFFF",
            fontSize: "30px",
            fontWeight: 900,
            textDecoration: "none",
          }}
        >
          VYBE<span style={{ color: "#22D3EE" }}>.</span>
        </Link>

        <Link
          href="/dashboard"
          style={{
            color: "#B99BFF",
            textDecoration: "none",
          }}
        >
          Dashboard →
        </Link>
      </nav>

      <section
        style={{
          maxWidth: "750px",
          margin: "55px auto",
          background: "#151629",
          border: "1px solid #302B4C",
          borderRadius: "22px",
          overflow: "hidden",
        }}
      >
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
              border: "5px solid #151629",
              background: profile?.avatar_url
                ? `url("${profile.avatar_url}") center/cover`
                : "linear-gradient(135deg, #8B5CF6, #22D3EE)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
              fontWeight: 900,
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

          <p style={{ color: "#22D3EE" }}>
            {profile?.username
              ? `@${profile.username}`
              : "Choose your username"}
          </p>

          <p style={{ color: "#BDB9D3" }}>
            {profile?.bio || "You haven't added a bio yet."}
          </p>
        </div>
      </section>

      <section
        style={{
          maxWidth: "750px",
          margin: "0 auto 35px",
          background: "#151629",
          border: "1px solid #302B4C",
          borderRadius: "18px",
          padding: "30px",
        }}
      >
        <h2 style={{ fontSize: "23px" }}>VYBE Image Studio</h2>

        <p style={{ color: "#9996B5", fontSize: "13px" }}>
          Edit, crop and position your profile pictures and banners before
          uploading them.
        </p>

        <ImageEditor />
      </section>

      <section
        style={{
          maxWidth: "750px",
          margin: "0 auto",
          background: "#151629",
          border: "1px solid #302B4C",
          borderRadius: "18px",
          padding: "30px",
        }}
      >
        <h2 style={{ fontSize: "23px" }}>Edit your details</h2>

        {params.error && (
          <p
            style={{
              background: "#451D2B",
              color: "#FF9BAF",
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
              background: "linear-gradient(90deg, #8B5CF6, #22D3EE)",
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
            background: "#090A14",
            borderRadius: "10px",
          }}
        >
          <p style={{ color: "#9996B5", fontSize: "12px" }}>
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
            background: "#151629",
            border: "1px solid #39304F",
            borderRadius: "10px",
            color: "#FFFFFF",
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
