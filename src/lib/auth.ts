import "server-only";
import { cookies } from "next/headers";
import { DB } from "@/lib/mock-data";
import { makeId } from "@/lib/mock-data/rng";
import { Profile, Role } from "@/lib/types";
import { isDemoMode } from "@/lib/config";

const SESSION_COOKIE = "workly_uid";

/**
 * Demo-mode auth. Workly must run with zero external credentials (see
 * `lib/config#isDemoMode`), so instead of Supabase Auth this stores a
 * profile id in an httpOnly cookie and resolves it against the seeded
 * in-memory DB. `getCurrentUser` is the single integration point: once a
 * Supabase project is connected, this swaps to
 * `(await createClient()).auth.getUser()` + a profile lookup, and every
 * call site (layouts, server actions, pages) stays unchanged.
 */
export async function getCurrentUser(): Promise<Profile | null> {
  const cookieStore = await cookies();
  const uid = cookieStore.get(SESSION_COOKIE)?.value;
  if (!uid) return null;
  return DB.users.all.find((u) => u.id === uid) ?? null;
}

export async function requireUser(): Promise<Profile> {
  const user = await getCurrentUser();
  if (!user) throw new AuthError("Not signed in.");
  return user;
}

export async function requireRole(role: Role): Promise<Profile> {
  const user = await requireUser();
  if (user.role !== role) {
    throw new AuthError(`This area requires a ${role} account.`);
  }
  return user;
}

export class AuthError extends Error {}

export async function setSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/** Demo-mode "login": match an existing seeded/created profile by email. */
export function findProfileByEmail(email: string): Profile | undefined {
  return DB.users.all.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

/** Demo-mode "signup": create a brand-new profile and sign in as them. */
export function createProfile(input: {
  fullName: string;
  email: string;
  role: Role;
  company?: string;
}): Profile {
  const profile: Profile = {
    id: makeId("user"),
    role: input.role,
    fullName: input.fullName,
    email: input.email,
    company: input.company,
    createdAt: new Date().toISOString(),
  };
  DB.users.all.push(profile);
  if (profile.role === "seeker") DB.users.seekerProfiles.push(profile);
  if (profile.role === "operator") DB.users.operatorProfiles.push(profile);
  return profile;
}

export const DEMO_ACCOUNTS = isDemoMode
  ? {
      admin: DB.users.admin,
      operator: DB.users.operatorProfiles[0],
      seeker: DB.users.seekerProfiles[0],
    }
  : null;
