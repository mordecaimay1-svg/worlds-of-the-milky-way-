import { useEffect, useRef } from "react";

export default function SpaceBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars = [];
    let width = 0;
    let height = 0;
    let frame = 0;

    const build = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(width * dpr, 1);
      canvas.height = Math.max(height * dpr, 1);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = width < 640 ? 90 : 200;
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.2 + 0.25,
        base: Math.random() * 0.55 + 0.16,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.014 + 0.004,
        tint: Math.random() > 0.86 ? "255, 220, 190" : Math.random() > 0.6 ? "180, 230, 255" : "255, 255, 255",
      }));
    };

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height);
      stars.forEach((star) => {
        const twinkle = reduceMotion ? 0.85 : 0.55 + Math.sin(time * star.speed + star.phase) * 0.45;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${star.tint}, ${star.base * twinkle})`;
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });
      if (!reduceMotion) frame = requestAnimationFrame(draw);
    };

    build();
    if (reduceMotion) {
      draw(0);
    } else {
      frame = requestAnimationFrame(draw);
    }

    const onResize = () => {
      build();
      if (reduceMotion) draw(0);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden bg-[#020408]">
      {/* Milky Way band */}
      <div
        className="absolute left-1/2 top-1/2 h-[130vh] w-[240vw] -translate-x-1/2 -translate-y-1/2 animate-drift opacity-[0.32] blur-3xl"
        style={{
          transform: "translate(-50%, -50%) rotate(-24deg)",
          background:
            "radial-gradient(60% 42% at 50% 50%, rgba(150,175,255,0.30), rgba(120,90,220,0.14) 45%, rgba(2,4,8,0) 72%)",
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-[52vh] w-[210vw] -translate-x-1/2 -translate-y-1/2 opacity-25 blur-2xl"
        style={{
          transform: "translate(-50%, -50%) rotate(-24deg)",
          background:
            "linear-gradient(90deg, rgba(2,4,8,0) 0%, rgba(190,205,255,0.22) 35%, rgba(240,235,255,0.32) 50%, rgba(190,205,255,0.2) 64%, rgba(2,4,8,0) 100%)",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* Deep vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(2,4,8,0)_0%,rgba(2,4,8,0.55)_62%,rgba(2,4,8,0.92)_100%)]" />
    </div>
  );
}