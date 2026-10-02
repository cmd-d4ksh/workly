"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleSavedAction } from "@/app/actions/saved";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function SaveButton({
  spaceId,
  initialSaved,
  floating,
}: {
  spaceId: string;
  initialSaved: boolean;
  floating?: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const next = !saved;
    setSaved(next);
    startTransition(async () => {
      const result = await toggleSavedAction(spaceId);
      if ("error" in result) {
        setSaved(!next);
        toast("Log in to save spaces", {
          action: { label: "Log in", onClick: () => router.push("/login") },
        });
        return;
      }
      if (result.saved) track("space_saved", { spaceId });
    });
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={pending}
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save space"}
      className={cn(
        "size-8 rounded-full",
        floating && "bg-white/90 shadow-sm hover:bg-white"
      )}
    >
      <Heart className={cn("size-4 transition-colors", saved ? "fill-rose-500 text-rose-500" : "text-foreground")} />
    </Button>
  );
}
