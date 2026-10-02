import Link from "next/link";
import { MessagesSquare } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { getCurrentUser } from "@/lib/auth";
import { getOperatorByUserId } from "@/lib/data/operators";
import { getLeadsForOperator } from "@/lib/data/leads";
import { getConversationForLead, getMessages } from "@/lib/data/messages";
import { formatRelativeDate } from "@/lib/format";

export default async function OperatorMessagesPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const operator = getOperatorByUserId(user.id);
  if (!operator) return null;

  const rows = getLeadsForOperator(operator.id)
    .map((r) => {
      const conversation = getConversationForLead(r.lead.id);
      const messages = conversation ? getMessages(conversation.id) : [];
      return { ...r, lastMessage: messages[messages.length - 1] };
    })
    .filter((r) => r.lastMessage);

  return (
    <div>
      <h2 className="font-heading text-xl font-medium">Messages</h2>
      <p className="mt-1 text-sm text-muted-foreground">Conversations with leads across all your spaces.</p>

      <div className="mt-6">
        {rows.length === 0 ? (
          <EmptyState icon={MessagesSquare} title="No conversations yet" description="Messages with leads will appear here once you make contact." />
        ) : (
          <div className="flex flex-col divide-y divide-border rounded-2xl border border-border">
            {rows.map((r) => (
              <Link key={r.lead.id} href={`/operator/leads/${r.lead.id}`} className="flex items-center justify-between gap-3 p-4 hover:bg-secondary/40">
                <div className="min-w-0">
                  <p className="font-medium">{r.lead.contactName} · {r.lead.company}</p>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">{r.lastMessage!.body}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{formatRelativeDate(r.lastMessage!.createdAt)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
