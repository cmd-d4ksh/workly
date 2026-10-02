import { LeadsOverTimeChart } from "@/components/operator/analytics-charts";
import { MetricCard } from "@/components/shared/metric-card";
import { leadsOverTimePlatform, pendingSpacesCount, platformMetrics } from "@/lib/data/admin";

export default function AdminAnalyticsPage() {
  const m = platformMetrics();
  const series = leadsOverTimePlatform(30);
  const pending = pendingSpacesCount();

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard label="Monthly leads" value={m.monthlyLeads} />
        <MetricCard label="Qualified leads" value={m.qualifiedLeads} />
        <MetricCard label="Conversion rate" value={`${m.conversionRate}%`} />
        <MetricCard label="Spaces pending review" value={pending} />
      </div>
      <div className="rounded-2xl border border-border p-5">
        <p className="mb-2 font-heading text-base font-medium">Platform leads over time (30 days)</p>
        <LeadsOverTimeChart data={series} />
      </div>
    </div>
  );
}
