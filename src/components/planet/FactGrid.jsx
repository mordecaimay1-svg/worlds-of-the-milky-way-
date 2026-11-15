export default function FactGrid({ facts }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-2">
      {facts.map((fact) => (
        <div key={fact.label} className="bg-[#05080f]/80 p-5">
          <p className="mono-label text-[0.55rem] text-white/35">{fact.label}</p>
          <p className="mt-2 font-mono text-[0.82rem] leading-relaxed text-white/85">{fact.value}</p>
        </div>
      ))}
    </div>
  );
}