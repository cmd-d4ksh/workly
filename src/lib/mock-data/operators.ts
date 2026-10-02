import { Operator, PlanTier } from "@/lib/types";
import { createRng, daysAgoIso, makeId } from "./rng";

export const OPERATOR_BRANDS = [
  "Atlas House",
  "The Foundry",
  "Worksmith",
  "Common Ground",
  "The Collective",
  "Desk District",
  "Founders House",
  "Northbank Works",
  "Harbor & Co",
  "Meridian Works",
] as const;

const PLAN_WEIGHTS: PlanTier[] = ["free", "free", "growth", "growth", "growth", "pro", "pro", "free", "growth", "pro"];

export function generateOperators(seed: number, operatorUserIds: string[]): Operator[] {
  const rng = createRng(seed);

  return OPERATOR_BRANDS.map((brand, index) => {
    const id = makeId("op");
    const slug = brand.toLowerCase().replace(/[^a-z]+/g, "");
    return {
      id,
      userId: operatorUserIds[index],
      companyName: `${brand} Workspaces`,
      logoUrl: null,
      contactEmail: `hello@${slug}.example.com`,
      contactPhone: `+91 ${rng.int(70000, 99999)}${rng.int(10000, 99999)}`,
      plan: PLAN_WEIGHTS[index],
      approved: rng.bool(0.9),
      createdAt: daysAgoIso(rng.int(60, 540)),
    };
  });
}
