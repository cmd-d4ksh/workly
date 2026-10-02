"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  clearSession,
  createProfile,
  findProfileByEmail,
  setSession,
} from "@/lib/auth";
import { sendEmail, EMAIL_TEMPLATES } from "@/lib/email";
import { Role } from "@/lib/types";

const ROLE_HOME: Record<Role, string> = {
  seeker: "/dashboard",
  operator: "/operator",
  admin: "/admin",
};

export interface AuthActionState {
  error?: string;
}

/**
 * Demo-mode login: looks the email up against seeded/created profiles.
 * There is no real password check here — see README § Demo mode. Once
 * Supabase is connected, this becomes `supabase.auth.signInWithPassword`.
 */
export async function loginAction(_prev: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Enter your email." };

  const profile = findProfileByEmail(email);
  if (!profile) {
    return { error: "No account found with that email. Try signing up instead." };
  }

  await setSession(profile.id);
  redirect(ROLE_HOME[profile.role]);
}

export async function signupAction(_prev: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const role = (String(formData.get("role") ?? "seeker") as Role) ?? "seeker";

  if (!fullName || !email) {
    return { error: "Name and email are required." };
  }
  if (findProfileByEmail(email)) {
    return { error: "An account with that email already exists. Log in instead." };
  }

  const profile = createProfile({ fullName, email, role, company: company || undefined });
  await setSession(profile.id);
  await sendEmail("welcome", { ...EMAIL_TEMPLATES.welcome(fullName), to: email });

  redirect(role === "operator" ? "/operator" : ROLE_HOME[profile.role]);
}

/** One-click demo sign-in used on /login — see DEMO_ACCOUNTS in lib/auth.ts. */
export async function demoLoginAction(formData: FormData) {
  const userId = String(formData.get("userId") ?? "");
  if (!userId) return;
  await setSession(userId);
  const role = String(formData.get("role") ?? "seeker") as Role;
  redirect(ROLE_HOME[role]);
}

export async function logoutAction() {
  await clearSession();
  revalidatePath("/");
  redirect("/");
}
