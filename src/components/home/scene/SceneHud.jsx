import { Pause, Play, Plus, Minus } from "lucide-react";
import SceneToggle from "@/components/home/scene/SceneToggle";

export default function SceneHud({
  paused,
  onTogglePause,
  speed,
  onSpeed,
  orbits,
  onToggleOrbits,
  labels,
  onToggleLabels,
  onBack,
  onZoomIn,
  onZoomOut,
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col gap-2.5 p-3 sm:p-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div className="glass-strong pointer-events-auto flex items-center gap-3 rounded-full px-3 py-2">
          <button
            type="button"
            onClick={onTogglePause}
            aria-label={paused ? "Resume orbital motion" : "Pause orbital motion"}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#00F2FF] hover:text-[#020408]"
          >
            {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          </button>
          <label className="flex items-center gap-2" htmlFor="orbit-speed">
            <span className="mono-label text-[0.48rem] text-white/40">Speed</span>
            <input
              id="orbit-speed"
              type="range"
              min={0}
              max={3}
              step={0.1}
              value={speed}
              onChange={(event) => onSpeed(Number(event.target.value))}
              className="h-1 w-20 cursor-pointer accent-[#00F2FF] sm:w-32"
            />
          </label>
          <span className="font-mono text-[0.6rem] text-[#00F2FF]/80">{speed.toFixed(1)}×</span>
        </div>

        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onZoomIn}
            aria-label="Zoom in"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-[#020408]/70 text-white/70 backdrop-blur transition-colors hover:border-[#00F2FF]/50 hover:text-white"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onZoomOut}
            aria-label="Zoom out"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-[#020408]/70 text-white/70 backdrop-blur transition-colors hover:border-[#00F2FF]/50 hover:text-white"
          >
            <Minus className="h-4 w-4" />
          </button>
          <SceneToggle active={orbits} onClick={onToggleOrbits} label="Orbits" />
          <SceneToggle active={labels} onClick={onToggleLabels} label="Labels" />
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-white/15 bg-[#020408]/70 px-3.5 py-2 font-mono text-[0.56rem] uppercase tracking-[0.16em] text-white/70 backdrop-blur transition-colors hover:border-[#00F2FF]/50 hover:text-white"
          >
            Back to solar system
          </button>
        </div>
      </div>

      <p className="mono-label text-[0.46rem] leading-relaxed text-white/25">
        Drag to orbit · scroll to zoom · right-drag to pan · click a world for a close-up
      </p>
    </div>
  );
}