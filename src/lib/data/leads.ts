import { DB } from "@/lib/mock-data";
import { daysAgoIso, makeId } from "@/lib/mock-data/rng";
import { matchLeadToSpaces, scoreLead, SpaceMatchResult } from "@/lib/matching";
import { Lead, LeadMatch, LeadStatus, LEAD_STATUSES, Space, TeamSizeBand } from "@/lib/types";
import { LeadIntakeInput } from "@/lib/validation";

export function createLead(input: LeadIntakeInput, userId: string | null = null): {
  lead: Lead;
  matches: SpaceMatchResult[];
} {
  const now = new Date().toISOString();
  const lead: Lead = {
    id: makeId("lead"),
    userId,
    city: input.city as Lead["city"],
    neighborhoods: input.neighborhoods,
    workspaceType: input.workspaceType as Lead["workspaceType"],
    teamSize: input.teamSize as Lead["teamSize"],
    budgetMin: input.budgetMin,
    budgetMax: input.budgetMax,
    moveIn: input.moveIn as Lead["moveIn"],
    amenities: input.amenities as Lead["amenities"],
    contactName: input.contactName,
    company: input.company,
    email: input.email,
    phone: input.phone,
    jobTitle: input.jobTitle,
    status: "new",
    assignedSpaceId: null,
    createdAt: now,
    updatedAt: now,
  };

  DB.leads.unshift(lead);
  DB.statusHistory.push({
    id: makeId("hist"),
    leadId: lead.id,
    status: "new",
    createdAt: now,
  });

  const matches = matchLeadToSpaces(lead, DB.spaces, 12);
  for (const result of matches) {
    const match: LeadMatch = {
      id: makeId("match"),
      leadId: lead.id,
      spaceId: result.space.id,
      score: result.score,
      band: result.band,
      breakdown: result.breakdown,
      createdAt: now,
    };
    DB.leadMatches.push(match);
  }

  // Notify the operators behind every matched space — this is the "send to
  // relevant operators only" rule from the matching engine in effect.
  const notifiedOperators = new Set<string>();
  for (const result of matches.slice(0, 6)) {
    const operator = DB.operators.find((o) => o.id === result.space.operatorId);
    if (!operator || notifiedOperators.has(operator.id)) continue;
    notifiedOperators.add(operator.id);
    DB.notifications.push({
      id: makeId("notif"),
      userId: operator.userId,
      title: `New lead from ${lead.company}`,
      body: `${lead.contactName} is looking for ${lead.workspaceType.replace("_", " ")} space in ${lead.city}.`,
      href: "/operator/leads",
      readAt: null,
      createdAt: now,
    });
  }

  return { lead, matches };
}

export interface DirectLeadInput {
  name: string;
  email: string;
  phone: string;
  company: string;
  teamSize: TeamSizeBand;
  message?: string;
}

/**
 * A lightweight lead created from a specific space's "Request a quote" /
 * "Schedule a tour" CTA, rather than the full matching-engine funnel. The
 * space is already chosen, so we skip qualification and go straight to a
 * conversation with that space's operator.
 */
export function createDirectLead(space: Space, input: DirectLeadInput, userId: string | null = null) {
  const now = new Date().toISOString();
  const workspaceType = space.workspaceTypes[0];
  const option = space.workspaceOptions.find((o) => o.type === workspaceType);
  const price = option?.priceMonthly ?? space.startingPrice;

  const lead: Lead = {
    id: makeId("lead"),
    userId,
    city: space.city,
    neighborhoods: [space.neighborhood],
    workspaceType,
    teamSize: input.teamSize,
    budgetMin: Math.round(price * 0.8),
    budgetMax: Math.round(price * 1.3),
    moveIn: "1_3_months",
    amenities: [],
    contactName: input.name,
    company: input.company,
    email: input.email,
    phone: input.phone,
    jobTitle: "",
    status: "new",
    assignedSpaceId: space.id,
    createdAt: now,
    updatedAt: now,
  };
  DB.leads.unshift(lead);
  DB.statusHistory.push({ id: makeId("hist"), leadId: lead.id, status: "new", createdAt: now });

  const scored = scoreLead(lead, space);
  const match: LeadMatch = {
    id: makeId("match"),
    leadId: lead.id,
    spaceId: space.id,
    score: scored.score,
    band: scored.band,
    breakdown: scored.breakdown,
    createdAt: now,
  };
  DB.leadMatches.push(match);

  const conversationId = makeId("conv");
  DB.conversations.push({
    id: conversationId,
    leadId: lead.id,
    spaceId: space.id,
    userId: userId ?? "guest",
    operatorId: space.operatorId,
    createdAt: now,
  });
  if (input.message) {
    DB.messages.push({
      id: makeId("msg"),
      conversationId,
      senderRole: "seeker",
      senderName: input.name,
      body: input.message,
      readAt: null,
      createdAt: now,
    });
  }

  const operator = DB.operators.find((o) => o.id === space.operatorId);
  if (operator) {
    DB.notifications.push({
      id: makeId("notif"),
      userId: operator.userId,
      title: `New lead from ${input.company}`,
      body: `${input.name} requested a quote for ${space.name}.`,
      href: "/operator/leads",
      readAt: null,
      createdAt: now,
    });
  }

  return { lead, match };
}

export function getLeadById(id: string): Lead | undefined {
  return DB.leads.find((l) => l.id === id);
}

export function getLeadsForSeeker(userId: string): Lead[] {
  return DB.leads
    .filter((l) => l.userId === userId)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export function getMatchesForLead(leadId: string): (LeadMatch & { space: ReturnType<typeof getSpaceFor> })[] {
  return DB.leadMatches
    .filter((m) => m.leadId === leadId)
    .sort((a, b) => b.score - a.score)
    .map((m) => ({ ...m, space: getSpaceFor(m.spaceId) }));
}

function getSpaceFor(spaceId: string) {
  return DB.spaces.find((s) => s.id === spaceId);
}

export function getStatusHistory(leadId: string) {
  return DB.statusHistory
    .filter((h) => h.leadId === leadId)
    .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
}

/** All leads whose top matches point at spaces this operator owns. */
export function getLeadsForOperator(operatorId: string) {
  const operatorSpaceIds = new Set(DB.spaces.filter((s) => s.operatorId === operatorId).map((s) => s.id));
  const leadIds = new Set(
    DB.leadMatches.filter((m) => operatorSpaceIds.has(m.spaceId)).map((m) => m.leadId)
  );
  return DB.leads
    .filter((l) => leadIds.has(l.id))
    .map((lead) => {
      const match = DB.leadMatches
        .filter((m) => m.leadId === lead.id && operatorSpaceIds.has(m.spaceId))
        .sort((a, b) => b.score - a.score)[0];
      return { lead, match, space: match ? getSpaceFor(match.spaceId) : undefined };
    })
    .sort((a, b) => Date.parse(b.lead.createdAt) - Date.parse(a.lead.createdAt));
}

export function updateLeadStatus(leadId: string, status: LeadStatus, note?: string): Lead | undefined {
  const lead = DB.leads.find((l) => l.id === leadId);
  if (!lead) return undefined;
  if (!LEAD_STATUSES.includes(status)) return lead;

  lead.status = status;
  lead.updatedAt = new Date().toISOString();
  DB.statusHistory.push({
    id: makeId("hist"),
    leadId,
    status,
    note,
    createdAt: new Date().toISOString(),
  });
  return lead;
}

export function getOperatorLeadMetrics(operatorId: string) {
  const rows = getLeadsForOperator(operatorId);
  const total = rows.length;
  const qualified = rows.filter((r) =>
    ["qualified", "tour_scheduled", "proposal", "won"].includes(r.lead.status)
  ).length;
  const tours = rows.filter((r) => ["tour_scheduled", "proposal", "won"].includes(r.lead.status)).length;
  const won = rows.filter((r) => r.lead.status === "won").length;
  const contacted = rows.filter((r) => r.lead.status !== "new").length;
  const responseRate = total ? Math.round((contacted / total) * 100) : 0;
  const conversionRate = total ? Math.round((won / total) * 100) : 0;
  const revenueInfluenced = rows
    .filter((r) => r.lead.status === "won" && r.space)
    .reduce((sum, r) => sum + (r.space?.startingPrice ?? 0), 0);

  return { total, qualified, tours, won, responseRate, conversionRate, revenueInfluenced };
}

export function leadsOverTime(operatorId: string, days = 30) {
  const rows = getLeadsForOperator(operatorId);
  const buckets: { date: string; value: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = daysAgoIso(i).slice(0, 10);
    const value = rows.filter((r) => r.lead.createdAt.slice(0, 10) === date).length;
    buckets.push({ date, value });
  }
  return buckets;
}

export function conversionFunnel(operatorId: string) {
  const rows = getLeadsForOperator(operatorId).map((r) => r.lead);
  const stageOrder: LeadStatus[] = ["new", "contacted", "qualified", "tour_scheduled", "proposal", "won"];
  return stageOrder.map((stage, idx) => ({
    stage: stage.replace("_", " "),
    count: rows.filter((l) => {
      const leadIdx = stageOrder.indexOf(l.status);
      return leadIdx >= idx || l.status === "won";
    }).length,
  }));
}
