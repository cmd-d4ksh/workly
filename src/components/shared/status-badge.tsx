import { Badge } from "@/components/ui/badge";
import { LeadStatus, MatchBand, OPERATOR_STATUS_LABELS, SpaceStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const LEAD_STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900",
  contacted: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
  qualified: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-900",
  tour_scheduled: "bg-brand-muted text-brand border-brand/30",
  proposal: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-900",
  won: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
  lost: "bg-muted text-muted-foreground border-border",
};

export function LeadStatusBadge({ status, label }: { status: LeadStatus; label?: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium", LEAD_STATUS_STYLES[status])}>
      {label ?? OPERATOR_STATUS_LABELS[status]}
    </Badge>
  );
}

const MATCH_BAND_STYLES: Record<MatchBand, string> = {
  excellent: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
  strong: "bg-brand-muted text-brand border-brand/30",
  possible: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
  low: "bg-muted text-muted-foreground border-border",
};

export function MatchBandBadge({ band, score }: { band: MatchBand; score: number }) {
  return (
    <Badge variant="outline" className={cn("gap-1 font-medium", MATCH_BAND_STYLES[band])}>
      {score}% match
    </Badge>
  );
}

const SPACE_STATUS_STYLES: Record<SpaceStatus, string> = {
  draft: "bg-muted text-muted-foreground border-border",
  pending_review: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
  published: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
  rejected: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900",
};

const SPACE_STATUS_LABELS: Record<SpaceStatus, string> = {
  draft: "Draft",
  pending_review: "Pending review",
  published: "Published",
  rejected: "Rejected",
};

export function SpaceStatusBadge({ status }: { status: SpaceStatus }) {
  return (
    <Badge variant="outline" className={cn("font-medium", SPACE_STATUS_STYLES[status])}>
      {SPACE_STATUS_LABELS[status]}
    </Badge>
  );
}
