import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaPositive = true,
}: {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  delta?: string;
  deltaPositive?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        {Icon && <Icon className="size-4 text-muted-foreground" />}
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
      {delta && (
        <p className={cn("mt-1 text-xs font-medium", deltaPositive ? "text-emerald-600" : "text-red-600")}>
          {delta}
        </p>
      )}
    </div>
  );
}
