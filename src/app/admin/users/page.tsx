import { Badge } from "@/components/ui/badge";
import { SimpleTable } from "@/components/admin/simple-table";
import { listUsersAdmin } from "@/lib/data/admin";
import { formatDate } from "@/lib/format";

export default function AdminUsersPage() {
  const { rows, total } = listUsersAdmin({ pageSize: 50 });

  return (
    <div>
      <h2 className="font-heading text-xl font-medium">Users</h2>
      <p className="mt-1 text-sm text-muted-foreground">{total} registered users.</p>
      <div className="mt-5">
        <SimpleTable
          rows={rows}
          columns={[
            { header: "Name", cell: (r) => <div><p className="font-medium">{r.fullName}</p><p className="text-xs text-muted-foreground">{r.email}</p></div> },
            { header: "Role", cell: (r) => <Badge variant="outline" className="capitalize">{r.role}</Badge> },
            { header: "Joined", cell: (r) => formatDate(r.createdAt) },
          ]}
        />
      </div>
    </div>
  );
}
