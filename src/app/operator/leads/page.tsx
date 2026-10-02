import { LeadTable } from "@/components/leads/lead-table";
import { getCurrentUser } from "@/lib/auth";
import { getOperatorByUserId } from "@/lib/data/operators";
import { getLeadsForOperator } from "@/lib/data/leads";

export default async function OperatorLeadsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const operator = getOperatorByUserId(user.id);
  if (!operator) return null;
  const rows = getLeadsForOperator(operator.id);

  return (
    <div>
      <h2 className="font-heading text-xl font-medium">Leads</h2>
      <p className="mt-1 text-sm text-muted-foreground">Every lead matched to one of your spaces.</p>
      <div className="mt-6">
        <LeadTable rows={rows} />
      </div>
    </div>
  );
}
