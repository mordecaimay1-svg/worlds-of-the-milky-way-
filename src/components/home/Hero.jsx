import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative mx-auto max-w-7xl px-5 pb-10 pt-16 sm:px-8 sm:pt-24">
      {/* orbital reticle */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-0 hidden opacity-40 lg:block">
        <div className="h-[520px] w-[520px] rounded-full border border-white/10" />
        <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00F2FF]/20" />
        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00F2FF] shadow-[0_0_20px_#00F2FF]" />
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/8" />
      </div>

      <div className="relative max-w-4xl">
        <p className="mono-label flex flex-wrap items-center gap-3 text-[#00F2FF]/75">
          <span className="h-px w-10 bg-[#00F2FF]/50" />
          Milky Way · Orion Arm · Sol System
        </p>

        <h1 className="mt-7 font-heading text-[2.6rem] font-medium leading-[1.03] tracking-[-0.03em] text-white sm:text-6xl lg:text-[4.6rem]">
          Eight worlds.
          <br />
          Eight species.
          <br />
          <span className="text-white/45">One you design.</span>
        </h1>

        <p className="mt-7 max-w-2xl text-[1.05rem] leading-relaxed text-white/60 sm:text-lg">
          Every planet orbiting our Sun carries its own native life, shaped by the exact conditions
          that would kill us. Survey the archive world by world — then invent the ninth planet and
          the organism that survives it.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="#explorer"
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#00F2FF] px-7 py-3.5 font-heading text-sm font-semibold text-[#020408] transition-all hover:shadow-[0_0_36px_-4px_#00F2FF]"
          >
            Begin the survey
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <Link
            to="/design"
            className="inline-flex items-center justify-center gap-3 rounded-full border border-white/15 px-7 py-3.5 font-heading text-sm font-medium text-white transition-all hover:border-[#8A2BE2]/60 hover:bg-[#8A2BE2]/10"
          >
            Design Planet Nine
          </Link>
        </div>

        <dl className="mt-14 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-6 border-t border-white/8 pt-8 sm:grid-cols-4">
          {[
            { value: "8", label: "Planets surveyed" },
            { value: "8", label: "Species catalogued" },
            { value: "26k", label: "Light years to core" },
            { value: "1", label: "Awaiting definition" },
          ].map((stat) => (
            <div key={stat.label}>
              <dt className="font-heading text-3xl font-medium text-white">{stat.value}</dt>
              <dd className="mono-label mt-2 text-white/35">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}