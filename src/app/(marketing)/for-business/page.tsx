import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Gauge, MessagesSquare, Building2, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "For businesses" };

const BENEFITS = [
  {
    icon: MessagesSquare,
    title: "High-intent leads only",
    description: "Every lead has already told us their budget, team size, timeline, and workspace type — no cold outreach required.",
  },
  {
    icon: Gauge,
    title: "Transparent match scoring",
    description: "See exactly why a lead was routed to your space, with a rules-based score across location, budget, capacity, and amenities.",
  },
  {
    icon: Building2,
    title: "A real CRM, not a spreadsheet",
    description: "Track every lead from new to won with status history, notes, and messaging — built for how sales teams actually work.",
  },
  {
    icon: LineChart,
    title: "Analytics that matter",
    description: "Response rate, conversion rate, and revenue influenced — know what's working without exporting a thing.",
  },
];

export default function ForBusinessPage() {
  return (
    <div>
      <div className="page-shell py-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">For operators</p>
        <h1 className="mx-auto mt-2 max-w-2xl font-heading text-4xl font-medium tracking-tight">
          Turn empty desks into qualified conversations
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          List your space on Workly and start receiving leads from teams actively searching in your city —
          already qualified by budget, team size, and timeline.
        </p>
        <Button size="lg" className="mt-7 gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90" render={<Link href="/signup?role=operator" />}>
          List your space <ArrowRight className="size-4" />
        </Button>
      </div>

      <div className="page-shell border-t border-border py-16">
        <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {BENEFITS.map((b) => (
            <div key={b.title} className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-muted text-brand">
                <b.icon className="size-5" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-medium">{b.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="page-shell pb-20 text-center">
        <Button size="lg" variant="outline" render={<Link href="/signup?role=operator" />}>
          Get started — it&rsquo;s free to list
        </Button>
      </div>
    </div>
  );
}
