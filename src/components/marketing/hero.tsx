import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { HeroSearch } from "@/components/marketing/hero-search";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background pb-20 pt-16 sm:pt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,var(--brand-muted)_0%,transparent_70%)] opacity-60"
      />
      <div className="page-shell grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="max-w-xl">
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Rules-based matching, not guesswork <ArrowUpRight className="size-3" />
          </Link>
          <h1 className="mt-5 font-heading text-[2.6rem] font-medium leading-[1.08] tracking-tight text-balance sm:text-6xl">
            Your next workspace is closer than you think.
          </h1>
          <p className="mt-5 max-w-lg text-[1.05rem] leading-relaxed text-muted-foreground text-balance">
            Discover flexible offices, coworking spaces and private workspaces built
            around the way your team actually works.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <p className="text-sm text-muted-foreground">Have space to fill?</p>
            <Button
              variant="link"
              className="h-auto p-0 text-sm font-semibold text-foreground"
              render={<Link href="/signup?role=operator" />}
            >
              List your space →
            </Button>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)]">
            <Image
              src="https://picsum.photos/seed/workly-hero-main/900/1120"
              alt="A modern coworking space"
              fill
              priority
              sizes="(max-width: 1024px) 0px, 40vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -left-10 bottom-10 w-56 rounded-2xl border border-border bg-card p-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.3)]">
            <div className="relative mb-3 aspect-video overflow-hidden rounded-lg">
              <Image
                src="https://picsum.photos/seed/workly-hero-card/400/240"
                alt="Private office"
                fill
                sizes="224px"
                className="object-cover"
              />
            </div>
            <p className="text-sm font-medium">Atlas House BKC</p>
            <p className="text-xs text-muted-foreground">Private offices · 2–12 people</p>
            <p className="mt-1 text-sm font-semibold">From ₹18,500<span className="font-normal text-muted-foreground">/mo</span></p>
          </div>
        </div>
      </div>

      <div className="page-shell mt-10">
        <HeroSearch />
      </div>
    </section>
  );
}
