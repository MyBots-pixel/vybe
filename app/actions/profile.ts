"use server";

import { createClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const username = String(formData.get("username") || "").trim().toLowerCase();
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
    .update({
      username,
      display_name: displayName,
      bio,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    if (error.code === "23505") {
      redirect("/profile?error=That%20username%20is%20already%20taken");
    }

    redirect(`/profile?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/profile?success=Profile%20updated%20successfully");
}

export async function updateProfileImages(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  const uploads = [
    {
      field: "avatar",
      bucket: "avatars",
      column: "avatar_url",
      maxSize: 5 * 1024 * 1024,
    },
    {
      field: "banner",
      bucket: "banners",
      column: "banner_url",
      maxSize: 8 * 1024 * 1024,
    },
  ] as const;

  for (const item of uploads) {
    const file = formData.get(item.field);

    if (!(file instanceof File) || file.size === 0) {
      continue;
    }

    if (!allowedTypes.includes(file.type)) {
      redirect("/profile?error=Please%20use%20a%20JPG%2C%20PNG%2C%20WebP%20or%20GIF%20image");
    }

    if (file.size > item.maxSize) {
      redirect(`/profile?error=${item.field === "avatar" ? "Profile%20picture" : "Banner"}%20file%20is%20too%20large`);
    }

    const extension = file.type === "image/jpeg"
      ? "jpg"
      : file.type.split("/")[1];

    const path = `${user.id}/${Date.now()}-${item.field}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(item.bucket)
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      redirect(`/profile?error=${encodeURIComponent(uploadError.message)}`);
    }

    const { data: publicUrl } = supabase.storage
      .from(item.bucket)
      .getPublicUrl(path);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        [item.column]: publicUrl.publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      redirect(`/profile?error=${encodeURIComponent(updateError.message)}`);
    }
  }

  redirect("/profile?success=Your%20images%20have%20been%20updated");
}
