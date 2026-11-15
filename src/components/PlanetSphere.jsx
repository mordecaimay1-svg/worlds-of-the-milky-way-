export default function PlanetSphere({ planet, size = 56, className = "" }) {
  const { color, light, dark, glow, ring } = planet;

  return (
    <span
      className={`relative inline-block shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {ring && (
        <span
          className="absolute left-1/2 top-1/2 rounded-[50%] border"
          style={{
            width: size * 1.65,
            height: size * 0.6,
            borderColor: "rgba(255,255,255,0.3)",
            transform: "translate(-50%, -50%) rotate(-16deg)",
            boxShadow: "0 0 14px rgba(255,255,255,0.12)",
          }}
        />
      )}
      <span
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{
          background: `radial-gradient(circle at 32% 26%, ${light}, ${color} 44%, ${dark} 84%)`,
          boxShadow: `inset -6px -8px 18px rgba(0,0,0,0.75), 0 0 26px ${glow}`,
        }}
      >
        <span
          className="absolute inset-[-50%] animate-spin-slow"
          style={{
            background: `conic-gradient(from 0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.22) 12%, rgba(0,0,0,0.18) 30%, rgba(255,255,255,0) 44%, rgba(0,0,0,0.28) 66%, rgba(255,255,255,0.1) 82%, rgba(255,255,255,0) 100%)`,
            opacity: 0.55,
          }}
        />
      </span>
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle at 70% 72%, rgba(0,0,0,0.72), rgba(0,0,0,0) 62%)",
        }}
      />
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle at 30% 24%, rgba(255,255,255,0.35), rgba(255,255,255,0) 40%)",
          opacity: 0.5,
        }}
      />
    </span>
  );
}