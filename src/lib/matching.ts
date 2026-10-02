import {
  AmenityKey,
  Lead,
  MatchBand,
  MatchScoreBreakdown,
  Space,
  TEAM_SIZE_BANDS,
  WorkspaceOption,
  WorkspaceType,
} from "@/lib/types";

/**
 * Rules-based lead-to-space matching engine.
 *
 * This is explicitly NOT an AI/ML model — it's a deterministic weighted
 * scoring function over structured fields, which is what the product spec
 * calls for ("don't expose arbitrary fake AI claims"). Every number here is
 * explainable: a lead and a space go in, a 0-100 score and a breakdown by
 * factor come out.
 *
 * Weights (sum to 100): location 30, workspace type 20, budget 20,
 * capacity 15, amenities 10, availability 5.
 */

const WEIGHTS: Record<keyof MatchScoreBreakdown, number> = {
  location: 30,
  workspaceType: 20,
  budget: 20,
  capacity: 15,
  amenities: 10,
  availability: 5,
};

const DESK_TYPES: WorkspaceType[] = ["hot_desk", "dedicated_desk"];
const OFFICE_TYPES: WorkspaceType[] = ["private_office", "team_office"];

function teamSizeRange(lead: Lead) {
  const band = TEAM_SIZE_BANDS.find((b) => b.value === lead.teamSize);
  return band ? { min: band.min, max: band.max } : { min: 1, max: 1 };
}

function relevantOption(space: Space, workspaceType: WorkspaceType): WorkspaceOption | undefined {
  return (
    space.workspaceOptions.find((o) => o.type === workspaceType) ??
    space.workspaceOptions[0]
  );
}

export function scoreLocation(lead: Lead, space: Space): number {
  if (lead.city !== space.city) return 0;
  if (lead.neighborhoods.length === 0) return 100;
  if (lead.neighborhoods.some((n) => n.toLowerCase() === space.neighborhood.toLowerCase())) {
    return 100;
  }
  // Same city, different preferred neighborhood — still a reasonable match.
  return 65;
}

export function scoreWorkspaceType(lead: Lead, space: Space): number {
  if (space.workspaceTypes.includes(lead.workspaceType)) return 100;
  const leadIsDesk = DESK_TYPES.includes(lead.workspaceType);
  const leadIsOffice = OFFICE_TYPES.includes(lead.workspaceType);
  const spaceHasDesk = space.workspaceTypes.some((t) => DESK_TYPES.includes(t));
  const spaceHasOffice = space.workspaceTypes.some((t) => OFFICE_TYPES.includes(t));
  if ((leadIsDesk && spaceHasDesk) || (leadIsOffice && spaceHasOffice)) return 45;
  return 0;
}

export function scoreBudget(lead: Lead, space: Space): number {
  const option = relevantOption(space, lead.workspaceType);
  const price = option?.priceMonthly ?? space.startingPrice;

  if (price <= lead.budgetMax && price >= lead.budgetMin * 0.4) return 100;
  if (price < lead.budgetMin * 0.4) return 80; // suspiciously cheap, still usable
  const overBy = (price - lead.budgetMax) / lead.budgetMax;
  const score = 100 - overBy * 160;
  return Math.max(0, Math.round(score));
}

export function scoreCapacity(lead: Lead, space: Space): number {
  const { min: leadMin, max: leadMax } = teamSizeRange(lead);
  const option = relevantOption(space, lead.workspaceType);
  const spaceMin = option?.minCapacity ?? space.minCapacity;
  const spaceMax = option?.maxCapacity ?? space.maxCapacity;

  const overlap = Math.min(leadMax, spaceMax) - Math.max(leadMin, spaceMin);
  if (overlap >= 0) {
    // Full containment of the lead's range scores highest.
    if (leadMin >= spaceMin && leadMax <= spaceMax) return 100;
    return 75;
  }
  // No overlap — score decays with distance, floored at 0.
  const gap = leadMin > spaceMax ? leadMin - spaceMax : spaceMin - leadMax;
  const denom = Math.max(leadMax, 1);
  return Math.max(0, Math.round(100 - (gap / denom) * 100));
}

export function scoreAmenities(lead: Lead, space: Space): number {
  if (lead.amenities.length === 0) return 100;
  const matched = lead.amenities.filter((a: AmenityKey) => space.amenities.includes(a));
  return Math.round((matched.length / lead.amenities.length) * 100);
}

export function scoreAvailability(lead: Lead, space: Space): number {
  const option = relevantOption(space, lead.workspaceType);
  if (!option) return 0;
  if (option.available && option.availableUnits > 0) return 100;
  return 20;
}

export function bandForScore(score: number): MatchBand {
  if (score >= 90) return "excellent";
  if (score >= 75) return "strong";
  if (score >= 60) return "possible";
  return "low";
}

export interface ScoredMatch {
  score: number;
  band: MatchBand;
  breakdown: MatchScoreBreakdown;
}

export function scoreLead(lead: Lead, space: Space): ScoredMatch {
  const breakdown: MatchScoreBreakdown = {
    location: scoreLocation(lead, space),
    workspaceType: scoreWorkspaceType(lead, space),
    budget: scoreBudget(lead, space),
    capacity: scoreCapacity(lead, space),
    amenities: scoreAmenities(lead, space),
    availability: scoreAvailability(lead, space),
  };

  const weighted =
    (breakdown.location * WEIGHTS.location +
      breakdown.workspaceType * WEIGHTS.workspaceType +
      breakdown.budget * WEIGHTS.budget +
      breakdown.capacity * WEIGHTS.capacity +
      breakdown.amenities * WEIGHTS.amenities +
      breakdown.availability * WEIGHTS.availability) /
    100;

  const score = Math.round(weighted);
  return { score, band: bandForScore(score), breakdown };
}

/**
 * Hard pre-filter before scoring, mirroring the product rule that a lead
 * must never fan out to every operator — only spaces that could plausibly
 * serve this lead are scored at all. City and workspace-type availability
 * are non-negotiable; budget gets a generous ceiling (not a hard cutoff)
 * since "approximately within budget" should still surface close misses.
 */
export function isEligible(lead: Lead, space: Space): boolean {
  if (space.status !== "published") return false;
  if (space.city !== lead.city) return false;
  if (!scoreWorkspaceType(lead, space)) return false;
  const option = relevantOption(space, lead.workspaceType);
  const price = option?.priceMonthly ?? space.startingPrice;
  if (price > lead.budgetMax * 2.5) return false;
  return true;
}

export interface SpaceMatchResult extends ScoredMatch {
  space: Space;
}

export function matchLeadToSpaces(lead: Lead, spaces: Space[], limit = 12): SpaceMatchResult[] {
  return spaces
    .filter((space) => isEligible(lead, space))
    .map((space) => ({ space, ...scoreLead(lead, space) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
