/**
 * The Mapbox token used here is the public, domain-restricted token
 * (NEXT_PUBLIC_MAPBOX_TOKEN) — Mapbox's GL JS client requires a token in
 * the browser by design, so this is not a secret. Never put a Mapbox
 * *secret* token in client code; secret tokens (style/tileset management)
 * stay server-only and are unused by this app.
 */
export function getMapboxToken(): string | null {
  return process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? null;
}

export const MAPBOX_STYLE = "mapbox://styles/mapbox/light-v11";
