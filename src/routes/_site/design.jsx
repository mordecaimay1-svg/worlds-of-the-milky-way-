import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { generateOrganism } from "@/lib/server-fns";
import { friendlyError } from "@/lib/friendly-error";
import { ATMOSPHERES, WATERS, SURFACES, radiationLabel } from "@/lib/planet-options";
import PlanetPreview from "@/components/design/PlanetPreview";
import SliderField from "@/components/design/SliderField";
import OptionGroup from "@/components/design/OptionGroup";
import { Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_site/design")({
  head: () => ({
    meta: [
      { title: "Design Planet Nine — Worlds of the Milky Way" },
      {
        name: "description",
        content:
          "Set the gravity, temperature and chemistry of an unknown world. An AI biologist designs the organism that could survive there.",
      },
    ],
  }),
  component: DesignPage,
});

const INITIAL = {
  planet_name: "Planet Nine",
  creator_name: "",
  gravity: 1,
  temperature: 15,
  atmosphere: "thin_co2",
  radiation: 20,
  water: "liquid",
  day_length: 24,
  surface_type: "rocky",
};

function DesignPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(INITIAL);
  const [error, setError] = useState("");
  const generate = useServerFn(generateOrganism);

  const mutation = useMutation({
    mutationFn: (payload) => generate({ data: payload }),
    onSuccess: (result) => {
      if (result?.id) {
        navigate({ to: "/specimen/$id", params: { id: result.id } });
      } else {
        setError("The survey came back empty. Try generating again.");
      }
    },
    onError: (err) => setError(friendlyError(err, "The survey failed before it could finish. Try again in a moment.")),
  });

  const update = (patch) => setSettings((current) => ({ ...current, ...patch }));

  const submit = () => {
    if (!settings.planet_name.trim()) {
      setError("Your world needs a name before it can be surveyed.");
      return;
    }
    setError("");
    mutation.mutate({
      ...settings,
      planet_name: settings.planet_name.trim(),
      creator_name: settings.creator_name.trim(),
      gravity: Number(settings.gravity),
      temperature: Number(settings.temperature),
      radiation: Number(settings.radiation),
      day_length: Number(settings.day_length),
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-5 pb-10 pt-10 sm:px-8">
      <p className="mono-label text-[#D9A8FF]/75">05 — The forge</p>
      <h1 className="mt-4 max-w-2xl font-heading text-4xl font-medium leading-tight tracking-[-0.03em] text-white sm:text-5xl">
        Design Planet Nine
      </h1>
      <p className="mt-4 max-w-2xl text-white/55">
        The ninth world has no data. Set its conditions yourself, and an AI biologist will reason from
        those numbers to a species that could actually hold together there.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div className="glass rounded-3xl p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="planet-name" className="mono-label text-[0.55rem] text-white/45">
                Planet name
              </label>
              <input
                id="planet-name"
                value={settings.planet_name}
                onChange={(event) => update({ planet_name: event.target.value })}
                maxLength={40}
                className="mt-3 w-full rounded-lg border border-white/12 bg-white/[0.03] px-4 py-2.5 font-heading text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-[#00F2FF]/60"
                placeholder="Name your world"
              />
            </div>
            <div>
              <label htmlFor="creator-name" className="mono-label text-[0.55rem] text-white/45">
                Your name (optional)
              </label>
              <input
                id="creator-name"
                value={settings.creator_name}
                onChange={(event) => update({ creator_name: event.target.value })}
                maxLength={40}
                className="mt-3 w-full rounded-lg border border-white/12 bg-white/[0.03] px-4 py-2.5 font-heading text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-[#00F2FF]/60"
                placeholder="Credit your survey"
              />
            </div>
          </div>

          <div className="mt-8 space-y-7">
            <SliderField
              label="Gravity"
              value={settings.gravity}
              min={0.1}
              max={5}
              step={0.1}
              unit="× Earth"
              hint={
                settings.gravity < 0.5
                  ? "Almost nothing holds you down — bodies grow tall and light."
                  : settings.gravity > 2
                  ? "Everything is heavy here — life stays low, dense and wide."
                  : "Earth-like pull; bones and fluids behave predictably."
              }
              onChange={(value) => update({ gravity: value })}
            />
            <SliderField
              label="Average temperature"
              value={settings.temperature}
              min={-250}
              max={500}
              step={5}
              unit="°C"
              hint={
                settings.temperature < -100
                  ? "Colder than any place on Earth; water is rock."
                  : settings.temperature > 150
                  ? "Hot enough to melt most organic chemistry."
                  : "A range where liquid chemistry is possible."
              }
              onChange={(value) => update({ temperature: value })}
            />
            <SliderField
              label="Radiation level"
              value={settings.radiation}
              min={0}
              max={100}
              step={1}
              hint={radiationLabel(settings.radiation)}
              onChange={(value) => update({ radiation: value })}
            />
            <SliderField
              label="Day length"
              value={settings.day_length}
              min={1}
              max={500}
              step={1}
              unit="hours"
              hint={
                settings.day_length > 72
                  ? `${(settings.day_length / 24).toFixed(1)} Earth days of continuous light and dark.`
                  : "Short, frequent cycles."
              }
              onChange={(value) => update({ day_length: value })}
            />
          </div>

          <div className="mt-8 space-y-6 border-t border-white/8 pt-7">
            <OptionGroup
              label="Atmosphere composition"
              options={ATMOSPHERES}
              value={settings.atmosphere}
              onChange={(value) => update({ atmosphere: value })}
            />
            <OptionGroup
              label="Water availability"
              options={WATERS}
              value={settings.water}
              onChange={(value) => update({ water: value })}
            />
            <OptionGroup
              label="Surface type"
              options={SURFACES}
              value={settings.surface_type}
              onChange={(value) => update({ surface_type: value })}
            />
          </div>

          {error ? (
            <p className="mt-6 rounded-lg border border-[#FF3B3B]/30 bg-[#FF3B3B]/10 px-4 py-3 text-sm text-[#FF9C9C]">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            onClick={submit}
            disabled={mutation.isPending}
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#00F2FF] px-6 py-4 font-heading text-sm font-semibold text-[#020408] transition-all hover:shadow-[0_0_36px_-4px_#00F2FF] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Sparkles className="h-4 w-4" />
            {mutation.isPending ? "Synthesizing organism…" : "Generate organism"}
          </button>
          <p className="mt-3 text-center font-mono text-[0.6rem] text-white/25">
            One AI survey per click · usually 15–30 seconds
          </p>
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="glass rounded-3xl p-6 sm:p-8">
            <PlanetPreview settings={settings} busy={mutation.isPending} />

            <div className="mt-7 space-y-2.5 border-t border-white/8 pt-6">
              {[
                ["Gravity", `${settings.gravity}× Earth`],
                ["Temperature", `${settings.temperature} °C`],
                [
                  "Atmosphere",
                  ATMOSPHERES.find((option) => option.value === settings.atmosphere)?.label,
                ],
                ["Water", WATERS.find((option) => option.value === settings.water)?.label],
                ["Day length", `${settings.day_length} h`],
                ["Surface", SURFACES.find((option) => option.value === settings.surface_type)?.label],
                ["Radiation", radiationLabel(settings.radiation)],
              ].map(([label, value]) => (
                <div key={label} className="flex items-baseline justify-between gap-3">
                  <span className="mono-label text-[0.5rem] text-white/30">{label}</span>
                  <span className="font-mono text-[0.72rem] text-white/70">{value}</span>
                </div>
              ))}
            </div>

            {mutation.isPending ? (
              <div className="mt-6 rounded-xl border border-[#00F2FF]/25 bg-[#00F2FF]/5 p-4">
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[#00F2FF]">
                  Survey in progress
                </p>
                <p className="mt-2 text-[0.8rem] leading-relaxed text-white/55">
                  Reasoning from gravity, heat and chemistry — then rendering the specimen.
                </p>
              </div>
            ) : (
              <Link
                to="/gallery"
                className="mt-6 flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-[0.8rem] text-white/55 transition-colors hover:border-white/25 hover:text-white"
              >
                See what others designed
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}