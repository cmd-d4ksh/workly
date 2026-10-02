import Link from "next/link";
import { ArrowRight, Users, CheckCircle2, MessageCircle, CalendarCheck, Trophy, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/shared/metric-card";
import { LeadStatusBadge } from "@/components/shared/status-badge";
import { MatchBandBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { getCurrentUser } from "@/lib/auth";
import { getOperatorByUserId } from "@/lib/data/operators";
import { getLeadsForOperator, getOperatorLeadMetrics } from "@/lib/data/leads";
import { formatINR, formatRelativeDate } from "@/lib/format";

export default async function OperatorOverviewPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const operator = getOperatorByUserId(user.id);
  if (!operator) return null;

  const metrics = getOperatorLeadMetrics(operator.id);
  const rows = getLeadsForOperator(operator.id).slice(0, 6);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard label="New leads" value={metrics.total} icon={Users} />
        <MetricCard label="Qualified leads" value={metrics.qualified} icon={CheckCircle2} />
        <MetricCard label="Response rate" value={`${metrics.responseRate}%`} icon={MessageCircle} />
        <MetricCard label="Tours booked" value={metrics.tours} icon={CalendarCheck} />
        <MetricCard label="Conversions" value={metrics.won} icon={Trophy} />
        <MetricCard label="Revenue influenced" value={formatINR(metrics.revenueInfluenced)} icon={IndianRupee} />
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-heading text-lg font-medium">Recent leads</h3>
          <Button variant="ghost" size="sm" className="gap-1" render={<Link href="/operator/leads" />}>
            View all <ArrowRight className="size-3.5" />
          </Button>
        </div>
        {rows.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No leads yet"
            description="Once your spaces are published, matching leads will show up here automatically."
            ctaLabel="Manage spaces"
            ctaHref="/operator/spaces"
          />
        ) : (
          <div className="flex flex-col divide-y divide-border rounded-2xl border border-border">
            {rows.map(({ lead, match }) => (
              <Link
                key={lead.id}
                href={`/operator/leads/${lead.id}`}
                className="flex flex-wrap items-center justify-between gap-3 p-4 transition-colors hover:bg-secondary/40"
              >
                <div>
                  <p className="font-medium">{lead.contactName} · {lead.company}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {lead.city} · {lead.teamSize} people · {formatINR(lead.budgetMin)}–{formatINR(lead.budgetMax)}/mo
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {match && <MatchBandBadge band={match.band} score={match.score} />}
                  <LeadStatusBadge status={lead.status} />
                  <span className="hidden text-xs text-muted-foreground sm:inline">{formatRelativeDate(lead.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
