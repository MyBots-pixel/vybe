
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username.toLowerCase())
    .single();

  if (!profile) notFound();

  const initial = (profile.display_name || profile.username || "V")
    .charAt(0)
    .toUpperCase();

  const joinedDate = new Date(profile.created_at).toLocaleDateString(
    "en-GB",
    { month: "long", year: "numeric" }
  );

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
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--border)",
          paddingBottom: "25px",
          gap: "15px",
        }}
      >
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
          }}
        >
          Go to VYBE →
        </Link>
      </nav>

      <section
        style={{
          maxWidth: "850px",
          margin: "70px auto",
          background: "var(--card-background)",
          border: "1px solid var(--border)",
          borderRadius: "22px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "200px",
            background: profile.banner_url
              ? `url("${profile.banner_url}") center/cover`
              : "linear-gradient(120deg, #5424A8, #151629 65%, #087F91)",
          }}
        />

        <div style={{ padding: "0 35px 40px" }}>
          <div
            style={{
              width: "110px",
              height: "110px",
              marginTop: "-55px",
              borderRadius: "50%",
              border: "5px solid var(--card-background)",
              background: profile.avatar_url
                ? `url("${profile.avatar_url}") center/cover`
                : "linear-gradient(135deg, var(--purple), var(--cyan))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "42px",
              fontWeight: 900,
              color: "#FFFFFF",
            }}
          >
            {!profile.avatar_url && initial}
          </div>

          <h1
            style={{
              fontSize: "34px",
              marginTop: "22px",
              marginBottom: "5px",
            }}
          >
            {profile.display_name || profile.username}
          </h1>

          <p style={{ color: "var(--cyan)", margin: 0 }}>
            @{profile.username}
          </p>

          <div
            style={{
              marginTop: "28px",
              padding: "22px",
              background: "var(--input-background)",
              border: "1px solid var(--border)",
              borderRadius: "13px",
            }}
          >
            <p
              style={{
                color: "var(--purple)",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "2px",
              }}
            >
              ABOUT
            </p>

            <p
              style={{
                color: "var(--text)",
                lineHeight: 1.8,
                whiteSpace: "pre-wrap",
              }}
            >
              {profile.bio || "This user hasn't written a bio yet."}
            </p>
          </div>

          <p
            style={{
              color: "var(--muted)",
              fontSize: "13px",
              marginTop: "25px",
            }}
          >
            Member since {joinedDate}
          </p>
        </div>
      </section>
    </main>
  );
}
