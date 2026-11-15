import { getSource } from "@/data/solar-system";

export default function SourceVerification({ planet }) {
  const facts = planet?.verifiedFacts
    ? Object.values(planet.verifiedFacts)
    : [];
  const sourceIds = [...new Set(facts.flatMap((fact) => fact.sourceIds || []))];
  const sources = sourceIds.map((id) => getSource(id)).filter(Boolean);
  const isGiant = ["jupiter", "saturn", "uranus", "neptune"].includes(planet?.slug);

  if (!sources.length) return null;

  return (
    <section aria-label="Source and verification" className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="mono-label text-[0.55rem] text-[#00F2FF]/70">Source and verification</p>
      <p className="mt-3 text-[0.85rem] leading-relaxed text-white/60">
        The three verified facts above, mean temperature, surface gravity and distance from the Sun,
        come from the source below. Other conditions on this page were carried over from the earlier
        build and do not yet have a source attached.
      </p>
      <ul className="mt-4 space-y-3">
        {sources.map((source) => (
          <li key={source.id}>
            <a
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="font-heading text-[0.95rem] font-medium text-white underline decoration-[#00F2FF]/50 underline-offset-4 transition-colors hover:text-[#00F2FF]"
            >
              {source.title}
            </a>
            <p className="mt-1 font-mono text-[0.62rem] text-white/40">
              {source.publisher} · Last updated {source.lastUpdated}
            </p>
          </li>
        ))}
      </ul>
      {isGiant ? (
        <p className="mt-4 text-[0.8rem] leading-relaxed text-white/50">
          For Jupiter, Saturn, Uranus and Neptune, temperature and gravity are at the 1-bar level,
          as NASA notes, because these planets have no solid surface.
        </p>
      ) : null}
    </section>
  );
}
