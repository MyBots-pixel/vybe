
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../lib/supabase/server";
import SettingsPanel from "./settings-panel";

export const dynamic = "force-dynamic";

const defaults = {
  theme: "dark",
  accent_color: "purple",
  font_size: "medium",
  compact_mode: false,
  reduced_motion: false,
  profile_visibility: "public",
  show_online_status: true,
  allow_messages: true,
  email_notifications: true,
  in_app_notifications: true,
};

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: savedSettings } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const settings = {
    ...defaults,
    ...(savedSettings || {}),
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#090A14",
        color: "#F4F4FF",
        fontFamily: "Arial, sans-serif",
        padding: "35px 5%",
      }}
    >
      <nav
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          paddingBottom: "20px",
          borderBottom: "1px solid #25243B",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          href="/"
          style={{
            color: "white",
            fontSize: "28px",
            fontWeight: 900,
            textDecoration: "none",
          }}
        >
          VYBE<span style={{ color: "#22D3EE" }}>.</span>
        </Link>

        <Link
          href="/feed"
          style={{
            color: "#B99BFF",
            textDecoration: "none",
            fontSize: "13px",
          }}
        >
          Back to feed
        </Link>
      </nav>

      <div style={{ maxWidth: "850px", margin: "35px auto" }}>
        <SettingsPanel initialSettings={settings} />
      </div>
    </main>
  );
}
