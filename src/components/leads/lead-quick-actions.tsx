"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateLeadStatusAction, addLeadNoteAction } from "@/app/actions/operator";
import { Lead } from "@/lib/types";
import { track } from "@/lib/analytics";

export function LeadQuickActions({ lead }: { lead: Lead }) {
  const [pending, startTransition] = useTransition();
  const [note, setNote] = useState("");

  function setStatus(status: Lead["status"]) {
    startTransition(async () => {
      await updateLeadStatusAction(lead.id, status);
      if (status === "qualified") track("lead_qualified", { leadId: lead.id });
      if (status === "won") track("lead_won", { leadId: lead.id });
      if (status === "lost") track("lead_lost", { leadId: lead.id });
    });
  }

  function submitNote() {
    if (!note.trim()) return;
    startTransition(async () => {
      await addLeadNoteAction(lead.id, note);
      setNote("");
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" disabled={pending} onClick={() => setStatus("contacted")} variant="outline">Mark contacted</Button>
        <Button size="sm" disabled={pending} onClick={() => setStatus("qualified")} variant="outline">Mark qualified</Button>
        <Button size="sm" disabled={pending} onClick={() => setStatus("tour_scheduled")} variant="outline">Schedule tour</Button>
        <Button size="sm" disabled={pending} onClick={() => setStatus("won")} className="bg-emerald-600 text-white hover:bg-emerald-700">Mark won</Button>
        <Button size="sm" disabled={pending} onClick={() => setStatus("lost")} variant="outline" className="text-destructive">Mark lost</Button>
      </div>
      <div>
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add an internal note…"
          rows={2}
        />
        <Button size="sm" className="mt-2" disabled={pending || !note.trim()} onClick={submitNote}>
          Add note
        </Button>
      </div>
    </div>
  );
}
