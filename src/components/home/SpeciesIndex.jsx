import { Link } from "@tanstack/react-router";
import { PLANETS } from "@/data/solar-system";
import { SPECIES_IMAGES } from "@/data/species-images";
import { Image } from "@/components/ui/image";
import { ArrowRight } from "lucide-react";

export default function SpeciesIndex() {
  return (
    <section className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mono-label text-white/35">03 - Speculative biology</p>
          <h2 className="mt-3 font-heading text-3xl font-medium tracking-[-0.02em] text-white sm:text-4xl">
            The catalogue
          </h2>
        </div>
        <p className="max-w-sm text-sm text-white/45">
          Eight hypothetical inhabitants, one per world. Each is imagined from the verified
          conditions, not discovered life. Earth is the exception: Homo sapiens is real.
        </p>
      </div>

      <div className="mt-10 grid gap-x-12 sm:grid-cols-2">
        {PLANETS.map((planet, index) => (
          <Link
            key={planet.slug}
            to="/planets/$planetSlug"
            params={{ planetSlug: planet.slug }}
            className="group flex items-center gap-5 border-b border-white/8 py-5 transition-colors hover:border-white/25"
          >
            <span className="mono-label w-6 shrink-0 text-white/25">
              {String(index + 1).padStart(2, "0")}
            </span>
            {SPECIES_IMAGES[planet.slug] ? (
              <Image
                src={SPECIES_IMAGES[planet.slug]}
                alt={`${planet.species.name}, the hypothetical inhabitant of ${planet.name}`}
                className="h-14 w-14 shrink-0 rounded-xl"
                fittingType="fill"
              />
            ) : null}
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-baseline gap-x-3">
                <span className="font-heading text-base font-medium text-white transition-colors group-hover:text-[#00F2FF]">
                  {planet.species.name}
                </span>
                <span className="mono-label text-[0.52rem] text-white/30">{planet.name}</span>
              </span>
              <span className="mt-1 block truncate text-[0.85rem] text-white/45">{planet.teaser}</span>
              {planet.species?.adaptations?.[0] ? (
                <span className="mt-1 block truncate text-[0.8rem] text-[#D9A8FF]/70">
                  Survives by: {planet.species.adaptations[0].adaptation}
                </span>
              ) : null}
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-white/20 transition-all group-hover:translate-x-1 group-hover:text-[#00F2FF]" />
          </Link>
        ))}
      </div>
    </section>
  );
}