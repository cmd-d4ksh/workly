import { Button } from "@/components/ui/button";
import { ContactSpaceDialog } from "@/components/spaces/contact-space-dialog";
import { Space } from "@/lib/types";
import { formatINRFull } from "@/lib/format";

export function BookingPanel({ space }: { space: Space }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.3)]">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Starting from</p>
      <p className="mt-1 font-heading text-2xl font-medium">
        {formatINRFull(space.startingPrice)}<span className="text-sm font-normal text-muted-foreground">/month</span>
      </p>
      <div className="mt-4 flex flex-col gap-2">
        <ContactSpaceDialog
          spaceId={space.id}
          spaceName={space.name}
          mode="quote"
          trigger={
            <Button className="w-full bg-brand text-brand-foreground hover:bg-brand/90">
              Request a quote
            </Button>
          }
        />
        <ContactSpaceDialog
          spaceId={space.id}
          spaceName={space.name}
          mode="tour"
          trigger={<Button variant="outline" className="w-full">Schedule a tour</Button>}
        />
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">No commitment — free to request</p>
    </div>
  );
}
