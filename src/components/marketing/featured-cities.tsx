import Link from "next/link";
import Image from "next/image";
import { getCityCounts } from "@/lib/data/spaces";

export function FeaturedCities() {
  const cities = getCityCounts().sort((a, b) => b.count - a.count);

  return (
    <section className="border-t border-border py-20">
      <div className="page-shell">
        <div className="mb-10 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">Featured cities</p>
          <h2 className="mt-2 font-heading text-3xl font-medium tracking-tight">Browse by city</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {cities.map((c) => (
            <Link
              key={c.city}
              href={`/search?city=${encodeURIComponent(c.city)}`}
              className="group relative overflow-hidden rounded-2xl"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                <Image
                  src={`https://picsum.photos/seed/city-${c.city.toLowerCase()}/400/560`}
                  alt={c.city}
                  fill
                  sizes="(max-width: 768px) 50vw, 16vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
              </div>
              <div className="absolute bottom-3 left-3 text-white">
                <p className="font-heading text-base font-medium">{c.city}</p>
                <p className="text-xs text-white/80">{c.count} spaces</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
