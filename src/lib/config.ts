/**
 * Central app configuration. Reading these in one place makes it obvious
 * which features depend on which external credentials, and keeps every
 * "is this key configured" check consistent across the app.
 */

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const APP_NAME = "Workly";
export const APP_TAGLINE = "Find your next workspace. Fill your next desk.";

export const hasSupabase = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const hasStripe = Boolean(process.env.STRIPE_SECRET_KEY);
export const hasResend = Boolean(process.env.RESEND_API_KEY);
export const hasMapbox = Boolean(process.env.NEXT_PUBLIC_MAPBOX_TOKEN);

/**
 * Workly runs fully on seeded mock data whenever Supabase isn't configured,
 * so the product is demoable with zero external setup (see README § Demo mode).
 * Every data-layer function in `lib/data` branches on this flag.
 */
export const isDemoMode = !hasSupabase;
