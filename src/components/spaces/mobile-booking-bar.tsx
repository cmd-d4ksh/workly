import { Button } from "@/components/ui/button";
import { ContactSpaceDialog } from "@/components/spaces/contact-space-dialog";
import { Space } from "@/lib/types";
import { formatINRFull } from "@/lib/format";

export function MobileBookingBar({ space }: { space: Space }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-border bg-background/95 p-3 backdrop-blur-md lg:hidden">
      <div>
        <p className="text-sm font-semibold">{formatINRFull(space.startingPrice)}<span className="font-normal text-muted-foreground">/mo</span></p>
        <p className="text-xs text-muted-foreground">Starting price</p>
      </div>
      <ContactSpaceDialog
        spaceId={space.id}
        spaceName={space.name}
        mode="quote"
        trigger={<Button className="bg-brand text-brand-foreground hover:bg-brand/90">Request a quote</Button>}
      />
    </div>
  );
}
