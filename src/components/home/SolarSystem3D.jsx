import { useCallback, useEffect, useRef, useState } from "react";
import { createSolarScene } from "@/lib/three/solar-scene";
import SceneHud from "@/components/home/scene/SceneHud";
import PlanetFocusCard from "@/components/home/scene/PlanetFocusCard";

export default function SolarSystem3D({ onFallback }) {
  const hostRef = useRef(null);
  const labelRef = useRef(null);
  const apiRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [focused, setFocused] = useState(null);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [orbits, setOrbits] = useState(true);
  const [labels, setLabels] = useState(true);

  const handleFocus = useCallback((slug) => setFocused(slug), []);
  const handleClear = useCallback(() => setFocused(null), []);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (cancelled || !hostRef.current) return;
      try {
        apiRef.current = createSolarScene({
          host: hostRef.current,
          labelHost: labelRef.current,
          quality: window.innerWidth < 768 ? "low" : "high",
          onFocus: handleFocus,
          onClearFocus: handleClear,
        });
        setReady(true);
      } catch (error) {
        console.error("The 3D solar system could not start.", error);
        onFallback?.();
      }
    }, 60);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      apiRef.current?.dispose();
      apiRef.current = null;
    };
  }, [handleFocus, handleClear, onFallback]);

  useEffect(() => {
    if (ready) apiRef.current?.setPaused(paused);
  }, [paused, ready]);

  useEffect(() => {
    if (ready) apiRef.current?.setSpeed(speed);
  }, [speed, ready]);

  useEffect(() => {
    if (ready) apiRef.current?.setOrbits(orbits);
  }, [orbits, ready]);

  useEffect(() => {
    if (ready) apiRef.current?.setLabels(labels);
  }, [labels, ready]);

  const backToSystem = useCallback(() => {
    apiRef.current?.reset();
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-black">
      <div className="relative h-[76svh] min-h-[500px] w-full sm:h-[86svh]">
        <div ref={hostRef} className="absolute inset-0" />
        <div
          ref={labelRef}
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
        />

        <PlanetFocusCard slug={focused} onClose={backToSystem} />

        <SceneHud
          paused={paused}
          onTogglePause={() => setPaused((value) => !value)}
          speed={speed}
          onSpeed={setSpeed}
          orbits={orbits}
          onToggleOrbits={() => setOrbits((value) => !value)}
          labels={labels}
          onToggleLabels={() => setLabels((value) => !value)}
          onBack={backToSystem}
        />

        {!ready ? (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-black">
            <span className="relative flex h-16 w-16 items-center justify-center">
              <span className="absolute inset-0 rounded-full border border-[#00F2FF]/25" />
              <span className="absolute inset-0 animate-spin rounded-full border border-transparent border-t-[#00F2FF]" />
              <span className="h-2 w-2 rounded-full bg-[#00F2FF] shadow-[0_0_16px_#00F2FF]" />
            </span>
            <div className="text-center">
              <p className="font-heading text-sm font-medium tracking-[0.02em] text-white/85">
                Entering the solar system…
              </p>
              <p className="mono-label mt-2 text-[0.48rem] text-white/30">Surveying eight worlds</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}