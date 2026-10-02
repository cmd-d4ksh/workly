import { CheckCircle2 } from "lucide-react";
import { LeadStatusHistoryEntry } from "@/lib/types";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export function LeadTimeline({
  history,
  labels,
}: {
  history: LeadStatusHistoryEntry[];
  labels: Record<string, string>;
}) {
  return (
    <ol className="flex flex-col">
      {history.map((entry, i) => (
        <li key={entry.id} className="relative flex gap-3 pb-6 last:pb-0">
          {i < history.length - 1 && (
            <span className="absolute left-[9px] top-5 h-full w-px bg-border" aria-hidden />
          )}
          <CheckCircle2
            className={cn("mt-0.5 size-[18px] shrink-0", i === history.length - 1 ? "text-brand" : "text-muted-foreground")}
          />
          <div>
            <p className="text-sm font-medium">{labels[entry.status] ?? entry.status}</p>
            <p className="text-xs text-muted-foreground">{formatDateTime(entry.createdAt)}</p>
            {entry.note && <p className="mt-1 text-sm text-muted-foreground">{entry.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
