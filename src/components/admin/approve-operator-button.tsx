"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { approveOperatorAction } from "@/app/actions/admin";

export function ApproveOperatorButton({ operatorId, approved }: { operatorId: string; approved: boolean }) {
  const [pending, startTransition] = useTransition();
  if (approved) return <span className="text-xs text-emerald-600">Approved</span>;
  return (
    <Button size="sm" variant="outline" disabled={pending} onClick={() => startTransition(() => approveOperatorAction(operatorId))}>
      Approve
    </Button>
  );
}
