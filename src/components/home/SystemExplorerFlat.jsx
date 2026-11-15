import { Link } from "@tanstack/react-router";
import { PLANETS, PLANET_NINE, SUN } from "@/data/solar-system";
import PlanetSphere from "@/components/PlanetSphere";
import { ArrowUpRight } from "lucide-react";

function SunNode() {
  return (
    <div className="group relative flex shrink-0 flex-col items-center gap-4">
      <div className="relative flex items-center justify-center" style={{ width: 168, height: 168 }}>
        <span
          className="absolute inset-0 rounded-full blur-2xl opacity-70 animate-pulse-glow"
          style={{ background: "radial-gradient(circle, rgba(255,190,80,0.55), rgba(255,120,0,0) 70%)" }}
        />
        <span
          className="relative h-[120px] w-[120px] rounded-full"
          style={{
            background: "radial-gradient(circle at 40% 35%, #FFF6D6, #FFC258 45%, #E0590B 88%)",
            boxShadow: "0 0 60px rgba(255,170,60,0.55), inset -8px -10px 24px rgba(120,40,0,0.5)",
          }}
        />
      </div>
      <div className="text-center">
        <p className="font-heading text-sm font-medium text-white">{SUN.name}</p>
        <p className="mono-label mt-1.5 text-[0.58rem] text-white/35">G2V · 0 AU</p>
      </div>
    </div>
  );
}

function PlanetNode({ planet }) {
  return (
    <Link
      to="/planets/$planetSlug"
      params={{ planetSlug: planet.slug }}
      aria-label={`${planet.name}: ${planet.facts.temperature}. Native species: ${planet.species.name}.`}
      className="group relative flex shrink-0 flex-col items-center gap-4 rounded-2xl px-2 py-3 transition-transform focus-visible:z-20"
    >
      <div className="relative flex items-center justify-center" style={{ width: planet.size + 40, height: planet.size + 40 }}>
        <span
          className="absolute inset-2 rounded-full opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-70"
          style={{ background: planet.glow }}
        />
        <PlanetSphere
          planet={planet}
          size={planet.size}
          className="transition-transform duration-500 group-hover:scale-[1.08]"
        />
      </div>

      <div className="text-center">
        <p className="font-heading text-sm font-medium text-white/85 transition-colors group-hover:text-white">
          {planet.name}
        </p>
        <p className="mono-label mt-1.5 text-[0.58rem] text-white/35">{planet.au} AU</p>
      </div>

      <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-60 -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        <div className="glass rounded-2xl p-4 text-left shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)]">
          <div className="flex items-center justify-between">
            <p className="mono-label text-[0.55rem] text-[#00F2FF]/70">{planet.kind}</p>
            <ArrowUpRight className="h-3.5 w-3.5 text-white/40" />
          </div>
          <p className="mt-2.5 font-heading text-base font-medium text-white">{planet.name}</p>
          <p className="mt-1.5 text-[0.8rem] leading-snug text-white/60">{planet.teaser}</p>
          <p className="mono-label mt-3 border-t border-white/10 pt-2.5 text-[0.52rem] text-[#8A2BE2]/80">
            Species · {planet.species.name}
          </p>
        </div>
      </div>
    </Link>
  );
}

function PlanetNineNode() {
  return (
    <Link
      to="/design"
      aria-label="Planet Nine: design your own world and its native organism."
      className="group relative flex shrink-0 flex-col items-center gap-4 rounded-2xl px-2 py-3"
    >
      <div className="relative flex items-center justify-center" style={{ width: 130, height: 130 }}>
        <span className="absolute inset-0 rounded-full bg-[#8A2BE2]/25 blur-2xl transition-all duration-500 group-hover:bg-[#8A2BE2]/45" />
        <span className="absolute inset-6 rounded-full border border-dashed border-[#D9A8FF]/50 animate-spin-slow" />
        <PlanetSphere planet={PLANET_NINE} size={72} />
        <span className="absolute -right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#D9A8FF] shadow-[0_0_10px_#D9A8FF]" />
      </div>

      <div className="text-center">
        <p className="font-heading text-sm font-medium text-[#D9A8FF]">Planet Nine</p>
        <p className="mono-label mt-1.5 text-[0.58rem] text-[#D9A8FF]/60">Design your own</p>
      </div>

      <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-60 -translate-x-1/2 translate-y-2 rounded-2xl opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        <div className="glass rounded-2xl border-[#8A2BE2]/30 p-4 text-left">
          <p className="mono-label text-[0.55rem] text-[#D9A8FF]/80">Unclassified</p>
          <p className="mt-2.5 font-heading text-base font-medium text-white">An empty orbit</p>
          <p className="mt-1.5 text-[0.8rem] leading-snug text-white/60">
            Set the gravity, heat and chemistry. An AI builds the organism that could live there.
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function SystemExplorerFlat() {
  return (
    <>
      <div className="no-scrollbar relative mt-6 overflow-x-auto overflow-y-visible pb-4">
        <div className="relative flex min-w-max items-end gap-2 px-2 py-40 sm:gap-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-1/2 h-px"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,170,60,0.35), rgba(0,242,255,0.22), rgba(138,43,226,0.4))",
            }}
          />
          <SunNode />
          {PLANETS.map((planet) => (
            <PlanetNode key={planet.slug} planet={planet} />
          ))}
          <div className="mx-4 h-16 w-px self-center bg-gradient-to-b from-transparent via-[#8A2BE2]/50 to-transparent" />
          <PlanetNineNode />
        </div>
      </div>

      <p className="mono-label mt-2 flex items-center gap-3 text-white/25 sm:hidden">
        <span className="h-px w-8 bg-white/20" />
        Scroll sideways
      </p>
    </>
  );
}