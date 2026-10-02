import { DB } from "@/lib/mock-data";
import { makeId } from "@/lib/mock-data/rng";

export function getToursForLead(leadId: string) {
  return DB.tours.filter((t) => t.leadId === leadId);
}

export function getUpcomingToursForUser(userId: string) {
  const myLeadIds = new Set(DB.leads.filter((l) => l.userId === userId).map((l) => l.id));
  return DB.tours
    .filter((t) => myLeadIds.has(t.leadId) && t.status !== "cancelled")
    .sort((a, b) => Date.parse(a.scheduledFor) - Date.parse(b.scheduledFor));
}

export function scheduleTour(leadId: string, spaceId: string, scheduledFor: string) {
  const tour = {
    id: makeId("tour"),
    leadId,
    spaceId,
    scheduledFor,
    status: "requested" as const,
    createdAt: new Date().toISOString(),
  };
  DB.tours.push(tour);
  return tour;
}
