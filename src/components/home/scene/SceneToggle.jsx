export default function SceneToggle({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-2 font-mono text-[0.56rem] uppercase tracking-[0.16em] backdrop-blur transition-colors ${
        active
          ? "border-[#00F2FF]/50 bg-[#00F2FF]/12 text-[#00F2FF]"
          : "border-white/12 bg-[#020408]/60 text-white/40 hover:text-white/75"
      }`}
    >
      {label}
    </button>
  );
}