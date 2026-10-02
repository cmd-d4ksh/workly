"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateOperatorPlanAction, updateOperatorProfileAction } from "@/app/actions/operator";
import { Operator, PlanTier } from "@/lib/types";

export function CompanySettingsForm({ operator }: { operator: Operator }) {
  const [pending, startTransition] = useTransition();
  const [fields, setFields] = useState({
    companyName: operator.companyName,
    contactEmail: operator.contactEmail,
    contactPhone: operator.contactPhone,
  });

  function save() {
    startTransition(async () => {
      await updateOperatorProfileAction(fields);
      toast.success("Company details saved");
    });
  }

  return (
    <div className="mt-5 flex flex-col gap-4">
      <div>
        <Label htmlFor="companyName">Company name</Label>
        <Input
          id="companyName"
          className="mt-1.5"
          value={fields.companyName}
          onChange={(e) => setFields((f) => ({ ...f, companyName: e.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor="contactEmail">Contact email</Label>
        <Input
          id="contactEmail"
          className="mt-1.5"
          value={fields.contactEmail}
          onChange={(e) => setFields((f) => ({ ...f, contactEmail: e.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor="contactPhone">Contact phone</Label>
        <Input
          id="contactPhone"
          className="mt-1.5"
          value={fields.contactPhone}
          onChange={(e) => setFields((f) => ({ ...f, contactPhone: e.target.value }))}
        />
      </div>
      <Button
        type="button"
        disabled={pending}
        onClick={save}
        className="mt-1 w-fit bg-brand text-brand-foreground hover:bg-brand/90"
      >
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </div>
  );
}

export function PlanActionButton({ plan, isCurrent }: { plan: PlanTier; isCurrent: boolean }) {
  const [pending, startTransition] = useTransition();

  function upgrade() {
    startTransition(async () => {
      await updateOperatorPlanAction(plan);
      toast.success(`You're now on the ${plan} plan`);
    });
  }

  return (
    <Button
      variant={isCurrent ? "outline" : "default"}
      disabled={isCurrent || pending}
      onClick={upgrade}
      className="mt-5 w-full"
    >
      {isCurrent ? "Current plan" : pending ? "Updating…" : "Switch plan"}
    </Button>
  );
}
