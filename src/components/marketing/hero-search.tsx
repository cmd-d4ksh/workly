"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Users, Building2, CalendarClock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CITIES, MOVE_IN_LABELS, TEAM_SIZE_BANDS, WORKSPACE_TYPE_LABELS, WORKSPACE_TYPES } from "@/lib/types";
import { track } from "@/lib/analytics";

const FIELD_CLASS =
  "flex min-w-0 items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-3 text-left lg:rounded-none lg:border-0 lg:bg-transparent lg:px-4 lg:py-0";

export function HeroSearch() {
  const router = useRouter();
  const [city, setCity] = useState<string>("");
  const [teamSize, setTeamSize] = useState<string>("");
  const [workspaceType, setWorkspaceType] = useState<string>("");
  const [moveIn, setMoveIn] = useState<string>("");

  function handleSubmit() {
    track("search_started", { city, teamSize, workspaceType, moveIn });
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (teamSize) params.set("teamSize", teamSize);
    if (workspaceType) params.set("workspaceType", workspaceType);
    if (moveIn) params.set("moveIn", moveIn);
    router.push(`/get-started?${params.toString()}`);
  }

  return (
    <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-3 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.18)] lg:rounded-full lg:border-border lg:p-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:items-stretch lg:gap-0 lg:divide-x lg:divide-border">
        <div className={FIELD_CLASS}>
          <MapPin className="size-4 shrink-0 text-muted-foreground" />
          <Select value={city} onValueChange={(value) => setCity(value ?? "")}>
            <SelectTrigger className="h-auto w-full min-w-0 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 [&>span]:truncate [&>svg]:hidden">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              {CITIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={FIELD_CLASS}>
          <Users className="size-4 shrink-0 text-muted-foreground" />
          <Select value={teamSize} onValueChange={(value) => setTeamSize(value ?? "")}>
            <SelectTrigger className="h-auto w-full min-w-0 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 [&>span]:truncate [&>svg]:hidden">
              <SelectValue placeholder="Team size" />
            </SelectTrigger>
            <SelectContent>
              {TEAM_SIZE_BANDS.map((b) => (
                <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={FIELD_CLASS}>
          <Building2 className="size-4 shrink-0 text-muted-foreground" />
          <Select value={workspaceType} onValueChange={(value) => setWorkspaceType(value ?? "")}>
            <SelectTrigger className="h-auto w-full min-w-0 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 [&>span]:truncate [&>svg]:hidden">
              <SelectValue placeholder="Workspace type" />
            </SelectTrigger>
            <SelectContent>
              {WORKSPACE_TYPES.map((t) => (
                <SelectItem key={t} value={t}>{WORKSPACE_TYPE_LABELS[t]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={FIELD_CLASS}>
          <CalendarClock className="size-4 shrink-0 text-muted-foreground" />
          <Select value={moveIn} onValueChange={(value) => setMoveIn(value ?? "")}>
            <SelectTrigger className="h-auto w-full min-w-0 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 [&>span]:truncate [&>svg]:hidden">
              <SelectValue placeholder="Move-in date" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(MOVE_IN_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="lg:p-1.5">
          <Button
            size="lg"
            onClick={handleSubmit}
            className="w-full gap-1.5 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 lg:w-auto lg:rounded-full"
          >
            Find my workspace <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
