import { ShieldCheck, Gauge, Handshake, LineChart } from "lucide-react";

const REASONS = [
  {
    icon: ShieldCheck,
    title: "Verified operators only",
    description: "Every listed space is reviewed before it goes live — no stale listings, no bait-and-switch pricing.",
  },
  {
    icon: Gauge,
    title: "Transparent matching",
    description: "Match scores are rules-based and explainable — you see exactly why a space was recommended.",
  },
  {
    icon: Handshake,
    title: "Direct to operators",
    description: "No middleman markup. You negotiate directly with the team that runs the space.",
  },
  {
    icon: LineChart,
    title: "Built for growing teams",
    description: "From a single hot desk to a 50-person floor — spaces that scale as you do.",
  },
];

export function WhyWorkly() {
  return (
    <section className="page-shell py-20">
      <div className="mb-14 max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">Why Workly</p>
        <h2 className="mt-2 font-heading text-3xl font-medium tracking-tight">
          A better way to find workspace
        </h2>
      </div>
      <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
        {REASONS.map((reason) => (
          <div key={reason.title} className="flex gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-muted text-brand">
              <reason.icon className="size-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-medium">{reason.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{reason.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
