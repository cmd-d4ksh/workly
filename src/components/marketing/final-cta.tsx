import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="border-t border-border py-20">
      <div className="page-shell flex flex-col items-center text-center">
        <h2 className="max-w-xl font-heading text-3xl font-medium tracking-tight sm:text-4xl">
          Your next workspace is a few minutes away.
        </h2>
        <p className="mt-3 max-w-md text-muted-foreground">
          Tell us what you need and we&rsquo;ll match you with spaces that fit — free, and no obligation.
        </p>
        <Button
          size="lg"
          className="mt-7 gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90"
          render={<Link href="/get-started" />}
        >
          Find my workspace <ArrowRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}
