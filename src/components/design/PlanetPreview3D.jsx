import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { planetPalette } from "@/lib/planet-visual";
import { makeCustomPlanetTexture, makeCloudTexture, makeGlowTexture, rgbaToHex } from "@/lib/three/textures";

const ATMO_VERT = `
  varying vec3 vNormalW;
  varying vec3 vWorldPos;
  void main() {
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorldPos = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const ATMO_FRAG = `
  uniform vec3 uColor;
  uniform float uPower;
  uniform float uIntensity;
  varying vec3 vNormalW;
  varying vec3 vWorldPos;
  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float rim = pow(1.0 - abs(dot(normalize(vNormalW), viewDir)), uPower);
    gl_FragColor = vec4(uColor, rim * uIntensity);
  }
`;

const glowAlpha = (rgba) => {
  const parts = String(rgba).match(/[\d.]+/g) || [];
  return parts.length >= 4 ? Number(parts[3]) : 0.4;
};

export default function PlanetPreview3D({ settings, busy = false }) {
  const hostRef = useRef(null);
  const applyRef = useRef(null);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFailed(true);
      return undefined;
    }

    const width = host.clientWidth || 260;
    const height = host.clientHeight || 232;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = "block";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 60);
    camera.position.set(0, 0, 4.7);

    const keyLight = new THREE.DirectionalLight(0xfff0d8, 3.1);
    keyLight.position.set(2.4, 1.7, 3.2);
    scene.add(keyLight);
    scene.add(new THREE.AmbientLight(0x2a3a55, 1.15));

    const fillLight = new THREE.DirectionalLight(0x9fd8ff, 1.1);
    fillLight.position.set(-3, -1.4, -2);
    scene.add(fillLight);

    const root = new THREE.Group();
    scene.add(root);

    const sphereGeometry = new THREE.SphereGeometry(1.22, 64, 44);
    const sphereMaterial = new THREE.MeshStandardMaterial({ roughness: 0.95, metalness: 0.02 });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    root.add(sphere);

    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color("#9fd8ff") },
        uPower: { value: 2.2 },
        uIntensity: { value: 1.3 },
      },
      vertexShader: ATMO_VERT,
      fragmentShader: ATMO_FRAG,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.BackSide,
    });
    const atmosphereGeometry = new THREE.SphereGeometry(1.44, 48, 32);
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    root.add(atmosphere);

    const cloudMaterial = new THREE.MeshStandardMaterial({
      map: makeCloudTexture(512),
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      roughness: 1,
    });
    const cloudGeometry = new THREE.SphereGeometry(1.245, 48, 32);
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    root.add(clouds);

    const glowTexture = makeGlowTexture();
    const glowMaterial = new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0x9fd8ff,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.4,
    });
    const glow = new THREE.Sprite(glowMaterial);
    glow.scale.setScalar(5.2);
    root.add(glow);

    const apply = (next) => {
      const palette = planetPalette(next);
      const texture = makeCustomPlanetTexture(next, palette, 512);
      if (sphereMaterial.map) sphereMaterial.map.dispose();
      sphereMaterial.map = texture;
      sphereMaterial.needsUpdate = true;

      const glowHex = rgbaToHex(palette.glow);
      const hazy = next.atmosphere !== "none";
      const thickness = glowAlpha(palette.glow);

      atmosphereMaterial.uniforms.uColor.value.set(glowHex);
      atmosphereMaterial.uniforms.uIntensity.value = thickness * 3;
      atmosphereMaterial.uniforms.uPower.value = next.surface_type === "cloud" ? 1.9 : 2.15;
      atmosphere.visible = hazy;

      glowMaterial.color.set(glowHex);
      glowMaterial.opacity = hazy ? 0.2 + thickness * 0.9 : 0.12;

      clouds.visible =
        next.surface_type === "cloud" || next.water === "liquid" || next.water === "ocean";
      cloudMaterial.opacity = next.surface_type === "cloud" ? 0.82 : 0.5;
    };

    applyRef.current = apply;
    apply(settingsRef.current);

    let frameId = 0;
    const tick = () => {
      frameId = requestAnimationFrame(tick);
      sphere.rotation.y += 0.0105;
      clouds.rotation.y += 0.0145;
      renderer.render(scene, camera);
    };
    tick();

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      applyRef.current = null;
      sphereMaterial.map?.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      cloudMaterial.map?.dispose();
      cloudGeometry.dispose();
      cloudMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      glowTexture.dispose();
      glowMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (!applyRef.current) return undefined;
    const timer = window.setTimeout(() => applyRef.current?.(settings), 160);
    return () => window.clearTimeout(timer);
  }, [
    settings.surface_type,
    settings.water,
    settings.temperature,
    settings.atmosphere,
    settings.radiation,
  ]);

  if (failed) {
    const palette = planetPalette(settings);
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="h-[176px] w-[176px] rounded-full"
          style={{
            background: `radial-gradient(circle at 32% 26%, ${palette.light}, ${palette.mid} 46%, ${palette.dark} 86%)`,
            boxShadow: `0 0 52px ${palette.glow}`,
          }}
        />
      </div>
    );
  }

  return (
    <div
      ref={hostRef}
      className={`absolute inset-0 transition-opacity duration-500 ${busy ? "opacity-60" : "opacity-100"}`}
    />
  );
}