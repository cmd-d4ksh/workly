"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateSpaceStatusAction } from "@/app/actions/operator";
import { SpaceStatus } from "@/lib/types";

export function SpaceStatusActions({ spaceId, status }: { spaceId: string; status: SpaceStatus }) {
  const [pending, startTransition] = useTransition();

  function setStatus(next: SpaceStatus, message: string) {
    startTransition(async () => {
      await updateSpaceStatusAction(spaceId, next);
      toast.success(message);
    });
  }

  if (status === "draft") {
    return (
      <Button
        disabled={pending}
        onClick={() => setStatus("pending_review", "Submitted for review")}
        className="bg-brand text-brand-foreground hover:bg-brand/90"
      >
        Submit for review
      </Button>
    );
  }

  if (status === "published") {
    return (
      <Button
        variant="outline"
        disabled={pending}
        className="text-destructive"
        onClick={() => setStatus("draft", "Listing unpublished")}
      >
        Unpublish
      </Button>
    );
  }

  if (status === "pending_review") {
    return <p className="text-sm text-muted-foreground">Waiting on admin review.</p>;
  }

  return (
    <Button
      variant="outline"
      disabled={pending}
      onClick={() => setStatus("draft", "Moved back to draft")}
    >
      Move back to draft
    </Button>
  );
}
