import { createFileRoute, Link } from "@tanstack/react-router";
import Hero from "@/components/home/Hero";
import SystemExplorer from "@/components/home/SystemExplorer";
import GalaxyIntro from "@/components/home/GalaxyIntro";
import SpeciesIndex from "@/components/home/SpeciesIndex";

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: [
      { title: "Worlds of the Milky Way | Solar System Explorer" },
      {
        name: "description",
        content:
          "Explore every planet in our solar system and the hypothetical species imagined for it, then design the ninth world yourself.",
      },
    ],
  }),
  component: HomePage,
});

// Solar system explorer, the entry screen.
function HomePage() {
  return (
    <>
      <Hero />
      <SystemExplorer />
      <GalaxyIntro />
      <SpeciesIndex />

      <section className="relative mx-auto max-w-7xl px-5 pt-16 sm:px-8">
        <div className="glass relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#8A2BE2]/25 blur-3xl"
          />
          <p className="mono-label text-[#D9A8FF]/70">04 - The empty orbit</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-heading text-3xl font-medium leading-tight tracking-[-0.02em] text-white sm:text-4xl">
            There is a ninth world. Nobody has written it yet.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-white/55">
            Choose its gravity, set its temperature, pick its chemistry. An AI biologist reasons from
            your parameters to a species that could actually hold together there.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/design"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-heading text-sm font-semibold text-[#020408] transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.35)]"
            >
              Design Planet Nine
            </Link>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 font-heading text-sm font-medium text-white transition-colors hover:border-white/35"
            >
              Browse the archive
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}