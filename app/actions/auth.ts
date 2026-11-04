"use server";

import { createClient } from "../../lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    redirect("/register?error=Please%20complete%20all%20fields");
  }

  if (password.length < 8) {
    redirect("/register?error=Password%20must%20be%20at%20least%208%20characters");
  }

  const headerList = await headers();
  const origin =
    headerList.get("origin") ||
    `https://${headerList.get("host")}`;

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/register?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?message=Check%20your%20email%20to%20confirm%20your%20account");
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    redirect("/login?error=Please%20enter%20your%20email%20and%20password");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
