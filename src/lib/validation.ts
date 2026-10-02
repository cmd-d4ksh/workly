import { z } from "zod";
import {
  AMENITY_KEYS,
  CITIES,
  WORKSPACE_TYPES,
} from "@/lib/types";

/**
 * Shared Zod schemas for the lead-generation funnel. Used on both the
 * client (step-by-step form validation) and the server action that
 * persists the lead, so a request can never bypass validation by calling
 * the action directly.
 */
export const leadIntakeSchema = z.object({
  city: z.enum(CITIES as unknown as [string, ...string[]]),
  neighborhoods: z.array(z.string()).default([]),
  workspaceType: z.enum(WORKSPACE_TYPES as unknown as [string, ...string[]]),
  teamSize: z.enum(["1", "2-5", "6-10", "11-25", "26-50", "50+"]),
  budgetMin: z.coerce.number().int().min(0),
  budgetMax: z.coerce.number().int().min(0),
  moveIn: z.enum(["immediately", "30_days", "1_3_months", "3_plus_months"]),
  amenities: z.array(z.enum(AMENITY_KEYS as unknown as [string, ...string[]])).default([]),
  contactName: z.string().min(2, "Enter your full name"),
  company: z.string().min(1, "Enter your company name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  jobTitle: z.string().min(1, "Enter your job title"),
}).refine((data) => data.budgetMax >= data.budgetMin, {
  message: "Maximum budget must be at least the minimum",
  path: ["budgetMax"],
});

export type LeadIntakeInput = z.infer<typeof leadIntakeSchema>;

export const leadStatusUpdateSchema = z.object({
  leadId: z.string().min(1),
  status: z.enum([
    "new",
    "contacted",
    "qualified",
    "tour_scheduled",
    "proposal",
    "won",
    "lost",
  ]),
  note: z.string().max(2000).optional(),
});

export const messageSchema = z.object({
  conversationId: z.string().min(1),
  body: z.string().min(1).max(4000),
});
