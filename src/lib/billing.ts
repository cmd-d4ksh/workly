import "server-only";
import Stripe from "stripe";
import { hasStripe } from "@/lib/config";
import { PlanDefinition, PlanTier } from "@/lib/types";

export const PLANS: PlanDefinition[] = [
  {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    leadCap: 5,
    features: ["Up to 5 leads / month", "Basic listing page", "Email notifications"],
  },
  {
    id: "growth",
    name: "Growth",
    priceMonthly: 4999,
    leadCap: 30,
    features: ["Up to 30 leads / month", "Analytics dashboard", "Priority listing placement", "CRM lead tracking"],
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: 12999,
    leadCap: null,
    features: ["Unlimited leads", "Priority lead routing", "Advanced analytics", "Full CRM + team seats", "Dedicated support"],
  },
];

let stripeClient: Stripe | null = null;

function getStripe(): Stripe {
  if (!hasStripe) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return stripeClient;
}

export interface CheckoutResult {
  mode: "live" | "mock";
  url: string | null;
  message: string;
}

/**
 * Starts (or mocks) a subscription checkout. Real Stripe integration is a
 * TODO behind `hasStripe` — the mock path never claims a payment succeeded;
 * it just upgrades the operator's plan locally so the rest of the product
 * (lead caps, analytics gating) can be demoed end-to-end.
 */
export async function startCheckout(
  operatorId: string,
  plan: PlanTier,
  successUrl: string
): Promise<CheckoutResult> {
  if (plan === "free") {
    return { mode: "mock", url: null, message: "Free plan requires no checkout." };
  }

  if (!hasStripe) {
    return {
      mode: "mock",
      url: null,
      message:
        "Demo mode: Stripe isn't configured, so no real payment was processed. Add STRIPE_SECRET_KEY to enable live checkout — see lib/billing.ts.",
    };
  }

  // TODO(stripe): create/reuse a Stripe Customer for this operator, then a
  // Checkout Session for the plan's price id, and return session.url.
  const stripe = getStripe();
  void stripe; // placeholder until price IDs are configured
  return {
    mode: "mock",
    url: successUrl,
    message: "Stripe is configured but price IDs are not wired up yet — see TODO in lib/billing.ts.",
  };
}
