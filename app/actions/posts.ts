
"use server";

import { createClient } from "../../lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Please log in." };

  const content = String(formData.get("content") || "").trim();

  if (!content) {
    return { success: false, error: "Write something before posting." };
  }

  if (content.length > 2000) {
    return { success: false, error: "Your post is too long." };
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({
      user_id: user.id,
      content,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath("/feed");

  return { success: true, post: data };
}

export async function toggleLike(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Please log in." };

  const postId = String(formData.get("post_id") || "");

  if (!postId) return { success: false, error: "Post not found." };

  const { data: existingLike, error: lookupError } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (lookupError) {
    return { success: false, error: lookupError.message };
  }

  if (existingLike) {
    const { error } = await supabase
      .from("post_likes")
      .delete()
      .eq("id", existingLike.id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/feed");
    return { success: true, liked: false };
  }

  const { error } = await supabase.from("post_likes").insert({
    post_id: postId,
    user_id: user.id,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/feed");
  return { success: true, liked: true };
}

export async function addComment(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Please log in." };

  const postId = String(formData.get("post_id") || "");
  const content = String(formData.get("content") || "").trim();

  if (!postId || !content) {
    return { success: false, error: "Please write a comment." };
  }

  if (content.length > 1000) {
    return { success: false, error: "Your comment is too long." };
  }

  const { data, error } = await supabase
    .from("post_comments")
    .insert({
      post_id: postId,
      user_id: user.id,
      content,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath("/feed");

  return { success: true, comment: data };
}

export async function deletePost(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Please log in." };

  const postId = String(formData.get("post_id") || "");

  if (!postId) return { success: false, error: "Post not found." };

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/feed");

  return { success: true };
}
