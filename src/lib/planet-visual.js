export const SURFACE_PALETTES = {
  rocky: { light: "#D8C9B4", mid: "#A08A70", dark: "#37302A" },
  icy: { light: "#E4F8FF", mid: "#8FCFE0", dark: "#1B4650" },
  volcanic: { light: "#FFC08A", mid: "#C1440E", dark: "#2A0A06" },
  cloud: { light: "#F7E7CE", mid: "#C9A87C", dark: "#4A3520" },
  ocean: { light: "#A8E4FF", mid: "#2E6FBF", dark: "#08243D" },
};

export const ATMOSPHERE_GLOW = {
  oxygen: "rgba(127,227,255,0.55)",
  methane: "rgba(185,140,255,0.5)",
  toxic: "rgba(198,255,106,0.45)",
  thick_nitrogen: "rgba(191,213,255,0.4)",
  thin_co2: "rgba(224,201,166,0.32)",
  none: "rgba(255,255,255,0)",
};

const toRgb = (hex) => {
  const clean = hex.replace("#", "");
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
};

const toHex = (rgb) =>
  `#${rgb.map((value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0")).join("")}`;

const mix = (from, to, amount) => {
  const a = toRgb(from);
  const b = toRgb(to);
  return toHex(a.map((value, index) => value + (b[index] - value) * amount));
};

export function planetPalette(settings) {
  const palette = SURFACE_PALETTES[settings.surface_type] || SURFACE_PALETTES.rocky;
  const temperature = Number(settings.temperature ?? 15);

  let mid = palette.mid;
  let light = palette.light;

  if (temperature < -50) {
    const amount = Math.min((-50 - temperature) / 220, 0.6);
    mid = mix(mid, "#6FA8F5", amount);
    light = mix(light, "#DDF1FF", amount);
  }
  if (temperature > 80) {
    const amount = Math.min((temperature - 80) / 380, 0.65);
    mid = mix(mid, "#E8451B", amount);
    light = mix(light, "#FFB07A", amount);
  }

  return {
    light,
    mid,
    dark: mix(palette.dark, mid, 0.08),
    glow: ATMOSPHERE_GLOW[settings.atmosphere] || "rgba(255,255,255,0.2)",
  };
}