import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { hasSupabase } from "@/lib/config";

/**
 * Server-side Supabase client (Server Components / Server Actions / Route
 * Handlers only — never import this from a Client Component). Reads/writes
 * the Supabase auth cookie via Next's `cookies()`.
 *
 * TODO(supabase): once a project is connected, every function in
 * `lib/data/*` should branch on `isDemoMode` and call
 * `(await createClient()).from(...)` here instead of reading `DB` directly.
 * The exported function signatures in `lib/data` were designed to stay
 * identical either way.
 */
export async function createClient() {
  if (!hasSupabase) {
    throw new Error("Supabase is not configured — this app is running in demo mode.");
  }
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component with no response to write to —
            // safe to ignore as long as middleware refreshes the session.
          }
        },
      },
    }
  );
}

/**
 * Service-role client for privileged server-only operations (webhooks,
 * admin actions). NEVER import this from a Client Component — the key is
 * only ever read on the server, and only exists when explicitly configured.
 */
export async function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }
  // Imported lazily so the service-role key is never bundled client-side.
  const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");
  return createSupabaseClient(url, serviceKey, { auth: { persistSession: false } });
}
