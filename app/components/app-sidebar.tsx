
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
          <Sparkles size={21} />
          <strong>Your people.</strong>
          <span>Your world.</span>
          <small>WELCOME TO VYBE</small>
        </div>
        <div className="sidebar-version">VYBE · YOUR WORLD</div>
      </div>

      <style jsx>{`
        .vybe-sidebar {
          --sidebar-bg: #10101f;
          --sidebar-text: #d5d2e8;
          --sidebar-muted: #aaa7c2;
          --sidebar-heading: #aaa7c2;
          --sidebar-border: #302d49;
          --sidebar-hover: #211e35;
          --sidebar-hover-text: #ffffff;
          --sidebar-active-bg: linear-gradient(100deg, #38265f, #202d49);
          --sidebar-active-text: #ffffff;
          --sidebar-promo-bg: linear-gradient(145deg, #211a3b, #111c2b);
          --sidebar-promo-border: #393052;

          width: 245px;
          min-width: 245px;
          min-height: 100vh;
          height: 100%;
          position: sticky;
          top: 0;
          align-self: flex-start;
          background: var(--sidebar-bg);
          border-right: 1px solid var(--sidebar-border);
          padding: 30px 17px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          font-family: Arial, sans-serif;
          color: var(--sidebar-text);
          transition: background 180ms ease, color 180ms ease;
        }

        .vybe-logo {
          color: var(--sidebar-active-text);
          font-size: 31px;
          font-weight: 950;
          letter-spacing: -1.5px;
          text-decoration: none;
          padding: 0 13px 42px;
        }

        .vybe-logo span {
          color: var(--vybe-accent, #22d3ee);
        }

        .sidebar-section {
          color: var(--sidebar-heading);
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
          color: var(--sidebar-text);
          text-decoration: none;
          font-size: 14px;
          font-weight: 650;
          transition: background 160ms ease, color 160ms ease;
        }

        .sidebar-link svg {
          flex-shrink: 0;
          color: var(--sidebar-muted);
        }

        .sidebar-link:hover {
          background: var(--sidebar-hover);
          color: var(--sidebar-hover-text);
        }

        .sidebar-link:hover svg {
          color: var(--sidebar-hover-text);
        }

        .sidebar-link.active {
          background: var(--sidebar-active-bg);
          color: var(--sidebar-active-text);
          box-shadow: inset 3px 0 var(--vybe-accent, #9b6dff);
        }

        .sidebar-link.active svg {
          color: var(--vybe-accent, #22d3ee);
        }

        .sidebar-link.disabled {
          opacity: 0.7;
          cursor: default;
        }

        .sidebar-link.disabled:hover {
          background: transparent;
          color: var(--sidebar-text);
        }

        .sidebar-link small {
          margin-left: auto;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1px;
          color: var(--vybe-accent, #22d3ee);
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
          border: 1px solid var(--sidebar-promo-border);
          border-radius: 14px;
          background: var(--sidebar-promo-bg);
          color: var(--sidebar-active-text);
          font-size: 15px;
        }

        .sidebar-promo :global(svg) {
          color: var(--cyan);
        }

        .sidebar-promo strong {
          margin-top: 9px;
        }

        .sidebar-promo span {
          color: var(--sidebar-text);
        }

        .sidebar-promo small {
          margin-top: 8px;
          color: var(--cyan);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .sidebar-version {
          color: var(--sidebar-heading);
          font-size: 9px;
          letter-spacing: 1.5px;
          text-align: center;
          margin-top: 22px;
        }

        /* Light theme */
        :global(html[data-resolved-theme="light"]) .vybe-sidebar {
          --sidebar-bg: #ffffff;
          --sidebar-text: #29283d;
          --sidebar-muted: #55536e;
          --sidebar-heading: #65627d;
          --sidebar-border: #deddea;
          --sidebar-hover: #eeeefa;
          --sidebar-hover-text: #17162a;
          --sidebar-active-bg: #ece7fa;
          --sidebar-active-text: #292044;
          --sidebar-promo-bg: linear-gradient(145deg, #f0ebff, #e9f5fa);
          --sidebar-promo-border: #d8d0ed;
        }

        @media (prefers-color-scheme: light) {
          :global(html[data-theme="system"]) .vybe-sidebar {
            --sidebar-bg: #ffffff;
            --sidebar-text: #29283d;
            --sidebar-muted: #55536e;
            --sidebar-heading: #65627d;
            --sidebar-border: #deddea;
            --sidebar-hover: #eeeefa;
            --sidebar-hover-text: #17162a;
            --sidebar-active-bg: #ece7fa;
            --sidebar-active-text: #292044;
            --sidebar-promo-bg: linear-gradient(145deg, #f0ebff, #e9f5fa);
            --sidebar-promo-border: #d8d0ed;
          }
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
            border-top: 1px solid var(--sidebar-border);
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
