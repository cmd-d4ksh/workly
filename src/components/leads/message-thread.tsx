"use client";

import { useState, useTransition } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Message, Role } from "@/lib/types";
import { formatRelativeDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { sendMessageAction } from "@/app/actions/messages";

export function MessageThread({
  conversationId,
  messages,
  viewerRole,
}: {
  conversationId: string | null;
  messages: Message[];
  viewerRole: Role;
}) {
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();
  const [localMessages, setLocalMessages] = useState(messages);

  function handleSend() {
    if (!body.trim() || !conversationId) return;
    const text = body;
    setBody("");
    startTransition(async () => {
      const message = await sendMessageAction(conversationId, text);
      if (message) setLocalMessages((prev) => [...prev, message]);
    });
  }

  if (!conversationId) {
    return <p className="text-sm text-muted-foreground">No conversation yet — messages appear here once contact is made.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex max-h-96 flex-col gap-3 overflow-y-auto rounded-2xl border border-border p-4">
        {localMessages.length === 0 && (
          <p className="text-sm text-muted-foreground">No messages yet.</p>
        )}
        {localMessages.map((m) => {
          const isViewer = m.senderRole === viewerRole;
          return (
            <div key={m.id} className={cn("flex flex-col", isViewer ? "items-end" : "items-start")}>
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm",
                  isViewer ? "bg-foreground text-background" : "bg-secondary text-foreground"
                )}
              >
                {m.body}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {m.senderName} · {formatRelativeDate(m.createdAt)}
              </p>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a message…"
          rows={2}
          className="resize-none"
        />
        <Button onClick={handleSend} disabled={pending || !body.trim()} className="self-end">
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}
