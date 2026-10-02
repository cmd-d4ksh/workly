import {
  Conversation,
  Lead,
  LeadMatch,
  LeadStatusHistoryEntry,
  LEAD_STATUSES,
  Message,
  Notification,
  Operator,
  Profile,
  Review,
  SavedSpace,
  Space,
  Tour,
} from "@/lib/types";
import { matchLeadToSpaces } from "@/lib/matching";
import { createRng, daysAgoIso, makeId } from "./rng";
import { generateOperators } from "./operators";
import { generateSpaces } from "./spaces";
import { generateUsers } from "./users";
import { generateLeads } from "./leads";
import { generateReviews } from "./reviews";

const SEED = 20260214;

function build() {
  const users = generateUsers(SEED);
  const operators = generateOperators(SEED + 1, users.operatorProfiles.map((p) => p.id));
  const spaces = generateSpaces(SEED + 2, operators);
  const leads = generateLeads(SEED + 3, users.seekerProfiles);

  const publishedSpaces = spaces.filter((s) => s.status === "published");
  const reviews = generateReviews(SEED + 4, publishedSpaces, users.seekerProfiles);

  // Roll review counts/ratings up onto each space from its generated reviews.
  const reviewsBySpace = new Map<string, Review[]>();
  for (const review of reviews) {
    const list = reviewsBySpace.get(review.spaceId) ?? [];
    list.push(review);
    reviewsBySpace.set(review.spaceId, list);
  }
  for (const space of spaces) {
    const spaceReviews = reviewsBySpace.get(space.id);
    if (spaceReviews?.length) {
      space.reviewCount = spaceReviews.length;
      space.rating = Math.round(
        (spaceReviews.reduce((sum, r) => sum + r.rating, 0) / spaceReviews.length) * 10
      ) / 10;
    }
  }

  const rng = createRng(SEED + 5);

  // --- Lead matches, computed via the real matching engine -----------------
  const leadMatches: LeadMatch[] = [];
  for (const lead of leads) {
    const results = matchLeadToSpaces(lead, spaces, 12);
    for (const result of results) {
      leadMatches.push({
        id: makeId("match"),
        leadId: lead.id,
        spaceId: result.space.id,
        score: result.score,
        band: result.band,
        breakdown: result.breakdown,
        createdAt: lead.createdAt,
      });
    }
    // Leads that progressed past "qualified" get assigned their top match.
    const advancedStatuses: Lead["status"][] = ["tour_scheduled", "proposal", "won"];
    if (advancedStatuses.includes(lead.status) && results[0]) {
      lead.assignedSpaceId = results[0].space.id;
    }
  }

  // --- Status history --------------------------------------------------------
  const statusHistory: LeadStatusHistoryEntry[] = [];
  for (const lead of leads) {
    const idx = LEAD_STATUSES.indexOf(lead.status);
    const path = lead.status === "lost" ? LEAD_STATUSES.slice(0, rng.int(1, 4)).concat("lost") : LEAD_STATUSES.slice(0, idx + 1);
    path.forEach((status, stepIndex) => {
      statusHistory.push({
        id: makeId("hist"),
        leadId: lead.id,
        status,
        createdAt: daysAgoIso((path.length - stepIndex) * rng.int(1, 4)),
      });
    });
  }

  // --- Conversations + messages for contacted-or-later leads ----------------
  const conversations: Conversation[] = [];
  const messages: Message[] = [];
  const contactedStatuses: Lead["status"][] = ["contacted", "qualified", "tour_scheduled", "proposal", "won", "lost"];
  for (const lead of leads) {
    if (!contactedStatuses.includes(lead.status)) continue;
    const spaceId = lead.assignedSpaceId ?? leadMatches.find((m) => m.leadId === lead.id)?.spaceId;
    if (!spaceId) continue;
    const space = spaces.find((s) => s.id === spaceId);
    if (!space) continue;

    const conversationId = makeId("conv");
    conversations.push({
      id: conversationId,
      leadId: lead.id,
      spaceId,
      userId: lead.userId ?? "guest",
      operatorId: space.operatorId,
      createdAt: lead.createdAt,
    });

    const operatorName = space.name;
    messages.push(
      {
        id: makeId("msg"),
        conversationId,
        senderRole: "operator",
        senderName: operatorName,
        body: `Hi ${lead.contactName.split(" ")[0]}, thanks for your interest in ${space.name}! We have availability that matches your team size and budget — happy to set up a tour this week.`,
        readAt: daysAgoIso(rng.int(0, 5)),
        createdAt: daysAgoIso(rng.int(5, 20)),
      },
      {
        id: makeId("msg"),
        conversationId,
        senderRole: "seeker",
        senderName: lead.contactName,
        body: "That sounds great — could we do Thursday afternoon? Also wanted to confirm the private office includes meeting room credits.",
        readAt: rng.bool(0.6) ? daysAgoIso(rng.int(0, 4)) : null,
        createdAt: daysAgoIso(rng.int(1, 4)),
      }
    );
  }

  // --- Tours for tour_scheduled / proposal / won leads -----------------------
  const tours: Tour[] = [];
  for (const lead of leads) {
    if (!["tour_scheduled", "proposal", "won"].includes(lead.status) || !lead.assignedSpaceId) continue;
    tours.push({
      id: makeId("tour"),
      leadId: lead.id,
      spaceId: lead.assignedSpaceId,
      scheduledFor: lead.status === "won" ? daysAgoIso(rng.int(5, 30)) : daysAgoIso(-rng.int(1, 10)),
      status: lead.status === "won" ? "completed" : rng.bool(0.8) ? "confirmed" : "requested",
      createdAt: lead.createdAt,
    });
  }

  // --- Saved spaces for seeker profiles ---------------------------------------
  const savedSpaces: SavedSpace[] = [];
  for (const seeker of users.seekerProfiles) {
    if (!rng.bool(0.7)) continue;
    const picks = rng.pickMany(publishedSpaces, rng.int(1, 4));
    for (const space of picks) {
      savedSpaces.push({
        id: makeId("saved"),
        userId: seeker.id,
        spaceId: space.id,
        createdAt: daysAgoIso(rng.int(0, 60)),
      });
    }
  }

  // --- Notifications -----------------------------------------------------------
  const notifications: Notification[] = [];
  for (const seeker of users.seekerProfiles) {
    const myLeads = leads.filter((l) => l.userId === seeker.id);
    for (const lead of myLeads.slice(0, 2)) {
      const match = leadMatches.find((m) => m.leadId === lead.id);
      const space = spaces.find((s) => s.id === match?.spaceId);
      if (!space) continue;
      notifications.push({
        id: makeId("notif"),
        userId: seeker.id,
        title: `${leadMatches.filter((m) => m.leadId === lead.id).length} spaces match your search`,
        body: `New matches for your ${lead.city} search are ready to view.`,
        href: "/dashboard/inquiries",
        readAt: rng.bool(0.5) ? daysAgoIso(rng.int(0, 3)) : null,
        createdAt: lead.createdAt,
      });
    }
  }
  for (const operatorProfile of users.operatorProfiles) {
    const operator = operators.find((o) => o.userId === operatorProfile.id);
    if (!operator) continue;
    const opSpaces = spaces.filter((s) => s.operatorId === operator.id).map((s) => s.id);
    const opLeads = leadMatches.filter((m) => opSpaces.includes(m.spaceId)).slice(0, 3);
    for (const match of opLeads) {
      const lead = leads.find((l) => l.id === match.leadId);
      if (!lead) continue;
      notifications.push({
        id: makeId("notif"),
        userId: operatorProfile.id,
        title: `New lead from ${lead.company}`,
        body: `${lead.contactName} is looking for ${lead.workspaceType.replace("_", " ")} space in ${lead.city}.`,
        href: "/operator/leads",
        readAt: rng.bool(0.4) ? daysAgoIso(rng.int(0, 3)) : null,
        createdAt: lead.createdAt,
      });
    }
  }

  return {
    users,
    operators,
    spaces,
    leads,
    reviews,
    leadMatches,
    statusHistory,
    conversations,
    messages,
    tours,
    savedSpaces,
    notifications,
  };
}

// Computed once per server process — this is the in-memory "database" that
// backs every `lib/data` function while Supabase isn't configured.
export const DB = build();

export type { Operator, Profile, Space, Lead, Review };
