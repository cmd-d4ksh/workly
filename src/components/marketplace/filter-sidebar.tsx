"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AMENITY_KEYS, AMENITY_LABELS, CITIES, WORKSPACE_TYPE_LABELS, WORKSPACE_TYPES } from "@/lib/types";
import { formatINRFull } from "@/lib/format";

const MAX_PRICE = 60000;

function FilterBody({
  city, setCity,
  types, toggleType,
  amenities, toggleAmenity,
  priceRange, setPriceRange,
  minCapacity, setMinCapacity,
}: {
  city: string;
  setCity: (v: string) => void;
  types: string[];
  toggleType: (t: string) => void;
  amenities: string[];
  toggleAmenity: (a: string) => void;
  priceRange: [number, number];
  setPriceRange: (v: [number, number]) => void;
  minCapacity: string;
  setMinCapacity: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Location
        </Label>
        <Select value={city || "all"} onValueChange={(v) => setCity(v === "all" ? "" : v ?? "")}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Any city" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any city</SelectItem>
            {CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Workspace type
        </Label>
        <div className="flex flex-col gap-2.5">
          {WORKSPACE_TYPES.map((t) => (
            <label key={t} className="flex items-center gap-2.5 text-sm">
              <Checkbox checked={types.includes(t)} onCheckedChange={() => toggleType(t)} />
              {WORKSPACE_TYPE_LABELS[t]}
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Price range
        </Label>
        <Slider
          min={0}
          max={MAX_PRICE}
          step={1000}
          value={priceRange}
          onValueChange={(v) => setPriceRange(v as [number, number])}
        />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{formatINRFull(priceRange[0])}</span>
          <span>{formatINRFull(priceRange[1])}{priceRange[1] === MAX_PRICE ? "+" : ""}</span>
        </div>
      </div>

      <div>
        <Label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Capacity
        </Label>
        <Select value={minCapacity || "any"} onValueChange={(v) => setMinCapacity(v === "any" ? "" : v ?? "")}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Any size" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any size</SelectItem>
            <SelectItem value="5">5+ people</SelectItem>
            <SelectItem value="10">10+ people</SelectItem>
            <SelectItem value="25">25+ people</SelectItem>
            <SelectItem value="50">50+ people</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Amenities
        </Label>
        <div className="flex flex-col gap-2.5">
          {AMENITY_KEYS.map((a) => (
            <label key={a} className="flex items-center gap-2.5 text-sm">
              <Checkbox checked={amenities.includes(a)} onCheckedChange={() => toggleAmenity(a)} />
              {AMENITY_LABELS[a]}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [types, setTypes] = useState<string[]>(searchParams.getAll("type"));
  const [amenities, setAmenities] = useState<string[]>(searchParams.getAll("amenity"));
  const [priceRange, setPriceRangeState] = useState<[number, number]>([
    Number(searchParams.get("minPrice") ?? 0),
    Number(searchParams.get("maxPrice") ?? MAX_PRICE),
  ]);
  const [minCapacity, setMinCapacity] = useState(searchParams.get("minCapacity") ?? "");
  const [open, setOpen] = useState(false);

  const applyFilters = useCallback(
    (overrides: Partial<{
      city: string; types: string[]; amenities: string[]; priceRange: [number, number]; minCapacity: string;
    }> = {}) => {
      const next = new URLSearchParams(searchParams.toString());
      const state = {
        city, types, amenities, priceRange, minCapacity,
        ...overrides,
      };
      next.delete("city"); next.delete("type"); next.delete("amenity");
      next.delete("minPrice"); next.delete("maxPrice"); next.delete("minCapacity");
      next.delete("page");

      if (state.city) next.set("city", state.city);
      state.types.forEach((t) => next.append("type", t));
      state.amenities.forEach((a) => next.append("amenity", a));
      if (state.priceRange[0] > 0) next.set("minPrice", String(state.priceRange[0]));
      if (state.priceRange[1] < MAX_PRICE) next.set("maxPrice", String(state.priceRange[1]));
      if (state.minCapacity) next.set("minCapacity", state.minCapacity);

      router.push(`${pathname}?${next.toString()}`);
      setOpen(false);
    },
    [city, types, amenities, priceRange, minCapacity, pathname, router, searchParams]
  );

  function toggleType(t: string) {
    const next = types.includes(t) ? types.filter((x) => x !== t) : [...types, t];
    setTypes(next);
    applyFilters({ types: next });
  }
  function toggleAmenity(a: string) {
    const next = amenities.includes(a) ? amenities.filter((x) => x !== a) : [...amenities, a];
    setAmenities(next);
    applyFilters({ amenities: next });
  }
  function handleCity(v: string) {
    setCity(v);
    applyFilters({ city: v });
  }
  function handleCapacity(v: string) {
    setMinCapacity(v);
    applyFilters({ minCapacity: v });
  }

  const props = {
    city, setCity: handleCity,
    types, toggleType,
    amenities, toggleAmenity,
    priceRange, setPriceRange: setPriceRangeState,
    minCapacity, setMinCapacity: handleCapacity,
  };

  return (
    <>
      <aside className="hidden w-64 shrink-0 lg:block">
        <FilterBody {...props} />
        <Button variant="outline" size="sm" className="mt-6 w-full" onClick={() => applyFilters()}>
          Apply price range
        </Button>
      </aside>

      <div className="mb-4 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger render={<Button variant="outline" className="gap-2" />}>
            <SlidersHorizontal className="size-4" /> Filters
          </SheetTrigger>
          <SheetContent side="left" className="w-[320px] overflow-y-auto p-6">
            <SheetHeader className="px-0">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <FilterBody {...props} />
              <Button className="mt-6 w-full" onClick={() => applyFilters()}>
                Show results
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
