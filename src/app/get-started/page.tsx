import type { Metadata } from "next";
import { FunnelWizard } from "@/components/lead-funnel/funnel-wizard";
import { City, MoveInTimeline, TeamSizeBand, WorkspaceType } from "@/lib/types";

export const metadata: Metadata = {
  title: "Find my workspace",
  description: "Tell us what you need and we'll match you with relevant coworking spaces.",
};

export default async function GetStartedPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

  return (
    <FunnelWizard
      initial={{
        city: (first(params.city) as City) || "",
        teamSize: (first(params.teamSize) as TeamSizeBand) || "",
        workspaceType: (first(params.workspaceType) as WorkspaceType) || "",
        moveIn: (first(params.moveIn) as MoveInTimeline) || "",
      }}
    />
  );
}
