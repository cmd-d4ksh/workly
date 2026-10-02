import { createBrowserClient } from "@supabase/ssr";
import { hasSupabase } from "@/lib/config";

/**
 * Browser Supabase client. Only call this when `hasSupabase` is true —
 * in demo mode there's no project to connect to, and every data-reading
 * component should be using `lib/data/*` (which transparently falls back
 * to the seeded mock DB) instead of calling Supabase directly.
 */
export function createClient() {
  if (!hasSupabase) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, or use the demo-mode data layer in lib/data instead."
    );
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
