
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { signOut } from "../actions/auth";
import {
  Newspaper,
  UserRound,
  Settings,
  Compass,
  MessageCircle,
  Bell,
  ArrowUpRight,
  Sparkles,
  LogOut,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, username, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const displayName =
    profile?.display_name ||
    profile?.username ||
    user.email?.split("@")[0] ||
    "there";

  const cards = [
    {
      title: "Your Feed",
      description: "See what's happening in your world.",
      href: "/feed",
      icon: Newspaper,
      color: "#22D3EE",
      status: "AVAILABLE",
    },
    {
      title: "My Profile",
      description: "Customise your identity on VYBE.",
      href: "/profile",
      icon: UserRound,
      color: "#EC4899",
      status: "AVAILABLE",
    },
    {
      title: "Settings",
      description: "Personalise your VYBE experience.",
      href: "/settings",
      icon: Settings,
      color: "#8B5CF6",
      status: "AVAILABLE",
    },
    {
      title: "Explore",
      description: "Discover people and communities.",
      href: null,
      icon: Compass,
      color: "#10B981",
      status: "COMING SOON",
    },
    {
      title: "Messages",
      description: "Connect privately with your people.",
      href: null,
      icon: MessageCircle,
      color: "#F59E0B",
      status: "COMING SOON",
    },
    {
      title: "Notifications",
      description: "Keep up with your latest activity.",
      href: null,
      icon: Bell,
      color: "#F472B6",
      status: "COMING SOON",
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#090A14",
        color: "#F4F4FF",
        padding: "30px 5%",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <style>{`
        .vybe-dashboard-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .vybe-dashboard-card {
          display: block;
          padding: 24px;
          min-height: 185px;
          border: 1px solid #302B4C;
          border-radius: 17px;
          background: #151629;
          color: #F4F4FF;
          text-decoration: none;
          transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
        }

        .vybe-dashboard-card:hover {
          transform: translateY(-4px);
          border-color: #8B5CF6;
          background: #1B1A34;
        }

        .vybe-dashboard-disabled {
          opacity: 0.5;
        }

        @media (max-width: 800px) {
          .vybe-dashboard-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 520px) {
          .vybe-dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <header
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          paddingBottom: "22px",
          borderBottom: "1px solid #25243B",
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

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link
            href="/profile"
            title="My profile"
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: profile?.avatar_url
                ? `url("${profile.avatar_url}") center/cover`
                : "linear-gradient(135deg, #8B5CF6, #22D3EE)",
              border: "2px solid #8B5CF6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            {!profile?.avatar_url && displayName.charAt(0).toUpperCase()}
          </Link>

          <form action={signOut}>
            <button
              type="submit"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                padding: "10px 14px",
                border: "1px solid #493044",
                borderRadius: "9px",
                background: "#151629",
                color: "#FF9BAF",
                cursor: "pointer",
              }}
            >
              <LogOut size={15} />
              Log out
            </button>
          </form>
        </div>
      </header>

      <div style={{ maxWidth: "1150px", margin: "40px auto" }}>
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "40px",
            borderRadius: "22px",
            border: "1px solid #49376B",
            background:
              "linear-gradient(115deg, #21183D, #171B35 60%, #102A3B)",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              color: "#22D3EE",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "2px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Sparkles size={15} />
            YOUR VYBE STARTS HERE
          </div>

          <h1
            style={{
              fontSize: "clamp(30px, 5vw, 45px)",
              margin: "20px 0 12px",
              letterSpacing: "-1px",
            }}
          >
            Welcome back, {displayName}.
          </h1>

          <p
            style={{
              color: "#C0B9D8",
              fontSize: "15px",
              lineHeight: 1.7,
              maxWidth: "550px",
            }}
          >
            Your people. Your world. Your place to connect, share and
            discover something new.
          </p>

          <Link
            href="/feed"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "9px",
              marginTop: "15px",
              padding: "13px 20px",
              borderRadius: "10px",
              background: "linear-gradient(90deg, #8B5CF6, #22D3EE)",
              color: "white",
              textDecoration: "none",
              fontWeight: 800,
              fontSize: "13px",
            }}
          >
            Open your feed <ArrowUpRight size={17} />
          </Link>
        </section>

        <section>
          <p
            style={{
              color: "#22D3EE",
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "2px",
            }}
          >
            YOUR SPACE
          </p>

          <h2 style={{ fontSize: "25px", marginBottom: "8px" }}>
            Where do you want to go?
          </h2>

          <p style={{ color: "#9996B5", fontSize: "13px", marginBottom: "22px" }}>
            Everything you need, just one click away.
          </p>

          <div className="vybe-dashboard-grid">
            {cards.map((card) => {
              const Icon = card.icon;

              const content = (
                <>
                  <div
                    style={{
                      width: "43px",
                      height: "43px",
                      borderRadius: "12px",
                      background: `${card.color}18`,
                      color: card.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <Icon size={22} />
                  </div>

                  <p
                    style={{
                      color: card.color,
                      fontSize: "9px",
                      fontWeight: 800,
                      letterSpacing: "1.3px",
                    }}
                  >
                    {card.status}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <strong style={{ fontSize: "17px" }}>
                      {card.title}
                    </strong>

                    {card.href && (
                      <ArrowUpRight size={17} color="#77778E" />
                    )}
                  </div>

                  <p
                    style={{
                      color: "#9996B5",
                      fontSize: "12px",
                      lineHeight: 1.6,
                      marginBottom: 0,
                    }}
                  >
                    {card.description}
                  </p>
                </>
              );

              return card.href ? (
                <Link
                  key={card.title}
                  href={card.href}
                  className="vybe-dashboard-card"
                >
                  {content}
                </Link>
              ) : (
                <div
                  key={card.title}
                  className="vybe-dashboard-card vybe-dashboard-disabled"
                  aria-disabled="true"
                >
                  {content}
                </div>
              );
            })}
          </div>
        </section>

        <section
          style={{
            marginTop: "30px",
            padding: "22px",
            borderRadius: "16px",
            border: "1px solid #302B4C",
            background: "#151629",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <div>
            <p
              style={{
                color: "#22D3EE",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "1.5px",
              }}
            >
              YOUR ACCOUNT
            </p>

            <strong>{displayName}</strong>

            <p style={{ color: "#9996B5", fontSize: "12px" }}>
              {user.email}
            </p>
          </div>

          <Link
            href="/settings"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "11px 15px",
              border: "1px solid #49376B",
              borderRadius: "9px",
              color: "#C5A8FF",
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            <Settings size={15} />
            Account settings
          </Link>
        </section>

        <footer
          style={{
            textAlign: "center",
            color: "#65627B",
            fontSize: "10px",
            letterSpacing: "1.5px",
            marginTop: "35px",
          }}
        >
          VYBE · YOUR PEOPLE. YOUR WORLD.
        </footer>
      </div>
    </main>
  );
}
