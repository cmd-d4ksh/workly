import { notFound, redirect } from "next/navigation";
import { MatchBandBadge, LeadStatusBadge } from "@/components/shared/status-badge";
import { LeadTimeline } from "@/components/leads/lead-timeline";
import { MessageThread } from "@/components/leads/message-thread";
import { LeadQuickActions } from "@/components/leads/lead-quick-actions";
import { getCurrentUser } from "@/lib/auth";
import { getOperatorByUserId } from "@/lib/data/operators";
import { getLeadById, getLeadsForOperator, getMatchesForLead, getStatusHistory } from "@/lib/data/leads";
import { getConversationForLead, getMessages } from "@/lib/data/messages";
import { OPERATOR_STATUS_LABELS, WORKSPACE_TYPE_LABELS } from "@/lib/types";
import { formatINR } from "@/lib/format";

export default async function OperatorLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const operator = getOperatorByUserId(user.id);
  if (!operator) redirect("/login");

  const owns = getLeadsForOperator(operator.id).find((r) => r.lead.id === id);
  if (!owns) notFound();

  const lead = getLeadById(id);
  if (!lead) notFound();

  const matches = getMatchesForLead(id).filter((m) => m.space?.operatorId === operator.id);
  const history = getStatusHistory(id);
  const conversation = getConversationForLead(id);
  const messages = conversation ? getMessages(conversation.id) : [];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="flex flex-col gap-8">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-heading text-xl font-medium">{lead.contactName}</h2>
            <LeadStatusBadge status={lead.status} />
            {matches[0] && <MatchBandBadge band={matches[0].band} score={matches[0].score} />}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{lead.company} · {lead.jobTitle}</p>
        </div>

        <section className="grid grid-cols-2 gap-4 rounded-2xl border border-border p-5 sm:grid-cols-3">
          <Field label="Email" value={lead.email} />
          <Field label="Phone" value={lead.phone} />
          <Field label="Location" value={`${lead.city}`} />
          <Field label="Team size" value={lead.teamSize} />
          <Field label="Budget" value={`${formatINR(lead.budgetMin)}–${formatINR(lead.budgetMax)}/mo`} />
          <Field label="Workspace type" value={WORKSPACE_TYPE_LABELS[lead.workspaceType]} />
          <Field label="Move-in" value={lead.moveIn.replace(/_/g, " ")} />
          {matches[0]?.space && <Field label="Assigned space" value={matches[0].space.name} />}
        </section>

        <section>
          <h3 className="mb-3 font-heading text-lg font-medium">Actions</h3>
          <LeadQuickActions lead={lead} />
        </section>

        <section>
          <h3 className="mb-3 font-heading text-lg font-medium">Messages</h3>
          <MessageThread conversationId={conversation?.id ?? null} messages={messages} viewerRole="operator" />
        </section>
      </div>

      <div>
        <h3 className="mb-3 font-heading text-lg font-medium">Activity timeline</h3>
        <LeadTimeline history={history} labels={OPERATOR_STATUS_LABELS} />
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium capitalize">{value}</p>
    </div>
  );
}
