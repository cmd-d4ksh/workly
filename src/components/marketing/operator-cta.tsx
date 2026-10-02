import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OperatorCta() {
  return (
    <section className="page-shell py-6">
      <div className="relative overflow-hidden rounded-3xl bg-foreground px-8 py-16 text-background sm:px-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-brand/30 blur-3xl"
        />
        <div className="relative max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-background/60">For operators</p>
          <h2 className="mt-2 font-heading text-3xl font-medium tracking-tight sm:text-4xl">
            Have space to fill?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-background/70">
            Turn empty desks into qualified conversations. List your space and start
            receiving high-intent leads from teams actively searching in your city.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="gap-1.5 bg-background text-foreground hover:bg-background/90"
              render={<Link href="/signup?role=operator" />}
            >
              List your space <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-background hover:bg-background/10 hover:text-background"
              render={<Link href="/for-business" />}
            >
              Learn more
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
