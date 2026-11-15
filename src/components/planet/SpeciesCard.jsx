import { Image } from "@/components/ui/image";
import { ShieldAlert, TriangleAlert } from "lucide-react";

export default function SpeciesCard({ species, image, kicker = "SPECULATIVE BIOLOGY", note }) {
  if (!species) return null;

  const score = Math.max(0, Math.min(100, species.score || 0));

  return (
    <div className="glass overflow-hidden rounded-3xl">
      <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
        <div className="relative min-h-[300px] lg:min-h-[560px]">
          {image ? (
            <Image
              src={image}
              alt={`${species.name}, ${kicker}`}
              className="absolute inset-0 h-full w-full"
              fittingType="fill"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_35%,rgba(138,43,226,0.35),#05080f_70%)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-[#020408]/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#05080f]/90" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <p className="mono-label text-[0.55rem] text-[#00F2FF]/70">{kicker}</p>
            <p className="mt-2 font-heading text-xl font-medium text-white">{species.name}</p>
            {species.latin ? (
              <p className="font-mono text-[0.72rem] italic text-white/45">{species.latin}</p>
            ) : null}
          </div>
        </div>

        <div className="p-6 sm:p-9">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <p className="mono-label text-[0.55rem] text-white/35">Survival score</p>
              <p className="mt-1 font-heading text-4xl font-medium text-white">
                {score}
                <span className="ml-1 font-mono text-sm text-white/35">/100</span>
              </p>
            </div>
            <div className="w-full max-w-[220px]">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#00F2FF] to-[#8A2BE2]"
                  style={{ width: `${score}%` }}
                />
              </div>
              <p className="mono-label mt-2 text-[0.5rem] text-white/30">
                Match to planetary parameters
              </p>
            </div>
          </div>

          {species.summary ? (
            <p className="mt-6 text-[0.98rem] leading-relaxed text-white/70">{species.summary}</p>
          ) : null}

          <div className="mt-7 grid gap-6 sm:grid-cols-2">
            {[
              { label: "Body plan", value: species.bodyPlan },
              { label: "Movement", value: species.locomotion },
              { label: "Senses", value: species.senses },
              { label: "Diet / energy", value: species.diet },
              { label: "Reproduction", value: species.reproduction },
            ]
              .filter((field) => field.value)
              .map((field) => (
                <div key={field.label} className="border-t border-white/8 pt-4">
                  <p className="mono-label text-[0.52rem] text-[#00F2FF]/60">{field.label}</p>
                  <p className="mt-2 text-[0.88rem] leading-relaxed text-white/65">{field.value}</p>
                </div>
              ))}
          </div>

          {species.adaptations?.length ? (
            <div className="mt-9">
              <p className="mono-label text-[0.55rem] text-white/35">Survival adaptations</p>
              <ul className="mt-4 space-y-0">
                {species.adaptations.map((adaptation, index) => (
                  <li key={index} className="border-t border-white/8 py-4">
                    <div className="flex items-start gap-4">
                      <span className="mt-0.5 font-mono text-[0.62rem] text-[#8A2BE2]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="font-mono text-[0.72rem] uppercase tracking-[0.08em] text-[#8A2BE2]/90">
                          {adaptation.label}
                        </p>
                        <p className="mt-1.5 text-[0.88rem] leading-relaxed text-white/70">
                          {adaptation.text}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {species.threats ? (
              <div className="rounded-xl border border-[#FF3B3B]/20 bg-[#FF3B3B]/[0.06] p-4">
                <p className="flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-[#FF8080]">
                  <ShieldAlert className="h-3.5 w-3.5" /> Main threats
                </p>
                <p className="mt-2 text-[0.84rem] leading-relaxed text-white/65">{species.threats}</p>
              </div>
            ) : null}
            {species.weakness ? (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-white/50">
                  <TriangleAlert className="h-3.5 w-3.5" /> One weakness
                </p>
                <p className="mt-2 text-[0.84rem] leading-relaxed text-white/65">{species.weakness}</p>
              </div>
            ) : null}
          </div>

          {note ? <p className="mt-6 font-mono text-[0.62rem] text-white/25">{note}</p> : null}
        </div>
      </div>
    </div>
  );
}