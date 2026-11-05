
"use server";

import { createClient } from "../../lib/supabase/server";
import { revalidatePath } from "next/cache";

const allowedSettings = {
  theme: ["dark", "light", "system"],
  accent_color: ["purple", "cyan", "pink", "blue", "green"],
  font_size: ["small", "medium", "large"],
  profile_visibility: ["public", "private"],
  border_radius: ["sharp", "rounded", "round"],
  font_family: ["default", "modern", "classic"],
  content_width: ["compact", "comfortable", "wide"],
  sidebar_style: ["expanded", "compact"],
} as const;

export async function saveSettings(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Please log in again." };
  }

  const values = {
    theme: String(formData.get("theme") || ""),
    accent_color: String(formData.get("accent_color") || ""),
    font_size: String(formData.get("font_size") || ""),
    profile_visibility: String(formData.get("profile_visibility") || ""),
    border_radius: String(formData.get("border_radius") || ""),
    font_family: String(formData.get("font_family") || ""),
    content_width: String(formData.get("content_width") || ""),
    sidebar_style: String(formData.get("sidebar_style") || ""),
  };

  if (
    !allowedSettings.theme.includes(values.theme as typeof allowedSettings.theme[number]) ||
    !allowedSettings.accent_color.includes(values.accent_color as typeof allowedSettings.accent_color[number]) ||
    !allowedSettings.font_size.includes(values.font_size as typeof allowedSettings.font_size[number]) ||
    !allowedSettings.profile_visibility.includes(values.profile_visibility as typeof allowedSettings.profile_visibility[number]) ||
    !allowedSettings.border_radius.includes(values.border_radius as typeof allowedSettings.border_radius[number]) ||
    !allowedSettings.font_family.includes(values.font_family as typeof allowedSettings.font_family[number]) ||
    !allowedSettings.content_width.includes(values.content_width as typeof allowedSettings.content_width[number]) ||
    !allowedSettings.sidebar_style.includes(values.sidebar_style as typeof allowedSettings.sidebar_style[number])
  ) {
    return { success: false, error: "One or more settings are invalid." };
  }

  const customAccentColor = String(
    formData.get("custom_accent_color") || ""
  ).trim();

  if (
    customAccentColor &&
    !/^#[0-9A-Fa-f]{6}$/.test(customAccentColor)
  ) {
    return {
      success: false,
      error: "Custom accent colour must be a valid HEX colour.",
    };
  }

  const { error } = await supabase
    .from("user_settings")
    .upsert(
      {
        user_id: user.id,
        ...values,
        custom_accent_color: customAccentColor,
        compact_mode: formData.get("compact_mode") === "true",
        reduced_motion: formData.get("reduced_motion") === "true",
        show_online_status: formData.get("show_online_status") === "true",
        allow_messages: formData.get("allow_messages") === "true",
        email_notifications: formData.get("email_notifications") === "true",
        in_app_notifications: formData.get("in_app_notifications") === "true",
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    );

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/settings");
  revalidatePath("/feed");
  revalidatePath("/dashboard");
  revalidatePath("/profile");

  return { success: true };
}
