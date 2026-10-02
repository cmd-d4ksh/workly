import Link from "next/link";
import { Search } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { LeadStatusBadge } from "@/components/shared/status-badge";
import { getCurrentUser } from "@/lib/auth";
import { getLeadsForSeeker } from "@/lib/data/leads";
import { SEEKER_STATUS_LABELS } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { formatDate } from "@/lib/format";

export default async function InquiriesPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const leads = getLeadsForSeeker(user.id);

  return (
    <div>
      <h2 className="font-heading text-xl font-medium">My inquiries</h2>
      <p className="mt-1 text-sm text-muted-foreground">Every workspace search you&rsquo;ve submitted.</p>

      <div className="mt-6">
        {leads.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No inquiries yet"
            description="Submit your requirements and we'll match you with relevant coworking spaces."
            ctaLabel="Find my workspace"
            ctaHref="/get-started"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {leads.map((lead) => (
              <Link
                key={lead.id}
                href={`/dashboard/inquiries/${lead.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border p-4 transition-colors hover:border-foreground/20"
              >
                <div>
                  <p className="font-medium">
                    {lead.city} · {lead.workspaceType.replace("_", " ")}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {lead.teamSize} people · {formatINR(lead.budgetMin)}–{formatINR(lead.budgetMax)}/mo
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{formatDate(lead.createdAt)}</span>
                  <LeadStatusBadge status={lead.status} label={SEEKER_STATUS_LABELS[lead.status]} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
