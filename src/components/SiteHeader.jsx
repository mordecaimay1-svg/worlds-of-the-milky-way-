import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Explorer" },
  { to: "/gallery", label: "Gallery" },
];

export default function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-[#020408]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <span className="relative flex h-8 w-8 items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-white/20" />
            <span className="absolute h-8 w-8 rounded-full border border-[#00F2FF]/40 [transform:rotate(35deg)_scaleY(0.45)]" />
            <span className="h-2 w-2 rounded-full bg-[#00F2FF] shadow-[0_0_12px_#00F2FF]" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-heading text-[0.82rem] font-semibold uppercase tracking-[0.22em] text-white">
              Worlds of the
            </span>
            <span className="font-heading text-[0.82rem] font-semibold uppercase tracking-[0.22em] text-white/55">
              Milky Way
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              className="rounded-full px-3 py-2 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-white/55 transition-colors hover:text-white data-[status=active]:text-[#00F2FF]"
            >
              {link.label}
            </Link>
          ))}

          <Link
            to="/design"
            className="ml-1 rounded-full border border-[#00F2FF]/40 bg-[#00F2FF]/10 px-4 py-2 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-[#00F2FF] transition-all hover:bg-[#00F2FF]/20 hover:shadow-[0_0_24px_-6px_#00F2FF]"
          >
            Design Yours
          </Link>

        </nav>
      </div>
    </header>
  );
}