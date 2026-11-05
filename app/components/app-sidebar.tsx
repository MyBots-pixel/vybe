
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Newspaper,
  UserRound,
  Settings,
  Compass,
  MessageCircle,
  Bell,
  Sparkles,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: House },
  { label: "Your Feed", href: "/feed", icon: Newspaper },
  { label: "Explore", href: "/explore", icon: Compass, comingSoon: true },
  { label: "Messages", href: "/messages", icon: MessageCircle, comingSoon: true },
  { label: "Notifications", href: "/notifications", icon: Bell, comingSoon: true },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="vybe-sidebar">
      <Link href="/" className="vybe-logo">
        VYBE<span>.</span>
      </Link>

      <div className="sidebar-section">MENU</div>

      <nav className="sidebar-navigation">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.comingSoon ? "#" : item.href}
              onClick={item.comingSoon ? (event) => event.preventDefault() : undefined}
              className={`sidebar-link ${active ? "active" : ""} ${item.comingSoon ? "disabled" : ""}`}
            >
              <Icon size={19} />
              <span>{item.label}</span>
              {item.comingSoon && <small>SOON</small>}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-section account-heading">ACCOUNT</div>

      <nav className="sidebar-navigation">
        <Link
          href="/profile"
          className={`sidebar-link ${pathname === "/profile" ? "active" : ""}`}
        >
          <UserRound size={19} />
          <span>My Profile</span>
        </Link>

        <Link
          href="/settings"
          className={`sidebar-link ${pathname.startsWith("/settings") ? "active" : ""}`}
        >
          <Settings size={19} />
          <span>Settings</span>
        </Link>
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-promo">
          <Sparkles size={21} color="#22D3EE" />
          <strong>Your people.</strong>
          <span>Your world.</span>
          <small>WELCOME TO VYBE</small>
        </div>
        <div className="sidebar-version">VYBE · YOUR WORLD</div>
      </div>

      <style jsx>{`
        .vybe-sidebar {
          width: 245px;
          min-width: 245px;
          min-height: 100vh;
          height: 100%;
          position: sticky;
          top: 0;
          align-self: flex-start;
          background: #10101f;
          border-right: 1px solid #28253e;
          padding: 30px 17px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          font-family: Arial, sans-serif;
        }

        .vybe-logo {
          color: white;
          font-size: 31px;
          font-weight: 950;
          letter-spacing: -1.5px;
          text-decoration: none;
          padding: 0 13px 42px;
        }

        .vybe-logo span {
          color: #22d3ee;
        }

        .sidebar-section {
          color: #77778e;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
          padding: 0 13px 13px;
        }

        .sidebar-navigation {
          display: grid;
          gap: 7px;
        }

        .sidebar-link {
          min-height: 47px;
          padding: 0 13px;
          display: flex;
          align-items: center;
          gap: 13px;
          border-radius: 11px;
          color: #aaa8c1;
          text-decoration: none;
          font-size: 14px;
          font-weight: 650;
          transition: background 160ms ease, color 160ms ease;
        }

        .sidebar-link:hover {
          background: #211e35;
          color: white;
        }

        .sidebar-link.active {
          background: linear-gradient(100deg, #38265f, #202d49);
          color: white;
          box-shadow: inset 3px 0 #9b6dff;
        }

        .sidebar-link.active :global(svg) {
          color: #22d3ee;
        }

        .sidebar-link.disabled {
          opacity: 0.45;
          cursor: default;
        }

        .sidebar-link small {
          margin-left: auto;
          font-size: 8px;
          letter-spacing: 1px;
          color: #22d3ee;
        }

        .account-heading {
          margin-top: 35px;
        }

        .sidebar-bottom {
          margin-top: auto;
        }

        .sidebar-promo {
          display: flex;
          flex-direction: column;
          gap: 7px;
          padding: 18px;
          border: 1px solid #393052;
          border-radius: 14px;
          background: linear-gradient(145deg, #211a3b, #111c2b);
          color: white;
          font-size: 15px;
        }

        .sidebar-promo strong {
          margin-top: 9px;
        }

        .sidebar-promo span {
          color: #aaa8c1;
        }

        .sidebar-promo small {
          margin-top: 8px;
          color: #22d3ee;
          font-size: 9px;
          letter-spacing: 1.5px;
        }

        .sidebar-version {
          color: #65627b;
          font-size: 9px;
          letter-spacing: 1.5px;
          text-align: center;
          margin-top: 22px;
        }

        @media (max-width: 700px) {
          .vybe-sidebar {
            position: fixed;
            z-index: 50;
            top: auto;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            min-width: 0;
            min-height: 0;
            height: 67px;
            padding: 6px 8px;
            border-right: none;
            border-top: 1px solid #28253e;
            display: block;
          }

          .vybe-logo,
          .sidebar-section,
          .sidebar-bottom {
            display: none;
          }

          .sidebar-navigation {
            height: 100%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            gap: 2px;
          }

          .sidebar-link {
            flex: 1;
            min-height: 52px;
            padding: 5px 2px;
            flex-direction: column;
            justify-content: center;
            gap: 4px;
            font-size: 9px;
            text-align: center;
          }

          .sidebar-link small {
            display: none;
          }

          .account-heading + .sidebar-navigation {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
}
