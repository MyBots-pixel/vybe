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

  if (!profile) {
    notFound();
  }

  const initial = (profile.display_name || profile.username || "V")
    .charAt(0)
    .toUpperCase();

  const joinedDate = new Date(profile.created_at).toLocaleDateString(
    "en-GB",
    { month: "long", year: "numeric" }
  );

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
          Go to VYBE →
        </Link>
      </nav>

      <section style={{
        maxWidth: "850px",
        margin: "70px auto",
        background: "#151629",
        border: "1px solid #302B4C",
        borderRadius: "22px",
        overflow: "hidden"
      }}>
        <div style={{
          height: "170px",
          background: "linear-gradient(120deg, #5424A8, #151629 65%, #087F91)"
        }} />

        <div style={{ padding: "0 35px 40px" }}>
          <div style={{
            width: "110px",
            height: "110px",
            marginTop: "-55px",
            borderRadius: "50%",
            border: "5px solid #151629",
            background: "linear-gradient(135deg, #8B5CF6, #22D3EE)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "42px",
            fontWeight: 900
          }}>
            {initial}
          </div>

          <h1 style={{
            fontSize: "34px",
            marginTop: "22px",
            marginBottom: "5px"
          }}>
            {profile.display_name || profile.username}
          </h1>

          <p style={{ color: "#22D3EE", margin: 0 }}>
            @{profile.username}
          </p>

          <div style={{
            marginTop: "28px",
            padding: "22px",
            background: "#090A14",
            borderRadius: "13px"
          }}>
            <p style={{
              color: "#A477FF",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "2px"
            }}>
              ABOUT
            </p>

            <p style={{
              color: "#D0CDE0",
              lineHeight: 1.8,
              whiteSpace: "pre-wrap"
            }}>
              {profile.bio || "This user hasn't written a bio yet."}
            </p>
          </div>

          <p style={{
            color: "#77778E",
            fontSize: "13px",
            marginTop: "25px"
          }}>
            Member since {joinedDate}
          </p>
        </div>
      </section>
    </main>
  );
}
