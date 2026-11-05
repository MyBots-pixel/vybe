"use server";

import { createClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const content = String(formData.get("content") || "").trim();

  if (!content) {
    redirect("/feed?error=Write%20something%20before%20posting");
  }

  if (content.length > 2000) {
    redirect("/feed?error=Your%20post%20is%20too%20long");
  }

  const { error } = await supabase.from("posts").insert({
    user_id: user.id,
    content,
  });

  if (error) {
    redirect(`/feed?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/feed?success=Your%20post%20has%20been%20published");
}

export async function toggleLike(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const postId = String(formData.get("post_id") || "");

  if (!postId) redirect("/feed");

  const { data: existingLike } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingLike) {
    await supabase
      .from("post_likes")
      .delete()
      .eq("id", existingLike.id);
  } else {
    await supabase.from("post_likes").insert({
      post_id: postId,
      user_id: user.id,
    });
  }

  redirect("/feed");
}

export async function addComment(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const postId = String(formData.get("post_id") || "");
  const content = String(formData.get("content") || "").trim();

  if (!postId || !content) {
    redirect("/feed?error=Please%20write%20a%20comment");
  }

  if (content.length > 1000) {
    redirect("/feed?error=Your%20comment%20is%20too%20long");
  }

  const { error } = await supabase.from("post_comments").insert({
    post_id: postId,
    user_id: user.id,
    content,
  });

  if (error) {
    redirect(`/feed?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/feed");
}

export async function deletePost(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const postId = String(formData.get("post_id") || "");

  if (!postId) redirect("/feed");

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", user.id);

  if (error) {
    redirect(`/feed?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/feed?success=Post%20deleted");
}
