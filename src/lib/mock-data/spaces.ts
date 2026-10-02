import {
  AMENITY_KEYS,
  AmenityKey,
  City,
  CITIES,
  Operator,
  OpeningHours,
  Space,
  SpaceStatus,
  WorkspaceOption,
  WorkspaceType,
} from "@/lib/types";
import { createRng, daysAgoIso, makeId, slugify } from "./rng";
import { CITY_CENTERS, NEIGHBORHOODS } from "./geo";
import { OPERATOR_BRANDS } from "./operators";

const TYPE_PRICE_RANGE: Record<WorkspaceType, [number, number]> = {
  hot_desk: [4500, 9000],
  dedicated_desk: [7500, 14000],
  private_office: [12500, 35000],
  team_office: [18000, 48000],
  meeting_room: [800, 2500],
  virtual_office: [1500, 4000],
};

const TYPE_CAPACITY_RANGE: Record<WorkspaceType, [number, number]> = {
  hot_desk: [1, 1],
  dedicated_desk: [1, 1],
  private_office: [2, 12],
  team_office: [10, 50],
  meeting_room: [2, 16],
  virtual_office: [1, 1],
};

const COMMON_TYPES: WorkspaceType[] = ["hot_desk", "dedicated_desk", "private_office", "meeting_room"];
const ALL_TYPES: WorkspaceType[] = [
  "hot_desk",
  "dedicated_desk",
  "private_office",
  "team_office",
  "meeting_room",
  "virtual_office",
];

const TAGLINES = [
  "Where ambitious teams get work done.",
  "Flexible space, built for growth.",
  "Premium workspace without the overhead.",
  "A home base for teams on the move.",
  "Thoughtfully designed, ready when you are.",
  "Work the way your team actually works.",
];

function buildDescription(name: string, neighborhood: string, city: City): string {
  return `${name} offers bright, thoughtfully designed workspace in ${neighborhood}, ${city}. Expect fast WiFi, flexible terms, and a community of fast-moving teams — whether you need a single hot desk for the day or a private floor for your next hundred hires.`;
}

function buildOpeningHours(has247: boolean): OpeningHours[] {
  const days: OpeningHours["day"][] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  if (has247) {
    return days.map((day) => ({ day, open: "00:00", close: "23:59" }));
  }
  return days.map((day) => {
    if (day === "sun") return { day, open: null, close: null };
    if (day === "sat") return { day, open: "10:00", close: "17:00" };
    return { day, open: "08:00", close: "20:00" };
  });
}

function buildWorkspaceOptions(
  rng: ReturnType<typeof createRng>,
  spaceId: string,
  types: WorkspaceType[]
): WorkspaceOption[] {
  return types.map((type) => {
    const [minPrice, maxPrice] = TYPE_PRICE_RANGE[type];
    const [minCap, maxCap] = TYPE_CAPACITY_RANGE[type];
    const available = rng.bool(0.82);
    return {
      id: makeId("wopt"),
      spaceId,
      type,
      priceMonthly: rng.int(minPrice, maxPrice),
      minCapacity: minCap,
      maxCapacity: type === "team_office" ? rng.int(minCap, maxCap) : maxCap,
      available,
      availableUnits: available ? rng.int(1, 12) : 0,
    };
  });
}

// 25 distinct branded locations across the 10 operators (first 5 operators
// run 3 locations each, remaining 5 run 2) — a realistic chain distribution.
const LOCATIONS_PER_OPERATOR = [3, 3, 3, 3, 3, 2, 2, 2, 2, 2];

export function generateSpaces(seed: number, operators: Operator[]): Space[] {
  const rng = createRng(seed);
  const spaces: Space[] = [];
  let citySpin = 0;

  OPERATOR_BRANDS.forEach((brand, operatorIndex) => {
    const operator = operators[operatorIndex];
    const locationCount = LOCATIONS_PER_OPERATOR[operatorIndex];

    for (let i = 0; i < locationCount; i++) {
      const city = CITIES[citySpin % CITIES.length];
      citySpin += 1;
      const neighborhood = rng.pick(NEIGHBORHOODS[city]);
      const name = locationCount > 1 ? `${brand} ${neighborhood.split(" ")[0]}` : brand;
      const slug = `${slugify(city)}/${slugify(name)}`;
      const spaceId = makeId("space");

      const typeCount = rng.int(2, 4);
      const types = Array.from(
        new Set([rng.pick(COMMON_TYPES), ...rng.pickMany(ALL_TYPES, typeCount)])
      ).slice(0, typeCount) as WorkspaceType[];

      const amenities = rng.pickMany(AMENITY_KEYS, rng.int(7, 13)) as AmenityKey[];
      const has247 = amenities.includes("access_247");
      const workspaceOptions = buildWorkspaceOptions(rng, spaceId, types);
      const prices = workspaceOptions.map((o) => o.priceMonthly);
      const capacities = workspaceOptions.flatMap((o) => [o.minCapacity, o.maxCapacity]);

      const center = CITY_CENTERS[city];
      const statusRoll = rng.next();
      const status: SpaceStatus =
        statusRoll < 0.84 ? "published" : statusRoll < 0.92 ? "pending_review" : statusRoll < 0.97 ? "draft" : "rejected";

      const imageSeed = slugify(name);
      spaces.push({
        id: spaceId,
        slug,
        operatorId: operator.id,
        name,
        tagline: rng.pick(TAGLINES),
        description: buildDescription(name, neighborhood, city),
        city,
        neighborhood,
        address: `${rng.int(1, 400)} ${neighborhood} Road, ${neighborhood}, ${city}`,
        lat: center.lat + rng.float(-0.05, 0.05, 4),
        lng: center.lng + rng.float(-0.05, 0.05, 4),
        images: Array.from({ length: rng.int(4, 6) }, (_, imgIdx) =>
          `https://picsum.photos/seed/${imageSeed}-${imgIdx}/1200/800`
        ),
        workspaceTypes: types,
        amenities,
        startingPrice: Math.min(...prices),
        minCapacity: Math.min(...capacities),
        maxCapacity: Math.max(...capacities),
        rating: rng.float(3.6, 5.0, 1),
        reviewCount: 0, // populated after reviews are generated
        verified: rng.bool(0.8),
        status,
        openingHours: buildOpeningHours(has247),
        workspaceOptions,
        createdAt: daysAgoIso(rng.int(30, 480)),
        updatedAt: daysAgoIso(rng.int(0, 29)),
      });
    }
  });

  return spaces;
}
