import { DB } from "@/lib/mock-data";
import { makeId, slugify } from "@/lib/mock-data/rng";
import { AmenityKey, City, Space, SpaceStatus, WorkspaceType } from "@/lib/types";

/**
 * Demo-mode data layer. Every function here reads/writes the in-memory
 * `DB` built in `lib/mock-data`. When a real Supabase project is connected
 * (see `lib/config#isDemoMode`), these signatures stay the same — only the
 * implementation swaps to `supabase.from(...)` queries against the schema
 * in `supabase/schema.sql`, so no calling code changes.
 */

export interface SpaceSearchFilters {
  query?: string;
  city?: City;
  workspaceTypes?: WorkspaceType[];
  amenities?: AmenityKey[];
  minPrice?: number;
  maxPrice?: number;
  minCapacity?: number;
  sort?: "recommended" | "price_asc" | "price_desc" | "rating" | "newest";
  page?: number;
  pageSize?: number;
}

export interface SpaceSearchResult {
  spaces: Space[];
  total: number;
  page: number;
  pageSize: number;
}

function publishedSpaces(): Space[] {
  return DB.spaces.filter((s) => s.status === "published");
}

export function getAllPublishedSpaces(): Space[] {
  return publishedSpaces();
}

export function searchSpaces(filters: SpaceSearchFilters): SpaceSearchResult {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 12;

  let results = publishedSpaces();

  if (filters.city) {
    results = results.filter((s) => s.city === filters.city);
  }
  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.neighborhood.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q)
    );
  }
  if (filters.workspaceTypes?.length) {
    results = results.filter((s) =>
      filters.workspaceTypes!.some((t) => s.workspaceTypes.includes(t))
    );
  }
  if (filters.amenities?.length) {
    results = results.filter((s) => filters.amenities!.every((a) => s.amenities.includes(a)));
  }
  if (filters.minPrice != null) {
    results = results.filter((s) => s.startingPrice >= filters.minPrice!);
  }
  if (filters.maxPrice != null) {
    results = results.filter((s) => s.startingPrice <= filters.maxPrice!);
  }
  if (filters.minCapacity != null) {
    results = results.filter((s) => s.maxCapacity >= filters.minCapacity!);
  }

  switch (filters.sort) {
    case "price_asc":
      results = [...results].sort((a, b) => a.startingPrice - b.startingPrice);
      break;
    case "price_desc":
      results = [...results].sort((a, b) => b.startingPrice - a.startingPrice);
      break;
    case "rating":
      results = [...results].sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      results = [...results].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
      break;
    default:
      // "recommended" — verified + rating-weighted
      results = [...results].sort(
        (a, b) => Number(b.verified) - Number(a.verified) || b.rating - a.rating
      );
  }

  const total = results.length;
  const start = (page - 1) * pageSize;
  return { spaces: results.slice(start, start + pageSize), total, page, pageSize };
}

export function getSpaceBySlug(slug: string): Space | undefined {
  return DB.spaces.find((s) => s.slug === slug);
}

export function getSpaceById(id: string): Space | undefined {
  return DB.spaces.find((s) => s.id === id);
}

export function getSimilarSpaces(space: Space, limit = 3): Space[] {
  return publishedSpaces()
    .filter((s) => s.id !== space.id && s.city === space.city)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export function getFeaturedSpaces(limit = 6): Space[] {
  return [...publishedSpaces()]
    .sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount)
    .slice(0, limit);
}

export function getSpacesByOperator(operatorId: string): Space[] {
  return DB.spaces.filter((s) => s.operatorId === operatorId);
}

export function getCityCounts(): { city: City; count: number }[] {
  const counts = new Map<City, number>();
  for (const space of publishedSpaces()) {
    counts.set(space.city, (counts.get(space.city) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([city, count]) => ({ city, count }));
}

export interface NewSpaceInput {
  name: string;
  city: City;
  neighborhood: string;
  description: string;
}

/**
 * Creates a minimal draft/pending space. Pricing, amenities, and images are
 * added afterward from the space's own page — drafts and pending-review
 * spaces never surface in search or matching (see `isEligible` in
 * lib/matching.ts), so an incomplete listing can't reach a seeker.
 */
export function createSpace(operatorId: string, input: NewSpaceInput, status: SpaceStatus): Space {
  const now = new Date().toISOString();
  const spaceId = makeId("space");
  const space: Space = {
    id: spaceId,
    slug: `${slugify(input.city)}/${slugify(input.name)}-${spaceId.slice(-4)}`,
    operatorId,
    name: input.name,
    tagline: "",
    description: input.description,
    city: input.city,
    neighborhood: input.neighborhood,
    address: "",
    lat: 0,
    lng: 0,
    images: [`https://picsum.photos/seed/${slugify(input.name)}/1200/800`],
    workspaceTypes: [],
    amenities: [],
    startingPrice: 0,
    minCapacity: 0,
    maxCapacity: 0,
    rating: 0,
    reviewCount: 0,
    verified: false,
    status,
    openingHours: [],
    workspaceOptions: [],
    createdAt: now,
    updatedAt: now,
  };
  DB.spaces.unshift(space);
  return space;
}

export function updateSpaceStatus(spaceId: string, status: SpaceStatus): Space | undefined {
  const space = DB.spaces.find((s) => s.id === spaceId);
  if (!space) return undefined;
  space.status = status;
  space.updatedAt = new Date().toISOString();
  return space;
}
