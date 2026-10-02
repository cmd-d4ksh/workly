import { DB } from "@/lib/mock-data";
import { makeId } from "@/lib/mock-data/rng";

export function getReviewsForSpace(spaceId: string) {
  return DB.reviews
    .filter((r) => r.spaceId === spaceId)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export function ratingDistribution(spaceId: string) {
  const reviews = getReviewsForSpace(spaceId);
  const buckets = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => Math.round(r.rating) === stars).length,
  }));
  return { buckets, total: reviews.length };
}

export function hasReviewed(spaceId: string, userId: string) {
  return DB.reviews.some((r) => r.spaceId === spaceId && r.userId === userId);
}

export function addReview(spaceId: string, userId: string, authorName: string, rating: number, comment: string) {
  if (hasReviewed(spaceId, userId)) {
    throw new Error("You've already reviewed this space.");
  }
  const review = {
    id: makeId("review"),
    spaceId,
    userId,
    authorName,
    rating,
    comment,
    createdAt: new Date().toISOString(),
  };
  DB.reviews.unshift(review);

  const space = DB.spaces.find((s) => s.id === spaceId);
  if (space) {
    const spaceReviews = getReviewsForSpace(spaceId);
    space.reviewCount = spaceReviews.length;
    space.rating =
      Math.round((spaceReviews.reduce((sum, r) => sum + r.rating, 0) / spaceReviews.length) * 10) / 10;
  }
  return review;
}
