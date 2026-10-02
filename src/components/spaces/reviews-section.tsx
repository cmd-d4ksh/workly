import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Review } from "@/lib/types";
import { formatDate } from "@/lib/format";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export function ReviewsSection({
  reviews,
  rating,
  distribution,
}: {
  reviews: Review[];
  rating: number;
  distribution: { stars: number; count: number }[];
}) {
  const total = distribution.reduce((sum, d) => sum + d.count, 0) || 1;

  return (
    <div>
      <div className="flex flex-col gap-8 sm:flex-row">
        <div className="flex shrink-0 flex-col items-center sm:items-start">
          <p className="font-heading text-5xl font-medium">{rating.toFixed(1)}</p>
          <div className="mt-2 flex gap-0.5 text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={i < Math.round(rating) ? "size-4 fill-current" : "size-4 text-muted"} />
            ))}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{reviews.length} reviews</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {distribution.map((d) => (
            <div key={d.stars} className="flex items-center gap-3 text-sm">
              <span className="w-10 text-muted-foreground">{d.stars} star</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-foreground" style={{ width: `${(d.count / total) * 100}%` }} />
              </div>
              <span className="w-6 text-right text-muted-foreground">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {reviews.slice(0, 6).map((review) => (
          <div key={review.id} className="rounded-2xl border border-border p-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-9">
                <AvatarFallback className="bg-brand-muted text-xs font-semibold text-brand">
                  {initials(review.authorName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{review.authorName}</p>
                <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
              </div>
            </div>
            <div className="mt-2 flex gap-0.5 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={i < review.rating ? "size-3 fill-current" : "size-3 text-muted"} />
              ))}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
