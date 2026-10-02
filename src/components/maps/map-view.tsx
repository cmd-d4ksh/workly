"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { Space } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { getMapboxToken, MAPBOX_STYLE } from "@/lib/mapbox";
import { cn } from "@/lib/utils";

interface MapViewProps {
  spaces: Space[];
  hoveredId?: string | null;
  onHover?: (id: string | null) => void;
  onSelect?: (slug: string) => void;
}

/**
 * Renders an interactive Mapbox map with a price-labeled marker per space,
 * synced bidirectionally with the result list's hover state. If
 * NEXT_PUBLIC_MAPBOX_TOKEN isn't configured, falls back to a static list
 * panel instead of breaking the page (per the product spec's demo-mode
 * requirement).
 *
 * `onHover`/`hoveredId` are optional so a Server Component can render a
 * read-only single-space map (e.g. the space detail page) without needing
 * to pass a client-only callback across the server/client boundary.
 */
export function MapView({ spaces, hoveredId = null, onHover = () => {}, onSelect }: MapViewProps) {
  const token = getMapboxToken();
  if (!token) return <MapFallback spaces={spaces} onSelect={onSelect} />;
  return <MapboxCanvas spaces={spaces} hoveredId={hoveredId} onHover={onHover} onSelect={onSelect} token={token} />;
}

function MapFallback({ spaces, onSelect }: { spaces: Space[]; onSelect?: (slug: string) => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-secondary/30 p-8 text-center">
      <MapPin className="size-8 text-muted-foreground" />
      <div>
        <p className="font-medium text-foreground">Locations</p>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          Browse the matching spaces below, or switch to list view for full details.
        </p>
      </div>
      <ul className="w-full max-w-sm divide-y divide-border overflow-hidden rounded-xl border border-border bg-card text-left">
        {spaces.slice(0, 8).map((s) => (
          <li key={s.id}>
            <button
              onClick={() => onSelect?.(s.slug)}
              className="flex w-full items-center justify-between px-4 py-2.5 text-sm hover:bg-secondary/60"
            >
              <span className="truncate">{s.name}</span>
              <span className="shrink-0 font-medium">{formatINR(s.startingPrice)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MapboxCanvas({
  spaces,
  hoveredId,
  onHover,
  onSelect,
  token,
}: {
  spaces: Space[];
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onSelect?: (slug: string) => void;
  token: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("mapbox-gl").Map | null>(null);
  const markersRef = useRef<Map<string, import("mapbox-gl").Marker>>(new Map());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    import("mapbox-gl").then((mapboxgl) => {
      if (cancelled || !containerRef.current || mapRef.current) return;
      mapboxgl.default.accessToken = token;
      const map = new mapboxgl.default.Map({
        container: containerRef.current,
        style: MAPBOX_STYLE,
        center: spaces[0] ? [spaces[0].lng, spaces[0].lat] : [77.5946, 12.9716],
        zoom: 11,
      });
      mapRef.current = map;
      map.on("load", () => setReady(true));
    });

    return () => {
      cancelled = true;
      markersRef.current.forEach((m) => m.remove());
      markersRef.current.clear();
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    let cancelled = false;

    import("mapbox-gl").then((mapboxgl) => {
      if (cancelled || !mapRef.current) return;
      markersRef.current.forEach((m) => m.remove());
      markersRef.current.clear();

      const bounds = new mapboxgl.default.LngLatBounds();
      spaces.forEach((space) => {
        const el = document.createElement("button");
        el.className = "workly-map-pin";
        el.textContent = formatINR(space.startingPrice);
        el.onclick = () => onSelect?.(space.slug);
        el.onmouseenter = () => onHover(space.id);
        el.onmouseleave = () => onHover(null);

        const marker = new mapboxgl.default.Marker({ element: el, anchor: "bottom" })
          .setLngLat([space.lng, space.lat])
          .addTo(mapRef.current!);
        markersRef.current.set(space.id, marker);
        bounds.extend([space.lng, space.lat]);
      });

      if (spaces.length > 1) {
        mapRef.current.fitBounds(bounds, { padding: 60, maxZoom: 13 });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [ready, spaces, onHover, onSelect]);

  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      marker.getElement().classList.toggle("workly-map-pin--active", id === hoveredId);
    });
  }, [hoveredId]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border">
      <div ref={containerRef} className={cn("h-full w-full", !ready && "opacity-0")} />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/30 text-sm text-muted-foreground">
          Loading map…
        </div>
      )}
    </div>
  );
}
