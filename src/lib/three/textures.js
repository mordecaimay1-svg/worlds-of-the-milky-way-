import * as THREE from "three";

/* ------------------------------------------------------------------ utils */

function canvas2d(w, h) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  return { canvas, ctx: canvas.getContext("2d") };
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), 1 | t);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const mix = (a, b, t) => a + (b - a) * t;

function mixColor(a, b, t) {
  const k = clamp01(t);
  return [mix(a[0], b[0], k), mix(a[1], b[1], k), mix(a[2], b[2], k)];
}

/* Periodic value noise so the texture wraps seamlessly around the sphere. */
function makeNoise(seed, period) {
  const rnd = mulberry32(seed);
  const grid = new Float32Array(period * period);
  for (let i = 0; i < grid.length; i += 1) grid[i] = rnd();
  const smooth = (t) => t * t * (3 - 2 * t);

  return (u, v) => {
    const x = ((u % 1) + 1) % 1;
    const y = ((v % 1) + 1) % 1;
    const gx = x * period;
    const gy = y * period;
    const x0 = Math.floor(gx) % period;
    const y0 = Math.floor(gy) % period;
    const x1 = (x0 + 1) % period;
    const y1 = (y0 + 1) % period;
    const tx = smooth(gx - Math.floor(gx));
    const ty = smooth(gy - Math.floor(gy));
    const v00 = grid[y0 * period + x0];
    const v10 = grid[y0 * period + x1];
    const v01 = grid[y1 * period + x0];
    const v11 = grid[y1 * period + x1];
    const top = v00 + (v10 - v00) * tx;
    const bottom = v01 + (v11 - v01) * tx;
    return top + (bottom - top) * ty;
  };
}

function noiseSet(seed) {
  return [
    makeNoise(seed, 9),
    makeNoise(seed + 11, 21),
    makeNoise(seed + 23, 47),
    makeNoise(seed + 31, 97),
  ];
}

function fbm(ns, u, v) {
  return ns[0](u, v) * 0.5 + ns[1](u, v) * 0.28 + ns[2](u, v) * 0.14 + ns[3](u, v) * 0.08;
}

function paint(w, h, fn) {
  const { canvas, ctx } = canvas2d(w, h);
  const image = ctx.createImageData(w, h);
  const data = image.data;
  for (let y = 0; y < h; y += 1) {
    const v = (y + 0.5) / h;
    for (let x = 0; x < w; x += 1) {
      const u = (x + 0.5) / w;
      const color = fn(u, v);
      const i = (y * w + x) * 4;
      data[i] = color[0];
      data[i + 1] = color[1];
      data[i + 2] = color[2];
      data[i + 3] = color[3] === undefined ? 255 : color[3];
    }
  }
  ctx.putImageData(image, 0, 0);
  return { canvas, ctx };
}

function finishTexture(canvas) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

export function hexToRgb(hex) {
  const clean = String(hex || "#888888").replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  return [
    parseInt(full.slice(0, 2), 16) || 128,
    parseInt(full.slice(2, 4), 16) || 128,
    parseInt(full.slice(4, 6), 16) || 128,
  ];
}

export function rgbaToHex(value) {
  const match = String(value || "").match(/rgba?\(([^)]+)\)/i);
  if (!match) return "#9fd8ff";
  const parts = match[1].split(",").map((n) => Number(n.trim()));
  const hex = parts
    .slice(0, 3)
    .map((n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0"))
    .join("");
  return `#${hex}`;
}

function drawCraters(ctx, w, h, count, seed) {
  const rnd = mulberry32(seed);
  for (let i = 0; i < count; i += 1) {
    const x = rnd() * w;
    const y = h * (0.08 + rnd() * 0.84);
    const r = (0.004 + rnd() * 0.022) * w;
    const gradient = ctx.createRadialGradient(x, y, r * 0.08, x, y, r);
    gradient.addColorStop(0, "rgba(28,24,20,0.34)");
    gradient.addColorStop(0.7, "rgba(255,255,255,0.10)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = Math.max(1, r * 0.1);
    ctx.beginPath();
    ctx.arc(x, y, r * 0.9, 0, Math.PI * 2);
    ctx.stroke();
  }
}

/* -------------------------------------------------------------- materials */

const SPECS = {
  mercury: {
    kind: "rocky",
    dark: [70, 64, 58],
    base: [140, 130, 118],
    light: [198, 188, 172],
    craters: 90,
    seed: 3,
  },
  venus: {
    kind: "swirl",
    dark: [168, 126, 56],
    base: [228, 194, 122],
    light: [252, 240, 202],
    seed: 12,
  },
  mars: {
    kind: "rocky",
    dark: [94, 40, 24],
    base: [172, 76, 44],
    light: [224, 140, 98],
    craters: 55,
    cap: 0.13,
    seed: 24,
  },
  jupiter: {
    kind: "bands",
    bands: 14,
    colors: [
      [124, 88, 62],
      [206, 168, 126],
      [246, 232, 204],
      [172, 126, 92],
      [232, 202, 164],
    ],
    spot: { x: 0.7, y: 0.63, rx: 0.075, ry: 0.05, color: [190, 88, 58] },
    seed: 36,
  },
  saturn: {
    kind: "bands",
    bands: 10,
    colors: [
      [190, 162, 112],
      [231, 208, 158],
      [249, 238, 208],
      [206, 180, 128],
    ],
    shadowBand: true,
    seed: 48,
  },
  uranus: {
    kind: "bands",
    bands: 6,
    colors: [
      [122, 204, 214],
      [158, 226, 232],
      [108, 188, 200],
    ],
    seed: 60,
  },
  neptune: {
    kind: "bands",
    bands: 8,
    colors: [
      [26, 44, 128],
      [56, 88, 200],
      [88, 122, 224],
      [34, 54, 150],
    ],
    spot: { x: 0.38, y: 0.62, rx: 0.07, ry: 0.045, color: [18, 30, 92] },
    seed: 72,
  },
  moon: {
    kind: "rocky",
    dark: [56, 54, 52],
    base: [128, 124, 118],
    light: [196, 192, 184],
    craters: 70,
    seed: 84,
  },
  nine: {
    kind: "rocky",
    dark: [34, 8, 60],
    base: [112, 44, 180],
    light: [214, 168, 255],
    craters: 26,
    seed: 96,
  },
};

export function makePlanetTexture(slug, size = 1024) {
  const spec = SPECS[slug] || SPECS.moon;
  const w = size;
  const h = Math.round(size / 2);
  const ns = noiseSet(spec.seed);

  const { canvas, ctx } = paint(w, h, (u, v) => {
    const lat = Math.abs(v - 0.5) * 2;
    const n = fbm(ns, u, v);
    const detail = ns[3](u, v);

    if (spec.kind === "bands") {
      const turbulence = (n - 0.5) * 0.1 + (detail - 0.5) * 0.02;
      const wave = 0.5 + 0.5 * Math.sin((v + turbulence) * spec.bands * Math.PI * 2 + n * 3);
      const t = wave * 0.72 + n * 0.28;
      const colors = spec.colors;
      const index = t * (colors.length - 1);
      const i0 = Math.floor(index);
      const i1 = Math.min(colors.length - 1, i0 + 1);
      let color = mixColor(colors[i0], colors[i1], index - i0);
      const pole = 1 - 0.22 * Math.pow(lat, 3);
      color = [color[0] * pole + 6, color[1] * pole + 6, color[2] * pole + 8];

      if (spec.spot) {
        const dx = (u - spec.spot.x) / spec.spot.rx;
        const dy = (v - spec.spot.y) / spec.spot.ry;
        const d = Math.sqrt(dx * dx + dy * dy);
        const k = 1 - clamp01((d - 0.55) / 0.45);
        if (k > 0) color = mixColor(color, spec.spot.color, k * 0.85);
      }
      if (spec.shadowBand) {
        const d = Math.abs(v - 0.5);
        const k = Math.max(0, 1 - Math.abs(d - 0.05) / 0.035);
        color = mixColor(color, [82, 64, 34], k * 0.32);
      }
      return color;
    }

    if (spec.kind === "swirl") {
      const warp = (n - 0.5) * 5 + Math.sin(v * Math.PI * 6) * 0.6;
      const t = 0.5 + 0.45 * Math.sin((v * 9 + warp * 0.25) * Math.PI);
      let color = mixColor(spec.dark, spec.base, clamp01(t * 0.62 + n * 0.65));
      color = mixColor(color, spec.light, clamp01((detail - 0.45) * 1.8) * 0.55);
      const pole = 1 - 0.12 * Math.pow(lat, 2);
      return [color[0] * pole, color[1] * pole, color[2] * pole];
    }

    const t = clamp01(n * 1.05 + (detail - 0.5) * 0.25);
    let color = mixColor(spec.dark, spec.base, clamp01(t * 1.4));
    color = mixColor(color, spec.light, clamp01((t - 0.55) * 2) * 0.8);
    if (spec.cap) {
      const capT = clamp01((lat - (1 - spec.cap)) / 0.06);
      if (capT > 0) color = mixColor(color, [238, 242, 248], capT * 0.9);
    }
    return color;
  });

  if (spec.craters) drawCraters(ctx, w, h, spec.craters, spec.seed + 5);
  return finishTexture(canvas);
}

export function makeEarthTextures(size = 1024) {
  const w = size;
  const h = Math.round(size / 2);
  const ns = noiseSet(101);
  const landNs = noiseSet(202);

  const isLand = (u, v) => {
    const lat = Math.abs(v - 0.5) * 2;
    return fbm(landNs, u, v) > 0.5 + lat * 0.07;
  };

  const day = paint(w, h, (u, v) => {
    const lat = Math.abs(v - 0.5) * 2;
    const detail = ns[2](u, v);
    const moisture = fbm(ns, u, v);

    if (isLand(u, v)) {
      let color = mixColor([58, 96, 52], [104, 112, 62], clamp01(moisture * 1.6));
      color = mixColor(color, [178, 150, 104], clamp01((lat - 0.18) * 1.5) * 0.55);
      color = mixColor(color, [124, 116, 100], clamp01((detail - 0.56) * 2.2) * 0.5);
      if (lat > 0.86) color = mixColor(color, [232, 240, 248], clamp01((lat - 0.86) / 0.1));
      return color;
    }

    let color = mixColor([7, 30, 68], [30, 96, 148], clamp01(moisture * 1.4 - 0.3));
    if (lat > 0.92) color = mixColor(color, [236, 244, 252], clamp01((lat - 0.92) / 0.06));
    return color;
  });

  const night = paint(w, h, (u, v) => {
    if (!isLand(u, v)) return [3, 6, 14];
    return [7, 7, 11];
  });

  const rnd = mulberry32(4545);
  for (let i = 0; i < 5200; i += 1) {
    const u = rnd();
    const v = 0.16 + rnd() * 0.68;
    if (!isLand(u, v)) continue;
    const x = u * w;
    const y = v * h;
    const radius = 0.6 + rnd() * 2.2;
    const alpha = 0.35 + rnd() * 0.65;
    night.ctx.fillStyle = `rgba(255, ${175 + Math.floor(rnd() * 55)}, ${105 + Math.floor(rnd() * 60)}, ${alpha})`;
    night.ctx.beginPath();
    night.ctx.arc(x, y, radius, 0, Math.PI * 2);
    night.ctx.fill();
    if (rnd() > 0.72) {
      night.ctx.fillStyle = `rgba(255, 236, 190, ${alpha * 0.16})`;
      night.ctx.beginPath();
      night.ctx.arc(x, y, radius * 3.4, 0, Math.PI * 2);
      night.ctx.fill();
    }
  }

  return { day: finishTexture(day.canvas), night: finishTexture(night.canvas) };
}

export function makeCloudTexture(size = 512, tint = [255, 255, 255], coverage = 0.48) {
  const ns = noiseSet(303);
  const { canvas } = paint(size, Math.round(size / 2), (u, v) => {
    const lat = Math.abs(v - 0.5) * 2;
    const swirl = fbm(ns, (u + v * 0.08) % 1, v);
    const detail = ns[3](u, v);
    const amount = clamp01((swirl * 0.86 + detail * 0.34 - (1 - coverage)) * 2.2);
    const fade = 1 - Math.pow(lat, 6) * 0.7;
    return [tint[0], tint[1], tint[2], Math.round(clamp01(amount * fade) * 255)];
  });
  return finishTexture(canvas);
}

export function makeCustomPlanetTexture(settings, palette, size = 512) {
  const light = hexToRgb(palette.light);
  const mid = hexToRgb(palette.mid);
  const dark = hexToRgb(palette.dark);
  const surface = settings.surface_type;
  const water = settings.water;
  const temperature = Number(settings.temperature ?? 15);
  const ns = noiseSet(707);

  const { canvas, ctx } = paint(size, Math.round(size / 2), (u, v) => {
    const lat = Math.abs(v - 0.5) * 2;
    const n = fbm(ns, u, v);
    const detail = ns[3](u, v);
    let color;

    if (surface === "cloud") {
      const wave = 0.5 + 0.5 * Math.sin((v * 7 + (n - 0.5) * 1.6) * Math.PI * 2);
      color = mixColor(dark, light, clamp01(wave * 0.7 + n * 0.5));
    } else {
      const t = clamp01(n * 1.1 + (detail - 0.5) * 0.4);
      color = mixColor(dark, mid, clamp01(t * 1.3));
      color = mixColor(color, light, clamp01((t - 0.55) * 2));
    }

    if (water === "ocean" || water === "liquid") {
      const sea = clamp01((n - 0.56) * 3.4) * (water === "ocean" ? 0.92 : 0.55);
      color = mixColor(color, [16, 62, 118], sea);
    }

    if (water === "ice" || temperature < -60) {
      const caps = Math.max(clamp01((lat - 0.72) / 0.22), temperature < -60 ? clamp01(lat * 1.1) * 0.55 : 0);
      color = mixColor(color, [238, 248, 255], caps * 0.85);
    }

    if (surface === "volcanic") {
      const vein = Math.abs(n - 0.5);
      const glow = clamp01((0.05 - vein) / 0.05);
      color = mixColor(color, [255, 128, 42], glow * 0.9);
    }

    return color;
  });

  if (surface === "rocky" || surface === "volcanic") drawCraters(ctx, size, size / 2, 34, 91);
  return finishTexture(canvas);
}

export function makeSunTexture(size = 1024) {
  const ns = noiseSet(404);
  const { canvas } = paint(size, Math.round(size / 2), (u, v) => {
    const n = fbm(ns, u, v);
    const detail = ns[3](u, v);
    const t = clamp01(n * 1.2 + detail * 0.25);
    let color = mixColor([255, 132, 20], [255, 206, 88], clamp01(t * 1.35));
    color = mixColor(color, [255, 248, 216], clamp01((detail - 0.55) * 2) * 0.6);
    return color;
  });
  return finishTexture(canvas);
}

export function makeGlowTexture(size = 256) {
  const { canvas, ctx } = canvas2d(size, size);
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.26, "rgba(255,255,255,0.5)");
  gradient.addColorStop(0.55, "rgba(255,255,255,0.13)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function makeMilkyWayTexture(width = 2048) {
  const h = Math.round(width / 2);
  const { canvas, ctx } = canvas2d(width, h);

  const image = ctx.createImageData(width, h);
  const data = image.data;

  // a tilted galactic plane, so the band sweeps diagonally across the sky
  const gx = 0.44;
  const gy = 0.84;
  const gz = 0.32;
  const glen = Math.hypot(gx, gy, gz);

  for (let y = 0; y < h; y += 1) {
    const phi = ((y + 0.5) / h) * Math.PI;
    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);

    for (let x = 0; x < width; x += 1) {
      const theta = ((x + 0.5) / width) * Math.PI * 2;
      const dx = sinPhi * Math.cos(theta);
      const dz = sinPhi * Math.sin(theta);

      const d = (dx * gx + cosPhi * gy + dz * gz) / glen;
      const dd = d * d;
      const core = Math.exp(-dd / 0.0125);
      const halo = Math.exp(-dd / 0.11);

      // periodic in both theta and phi: no seam, no hard edge
      const cloud =
        0.7 +
        0.3 *
          ((Math.sin(theta * 3 + 1.3) * Math.sin(phi * 2.1 + 0.4) +
            Math.sin(theta * 7 - 0.7) * Math.sin(phi * 4.3) * 0.55 +
            Math.sin(theta * 13 + 2.1) * Math.sin(phi * 8.7) * 0.28) /
            1.83);

      const lum = (core * 0.5 + halo * 0.1) * cloud;
      const i = (y * width + x) * 4;
      data[i] = 4 + lum * 172;
      data[i + 1] = 5 + lum * 180;
      data[i + 2] = 9 + lum * 202;
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);

  const rnd = mulberry32(9331);

  const stars = Math.round(width * 2.2);
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < stars; i += 1) {
    const x = rnd() * width;
    const y = rnd() * h;
    const bright = rnd() > 0.93;
    const r = bright ? 0.85 + rnd() * 1.05 : 0.16 + rnd() * 0.55;
    const alpha = bright ? 0.5 + rnd() * 0.45 : 0.1 + rnd() * 0.55;
    const warm = rnd();
    const tone = warm > 0.87 ? "255,226,196" : warm > 0.62 ? "198,220,255" : "255,255,255";
    ctx.fillStyle = `rgba(${tone},${alpha.toFixed(3)})`;
    // duplicate stars that cross the seam so it never shows
    const copies = x < r + 1 ? [x, x + width] : x > width - r - 1 ? [x, x - width] : [x];
    copies.forEach((px) => {
      ctx.beginPath();
      ctx.arc(px, y, r, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  ctx.globalCompositeOperation = "source-over";

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

export function makeRingTexture(width = 1024) {
  const { canvas, ctx } = canvas2d(width, 8);
  const image = ctx.createImageData(width, 8);
  for (let x = 0; x < width; x += 1) {
    const t = x / width;
    let alpha = 0.8;
    const gapA = 1 - Math.exp(-Math.pow((t - 0.34) / 0.028, 2));
    const gapB = 1 - Math.exp(-Math.pow((t - 0.66) / 0.016, 2));
    alpha *= gapA * gapB;
    const band = 0.55 + 0.45 * Math.sin(t * 68 + Math.sin(t * 23) * 3);
    alpha *= 0.4 + 0.6 * band;
    if (t < 0.08) alpha *= t / 0.08;
    if (t > 0.96) alpha *= (1 - t) / 0.04;
    alpha = clamp01(alpha) * 0.92;
    const shade = 196 + 56 * band;
    for (let y = 0; y < 8; y += 1) {
      const i = (y * width + x) * 4;
      image.data[i] = shade;
      image.data[i + 1] = shade * 0.95;
      image.data[i + 2] = shade * 0.82;
      image.data[i + 3] = alpha * 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function makeRingGeometry(inner, outer, segments = 168) {
  const geometry = new THREE.RingGeometry(inner, outer, segments, 1);
  const position = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  const vertex = new THREE.Vector3();
  for (let i = 0; i < position.count; i += 1) {
    vertex.fromBufferAttribute(position, i);
    uv.setXY(i, clamp01((vertex.length() - inner) / (outer - inner)), 0.5);
  }
  return geometry;
}