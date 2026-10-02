import { Suspense } from "react";
import type { Metadata } from "next";
import { Input } from "@/components/ui/input";
import { FilterSidebar } from "@/components/marketplace/filter-sidebar";
import { SortSelect } from "@/components/marketplace/sort-select";
import { SearchView } from "@/components/marketplace/search-view";
import { SiteHeader } from "@/components/layout/site-header";
import { searchSpaces, SpaceSearchFilters } from "@/lib/data/spaces";
import { getCurrentUser } from "@/lib/auth";
import { getSavedSpaces } from "@/lib/data/saved";
import { AmenityKey, City, WorkspaceType } from "@/lib/types";

export const metadata: Metadata = {
  title: "Search coworking spaces",
  description: "Browse flexible offices and coworking spaces, filtered by location, price, and amenities.",
};

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}
function toStr(value: string | string[] | undefined): string | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const user = await getCurrentUser();
  const savedIds = new Set(user ? getSavedSpaces(user.id).map((s) => s.id) : []);

  const filters: SpaceSearchFilters = {
    query: toStr(params.q),
    city: toStr(params.city) as City | undefined,
    workspaceTypes: toArray(params.type) as WorkspaceType[],
    amenities: toArray(params.amenity) as AmenityKey[],
    minPrice: params.minPrice ? Number(toStr(params.minPrice)) : undefined,
    maxPrice: params.maxPrice ? Number(toStr(params.maxPrice)) : undefined,
    minCapacity: params.minCapacity ? Number(toStr(params.minCapacity)) : undefined,
    sort: (toStr(params.sort) as SpaceSearchFilters["sort"]) ?? "recommended",
    page: params.page ? Number(toStr(params.page)) : 1,
    pageSize: 24,
  };

  const { spaces, total } = searchSpaces(filters);

  return (
    <>
      <SiteHeader />
      <main className="page-shell flex-1 py-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <form className="flex-1 sm:max-w-md">
            <Input
              name="q"
              defaultValue={filters.query}
              placeholder="Search by name, neighborhood, or city"
            />
          </form>
          <div className="flex items-center gap-2">
            <p className="hidden text-sm text-muted-foreground sm:block">{total} results</p>
            <Suspense>
              <SortSelect />
            </Suspense>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <Suspense>
            <FilterSidebar />
          </Suspense>
          <div className="min-w-0 flex-1">
            <SearchView spaces={spaces} savedIds={savedIds} />
          </div>
        </div>
      </main>
    </>
  );
}
