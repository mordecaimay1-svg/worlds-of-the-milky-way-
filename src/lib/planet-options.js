export const ATMOSPHERES = [
  { value: "thin_co2", label: "Thin CO₂" },
  { value: "thick_nitrogen", label: "Thick nitrogen" },
  { value: "methane", label: "Methane-rich" },
  { value: "oxygen", label: "Oxygen-rich" },
  { value: "none", label: "None / vacuum" },
  { value: "toxic", label: "Toxic mix" },
];

export const WATERS = [
  { value: "none", label: "None" },
  { value: "ice", label: "Ice" },
  { value: "liquid", label: "Liquid" },
  { value: "ocean", label: "Global ocean" },
];

export const SURFACES = [
  { value: "rocky", label: "Rocky" },
  { value: "icy", label: "Icy" },
  { value: "volcanic", label: "Volcanic" },
  { value: "cloud", label: "Gas giant cloud layer" },
  { value: "ocean", label: "Ocean" },
];

export const labelFor = (options, value) =>
  options.find((option) => option.value === value)?.label || value || "—";

export const radiationLabel = (index) => {
  if (index < 15) return "Low — 0.5× Earth";
  if (index < 35) return "Moderate — 1× Earth";
  if (index < 55) return "Elevated — 5× Earth";
  if (index < 75) return "High — 20× Earth";
  if (index < 90) return "Severe — 80× Earth";
  return "Lethal — 300× Earth";
};

export const atmosphereLabel = (value) => labelFor(ATMOSPHERES, value);
export const waterLabel = (value) => labelFor(WATERS, value);
export const surfaceLabel = (value) => labelFor(SURFACES, value);