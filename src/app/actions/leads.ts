"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { createDirectLead } from "@/lib/data/leads";
import { scheduleTour } from "@/lib/data/tours";
import { createLead } from "@/lib/data/leads";
import { getSpaceById } from "@/lib/data/spaces";
import { leadIntakeSchema } from "@/lib/validation";
import { sendEmail, EMAIL_TEMPLATES } from "@/lib/email";
import { getOperatorById } from "@/lib/data/operators";

const contactSchema = z.object({
  spaceId: z.string().min(1),
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  company: z.string().min(1, "Enter your company"),
  teamSize: z.enum(["1", "2-5", "6-10", "11-25", "26-50", "50+"]),
  message: z.string().max(1000).optional(),
  tourDate: z.string().optional(),
});

export interface ContactActionState {
  error?: string;
  success?: boolean;
}

export async function contactSpaceAction(
  _prev: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }
  const data = parsed.data;
  const space = getSpaceById(data.spaceId);
  if (!space) return { error: "This space is no longer available." };

  const user = await getCurrentUser();
  const { lead } = createDirectLead(
    space,
    { name: data.name, email: data.email, phone: data.phone, company: data.company, teamSize: data.teamSize, message: data.message },
    user?.id ?? null
  );

  if (data.tourDate) {
    scheduleTour(lead.id, space.id, data.tourDate);
  }

  const operator = getOperatorById(space.operatorId);
  if (operator) {
    await sendEmail("new_lead", { ...EMAIL_TEMPLATES.newLead(operator.contactEmail, data.company) });
  }

  revalidatePath("/operator/leads");
  return { success: true };
}

export interface LeadFunnelResult {
  leadId?: string;
  matchCount?: number;
  error?: string;
}

export async function submitLeadFunnelAction(formData: FormData): Promise<LeadFunnelResult> {
  const raw = Object.fromEntries(formData);
  const parsed = leadIntakeSchema.safeParse({
    ...raw,
    neighborhoods: formData.getAll("neighborhoods"),
    amenities: formData.getAll("amenities"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your answers and try again." };
  }

  const user = await getCurrentUser();
  const { lead, matches } = createLead(parsed.data, user?.id ?? null);

  revalidatePath("/operator/leads");
  return { leadId: lead.id, matchCount: matches.length };
}
