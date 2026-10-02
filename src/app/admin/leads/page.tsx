import { SimpleTable } from "@/components/admin/simple-table";
import { LeadStatusBadge } from "@/components/shared/status-badge";
import { listLeadsAdmin } from "@/lib/data/admin";
import { formatDate, formatINR } from "@/lib/format";

export default function AdminLeadsPage() {
  const { rows, total } = listLeadsAdmin({ pageSize: 50 });

  return (
    <div>
      <h2 className="font-heading text-xl font-medium">Leads</h2>
      <p className="mt-1 text-sm text-muted-foreground">{total} leads across the platform.</p>
      <div className="mt-5">
        <SimpleTable
          rows={rows}
          columns={[
            { header: "Name", cell: (r) => <div><p className="font-medium">{r.contactName}</p><p className="text-xs text-muted-foreground">{r.company}</p></div> },
            { header: "City", cell: (r) => r.city },
            { header: "Budget", cell: (r) => `${formatINR(r.budgetMin)}–${formatINR(r.budgetMax)}` },
            { header: "Status", cell: (r) => <LeadStatusBadge status={r.status} /> },
            { header: "Created", cell: (r) => formatDate(r.createdAt) },
          ]}
        />
      </div>
    </div>
  );
}
