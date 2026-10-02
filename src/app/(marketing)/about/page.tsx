import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="page-shell py-20">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">About Workly</p>
        <h1 className="mt-2 font-heading text-4xl font-medium tracking-tight">
          Built to make workspace search less painful
        </h1>
        <p className="mt-5 leading-relaxed text-muted-foreground">
          Workly is a demo marketplace connecting teams looking for flexible office space with coworking
          operators who have it. We built it to show what a modern, high-intent lead-generation marketplace
          looks like end to end — transparent matching, a real operator CRM, and no filler.
        </p>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Workly, its listed spaces, and its testimonials are fictional and built for demonstration purposes.
        </p>
      </div>
    </div>
  );
}
