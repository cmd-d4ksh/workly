"use client";

import { useActionState, useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TEAM_SIZE_BANDS } from "@/lib/types";
import { contactSpaceAction, ContactActionState } from "@/app/actions/leads";
import { track } from "@/lib/analytics";

const initialState: ContactActionState = {};

export function ContactSpaceDialog({
  spaceId,
  spaceName,
  trigger,
  mode,
}: {
  spaceId: string;
  spaceName: string;
  trigger: React.ReactElement;
  mode: "quote" | "tour";
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(contactSpaceAction, initialState);

  useEffect(() => {
    if (state.success) {
      track(mode === "tour" ? "tour_requested" : "operator_contacted", { spaceId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) formAction(new FormData());
      }}
    >
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md">
        {state.success ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="size-10 text-brand" />
            <DialogTitle>Request sent</DialogTitle>
            <p className="text-sm text-muted-foreground">
              {spaceName} has received your {mode === "tour" ? "tour request" : "quote request"} and will
              follow up directly by email or phone.
            </p>
            <Button className="mt-2" onClick={() => setOpen(false)}>Done</Button>
          </div>
        ) : (
          <form action={formAction}>
            <DialogHeader>
              <DialogTitle>{mode === "tour" ? "Schedule a tour" : "Request a quote"}</DialogTitle>
              <DialogDescription>
                Sent directly to {spaceName}. They typically respond within a day.
              </DialogDescription>
            </DialogHeader>

            <input type="hidden" name="spaceId" value={spaceId} />

            <div className="mt-4 grid gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" name="name" required className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" name="company" required className="mt-1.5" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" required className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label htmlFor="teamSize">Team size</Label>
                <Select name="teamSize" defaultValue="2-5">
                  <SelectTrigger className="mt-1.5 w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TEAM_SIZE_BANDS.map((b) => (
                      <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {mode === "tour" && (
                <div>
                  <Label htmlFor="tourDate">Preferred date</Label>
                  <Input id="tourDate" name="tourDate" type="date" className="mt-1.5" />
                </div>
              )}
              <div>
                <Label htmlFor="message">Message (optional)</Label>
                <Textarea id="message" name="message" rows={3} className="mt-1.5" placeholder="Anything specific you'd like them to know?" />
              </div>
              {state.error && <p className="text-sm text-destructive">{state.error}</p>}
            </div>

            <Button type="submit" disabled={pending} className="mt-5 w-full bg-brand text-brand-foreground hover:bg-brand/90">
              {pending ? "Sending…" : mode === "tour" ? "Request tour" : "Send request"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
