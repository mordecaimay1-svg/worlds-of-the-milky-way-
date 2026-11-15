export default function SliderField({ label, value, min, max, step = 1, unit, hint, onChange }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label className="mono-label text-[0.55rem] text-white/45" htmlFor={`slider-${label}`}>
          {label}
        </label>
        <span className="font-mono text-[0.78rem] text-[#00F2FF]">
          {value}
          {unit ? <span className="ml-1 text-white/35">{unit}</span> : null}
        </span>
      </div>
      <input
        id={`slider-${label}`}
        name={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/12"
        style={{ accentColor: "#00F2FF" }}
      />
      {hint ? <p className="mt-2 font-mono text-[0.6rem] text-white/30">{hint}</p> : null}
    </div>
  );
}