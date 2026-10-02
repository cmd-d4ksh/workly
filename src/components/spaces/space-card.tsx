"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Users, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SaveButton } from "@/components/spaces/save-button";
import { Space } from "@/lib/types";
import { WORKSPACE_TYPE_LABELS } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

export function SpaceCard({
  space,
  saved = false,
  highlighted = false,
  onHover,
  className,
}: {
  space: Space;
  saved?: boolean;
  highlighted?: boolean;
  onHover?: (id: string | null) => void;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all",
        highlighted ? "ring-2 ring-brand" : "hover:border-foreground/20 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)]",
        className
      )}
      onMouseEnter={() => onHover?.(space.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <Link href={`/spaces/${space.slug}`} className="relative block aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={space.images[0]}
          alt={space.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
        {space.verified && (
          <Badge className="absolute left-3 top-3 gap-1 border-0 bg-white/95 text-foreground shadow-sm">
            <BadgeCheck className="size-3.5 text-brand" /> Verified
          </Badge>
        )}
        <div className="absolute right-3 top-3">
          <SaveButton spaceId={space.id} initialSaved={saved} floating />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/spaces/${space.slug}`} className="min-w-0">
            <h3 className="truncate font-heading text-[1.05rem] font-medium leading-tight text-foreground">
              {space.name}
            </h3>
          </Link>
          <div className="flex shrink-0 items-center gap-1 text-sm">
            <Star className="size-3.5 fill-foreground text-foreground" />
            <span className="font-medium">{space.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({space.reviewCount})</span>
          </div>
        </div>

        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-3.5" />
          {space.neighborhood}, {space.city}
        </p>

        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="size-3.5" />
          {WORKSPACE_TYPE_LABELS[space.workspaceTypes[0]]}
          {space.workspaceTypes.length > 1 && ` +${space.workspaceTypes.length - 1}`}
          <span className="text-border">·</span>
          {space.minCapacity}–{space.maxCapacity} people
        </p>

        <div className="mt-auto flex items-end justify-between pt-2">
          <p className="text-sm">
            <span className="font-semibold text-foreground">From {formatINR(space.startingPrice)}</span>
            <span className="text-muted-foreground"> /desk/mo</span>
          </p>
        </div>
      </div>
    </article>
  );
}
