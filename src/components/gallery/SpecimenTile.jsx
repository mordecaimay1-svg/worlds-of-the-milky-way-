import { Link } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import { ArrowUpRight } from "lucide-react";
import { surfaceLabel } from "@/lib/planet-options";

export default function SpecimenTile({ record }) {
  return (
    <Link
      to="/specimen/$id"
      params={{ id: record.id }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-[#05080f]/70 transition-all hover:border-[#00F2FF]/35 hover:shadow-[0_20px_60px_-30px_rgba(0,242,255,0.5)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {record.image_url ? (
          <Image
            src={record.image_url}
            alt={`${record.species_name}, native to ${record.planet_name}`}
            className="h-full w-full transition-transform duration-700 group-hover:scale-105"
            fittingType="fill"
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_40%_30%,rgba(138,43,226,0.4),#05080f_72%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-transparent to-transparent" />
        <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-[#020408]/70 px-2.5 py-1 font-mono text-[0.58rem] text-white/70">
          {record.survival_score}/100
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="mono-label text-[0.5rem] text-[#00F2FF]/60">{record.planet_name}</p>
            <p className="mt-2 font-heading text-lg font-medium text-white">{record.species_name}</p>
          </div>
          <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-white/25 transition-all group-hover:text-[#00F2FF]" />
        </div>

        <p className="mt-2 line-clamp-2 text-[0.82rem] leading-relaxed text-white/50">
          {record.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5 border-t border-white/8 pt-4">
          <span className="rounded-full bg-white/5 px-2.5 py-1 font-mono text-[0.58rem] text-white/50">
            {record.gravity}× g
          </span>
          <span className="rounded-full bg-white/5 px-2.5 py-1 font-mono text-[0.58rem] text-white/50">
            {record.temperature} °C
          </span>
          <span className="rounded-full bg-white/5 px-2.5 py-1 font-mono text-[0.58rem] text-white/50">
            {surfaceLabel(record.surface_type)}
          </span>
        </div>

        <p className="mt-3 font-mono text-[0.58rem] text-white/25">
          {record.creator_name ? `by ${record.creator_name}` : "anonymous survey"}
        </p>
      </div>
    </Link>
  );
}