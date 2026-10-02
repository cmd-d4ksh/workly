import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { SpaceStatusBadge } from "@/components/shared/status-badge";
import { SpaceStatusActions } from "@/components/operator/space-status-actions";
import { getCurrentUser } from "@/lib/auth";
import { getOperatorByUserId } from "@/lib/data/operators";
import { getSpaceById } from "@/lib/data/spaces";
import { AMENITY_LABELS, WORKSPACE_TYPE_LABELS } from "@/lib/types";
import { formatINRFull } from "@/lib/format";

export default async function EditSpacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const operator = getOperatorByUserId(user.id);
  const space = getSpaceById(id);
  if (!space || space.operatorId !== operator?.id) notFound();

  return (
    <div className="max-w-3xl">
      <div className="mb-5 flex items-center gap-3">
        <h2 className="font-heading text-xl font-medium">{space.name}</h2>
        <SpaceStatusBadge status={space.status} />
      </div>

      <div className="relative mb-6 aspect-[16/7] overflow-hidden rounded-2xl bg-muted">
        <Image src={space.images[0]} alt={space.name} fill className="object-cover" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-border p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pricing</p>
          <p className="mt-2 text-lg font-medium">From {formatINRFull(space.startingPrice)}/mo</p>
          <ul className="mt-3 flex flex-col gap-1.5 text-sm text-muted-foreground">
            {space.workspaceOptions.map((o) => (
              <li key={o.id} className="flex justify-between">
                <span>{WORKSPACE_TYPE_LABELS[o.type]}</span>
                <span className="font-medium text-foreground">{formatINRFull(o.priceMonthly)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Amenities</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {space.amenities.map((a) => (
              <span key={a} className="rounded-full bg-secondary px-2.5 py-1 text-xs">{AMENITY_LABELS[a]}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <SpaceStatusActions spaceId={space.id} status={space.status} />
      </div>
    </div>
  );
}
