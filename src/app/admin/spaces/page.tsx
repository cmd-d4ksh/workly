import { SimpleTable } from "@/components/admin/simple-table";
import { SpaceStatusBadge } from "@/components/shared/status-badge";
import { SpaceModerationActions } from "@/components/admin/space-moderation-actions";
import { listSpacesAdmin } from "@/lib/data/admin";
import { formatINR } from "@/lib/format";

export default function AdminSpacesPage() {
  const { rows, total } = listSpacesAdmin({ pageSize: 50 });

  return (
    <div>
      <h2 className="font-heading text-xl font-medium">Spaces</h2>
      <p className="mt-1 text-sm text-muted-foreground">{total} spaces across the platform.</p>
      <div className="mt-5">
        <SimpleTable
          rows={rows}
          columns={[
            { header: "Name", cell: (r) => <div><p className="font-medium">{r.name}</p><p className="text-xs text-muted-foreground">{r.city}</p></div> },
            { header: "Price", cell: (r) => `${formatINR(r.startingPrice)}/mo` },
            { header: "Status", cell: (r) => <SpaceStatusBadge status={r.status} /> },
            { header: "Actions", cell: (r) => <SpaceModerationActions spaceId={r.id} status={r.status} /> },
          ]}
        />
      </div>
    </div>
  );
}
