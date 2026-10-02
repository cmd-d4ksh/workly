export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  date: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-pick-a-coworking-space",
    title: "How to pick the right coworking space for your team",
    excerpt: "Budget, location, and amenities all matter — but in a different order than you'd think.",
    body: "When evaluating a coworking space, most teams start with price. In practice, location and move-in timeline usually matter more — a cheaper space your team won't commute to isn't actually cheaper. Start with the non-negotiables (city, team size, move-in date), then compare amenities and price across the shortlist.",
    date: "2026-08-12",
  },
  {
    slug: "signs-your-team-has-outgrown-its-office",
    title: "5 signs your team has outgrown its office",
    excerpt: "From meeting room scarcity to onboarding friction — the early signals are easy to miss.",
    body: "Growing teams often wait too long to move. Watch for recurring meeting room conflicts, new hires without a permanent desk, and client meetings held off-site because your current space doesn't make a good impression.",
    date: "2026-07-02",
  },
];
