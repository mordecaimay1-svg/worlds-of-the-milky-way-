export default function OptionGroup({ label, options, value, columns = 2, onChange }) {
  return (
    <div>
      <p className="mono-label text-[0.55rem] text-white/45">{label}</p>
      <div
        role="group"
        aria-label={label}
        className={`mt-3 grid gap-2 ${columns === 3 ? "grid-cols-3" : "grid-cols-2"}`}
      >
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className={`rounded-lg border px-3 py-2 text-left text-[0.78rem] transition-all ${
                active
                  ? "border-[#00F2FF]/60 bg-[#00F2FF]/10 text-white shadow-[0_0_18px_-8px_#00F2FF]"
                  : "border-white/10 bg-white/[0.02] text-white/55 hover:border-white/25 hover:text-white"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}