import Link from "next/link";
import { ArrowRight, CalendarClock, Heart, MessagesSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/shared/metric-card";
import { EmptyState } from "@/components/shared/empty-state";
import { SpaceCard } from "@/components/spaces/space-card";
import { LeadStatusBadge } from "@/components/shared/status-badge";
import { getCurrentUser } from "@/lib/auth";
import { getLeadsForSeeker } from "@/lib/data/leads";
import { getSavedSpaces } from "@/lib/data/saved";
import { getUpcomingToursForUser } from "@/lib/data/tours";
import { getFeaturedSpaces } from "@/lib/data/spaces";
import { SEEKER_STATUS_LABELS } from "@/lib/types";
import { formatDate } from "@/lib/format";

export default async function SeekerOverviewPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const leads = getLeadsForSeeker(user.id);
  const activeLeads = leads.filter((l) => !["won", "lost"].includes(l.status));
  const saved = getSavedSpaces(user.id);
  const tours = getUpcomingToursForUser(user.id);
  const recommended = getFeaturedSpaces(3);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-heading text-xl font-medium">Welcome back, {user.fullName.split(" ")[0]}</h2>
        <p className="mt-1 text-sm text-muted-foreground">Here&rsquo;s what&rsquo;s happening with your workspace search.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard label="Active inquiries" value={activeLeads.length} icon={MessagesSquare} />
        <MetricCard label="Saved spaces" value={saved.length} icon={Heart} />
        <MetricCard label="Upcoming tours" value={tours.length} icon={CalendarClock} />
        <MetricCard label="Total searches" value={leads.length} icon={Search} />
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-heading text-lg font-medium">Active inquiries</h3>
          <Button variant="ghost" size="sm" className="gap-1" render={<Link href="/dashboard/inquiries" />}>
            View all <ArrowRight className="size-3.5" />
          </Button>
        </div>
        {activeLeads.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No active searches yet"
            description="Tell us what you're looking for and we'll match you with relevant spaces."
            ctaLabel="Find my workspace"
            ctaHref="/get-started"
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {activeLeads.slice(0, 4).map((lead) => (
              <Link
                key={lead.id}
                href={`/dashboard/inquiries/${lead.id}`}
                className="rounded-2xl border border-border p-4 transition-colors hover:border-foreground/20"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{lead.city} workspace search</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {lead.teamSize} people · {lead.workspaceType.replace("_", " ")}
                    </p>
                  </div>
                  <LeadStatusBadge status={lead.status} label={SEEKER_STATUS_LABELS[lead.status]} />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">Submitted {formatDate(lead.createdAt)}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {tours.length > 0 && (
        <section>
          <h3 className="mb-3 font-heading text-lg font-medium">Upcoming tours</h3>
          <div className="flex flex-col gap-2">
            {tours.slice(0, 3).map((tour) => (
              <div key={tour.id} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarClock className="size-4 text-brand" />
                  {formatDate(tour.scheduledFor)}
                </div>
                <span className="text-xs capitalize text-muted-foreground">{tour.status}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="mb-3 font-heading text-lg font-medium">Recommended for you</h3>
        <div className="grid gap-5 sm:grid-cols-3">
          {recommended.map((space) => <SpaceCard key={space.id} space={space} />)}
        </div>
      </section>
    </div>
  );
}
