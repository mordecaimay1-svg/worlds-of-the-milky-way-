import { useCallback, useEffect, useState } from "react";
import SolarSystem3D from "@/components/home/SolarSystem3D";
import SystemExplorerFlat from "@/components/home/SystemExplorerFlat";

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext && (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

export default function SystemExplorer() {
  const [flat, setFlat] = useState(false);
  const handleFallback = useCallback(() => setFlat(true), []);

  useEffect(() => {
    if (!supportsWebGL()) setFlat(true);
  }, []);

  return (
    <section id="explorer" className="relative scroll-mt-20">
      <div className="mx-auto max-w-7xl px-5 pt-16 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mono-label text-white/35">01 — Orbital survey</p>
            <h2 className="mt-3 font-heading text-3xl font-medium tracking-[-0.02em] text-white sm:text-4xl">
              The system in motion
            </h2>
          </div>
          <p className="max-w-sm text-sm text-white/45">
            Every world turns on its own axis and follows its own ellipse. Sizes and distances are
            stylised — the order and the scale between neighbours are not.
          </p>
        </div>
      </div>

      {flat ? (
        <div className="mx-auto mt-6 max-w-7xl px-5 pb-16 sm:px-8">
          <SystemExplorerFlat />
        </div>
      ) : (
        <div className="mt-10">
          <SolarSystem3D onFallback={handleFallback} />
        </div>
      )}
    </section>
  );
}