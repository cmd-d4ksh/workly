"use client";

/**
 * Minimal analytics-events abstraction. Every product event the spec calls
 * for funnels through `track()`, so wiring in a real provider (PostHog,
 * Segment, etc.) later is a one-line change in this file — nothing calling
 * `track()` needs to know. In demo mode it just logs to the console.
 */
export type AnalyticsEvent =
  | "search_started"
  | "search_completed"
  | "space_viewed"
  | "space_saved"
  | "lead_started"
  | "lead_submitted"
  | "match_viewed"
  | "operator_contacted"
  | "tour_requested"
  | "tour_scheduled"
  | "lead_qualified"
  | "lead_won"
  | "lead_lost";

export function track(event: AnalyticsEvent, properties: Record<string, unknown> = {}) {
  if (process.env.NODE_ENV !== "production") {
    console.debug(`[analytics] ${event}`, properties);
  }
  // TODO: forward to a real provider once one is configured, e.g.
  // window.posthog?.capture(event, properties);
}
