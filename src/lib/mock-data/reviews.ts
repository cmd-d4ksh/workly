import { Profile, Review, Space } from "@/lib/types";
import { createRng, daysAgoIso, makeId } from "./rng";

const REVIEW_SNIPPETS = [
  "Clean, quiet, and the WiFi never drops — exactly what our team needed for a 3-month sprint.",
  "Booked a private office for 8 people and the onboarding was seamless. Would recommend.",
  "Great location and the staff were responsive whenever we needed extra meeting rooms.",
  "A bit pricier than nearby options but the community and amenities make it worth it.",
  "Our team moved in within a week of signing. Reception staff are excellent.",
  "Meeting rooms book up fast during the week, but overall a solid workspace.",
  "The 24/7 access was the deciding factor for our engineering team.",
  "Loved the natural light and the kitchen setup. Would work from here again.",
  "Good value for a dedicated desk — the coffee alone is worth the membership.",
  "Tour was quick and the operator answered every question same-day.",
  "Parking can get tight on weekdays but everything else has been great.",
  "Switched here after outgrowing our last space — capacity and pricing were spot on.",
  "Phone booths are a lifesaver for client calls. Highly recommend for small teams.",
  "The space feels premium without the premium downtown price tag.",
  "Six months in and still happy — responsive operator, reliable internet, clean facilities.",
];

export function generateReviews(seed: number, publishedSpaces: Space[], seekers: Profile[]): Review[] {
  const rng = createRng(seed);
  const pool = rng.pickMany(publishedSpaces, Math.min(15, publishedSpaces.length));

  return REVIEW_SNIPPETS.map((comment, index) => {
    const space = pool[index % pool.length];
    const author = rng.pick(seekers);
    return {
      id: makeId("review"),
      spaceId: space.id,
      userId: author.id,
      authorName: author.fullName,
      rating: rng.pick([4, 4, 5, 5, 5, 3]),
      comment,
      createdAt: daysAgoIso(rng.int(3, 300)),
    };
  });
}
