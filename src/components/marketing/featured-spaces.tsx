import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SpaceCard } from "@/components/spaces/space-card";
import { Button } from "@/components/ui/button";
import { getFeaturedSpaces } from "@/lib/data/spaces";

export function FeaturedSpaces() {
  const spaces = getFeaturedSpaces(6);

  return (
    <section className="page-shell py-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">Featured spaces</p>
          <h2 className="mt-2 font-heading text-3xl font-medium tracking-tight">
            Spaces teams are choosing right now
          </h2>
        </div>
        <Button variant="ghost" className="gap-1.5" render={<Link href="/search" />}>
          View all spaces <ArrowRight className="size-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {spaces.map((space) => (
          <SpaceCard key={space.id} space={space} />
        ))}
      </div>
    </section>
  );
}
