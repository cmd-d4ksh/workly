"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { approveSpaceAction, rejectSpaceAction, suspendSpaceAction } from "@/app/actions/admin";
import { SpaceStatus } from "@/lib/types";

export function SpaceModerationActions({ spaceId, status }: { spaceId: string; status: SpaceStatus }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex gap-1.5">
      {status !== "published" && (
        <Button size="sm" variant="outline" disabled={pending} onClick={() => startTransition(() => approveSpaceAction(spaceId))}>
          Approve
        </Button>
      )}
      {status !== "rejected" && (
        <Button size="sm" variant="outline" className="text-destructive" disabled={pending} onClick={() => startTransition(() => rejectSpaceAction(spaceId))}>
          Reject
        </Button>
      )}
      {status === "published" && (
        <Button size="sm" variant="outline" disabled={pending} onClick={() => startTransition(() => suspendSpaceAction(spaceId))}>
          Suspend
        </Button>
      )}
    </div>
  );
}
