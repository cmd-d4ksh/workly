import { Users, Building2, LayoutGrid, TrendingUp, CheckCircle2, Briefcase } from "lucide-react";
import { MetricCard } from "@/components/shared/metric-card";
import { platformMetrics } from "@/lib/data/admin";

export default function AdminOverviewPage() {
  const m = platformMetrics();

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard label="Total users" value={m.totalUsers} icon={Users} />
        <MetricCard label="Active operators" value={m.activeOperators} icon={Building2} />
        <MetricCard label="Published spaces" value={m.publishedSpaces} icon={LayoutGrid} />
        <MetricCard label="Monthly leads" value={m.monthlyLeads} icon={Briefcase} />
        <MetricCard label="Qualified leads" value={m.qualifiedLeads} icon={CheckCircle2} />
        <MetricCard label="Conversion rate" value={`${m.conversionRate}%`} icon={TrendingUp} />
      </div>
      <p className="text-sm text-muted-foreground">
        Use the sidebar to review operators pending approval, moderate space listings, and browse all
        platform leads and users.
      </p>
    </div>
  );
}
