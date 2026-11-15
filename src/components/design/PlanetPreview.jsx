import PlanetPreview3D from "@/components/design/PlanetPreview3D";

export default function PlanetPreview({ settings, busy = false }) {
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative h-[232px] w-full">
        <PlanetPreview3D settings={settings} busy={busy} />
        {busy ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="h-[168px] w-[168px] animate-spin rounded-full border border-dashed border-[#00F2FF]/50" />
          </div>
        ) : null}
      </div>

      <div className="mt-5 text-center">
        <p className="font-heading text-xl font-medium text-white">
          {settings.planet_name || "Unnamed world"}
        </p>
        <p className="mono-label mt-2 text-[0.52rem] text-[#D9A8FF]/70">Live preview · not yet surveyed</p>
      </div>
    </div>
  );
}