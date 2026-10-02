import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactSpaceDialog } from "@/components/spaces/contact-space-dialog";
import { Space } from "@/lib/types";
import { WORKSPACE_TYPE_LABELS } from "@/lib/types";
import { formatINRFull } from "@/lib/format";

export function WorkspaceOptionsList({ space }: { space: Space }) {
  return (
    <div className="divide-y divide-border rounded-2xl border border-border">
      {space.workspaceOptions.map((option) => (
        <div key={option.id} className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
          <div>
            <p className="font-medium text-foreground">{WORKSPACE_TYPE_LABELS[option.type]}</p>
            <p className="text-sm text-muted-foreground">
              {option.minCapacity === option.maxCapacity
                ? `${option.minCapacity} person`
                : `${option.minCapacity}–${option.maxCapacity} people`}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs">
              {option.available ? (
                <>
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  <span className="text-emerald-700">{option.availableUnits} available</span>
                </>
              ) : (
                <>
                  <XCircle className="size-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Currently full</span>
                </>
              )}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-right">
              <span className="block font-semibold text-foreground">{formatINRFull(option.priceMonthly)}</span>
              <span className="text-xs text-muted-foreground">/month</span>
            </p>
            <ContactSpaceDialog
              spaceId={space.id}
              spaceName={space.name}
              mode="quote"
              trigger={<Button variant="outline" size="sm">Get pricing</Button>}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
