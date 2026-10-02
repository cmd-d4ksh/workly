"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { List, Map as MapIcon, Columns2, SlidersHorizontal } from "lucide-react";
import { SpaceCard } from "@/components/spaces/space-card";
import { MapView } from "@/components/maps/map-view";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Space } from "@/lib/types";
import { cn } from "@/lib/utils";

type ViewMode = "list" | "map" | "split";

export function SearchView({ spaces, savedIds }: { spaces: Space[]; savedIds: Set<string> }) {
  const [view, setView] = useState<ViewMode>("split");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const router = useRouter();

  if (spaces.length === 0) {
    return (
      <EmptyState
        icon={SlidersHorizontal}
        title="No spaces match your current filters."
        description="Try widening your price range, clearing an amenity filter, or searching a different city."
        ctaLabel="Clear filters"
        ctaHref="/search"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{spaces.length} spaces found</p>
        <div className="hidden items-center gap-1 rounded-full border border-border p-0.5 sm:flex">
          {([
            { mode: "list", icon: List },
            { mode: "split", icon: Columns2 },
            { mode: "map", icon: MapIcon },
          ] as const).map(({ mode, icon: Icon }) => (
            <Button
              key={mode}
              size="sm"
              variant={view === mode ? "default" : "ghost"}
              className={cn("h-7 gap-1.5 rounded-full px-3 capitalize", view === mode && "shadow-none")}
              onClick={() => setView(mode)}
            >
              <Icon className="size-3.5" /> {mode}
            </Button>
          ))}
        </div>
      </div>

      <div className={cn("grid gap-6", view === "split" && "lg:grid-cols-[1fr_440px]")}>
        {view !== "map" && (
          <div
            className={cn(
              "grid grid-cols-1 gap-5",
              view === "list" ? "sm:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2"
            )}
          >
            {spaces.map((space) => (
              <SpaceCard
                key={space.id}
                space={space}
                saved={savedIds.has(space.id)}
                highlighted={hoveredId === space.id}
                onHover={setHoveredId}
              />
            ))}
          </div>
        )}

        {view !== "list" && (
          <div className={cn("h-[500px]", view === "map" && "h-[70vh]")}>
            <MapView
              spaces={spaces}
              hoveredId={hoveredId}
              onHover={setHoveredId}
              onSelect={(slug) => router.push(`/spaces/${slug}`)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
