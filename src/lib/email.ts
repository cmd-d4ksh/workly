import "server-only";
import { Resend } from "resend";
import { hasResend } from "@/lib/config";

export type EmailEvent =
  | "new_lead"
  | "lead_response"
  | "tour_confirmation"
  | "operator_approval"
  | "welcome"
  | "password_reset";

interface SendEmailInput {
  to: string;
  subject: string;
  heading: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
}

function renderTemplate({ heading, body, ctaLabel, ctaHref }: SendEmailInput): string {
  return `
  <div style="font-family: -apple-system, 'Segoe UI', sans-serif; background:#f6f6f4; padding:32px 0;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;border:1px solid #eceae4;">
      <p style="font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#0a6847;font-weight:700;margin:0 0 16px;">Workly</p>
      <h1 style="font-size:20px;margin:0 0 12px;color:#111;">${heading}</h1>
      <p style="font-size:14px;line-height:1.6;color:#44433e;margin:0 0 24px;">${body}</p>
      ${
        ctaLabel && ctaHref
          ? `<a href="${ctaHref}" style="display:inline-block;background:#0a6847;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:10px 20px;border-radius:10px;">${ctaLabel}</a>`
          : ""
      }
      <p style="font-size:12px;color:#9a988f;margin-top:32px;">Workly · Find your next workspace. Fill your next desk.</p>
    </div>
  </div>`;
}

/**
 * Sends (or mocks) a transactional email. In demo mode this just logs the
 * rendered email server-side instead of calling Resend — the UI flow that
 * triggers it still runs to completion either way.
 */
export async function sendEmail(event: EmailEvent, input: SendEmailInput): Promise<{ mode: "live" | "mock" }> {
  const html = renderTemplate(input);

  if (!hasResend) {
    console.info(`[email:mock] (${event}) -> ${input.to}: ${input.subject}`);
    return { mode: "mock" };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "Workly <notifications@workly.example.com>",
    to: input.to,
    subject: input.subject,
    html,
  });
  return { mode: "live" };
}

export const EMAIL_TEMPLATES = {
  newLead: (operatorEmail: string, leadCompany: string): SendEmailInput => ({
    to: operatorEmail,
    subject: `New lead from ${leadCompany}`,
    heading: "You've got a new lead",
    body: `${leadCompany} just submitted a workspace request that matches one of your listings. Respond quickly — leads that get a same-day reply are far more likely to convert.`,
    ctaLabel: "View lead",
    ctaHref: "/operator/leads",
  }),
  welcome: (name: string): SendEmailInput => ({
    to: "",
    subject: "Welcome to Workly",
    heading: `Welcome, ${name.split(" ")[0]}`,
    body: "Your Workly account is ready. Start by telling us what kind of workspace you're looking for, and we'll match you with relevant spaces.",
    ctaLabel: "Find a workspace",
    ctaHref: "/search",
  }),
} as const;
