
"use server";

import { createClient } from "../../lib/supabase/server";
import { revalidatePath } from "next/cache";

const allowedSettings = {
  theme: ["dark", "light", "system"],
  accent_color: ["purple", "cyan", "pink", "blue", "green"],
  font_size: ["small", "medium", "large"],
  profile_visibility: ["public", "private"],
} as const;

export async function saveSettings(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Please log in again." };
  }

  const theme = String(formData.get("theme") || "");
  const accentColor = String(formData.get("accent_color") || "");
  const fontSize = String(formData.get("font_size") || "");
  const visibility = String(formData.get("profile_visibility") || "");

  if (
    !allowedSettings.theme.includes(theme as typeof allowedSettings.theme[number]) ||
    !allowedSettings.accent_color.includes(accentColor as typeof allowedSettings.accent_color[number]) ||
    !allowedSettings.font_size.includes(fontSize as typeof allowedSettings.font_size[number]) ||
    !allowedSettings.profile_visibility.includes(visibility as typeof allowedSettings.profile_visibility[number])
  ) {
    return { success: false, error: "One or more settings are invalid." };
  }

  const { error } = await supabase
    .from("user_settings")
    .upsert({
      user_id: user.id,
      theme,
      accent_color: accentColor,
      font_size: fontSize,
      compact_mode: formData.get("compact_mode") === "true",
      reduced_motion: formData.get("reduced_motion") === "true",
      profile_visibility: visibility,
      show_online_status: formData.get("show_online_status") === "true",
      allow_messages: formData.get("allow_messages") === "true",
      email_notifications: formData.get("email_notifications") === "true",
      in_app_notifications: formData.get("in_app_notifications") === "true",
      updated_at: new Date().toISOString(),
    }, {
      onConflict: "user_id",
    });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/settings");
  revalidatePath("/feed");

  return { success: true };
}
