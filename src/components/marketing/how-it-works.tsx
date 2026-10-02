import { ClipboardList, Sparkles, CalendarCheck } from "lucide-react";

const STEPS = [
  {
    icon: ClipboardList,
    title: "Tell us what you need",
    description: "Location, team size, workspace type, and budget — takes about two minutes.",
  },
  {
    icon: Sparkles,
    title: "We match you with spaces",
    description: "Our matching engine scores every relevant space against your requirements.",
  },
  {
    icon: CalendarCheck,
    title: "Tour and choose",
    description: "Book tours directly with operators and move in on your timeline.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-border bg-secondary/30 py-20">
      <div className="page-shell">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">How it works</p>
          <h2 className="mt-2 font-heading text-3xl font-medium tracking-tight">
            From search to signed, in three steps
          </h2>
        </div>
        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <div key={step.title} className="relative flex flex-col items-start rounded-2xl border border-border bg-card p-6">
              <span className="font-heading text-sm text-muted-foreground">0{index + 1}</span>
              <div className="my-4 flex size-10 items-center justify-center rounded-xl bg-brand-muted text-brand">
                <step.icon className="size-5" />
              </div>
              <h3 className="font-heading text-lg font-medium">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
