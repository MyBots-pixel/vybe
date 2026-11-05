
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { signOut } from "../actions/auth";
import {
  House,
  Newspaper,
  UserRound,
  Settings,
  Compass,
  MessageCircle,
  Bell,
  ArrowUpRight,
  Sparkles,
  LogOut,
  Users,
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

  const navigation = [
    {
      title: "Your Feed",
      description: "See what's happening in your world.",
      href: "/feed",
      icon: Newspaper,
      color: "#22D3EE",
      tag: "SOCIAL",
    },
    {
      title: "My Profile",
      description: "Customise how people see you.",
      href: "/profile",
      icon: UserRound,
      color: "#EC4899",
      tag: "YOUR IDENTITY",
    },
    {
      title: "Settings",
      description: "Make VYBE yours with customisation.",
      href: "/settings",
      icon: Settings,
      color: "#8B5CF6",
      tag: "PERSONALISE",
    },
    {
      title: "Explore",
      description: "Discover new people and communities.",
      href: "#",
      icon: Compass,
      color: "#10B981",
      tag: "COMING SOON",
      disabled: true,
    },
    {
      title: "Messages",
      description: "Connect privately with your people.",
      href: "#",
      icon: MessageCircle,
      color: "#F59E0B",
      tag: "COMING SOON",
      disabled: true,
    },
    {
      title: "Notifications",
      description: "Keep up with your latest activity.",
      href: "#",
      icon: Bell,
      color: "#F472B6",
      tag: "COMING SOON",
      disabled: true,
    },
  ];

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
      <style>{`
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 17px;
        }

        .dashboard-card {
          display: flex;
          flex-direction: column;
          min-height: 185px;
          padding: 22px;
          border-radius: 17px;
          border: 1px solid #302B4C;
          background: #151629;
          color: white;
          text-decoration: none;
          transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
        }

        .dashboard-card:not(.disabled):hover {
          transform: translateY(-4px);
          border-color: #8B5CF6;
          background: #1B1A34;
        }

        .dashboard-card.disabled {
          opacity: 0.48;
          cursor: default;
        }

        .dashboard-card .card-icon {
          width: 43px;
          height: 43px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .dashboard-card .card-tag {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.3px;
          margin-bottom: 8px;
        }

        @media (max-width: 850px) {
          .dashboard-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 520px) {
          .dashboard-grid {
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
          paddingBottom: "23px",
          borderBottom: "1px solid #25243B",
        }}
      >
        <Link
          href="/"
          style={{
            color: "white",
            fontSize: "31px",
            fontWeight: 950,
            letterSpacing: "-1px",
            textDecoration: "none",
          }}
        >
          VYBE<span style={{ color: "#22D3EE" }}>.</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "13px" }}>
          <Link
            href="/profile"
            title="My profile"
            style={{
              width: "40px",
              height: "40px",
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
                gap: "8px",
                padding: "10px 14px",
                border: "1px solid #39304F",
                borderRadius: "9px",
                background: "#151629",
                color: "#FF9BAF",
                cursor: "pointer",
                fontWeight: 700,
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
            padding: "42px",
            borderRadius: "22px",
            border: "1px solid #49376B",
            background: "linear-gradient(115deg, #21183D, #171B35 60%, #102A3B)",
            marginBottom: "38px",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "250px",
              height: "250px",
              borderRadius: "50%",
              background: "#8B5CF6",
              filter: "blur(100px)",
              opacity: 0.18,
              right: "5%",
              top: "-100px",
            }}
          />

          <div style={{ position: "relative" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
                color: "#22D3EE",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "2px",
              }}
            >
              <Sparkles size={15} />
              YOUR VYBE STARTS HERE
            </div>

            <h1
              style={{
                fontSize: "clamp(30px, 5vw, 46px)",
                margin: "18px 0 10px",
                letterSpacing: "-1.5px",
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
                margin: 0,
              }}
            >
              Your people. Your world. Everything you need to connect,
              share and make your VYBE yours is right here.
            </p>

            <Link
              href="/feed"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "9px",
                marginTop: "25px",
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
          </div>
        </section>

        <div style={{ marginBottom: "20px" }}>
          <p
            style={{
              color: "#22D3EE",
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "2px",
              marginBottom: "8px",
            }}
          >
            YOUR SPACE
          </p>

          <h2 style={{ fontSize: "25px", margin: 0 }}>
            Where do you want to go?
          </h2>

          <p style={{ color: "#9996B5", fontSize: "13px" }}>
            Everything in VYBE, just one click away.
          </p>
        </div>

        <div className="dashboard-grid">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                onClick={
                  item.disabled
                    ? (event) => event.preventDefault()
                    : undefined
                }
                className={`dashboard-card ${item.disabled ? "disabled" : ""}`}
                aria-disabled={item.disabled || undefined}
              >
                <div
                  className="card-icon"
                  style={{
                    background: `${item.color}18`,
                    color: item.color,
                  }}
                >
                  <Icon size={22} />
                </div>

                <span
                  className="card-tag"
                  style={{ color: item.color }}
                >
                  {item.tag}
                </span>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <strong style={{ fontSize: "17px" }}>
                    {item.title}
                  </strong>

                  {!item.disabled && (
                    <ArrowUpRight size={17} color="#77778E" />
                  )}
                </div>

                <p
                  style={{
                    color: "#9996B5",
                    fontSize: "12px",
                    lineHeight: 1.6,
                    margin: "9px 0 0",
                  }}
                >
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>

        <section
          style={{
            marginTop: "30px",
            padding: "22px",
            borderRadius: "16px",
            border: "1px solid #302B4C",
            background: "#151629",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                color: "#22D3EE",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "1.5px",
              }}
            >
              YOUR ACCOUNT
            </div>

            <div style={{ fontWeight: 700, marginTop: "8px" }}>
              {displayName}
            </div>

            <div
              style={{
                color: "#9996B5",
                fontSize: "12px",
                marginTop: "4px",
              }}
            >
              {user.email}
            </div>
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
