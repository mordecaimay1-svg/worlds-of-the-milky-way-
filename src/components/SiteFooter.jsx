import { Link } from "@tanstack/react-router";

export default function SiteFooter() {
  return (
    <footer className="relative z-10 mt-24 border-t border-white/8 px-5 py-14 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <p className="mono-label text-[#00F2FF]/70">Worlds of the Milky Way</p>
          <p className="mt-4 text-sm leading-relaxed text-white/50">
            A speculative field guide to the solar system. Every organism here is invented, but every
            planetary condition is real — the biology follows the physics.
          </p>
        </div>

        <div className="flex gap-14">
          <div>
            <p className="mono-label text-white/35">Survey</p>
            <ul className="mt-4 space-y-2 text-sm text-white/60">
              <li>
                <Link to="/" className="transition-colors hover:text-[#00F2FF]">
                  Solar system
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="transition-colors hover:text-[#00F2FF]">
                  Species archive
                </Link>
              </li>
              <li>
                <Link to="/design" className="transition-colors hover:text-[#00F2FF]">
                  Planet Nine
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mono-label text-white/35">Worlds</p>
            <ul className="mt-4 space-y-2 text-sm text-white/60">
              <li>
                <Link to="/planets/$planetSlug" params={{ planetSlug: "earth" }} className="transition-colors hover:text-[#00F2FF]">
                  Earth
                </Link>
              </li>
              <li>
                <Link to="/planets/$planetSlug" params={{ planetSlug: "jupiter" }} className="transition-colors hover:text-[#00F2FF]">
                  Jupiter
                </Link>
              </li>
              <li>
                <Link to="/planets/$planetSlug" params={{ planetSlug: "neptune" }} className="transition-colors hover:text-[#00F2FF]">
                  Neptune
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-2 border-t border-white/8 pt-6 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/25 sm:flex-row sm:justify-between">
        <span>Orion Arm · Sol System · 26,000 light years from the core</span>
        <span>Speculative biology · planetary data from published mission science</span>
      </div>
    </footer>
  );
}