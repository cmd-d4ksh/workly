import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SpaceCard } from "@/components/spaces/space-card";
import { MatchBandBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { getLeadById, getMatchesForLead } from "@/lib/data/leads";
import { getCurrentUser } from "@/lib/auth";
import { getSavedSpaces } from "@/lib/data/saved";

export default async function LeadMatchesPage({
  params,
}: {
  params: Promise<{ leadId: string }>;
}) {
  const { leadId } = await params;
  const lead = getLeadById(leadId);
  if (!lead) notFound();

  const matches = getMatchesForLead(leadId).filter((m) => m.space);
  const user = await getCurrentUser();
  const savedIds = new Set(user ? getSavedSpaces(user.id).map((s) => s.id) : []);

  return (
    <div className="py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand">Your matches</p>
      <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight">
        {matches.length} spaces matched your search in {lead.city}
      </h1>
      <p className="mt-2 text-muted-foreground">
        Ranked by fit — location, workspace type, budget, capacity, amenities, and availability.
      </p>

      {matches.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-muted-foreground">
            No spaces matched exactly, but our team has your requirements — widen your budget or city to
            see more options.
          </p>
          <Button variant="outline" className="mt-4" render={<Link href="/search" />}>
            Browse all spaces
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((m) => (
            <div key={m.id} className="relative">
              <div className="absolute left-3 top-3 z-10">
                <MatchBandBadge band={m.band} score={m.score} />
              </div>
              <SpaceCard space={m.space!} saved={savedIds.has(m.space!.id)} />
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Button size="lg" className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90" render={<Link href="/dashboard/inquiries" />}>
          Track this search <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
