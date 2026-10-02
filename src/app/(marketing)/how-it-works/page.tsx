import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Faq } from "@/components/marketing/faq";

export const metadata: Metadata = { title: "How it works" };

export default function HowItWorksPage() {
  return (
    <div>
      <div className="page-shell py-16 text-center">
        <h1 className="font-heading text-4xl font-medium tracking-tight">How Workly works</h1>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          From telling us what you need to touring your new space — here&rsquo;s the whole flow.
        </p>
        <Button size="lg" className="mt-7 bg-brand text-brand-foreground hover:bg-brand/90" render={<Link href="/get-started" />}>
          Find my workspace
        </Button>
      </div>
      <HowItWorks />
      <Faq />
    </div>
  );
}
