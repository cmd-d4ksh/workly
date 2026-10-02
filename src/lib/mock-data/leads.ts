import {
  AMENITY_KEYS,
  AmenityKey,
  CITIES,
  Lead,
  LEAD_STATUSES,
  LeadStatus,
  MoveInTimeline,
  Profile,
  TeamSizeBand,
  WorkspaceType,
} from "@/lib/types";
import { createRng, daysAgoIso, makeId } from "./rng";
import { NEIGHBORHOODS } from "./geo";
import { SEEKER_COMPANIES, FIRST_NAMES, LAST_NAMES } from "./users";

const TEAM_SIZES: TeamSizeBand[] = ["1", "2-5", "6-10", "11-25", "26-50", "50+"];
const MOVE_INS: MoveInTimeline[] = ["immediately", "30_days", "1_3_months", "3_plus_months"];
const WORKSPACE_TYPES: WorkspaceType[] = [
  "hot_desk",
  "dedicated_desk",
  "private_office",
  "team_office",
  "meeting_room",
  "virtual_office",
];

const BUDGET_BY_TYPE: Record<WorkspaceType, [number, number]> = {
  hot_desk: [4000, 9000],
  dedicated_desk: [7000, 15000],
  private_office: [15000, 60000],
  team_office: [40000, 150000],
  meeting_room: [1000, 4000],
  virtual_office: [1500, 4000],
};

// Weighted so most leads are early-stage (realistic funnel shape) with a
// meaningful tail of won/lost for operator analytics to have something to show.
const STATUS_WEIGHTS: LeadStatus[] = [
  "new", "new", "new", "new", "new", "new",
  "contacted", "contacted", "contacted", "contacted", "contacted",
  "qualified", "qualified", "qualified", "qualified",
  "tour_scheduled", "tour_scheduled", "tour_scheduled",
  "proposal", "proposal",
  "won", "won", "won",
  "lost", "lost",
];

const JOB_TITLES = ["Operations Manager", "Office Manager", "Founder", "HR Lead", "COO", "Workplace Lead"];

export function generateLeads(seed: number, seekers: Profile[]): Lead[] {
  const rng = createRng(seed);

  return Array.from({ length: 50 }, () => {
    const city = rng.pick(CITIES);
    const workspaceType = rng.pick(WORKSPACE_TYPES);
    const teamSize = rng.pick(TEAM_SIZES);
    const [minBudget, maxBudget] = BUDGET_BY_TYPE[workspaceType];
    const budgetMin = rng.int(minBudget, Math.round((minBudget + maxBudget) / 2));
    const budgetMax = rng.int(budgetMin + Math.round(minBudget * 0.3), maxBudget);
    const amenities = rng.pickMany(AMENITY_KEYS, rng.int(2, 5)) as AmenityKey[];
    const neighborhoods = rng.bool(0.6) ? [rng.pick(NEIGHBORHOODS[city])] : [];

    const linkedSeeker = rng.bool(0.55) ? rng.pick(seekers) : null;
    const name = linkedSeeker?.fullName ?? `${rng.pick(FIRST_NAMES)} ${rng.pick(LAST_NAMES)}`;
    const company = linkedSeeker?.company ?? rng.pick(SEEKER_COMPANIES);
    const createdAt = daysAgoIso(rng.int(0, 120));

    return {
      id: makeId("lead"),
      userId: linkedSeeker?.id ?? null,
      city,
      neighborhoods,
      workspaceType,
      teamSize,
      budgetMin,
      budgetMax,
      moveIn: rng.pick(MOVE_INS),
      amenities,
      contactName: name,
      company,
      email: linkedSeeker?.email ?? `${name.toLowerCase().replace(/\s+/g, ".")}@${company.toLowerCase().replace(/[^a-z]+/g, "")}.example.com`,
      phone: linkedSeeker?.phone ?? `+91 ${rng.int(70000, 99999)}${rng.int(10000, 99999)}`,
      jobTitle: linkedSeeker?.jobTitle ?? rng.pick(JOB_TITLES),
      status: rng.pick(STATUS_WEIGHTS),
      assignedSpaceId: null,
      createdAt,
      updatedAt: createdAt,
    } satisfies Lead;
  });
}

export { LEAD_STATUSES };
