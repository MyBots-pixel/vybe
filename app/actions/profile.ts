"use server";

import { createClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const username = String(formData.get("username") || "")
    .trim()
    .toLowerCase();

  const displayName = String(formData.get("display_name") || "").trim();
  const bio = String(formData.get("bio") || "").trim();

  if (!/^[a-z0-9_]{3,20}$/.test(username)) {
    redirect("/profile?error=Username%20must%20be%203-20%20characters%20using%20letters%2C%20numbers%20or%20underscores");
  }

  if (!displayName || displayName.length > 40) {
    redirect("/profile?error=Display%20name%20must%20be%201-40%20characters");
  }

  if (bio.length > 160) {
    redirect("/profile?error=Bio%20must%20be%20160%20characters%20or%20less");
  }

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      username,
      display_name: displayName,
      bio,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    if (error.code === "23505") {
      redirect("/profile?error=That%20username%20is%20already%20taken");
    }

    redirect(`/profile?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/profile?success=Profile%20updated%20successfully");
}
