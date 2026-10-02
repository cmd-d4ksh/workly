import { NewSpaceForm } from "@/components/operator/new-space-form";

export default function NewSpacePage() {
  return (
    <div className="max-w-2xl">
      <h2 className="font-heading text-xl font-medium">Add a new space</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Start with the basics — you can fill in pricing, amenities, and photos next.
      </p>
      <div className="mt-6">
        <NewSpaceForm />
      </div>
    </div>
  );
}
