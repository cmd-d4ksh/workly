import { notFound, redirect } from "next/navigation";
import { LeadStatusBadge } from "@/components/shared/status-badge";
import { MatchBandBadge } from "@/components/shared/status-badge";
import { LeadTimeline } from "@/components/leads/lead-timeline";
import { MessageThread } from "@/components/leads/message-thread";
import { SpaceCard } from "@/components/spaces/space-card";
import { getCurrentUser } from "@/lib/auth";
import { getLeadById, getMatchesForLead, getStatusHistory } from "@/lib/data/leads";
import { getConversationForLead, getMessages } from "@/lib/data/messages";
import { getSavedSpaces } from "@/lib/data/saved";
import { SEEKER_STATUS_LABELS, WORKSPACE_TYPE_LABELS } from "@/lib/types";
import { formatINR } from "@/lib/format";

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ leadId: string }>;
}) {
  const { leadId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const lead = getLeadById(leadId);
  if (!lead || lead.userId !== user.id) notFound();

  const matches = getMatchesForLead(leadId).filter((m) => m.space);
  const history = getStatusHistory(leadId);
  const conversation = getConversationForLead(leadId);
  const messages = conversation ? getMessages(conversation.id) : [];
  const savedIds = new Set(getSavedSpaces(user.id).map((s) => s.id));

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-8">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-heading text-xl font-medium">
              {lead.city} · {WORKSPACE_TYPE_LABELS[lead.workspaceType]}
            </h2>
            <LeadStatusBadge status={lead.status} label={SEEKER_STATUS_LABELS[lead.status]} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {lead.teamSize} people · {formatINR(lead.budgetMin)}–{formatINR(lead.budgetMax)}/mo
          </p>
        </div>

        {matches.length > 0 && (
          <section>
            <h3 className="mb-3 font-heading text-lg font-medium">Matched spaces</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              {matches.slice(0, 4).map((m) => (
                <div key={m.id} className="relative">
                  <div className="absolute left-3 top-3 z-10">
                    <MatchBandBadge band={m.band} score={m.score} />
                  </div>
                  <SpaceCard space={m.space!} saved={savedIds.has(m.space!.id)} />
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h3 className="mb-3 font-heading text-lg font-medium">Messages</h3>
          <MessageThread conversationId={conversation?.id ?? null} messages={messages} viewerRole="seeker" />
        </section>
      </div>

      <div>
        <h3 className="mb-3 font-heading text-lg font-medium">Timeline</h3>
        <LeadTimeline history={history} labels={SEEKER_STATUS_LABELS} />
      </div>
    </div>
  );
}
