import { Link } from "@tanstack/react-router";
import { X, ArrowUpRight } from "lucide-react";
import { PLANETS, getSource } from "@/data/solar-system";

const NASA_SOURCE = getSource("nasa-factsheet-metric");

export default function PlanetFocusCard({ slug, onClose }) {
  const isNine = slug === "nine";
  const planet = isNine ? null : PLANETS.find((item) => item.slug === slug);

  if (!isNine && !planet) return null;

  return (
    <div className="absolute right-3 top-3 z-20 w-[300px] max-w-[calc(100%-1.5rem)]">
      <div className="glass-strong max-h-[calc(76svh-2rem)] overflow-y-auto rounded-2xl p-4 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.95)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className={`mono-label text-[0.46rem] ${isNine ? "text-[#D9A8FF]/80" : "text-[#00F2FF]/70"}`}>
              {isNine ? "Unclassified" : planet.kind}
            </p>
            <h3 className="mt-1.5 font-heading text-lg font-medium leading-tight text-white">
              {isNine ? "Planet Nine" : planet.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close planet panel"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/12 text-white/45 transition-colors hover:border-white/30 hover:text-white"
          >
            <X className="h-3 w-3" />
          </button>
        </div>

        {isNine ? (
          <>
            <p className="mt-2.5 text-[0.8rem] leading-snug text-white/60">
              The empty ninth orbit. Set its gravity, heat and chemistry, an AI biologist designs the
              organism that could hold together there.
            </p>
            <Link
              to="/design"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#8A2BE2] px-4 py-2 font-heading text-[0.78rem] font-semibold text-white transition-shadow hover:shadow-[0_0_26px_-4px_#8A2BE2]"
            >
              Design your own
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </>
        ) : (
          <>
            <p className="mt-2.5 text-[0.8rem] leading-snug text-white/60">{planet.tagline}</p>
            <p className="mono-label mt-3 text-[0.46rem] text-[#00F2FF]/70">
              VERIFIED PLANETARY DATA
            </p>
            <dl className="mt-3 space-y-1.5 border-t border-white/10 pt-3">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="mono-label text-[0.44rem] text-white/30">Gravity</dt>
                <dd className="font-mono text-[0.66rem] text-white/70">{planet.facts.gravity.split("·")[0]}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="mono-label text-[0.44rem] text-white/30">Temp</dt>
                <dd className="text-right font-mono text-[0.62rem] text-white/70">
                  {planet.facts.temperature}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="mono-label text-[0.44rem] text-white/30">Distance</dt>
                <dd className="text-right font-mono text-[0.62rem] text-white/70">
                  {planet.verifiedFacts?.distanceFromSun?.value}
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-[0.62rem] leading-relaxed text-white/40">
              Source and verification:{" "}
              <a
                href={NASA_SOURCE?.url}
                target="_blank"
                rel="noreferrer"
                className="text-[#00F2FF] underline underline-offset-2 hover:text-white"
              >
                NASA Planetary Fact Sheet
              </a>
            </p>
            <p className="mono-label mt-3 text-[0.46rem] text-[#D9A8FF]/80">
              {planet.slug === "earth"
                ? "Known species · Homo sapiens"
                : `Speculative biology · ${planet.species.name}`}
            </p>
            <p className="mt-2 text-[0.78rem] leading-snug text-white/65">{planet.teaser}</p>
            {planet.species?.adaptations?.length ? (
              <>
                <p className="mono-label mt-3 text-[0.46rem] text-[#D9A8FF]/80">
                  Why it survives here
                </p>
                <ul className="mt-2 space-y-2.5 border-t border-white/10 pt-2.5">
                  {planet.species.adaptations.slice(0, 3).map((item, index) => (
                    <li key={index}>
                      <p className="font-mono text-[0.6rem] uppercase tracking-[0.08em] text-[#8A2BE2]">
                        {item.condition}
                      </p>
                      <p className="mt-0.5 text-[0.74rem] leading-snug text-white/65">
                        {item.adaptation}
                      </p>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            <Link
              to="/planets/$planetSlug"
              params={{ planetSlug: planet.slug }}
              className="mt-3 inline-flex items-center gap-2 font-heading text-[0.78rem] font-medium text-[#00F2FF] transition-colors hover:text-white"
            >
              Open dossier
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </>
        )}
      </div>
    </div>
  );
}