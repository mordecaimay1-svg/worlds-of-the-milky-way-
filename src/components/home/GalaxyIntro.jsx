export default function GalaxyIntro() {
  return (
    <section className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p className="mono-label text-white/35">02 — Our address</p>
          <h2 className="mt-3 max-w-xl font-heading text-3xl font-medium leading-tight tracking-[-0.02em] text-white sm:text-4xl">
            A pale yellow dot, two thirds of the way out.
          </h2>

          <div className="mt-7 max-w-xl space-y-5 text-[0.98rem] leading-relaxed text-white/60">
            <p>
              The Milky Way is a barred spiral roughly 100,000 light years across, holding something
              like 200 billion stars. Our Sun sits in a minor arm called Orion, about 26,000 light
              years from the galactic centre — far enough out that we are not cooked, close enough in
              that we are made of the debris of older stars.
            </p>
            <p>
              The Sun carries eight planets, and no two are remotely alike. A world with no air and a
              610 °C temperature swing raises one kind of life. A world with no surface at all raises
              another. Adaptation is not poetry here — it is arithmetic. Gravity decides how tall you
              can be; pressure decides whether you can be a gas; the chemistry decides what you
              breathe out.
            </p>
            <p className="text-white/75">
              That is the rule this archive runs on: the environment writes the body.
            </p>
          </div>
        </div>

        {/* orbit diagram */}
        <div className="relative mx-auto aspect-square w-full max-w-md">
          <div className="absolute inset-0 rounded-full border border-white/8" />
          <div className="absolute inset-[14%] rounded-full border border-white/10" />
          <div className="absolute inset-[30%] rounded-full border border-white/12" />
          <div className="absolute inset-[46%] rounded-full border border-white/15" />
          <div className="absolute inset-[60%] rounded-full border border-[#00F2FF]/25" />
          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00F2FF] shadow-[0_0_26px_#00F2FF]" />
          <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-full border border-[#00F2FF]/20" />
          <span className="absolute left-[68%] top-[24%] h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_16px_rgba(255,255,255,0.9)]" />

          <div className="absolute left-1/2 top-1/2 h-px w-[42%] origin-left bg-gradient-to-r from-[#00F2FF]/60 to-white/25" />
          <div className="glass absolute left-[54%] top-[38%] rounded-xl px-3 py-2">
            <p className="mono-label text-[0.5rem] text-white/40">Sol system</p>
            <p className="font-mono text-[0.7rem] text-white/80">26,000 ly</p>
          </div>
          <p className="mono-label absolute -bottom-1 left-1/2 -translate-x-1/2 text-[0.5rem] text-white/25">
            Galactic centre
          </p>
        </div>
      </div>
    </section>
  );
}