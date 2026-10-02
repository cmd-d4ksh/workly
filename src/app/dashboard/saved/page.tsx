import { Heart } from "lucide-react";
import { SpaceCard } from "@/components/spaces/space-card";
import { EmptyState } from "@/components/shared/empty-state";
import { getCurrentUser } from "@/lib/auth";
import { getSavedSpaces } from "@/lib/data/saved";

export default async function SavedSpacesPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const spaces = getSavedSpaces(user.id);

  return (
    <div>
      <h2 className="font-heading text-xl font-medium">Saved spaces</h2>
      <p className="mt-1 text-sm text-muted-foreground">Spaces you&rsquo;ve bookmarked for later.</p>

      <div className="mt-6">
        {spaces.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="No saved spaces yet"
            description="Tap the heart icon on any space to save it here for later."
            ctaLabel="Browse spaces"
            ctaHref="/search"
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {spaces.map((space) => <SpaceCard key={space.id} space={space} saved />)}
          </div>
        )}
      </div>
    </div>
  );
}
