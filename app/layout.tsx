
import type { Metadata } from "next";
import "./globals.css";
import { createClient } from "../lib/supabase/server";

export const metadata: Metadata = {
  title: "VYBE",
  description:
    "Connect, discover communities and share your world with VYBE.",
};

const defaultSettings = {
  theme: "dark",
  accent_color: "purple",
  custom_accent_color: "",
  font_size: "medium",
  font_family: "default",
  border_radius: "rounded",
  content_width: "comfortable",
  sidebar_style: "expanded",
  compact_mode: false,
  reduced_motion: false,
};

const accentColours: Record<string, string> = {
  purple: "#8B5CF6",
  cyan: "#22D3EE",
  pink: "#EC4899",
  blue: "#3B82F6",
  green: "#10B981",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let settings = defaultSettings;

  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data } = await supabase
        .from("user_settings")
        .select(
          "theme, accent_color, custom_accent_color, font_size, font_family, border_radius, content_width, sidebar_style, compact_mode, reduced_motion"
        )
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        settings = {
          ...defaultSettings,
          ...data,
        };
      }
    }
  } catch (error) {
    console.error("Unable to load VYBE appearance settings:", error);
  }

  const accent =
    settings.custom_accent_color ||
    accentColours[settings.accent_color] ||
    accentColours.purple;

  return (
    <html
      lang="en"
      data-theme={settings.theme}
      data-resolved-theme={settings.theme === "light" ? "light" : "dark"}
      data-font-size={settings.font_size}
      data-font-family={settings.font_family}
      data-border-radius={settings.border_radius}
      data-content-width={settings.content_width}
      data-sidebar-style={settings.sidebar_style}
      data-compact={String(settings.compact_mode)}
      data-reduced-motion={String(settings.reduced_motion)}
      style={
        {
          "--vybe-accent": accent,
        } as React.CSSProperties
      }
    >
      <body>{children}</body>
    </html>
  );
}
