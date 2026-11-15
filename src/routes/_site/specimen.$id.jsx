import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getUserPlanet, regenerateOrganism } from "@/lib/server-fns";
import { normalizeSpecies } from "@/lib/normalize-species";
import { friendlyError } from "@/lib/friendly-error";
import { atmosphereLabel, waterLabel, surfaceLabel } from "@/lib/planet-options";
import SpeciesCard from "@/components/planet/SpeciesCard";
import FactGrid from "@/components/planet/FactGrid";
import { ArrowLeft, RefreshCw, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_site/specimen/$id")({
  head: () => ({
    meta: [
      { title: "Organism record — Worlds of the Milky Way" },
      {
        name: "description",
        content: "An AI-designed native species for a visitor-created world beyond Neptune.",
      },
    ],
  }),
  component: SpecimenPage,
});

function SpecimenPage() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const regenerate = useServerFn(regenerateOrganism);

  const { data: record, isLoading, isError } = useQuery({
    queryKey: ["specimen", id],
    queryFn: () => getUserPlanet({ data: { id } }),
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: () => regenerate({ data: { id } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["specimen", id] }),
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8">
        <div className="glass h-[520px] animate-pulse rounded-3xl" />
      </div>
    );
  }

  if (isError || !record) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center sm:px-8">
        <p className="mono-label text-[#FF3B3B]/70">Record unavailable</p>
        <h1 className="mt-4 font-heading text-3xl text-white">This specimen has drifted out of range.</h1>
        <p className="mt-3 text-white/50">
          The record may have been removed, or the link was mistyped.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/gallery"
            className="rounded-full bg-white px-6 py-3 font-heading text-sm font-semibold text-[#020408]"
          >
            Browse the archive
          </Link>
          <Link
            to="/design"
            className="rounded-full border border-white/15 px-6 py-3 font-heading text-sm text-white"
          >
            Design a world
          </Link>
        </div>
      </div>
    );
  }

  const species = normalizeSpecies(record);
  const facts = [
    { label: "Gravity", value: `${record.gravity}× Earth` },
    { label: "Average temperature", value: `${record.temperature} °C` },
    { label: "Atmosphere", value: atmosphereLabel(record.atmosphere) },
    { label: "Radiation", value: record.radiation_label || `${record.radiation}/100` },
    { label: "Water", value: waterLabel(record.water) },
    { label: "Day length", value: `${record.day_length} hours` },
    { label: "Surface", value: surfaceLabel(record.surface_type) },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 pb-10 pt-10 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/gallery"
          className="inline-flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Archive
        </Link>
        <p className="mono-label text-[#00F2FF]/60">Specimen record · AI survey</p>
      </div>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="mono-label text-white/35">
            {record.creator_name ? `Surveyed by ${record.creator_name}` : "Surveyed anonymously"}
          </p>
          <h1 className="mt-3 font-heading text-4xl font-medium tracking-[-0.03em] text-white sm:text-5xl">
            {record.planet_name}
          </h1>
          <p className="mt-3 max-w-xl text-white/55">
            A world of {record.gravity}× Earth gravity, {record.temperature} °C and{" "}
            {atmosphereLabel(record.atmosphere).toLowerCase()} air — and the organism that answers it.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="inline-flex items-center gap-2 rounded-full border border-[#8A2BE2]/45 bg-[#8A2BE2]/10 px-5 py-3 font-heading text-sm text-[#D9A8FF] transition-all hover:bg-[#8A2BE2]/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${mutation.isPending ? "animate-spin" : ""}`} />
            {mutation.isPending ? "Regenerating…" : "Regenerate organism"}
          </button>
          <Link
            to="/design"
            className="inline-flex items-center gap-2 rounded-full bg-[#00F2FF] px-5 py-3 font-heading text-sm font-semibold text-[#020408] transition-all hover:shadow-[0_0_30px_-6px_#00F2FF]"
          >
            <Sparkles className="h-4 w-4" />
            Design another
          </Link>
        </div>
      </div>

      {mutation.isError ? (
        <p className="mt-6 rounded-lg border border-[#FF3B3B]/30 bg-[#FF3B3B]/10 px-4 py-3 text-sm text-[#FF9C9C]">
          {friendlyError(mutation.error, "The regeneration failed. Try again in a moment.")}
        </p>
      ) : null}

      <section className="mt-10">
        <p className="mono-label text-white/35">Planet parameters</p>
        <div className="mt-4">
          <FactGrid facts={facts} />
        </div>
      </section>

      <section className="relative mt-10">
        <SpeciesCard
          species={species}
          image={record.image_url}
          kicker="Engineered specimen"
          note="Generated by AI from the parameters above · speculative biology, physically constrained."
        />
        {mutation.isPending ? (
          <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-[#020408]/75 backdrop-blur-sm">
            <div className="text-center">
              <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-2 border-[#00F2FF]/30 border-t-[#00F2FF]" />
              <p className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[#00F2FF]">
                Re-surveying the world
              </p>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}