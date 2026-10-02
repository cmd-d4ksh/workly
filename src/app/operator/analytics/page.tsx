import { LeadsOverTimeChart, FunnelChart } from "@/components/operator/analytics-charts";
import { MetricCard } from "@/components/shared/metric-card";
import { getCurrentUser } from "@/lib/auth";
import { getOperatorByUserId } from "@/lib/data/operators";
import { conversionFunnel, getLeadsForOperator, getOperatorLeadMetrics, leadsOverTime } from "@/lib/data/leads";
import { getSpacesByOperator } from "@/lib/data/spaces";
import { formatINR } from "@/lib/format";

export default async function OperatorAnalyticsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const operator = getOperatorByUserId(user.id);
  if (!operator) return null;

  const metrics = getOperatorLeadMetrics(operator.id);
  const series = leadsOverTime(operator.id, 30);
  const funnel = conversionFunnel(operator.id);
  const rows = getLeadsForOperator(operator.id);
  const spaces = getSpacesByOperator(operator.id);

  const topSpaces = spaces
    .map((s) => ({ space: s, leadCount: rows.filter((r) => r.space?.id === s.id).length }))
    .sort((a, b) => b.leadCount - a.leadCount)
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard label="Total leads" value={metrics.total} />
        <MetricCard label="Qualified" value={metrics.qualified} />
        <MetricCard label="Tours booked" value={metrics.tours} />
        <MetricCard label="Conversion rate" value={`${metrics.conversionRate}%`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border p-5">
          <p className="mb-2 font-heading text-base font-medium">Leads over time (30 days)</p>
          <LeadsOverTimeChart data={series} />
        </div>
        <div className="rounded-2xl border border-border p-5">
          <p className="mb-2 font-heading text-base font-medium">Conversion funnel</p>
          <FunnelChart data={funnel} />
        </div>
      </div>

      <div className="rounded-2xl border border-border p-5">
        <p className="mb-3 font-heading text-base font-medium">Top performing spaces</p>
        <div className="flex flex-col divide-y divide-border">
          {topSpaces.map(({ space, leadCount }) => (
            <div key={space.id} className="flex items-center justify-between py-2.5 text-sm">
              <span>{space.name}</span>
              <span className="text-muted-foreground">{leadCount} leads · from {formatINR(space.startingPrice)}/mo</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
