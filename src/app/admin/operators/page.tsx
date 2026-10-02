import { SimpleTable } from "@/components/admin/simple-table";
import { ApproveOperatorButton } from "@/components/admin/approve-operator-button";
import { listOperatorsAdmin } from "@/lib/data/admin";

export default function AdminOperatorsPage() {
  const { rows, total } = listOperatorsAdmin({ pageSize: 50 });

  return (
    <div>
      <h2 className="font-heading text-xl font-medium">Operators</h2>
      <p className="mt-1 text-sm text-muted-foreground">{total} operators on the platform.</p>
      <div className="mt-5">
        <SimpleTable
          rows={rows}
          columns={[
            { header: "Company", cell: (r) => r.companyName },
            { header: "Plan", cell: (r) => <span className="capitalize">{r.plan}</span> },
            { header: "Spaces", cell: (r) => r.spaceCount },
            { header: "Status", cell: (r) => <ApproveOperatorButton operatorId={r.id} approved={r.approved} /> },
          ]}
        />
      </div>
    </div>
  );
}
