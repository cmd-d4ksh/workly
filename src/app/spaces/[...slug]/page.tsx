import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BadgeCheck, MapPin, Star } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { ImageGallery } from "@/components/spaces/image-gallery";
import { WorkspaceOptionsList } from "@/components/spaces/workspace-options-list";
import { ReviewsSection } from "@/components/spaces/reviews-section";
import { BookingPanel } from "@/components/spaces/booking-panel";
import { MobileBookingBar } from "@/components/spaces/mobile-booking-bar";
import { SaveButton } from "@/components/spaces/save-button";
import { ShareButton } from "@/components/spaces/share-button";
import { SpaceCard } from "@/components/spaces/space-card";
import { MapView } from "@/components/maps/map-view";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getSimilarSpaces, getSpaceBySlug } from "@/lib/data/spaces";
import { getReviewsForSpace, ratingDistribution } from "@/lib/data/reviews";
import { getCurrentUser } from "@/lib/auth";
import { isSaved } from "@/lib/data/saved";
import { AMENITY_LABELS } from "@/lib/types";

const DAY_LABELS: Record<string, string> = {
  mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday",
  fri: "Friday", sat: "Saturday", sun: "Sunday",
};

const FAQS = (name: string) => [
  { q: "What's included in the price?", a: `Pricing at ${name} includes desk/office access, WiFi, and standard amenities listed above. Meeting room credits and add-ons vary by plan — ask for specifics when requesting a quote.` },
  { q: "Is there a minimum commitment?", a: "Most plans are available month-to-month, with discounts for longer commitments. Confirm directly with the operator." },
  { q: "Can I tour before signing up?", a: "Yes — use \"Schedule a tour\" above to request a time that works for you." },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const space = getSpaceBySlug(slug.join("/"));
  if (!space) return { title: "Space not found" };

  return {
    title: `${space.name} — ${space.neighborhood}, ${space.city}`,
    description: space.tagline,
    openGraph: {
      title: space.name,
      description: space.tagline,
      images: [space.images[0]],
    },
  };
}

export default async function SpaceDetailPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const space = getSpaceBySlug(slug.join("/"));
  if (!space || space.status !== "published") notFound();

  const user = await getCurrentUser();
  const saved = user ? isSaved(user.id, space.id) : false;
  const reviews = getReviewsForSpace(space.id);
  const { buckets } = ratingDistribution(space.id);
  const similar = getSimilarSpaces(space);
  const faqs = FAQS(space.name);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: space.name,
    image: space.images[0],
    address: { "@type": "PostalAddress", streetAddress: space.address, addressLocality: space.city },
    aggregateRating: space.reviewCount
      ? { "@type": "AggregateRating", ratingValue: space.rating, reviewCount: space.reviewCount }
      : undefined,
  };

  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="flex-1 pb-24 lg:pb-0">
        <div className="page-shell pt-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-2xl font-medium sm:text-3xl">{space.name}</h1>
                {space.verified && (
                  <Badge className="gap-1 border-0 bg-brand-muted text-brand">
                    <BadgeCheck className="size-3.5" /> Verified workspace
                  </Badge>
                )}
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" /> {space.neighborhood}, {space.city}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="size-3.5 fill-foreground text-foreground" />
                  <span className="font-medium text-foreground">{space.rating.toFixed(1)}</span> ({space.reviewCount} reviews)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <ShareButton title={space.name} />
              <SaveButton spaceId={space.id} initialSaved={saved} />
            </div>
          </div>

          <ImageGallery images={space.images} name={space.name} />
        </div>

        <div className="page-shell mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-12">
            <section>
              <h2 className="font-heading text-xl font-medium">Overview</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{space.description}</p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-medium">Workspace options</h2>
              <div className="mt-4">
                <WorkspaceOptionsList space={space} />
              </div>
            </section>

            <section>
              <h2 className="font-heading text-xl font-medium">Amenities</h2>
              <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                {space.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-2 text-sm">
                    <span className="size-1.5 rounded-full bg-brand" />
                    {AMENITY_LABELS[a]}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-heading text-xl font-medium">Location</h2>
              <p className="mt-2 text-sm text-muted-foreground">{space.address}</p>
              <div className="mt-4 h-[320px]">
                <MapView spaces={[space]} />
              </div>
            </section>

            <section>
              <h2 className="font-heading text-xl font-medium">Opening hours</h2>
              <div className="mt-4 divide-y divide-border rounded-2xl border border-border text-sm">
                {space.openingHours.map((h) => (
                  <div key={h.day} className="flex justify-between px-4 py-2.5">
                    <span className="text-muted-foreground">{DAY_LABELS[h.day]}</span>
                    <span className="font-medium">{h.open ? `${h.open} – ${h.close}` : "Closed"}</span>
                  </div>
                ))}
              </div>
            </section>

            {reviews.length > 0 && (
              <section>
                <h2 className="font-heading text-xl font-medium">Reviews</h2>
                <div className="mt-4">
                  <ReviewsSection reviews={reviews} rating={space.rating} distribution={buckets} />
                </div>
              </section>
            )}

            <section>
              <h2 className="font-heading text-xl font-medium">Frequently asked questions</h2>
              <Accordion className="mt-4">
                {faqs.map((f) => (
                  <AccordionItem key={f.q} value={f.q}>
                    <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {similar.length > 0 && (
              <section>
                <h2 className="font-heading text-xl font-medium">Similar spaces</h2>
                <div className="mt-4 grid gap-5 sm:grid-cols-3">
                  {similar.map((s) => <SpaceCard key={s.id} space={s} />)}
                </div>
              </section>
            )}
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-24">
              <BookingPanel space={space} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBookingBar space={space} />
    </>
  );
}
