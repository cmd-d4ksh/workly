import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpaceStatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Building2 } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getOperatorByUserId } from "@/lib/data/operators";
import { getSpacesByOperator } from "@/lib/data/spaces";
import { formatINR } from "@/lib/format";

export default async function OperatorSpacesPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const operator = getOperatorByUserId(user.id);
  if (!operator) return null;
  const spaces = getSpacesByOperator(operator.id);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-medium">Spaces</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage your listed workspaces.</p>
        </div>
        <Button className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90" render={<Link href="/operator/spaces/new" />}>
          <Plus className="size-4" /> Add space
        </Button>
      </div>

      {spaces.length === 0 ? (
        <EmptyState icon={Building2} title="No spaces yet" description="Add your first space to start receiving leads." ctaLabel="Add space" ctaHref="/operator/spaces/new" />
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-2xl border border-border">
          {spaces.map((space) => (
            <Link
              key={space.id}
              href={`/operator/spaces/${space.id}`}
              className="flex flex-wrap items-center justify-between gap-3 p-4 transition-colors hover:bg-secondary/40"
            >
              <div>
                <p className="font-medium">{space.name}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {space.neighborhood}, {space.city} · From {formatINR(space.startingPrice)}/mo
                </p>
              </div>
              <SpaceStatusBadge status={space.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
