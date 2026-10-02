"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getOperatorByUserId, updateOperatorPlan, updateOperatorProfile } from "@/lib/data/operators";
import { getLeadById, getLeadsForOperator, updateLeadStatus } from "@/lib/data/leads";
import { createSpace, getSpacesByOperator, NewSpaceInput, updateSpaceStatus } from "@/lib/data/spaces";
import { LeadStatus, PlanTier, SpaceStatus } from "@/lib/types";

async function assertOwnsLead(leadId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "operator") throw new Error("Not authorized.");
  const operator = getOperatorByUserId(user.id);
  if (!operator) throw new Error("Not authorized.");
  const owns = getLeadsForOperator(operator.id).some((r) => r.lead.id === leadId);
  if (!owns) throw new Error("You don't have access to this lead.");
  return operator;
}

export async function updateLeadStatusAction(leadId: string, status: LeadStatus, note?: string) {
  await assertOwnsLead(leadId);
  const lead = updateLeadStatus(leadId, status, note);
  revalidatePath("/operator/leads");
  revalidatePath(`/operator/leads/${leadId}`);
  return lead;
}

export async function addLeadNoteAction(leadId: string, note: string) {
  await assertOwnsLead(leadId);
  const lead = getLeadById(leadId);
  if (!lead) return null;
  updateLeadStatus(leadId, lead.status, note);
  revalidatePath(`/operator/leads/${leadId}`);
  return lead;
}

async function requireOperator() {
  const user = await getCurrentUser();
  if (!user || user.role !== "operator") throw new Error("Not authorized.");
  const operator = getOperatorByUserId(user.id);
  if (!operator) throw new Error("Not authorized.");
  return operator;
}

export async function updateOperatorProfileAction(fields: {
  companyName: string;
  contactEmail: string;
  contactPhone: string;
}) {
  const operator = await requireOperator();
  const updated = updateOperatorProfile(operator.id, fields);
  revalidatePath("/operator/settings");
  return updated;
}

export async function updateOperatorPlanAction(plan: PlanTier) {
  const operator = await requireOperator();
  const updated = updateOperatorPlan(operator.id, plan);
  revalidatePath("/operator/settings");
  return updated;
}

export async function createSpaceAction(input: NewSpaceInput, status: SpaceStatus) {
  const operator = await requireOperator();
  const space = createSpace(operator.id, input, status);
  revalidatePath("/operator/spaces");
  redirect(`/operator/spaces/${space.id}`);
}

export async function updateSpaceStatusAction(spaceId: string, status: SpaceStatus) {
  const operator = await requireOperator();
  const owns = getSpacesByOperator(operator.id).some((s) => s.id === spaceId);
  if (!owns) throw new Error("You don't have access to this space.");
  const space = updateSpaceStatus(spaceId, status);
  revalidatePath("/operator/spaces");
  revalidatePath(`/operator/spaces/${spaceId}`);
  return space;
}
