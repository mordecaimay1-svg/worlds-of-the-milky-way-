import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  makePlanetTexture,
  makeEarthTextures,
  makeCloudTexture,
  makeSunTexture,
  makeGlowTexture,
  makeMilkyWayTexture,
  makeRingTexture,
  makeRingGeometry,
} from "./textures";

const DEG = Math.PI / 180;
const TAU = Math.PI * 2;

const BODIES = [
  {
    slug: "mercury",
    name: "Mercury",
    radius: 0.42,
    a: 6.6,
    e: 0.2,
    incl: 0.12,
    tilt: 0.03,
    spin: 0.06,
    angular: 0.085,
    texture: "mercury",
    bump: 0.02,
  },
  {
    slug: "venus",
    name: "Venus",
    radius: 0.6,
    a: 9.1,
    e: 0.01,
    incl: 0.06,
    tilt: 177.4,
    spin: -0.016,
    angular: 0.06,
    texture: "venus",
    bump: 0.008,
    atmosphere: { color: 0xffe1a0, power: 2.0, intensity: 0.9, scale: 1.2 },
  },
  {
    slug: "earth",
    name: "Earth",
    radius: 0.64,
    a: 11.8,
    e: 0.017,
    incl: 0.03,
    tilt: 23.4,
    spin: 0.22,
    angular: 0.048,
    atmosphere: { color: 0x62b8ff, power: 2.6, intensity: 1.0, scale: 1.16 },
    moon: true,
  },
  {
    slug: "mars",
    name: "Mars",
    radius: 0.48,
    a: 14.8,
    e: 0.09,
    incl: 0.04,
    tilt: 25.2,
    spin: 0.21,
    angular: 0.039,
    texture: "mars",
    bump: 0.022,
    atmosphere: { color: 0xffb08a, power: 3.0, intensity: 0.55, scale: 1.12 },
  },
  {
    slug: "jupiter",
    name: "Jupiter",
    radius: 1.85,
    a: 21,
    e: 0.05,
    incl: 0.03,
    tilt: 3.1,
    spin: 0.52,
    angular: 0.024,
    texture: "jupiter",
    atmosphere: { color: 0xe7d3ae, power: 3.4, intensity: 0.32, scale: 1.07 },
    moons: 4,
  },
  {
    slug: "saturn",
    name: "Saturn",
    radius: 1.55,
    a: 27.6,
    e: 0.056,
    incl: 0.05,
    tilt: 26.7,
    spin: 0.48,
    angular: 0.018,
    texture: "saturn",
    atmosphere: { color: 0xf3e2b8, power: 3.4, intensity: 0.28, scale: 1.07 },
    rings: true,
  },
  {
    slug: "uranus",
    name: "Uranus",
    radius: 1.1,
    a: 34,
    e: 0.047,
    incl: 0.02,
    tilt: 97.8,
    spin: -0.32,
    angular: 0.013,
    texture: "uranus",
    atmosphere: { color: 0x9ff0f7, power: 3.0, intensity: 0.45, scale: 1.1 },
  },
  {
    slug: "neptune",
    name: "Neptune",
    radius: 1.08,
    a: 40,
    e: 0.009,
    incl: 0.03,
    tilt: 28.3,
    spin: 0.3,
    angular: 0.01,
    texture: "neptune",
    atmosphere: { color: 0x6d8dff, power: 3.0, intensity: 0.5, scale: 1.1 },
  },
];

const NINE = { slug: "nine", name: "Planet Nine", radius: 0.8, a: 47, e: 0.16, incl: 0.14, angular: 0.0068 };

const EARTH_VERT = `
  varying vec2 vUv;
  varying vec3 vNormalW;
  void main() {
    vUv = uv;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const EARTH_FRAG = `
  uniform sampler2D uDay;
  uniform sampler2D uNight;
  uniform vec3 uSunDir;
  varying vec2 vUv;
  varying vec3 vNormalW;
  void main() {
    vec3 n = normalize(vNormalW);
    float lambert = clamp(dot(n, normalize(uSunDir)), 0.0, 1.0);
    float dayAmount = smoothstep(0.02, 0.34, lambert);
    vec3 day = texture2D(uDay, vUv).rgb * (0.16 + 0.9 * lambert);
    vec3 night = texture2D(uNight, vUv).rgb * (1.0 - dayAmount);
    gl_FragColor = vec4(day + night * 1.45, 1.0);
  }
`;

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

function makeAtmosphere(radius, { color, power, intensity, scale }) {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uPower: { value: power },
      uIntensity: { value: intensity },
    },
    vertexShader: ATMO_VERT,
    fragmentShader: ATMO_FRAG,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.BackSide,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius * scale, 48, 32), material);
  return mesh;
}

export function createSolarScene({ host, labelHost, quality = "high", onFocus, onClearFocus }) {
  const isMobile = quality === "low" || window.innerWidth < 768;
  const textureSize = isMobile ? 512 : 1024;
  const textures = [];
  const track = (texture) => {
    textures.push(texture);
    return texture;
  };

  const width = host.clientWidth || 800;
  const height = host.clientHeight || 520;

  const scene = new THREE.Scene();

  /* ------------------------------------------------------------ deep space */
  // One huge inverted sphere carries the star panorama. It follows the camera
  // every frame and writes no depth, so it never closes in like a dome.
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(1, 48, 32),
    new THREE.MeshBasicMaterial({
      map: track(makeMilkyWayTexture(isMobile ? 1024 : 2048)),
      side: THREE.BackSide,
      depthTest: false,
      depthWrite: false,
      fog: false,
      toneMapped: false,
    })
  );
  sky.scale.setScalar(30000);
  sky.renderOrder = -1000;
  sky.frustumCulled = false;
  scene.add(sky);

  // A real volume of star points far out in the system: orbiting or panning
  // shifts them slightly, which a flat panorama can never do.
  const starCount = isMobile ? 2600 : 6000;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i += 1) {
    const u = Math.random() * 2 - 1;
    const ring = Math.sqrt(1 - u * u);
    const angle = Math.random() * TAU;
    const distance = 300 + Math.random() * 1400;
    starPositions[i * 3] = Math.cos(angle) * ring * distance;
    starPositions[i * 3 + 1] = u * distance;
    starPositions[i * 3 + 2] = Math.sin(angle) * ring * distance;
  }
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  const starField = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({
      size: isMobile ? 3.6 : 2.8,
      sizeAttenuation: true,
      color: 0xcfdcff,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
      toneMapped: false,
    })
  );
  starField.frustumCulled = false;
  scene.add(starField);

  const camera = new THREE.PerspectiveCamera(60, width / height, 0.2, 120000);

  const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.style.display = "block";
  host.appendChild(renderer.domElement);

  // Elevated, angled overview, so the orbits read as ellipses in open space.
  const OVERVIEW_ELEVATION = 33 * DEG;
  const OVERVIEW_AZIMUTH = -24 * DEG;

  const overviewDistance = () => {
    const aspect = camera.aspect || width / height;
    const halfFov = Math.tan((60 * DEG) / 2);
    return Math.max(52 / (halfFov * aspect), 58);
  };

  const overviewPosition = () =>
    new THREE.Vector3(
      Math.sin(OVERVIEW_AZIMUTH) * Math.cos(OVERVIEW_ELEVATION),
      Math.sin(OVERVIEW_ELEVATION),
      Math.cos(OVERVIEW_AZIMUTH) * Math.cos(OVERVIEW_ELEVATION)
    ).multiplyScalar(overviewDistance());

  camera.position.copy(overviewPosition());
  camera.lookAt(0, 0, 0);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.12;
  controls.rotateSpeed = 0.45;
  // No scroll-wheel zoom: scrolling the page should scroll the page, not
  // zoom the scene. Close-ups come from clicking a planet, which snaps
  // straight to it instead of flying the camera in.
  controls.enableZoom = false;
  controls.panSpeed = 0.7;
  controls.minDistance = 1.6;
  controls.maxDistance = Infinity;
  controls.maxPolarAngle = Math.PI * 0.995;
  controls.target.set(0, 0, 0);

  const sunLight = new THREE.PointLight(0xfff3d6, 3.4, 0, 0);
  // Only the ring plane casts, so the shadow cube stays cheap.
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(isMobile ? 512 : 1024, isMobile ? 512 : 1024);
  sunLight.shadow.camera.near = 1;
  sunLight.shadow.camera.far = 72;
  sunLight.shadow.bias = -0.0015;
  sunLight.shadow.normalBias = 0.02;
  scene.add(sunLight);
  // just enough to keep the unlit sides readable, never enough to flatten them
  scene.add(new THREE.AmbientLight(0x0d1626, 0.22));

  /* ------------------------------------------------------------- the sun */
  const sunGroup = new THREE.Group();
  scene.add(sunGroup);

  const sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(3, isMobile ? 40 : 64, isMobile ? 28 : 48),
    new THREE.MeshBasicMaterial({ map: track(makeSunTexture(textureSize)), toneMapped: false })
  );
  sunGroup.add(sunMesh);

  const glowTexture = track(makeGlowTexture());

  const sunHalo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0xffa63d,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.85,
    })
  );
  sunHalo.scale.setScalar(15);
  sunGroup.add(sunHalo);

  const sunCore = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0xfff1c6,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.9,
    })
  );
  sunCore.scale.setScalar(8);
  sunGroup.add(sunCore);

  /* --------------------------------------------------------------- worlds */
  const moonTexture = track(makePlanetTexture("moon", isMobile ? 128 : 256));
  const ringTexture = track(makeRingTexture(1024));
  const cloudTexture = track(makeCloudTexture(isMobile ? 384 : 768));

  const bodies = {};
  const orbitLines = [];
  const pickables = [];
  const labelEls = {};
  let labelsOn = true;

  BODIES.forEach((cfg, index) => {
    const plane = new THREE.Group();
    plane.rotation.x = cfg.incl * DEG;
    scene.add(plane);

    const holder = new THREE.Group();
    plane.add(holder);

    const tiltGroup = new THREE.Group();
    tiltGroup.rotation.z = cfg.tilt * DEG;
    holder.add(tiltGroup);

    let mesh;
    let earthUniforms = null;
    let cloudMesh = null;

    if (cfg.slug === "earth") {
      const { day, night } = makeEarthTextures(textureSize);
      track(day);
      track(night);
      earthUniforms = { uSunDir: { value: new THREE.Vector3(1, 0, 0) } };
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uDay: { value: day },
          uNight: { value: night },
          uSunDir: earthUniforms.uSunDir,
        },
        vertexShader: EARTH_VERT,
        fragmentShader: EARTH_FRAG,
      });
      mesh = new THREE.Mesh(new THREE.SphereGeometry(cfg.radius, 72, 48), material);

      const clouds = new THREE.Mesh(
        new THREE.SphereGeometry(cfg.radius * 1.015, 64, 40),
        new THREE.MeshStandardMaterial({
          map: cloudTexture,
          transparent: true,
          opacity: 0.72,
          depthWrite: false,
          roughness: 1,
        })
      );
      tiltGroup.add(clouds);
      cloudMesh = clouds;
    } else {
      const surfaceTexture = track(makePlanetTexture(cfg.texture, textureSize));
      mesh = new THREE.Mesh(
        new THREE.SphereGeometry(cfg.radius, isMobile ? 40 : 64, isMobile ? 28 : 48),
        new THREE.MeshStandardMaterial({
          map: surfaceTexture,
          roughness: 0.94,
          metalness: 0.02,
          ...(cfg.bump ? { bumpMap: surfaceTexture, bumpScale: cfg.bump } : {}),
        })
      );
    }
    tiltGroup.add(mesh);

    if (cfg.rings) mesh.receiveShadow = true;

    if (cfg.atmosphere) holder.add(makeAtmosphere(cfg.radius, cfg.atmosphere));

    if (cfg.rings) {
      const rings = new THREE.Mesh(
        makeRingGeometry(cfg.radius * 1.32, cfg.radius * 2.4, 168),
        new THREE.MeshBasicMaterial({
          map: ringTexture,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
          opacity: 0.95,
        })
      );
      rings.rotation.x = -Math.PI / 2;
      // The ring bands, gaps included, throw a shadow across the planet.
      rings.castShadow = true;
      rings.customDepthMaterial = new THREE.MeshDepthMaterial({
        depthPacking: THREE.RGBADepthPacking,
        map: ringTexture,
        alphaTest: 0.4,
      });
      tiltGroup.add(rings);
    }

    const moons = [];
    const addMoon = (distance, radius, speed) => {
      const pivot = new THREE.Group();
      holder.add(pivot);
      const moon = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 20, 14),
        new THREE.MeshStandardMaterial({ map: moonTexture, roughness: 1 })
      );
      moon.position.set(distance, 0, 0);
      pivot.add(moon);
      moons.push({ pivot, speed });
    };

    if (cfg.moon) addMoon(cfg.radius * 2.6, 0.17, 0.55);
    if (cfg.moons === 4) {
      addMoon(2.75, 0.11, 1.3);
      addMoon(3.3, 0.1, 1.02);
      addMoon(3.95, 0.16, 0.74);
      addMoon(4.7, 0.14, 0.55);
    }

    const b = cfg.a * Math.sqrt(1 - cfg.e * cfg.e);
    const points = [];
    for (let i = 0; i <= 220; i += 1) {
      const t = (i / 220) * TAU;
      points.push(new THREE.Vector3(cfg.a * (Math.cos(t) - cfg.e), 0, b * Math.sin(t)));
    }
    const orbitLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({
        color: 0x9dc8ff,
        transparent: true,
        opacity: Math.max(0.05, 0.15 - index * 0.011),
        depthWrite: false,
      })
    );
    plane.add(orbitLine);
    orbitLines.push(orbitLine);

    const proxy = new THREE.Mesh(
      new THREE.SphereGeometry(Math.max(cfg.radius * 1.7, 0.85), 12, 8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    proxy.userData.slug = cfg.slug;
    holder.add(proxy);
    pickables.push(proxy);

    bodies[cfg.slug] = {
      cfg,
      holder,
      mesh,
      planes: plane,
      moons,
      clouds: cloudMesh,
      earthUniforms,
      angle0: index * 1.65,
      b,
    };
  });

  /* ---------------------------------------------------------- Planet Nine */
  const ninePlane = new THREE.Group();
  ninePlane.rotation.x = NINE.incl * DEG;
  scene.add(ninePlane);

  const nineHolder = new THREE.Group();
  ninePlane.add(nineHolder);

  const nineMesh = new THREE.Mesh(
    new THREE.SphereGeometry(NINE.radius, 48, 32),
    new THREE.MeshStandardMaterial({
      map: track(makePlanetTexture("nine", isMobile ? 256 : 512)),
      roughness: 0.85,
      metalness: 0.05,
    })
  );
  nineHolder.add(nineMesh);
  nineHolder.add(
    makeAtmosphere(NINE.radius, { color: 0xb46bff, power: 2.4, intensity: 1.15, scale: 1.22 })
  );

  const nineGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0xb46bff,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.65,
    })
  );
  nineGlow.scale.setScalar(4.6);
  nineHolder.add(nineGlow);

  const nineProxy = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 12, 8),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  nineProxy.userData.slug = NINE.slug;
  nineHolder.add(nineProxy);
  pickables.push(nineProxy);

  const nineB = NINE.a * Math.sqrt(1 - NINE.e * NINE.e);
  const ninePoints = [];
  for (let i = 0; i <= 220; i += 1) {
    const t = (i / 220) * TAU;
    ninePoints.push(new THREE.Vector3(NINE.a * (Math.cos(t) - NINE.e), 0, nineB * Math.sin(t)));
  }
  const nineOrbit = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(ninePoints),
    new THREE.LineBasicMaterial({
      color: 0xc79bff,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
    })
  );
  ninePlane.add(nineOrbit);
  orbitLines.push(nineOrbit);

  /* --------------------------------------------------------------- labels */
  if (labelHost) {
    labelHost.innerHTML = "";
    const labels = [
      { slug: "sun", name: "The Sun", offset: 4.2 },
      ...BODIES.map((cfg) => ({ slug: cfg.slug, name: cfg.name, offset: cfg.radius + 0.55 })),
      { slug: "nine", name: "Design Your Own", offset: NINE.radius + 0.85, cta: true },
    ];

    labels.forEach((item) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = `scene-label${item.cta ? " scene-label--cta" : ""}`;
      el.textContent = item.name;
      el.style.opacity = "0";
      el.dataset.offset = String(item.offset);
      if (item.slug !== "sun") {
        el.addEventListener("click", () => select(item.slug));
      } else {
        el.style.cursor = "default";
      }
      labelHost.appendChild(el);
      labelEls[item.slug] = el;
    });
  }

  /* -------------------------------------------------------------- picking */
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let pressPos = null;

  const onPointerDown = (event) => {
    pressPos = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event) => {
    if (!pressPos) return;
    const moved = Math.hypot(event.clientX - pressPos.x, event.clientY - pressPos.y);
    pressPos = null;
    if (moved > 6) return;
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(pickables, false);
    if (hits.length) select(hits[0].object.userData.slug);
  };

  renderer.domElement.addEventListener("pointerdown", onPointerDown);
  renderer.domElement.addEventListener("pointerup", onPointerUp);

  /* ------------------------------------------------------- planet focus */
  // No camera flights: selecting a planet snaps the camera straight to it,
  // and going back snaps straight to the overview. No zoom animation.
  let follow = null;
  let previousFollowPos = null;

  function select(slug) {
    const isNine = slug === "nine";
    const holder = isNine ? nineHolder : bodies[slug]?.holder;
    if (!holder) return;
    const radius = isNine ? NINE.radius : bodies[slug].cfg.radius;
    const world = new THREE.Vector3();
    holder.getWorldPosition(world);
    const distance = Math.max(radius * 4.8, 3.1);
    const direction = new THREE.Vector3(0.52, 0.34, 1).normalize();
    camera.position.copy(world.clone().add(direction.multiplyScalar(distance)));
    controls.target.copy(world);
    controls.update();
    follow = { slug };
    previousFollowPos = null;
    onFocus?.(slug);
  }

  function reset() {
    follow = null;
    previousFollowPos = null;
    onClearFocus?.();
    camera.position.copy(overviewPosition());
    controls.target.set(0, 0, 0);
    controls.update();
  }

  /* ------------------------------------------------------------- animation */
  let paused = false;
  let speedMultiplier = 1;
  let elapsed = 0;
  let frameId = 0;

  const clock = new THREE.Clock();
  const worldPos = new THREE.Vector3();
  const projected = new THREE.Vector3();

  function updateLabels() {
    if (!labelHost) return;
    const w = host.clientWidth;
    const h = host.clientHeight;
    Object.entries(labelEls).forEach(([slug, el]) => {
      if (!labelsOn) {
        el.style.opacity = "0";
        return;
      }
      const target = slug === "sun" ? sunGroup : slug === "nine" ? nineHolder : bodies[slug]?.holder;
      if (!target) return;
      target.getWorldPosition(worldPos);
      worldPos.y += Number(el.dataset.offset || 1);
      projected.copy(worldPos).project(camera);
      if (projected.z > 1 || projected.x < -1.2 || projected.x > 1.2) {
        el.style.opacity = "0";
        return;
      }
      const x = (projected.x * 0.5 + 0.5) * w;
      const y = (-projected.y * 0.5 + 0.5) * h;
      el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
      el.style.opacity = projected.z > 0.999 ? "0" : "1";
    });
  }

  function animate() {
    frameId = requestAnimationFrame(animate);
    const delta = Math.min(clock.getDelta(), 0.05);
    const motion = paused ? 0 : delta * speedMultiplier;
    elapsed += motion;

    BODIES.forEach((cfg) => {
      const body = bodies[cfg.slug];
      const angle = body.angle0 + elapsed * cfg.angular;
      body.holder.position.set(
        cfg.a * (Math.cos(angle) - cfg.e),
        0,
        body.b * Math.sin(angle)
      );
      body.mesh.rotation.y += motion * cfg.spin;
      if (body.clouds) body.clouds.rotation.y += motion * cfg.spin * 1.35;
      body.moons.forEach((moon) => {
        moon.pivot.rotation.y = elapsed * moon.speed;
      });
      if (body.earthUniforms) {
        body.holder.getWorldPosition(worldPos);
        body.earthUniforms.uSunDir.value.copy(worldPos).multiplyScalar(-1).normalize();
      }
    });

    const nineAngle = elapsed * NINE.angular;
    nineHolder.position.set(
      NINE.a * (Math.cos(nineAngle) - NINE.e),
      0,
      nineB * Math.sin(nineAngle)
    );
    nineMesh.rotation.y += motion * 0.12;
    const pulse = 1 + Math.sin(performance.now() * 0.0016) * 0.09;
    nineGlow.scale.setScalar(4.6 * pulse);
    nineGlow.material.opacity = 0.5 + Math.sin(performance.now() * 0.0016) * 0.14;

    sunMesh.rotation.y += motion * 0.05;

    if (follow) {
      const holder = follow.slug === "nine" ? nineHolder : bodies[follow.slug]?.holder;
      if (holder) {
        holder.getWorldPosition(worldPos);
        if (previousFollowPos) {
          const shift = worldPos.clone().sub(previousFollowPos);
          camera.position.add(shift);
          controls.target.add(shift);
        }
        previousFollowPos = worldPos.clone();
      }
    }

    controls.update();

    sky.position.copy(camera.position);
    renderer.render(scene, camera);
    updateLabels();
  }

  animate();

  /* ---------------------------------------------------------------- resize */
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

  /* ------------------------------------------------------------------- api */
  return {
    focus: select,
    reset,
    setPaused: (value) => {
      paused = value;
    },
    setSpeed: (value) => {
      speedMultiplier = Math.max(0, value);
    },
    setOrbits: (visible) => {
      orbitLines.forEach((line) => {
        line.visible = visible;
      });
    },
    setLabels: (visible) => {
      labelsOn = visible;
      if (!visible) Object.values(labelEls).forEach((el) => (el.style.opacity = "0"));
    },
    dispose: () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      controls.dispose();
      textures.forEach((texture) => texture.dispose());
      scene.traverse((node) => {
        if (node.geometry) node.geometry.dispose();
        const materials = Array.isArray(node.material)
          ? node.material
          : node.material
          ? [node.material]
          : [];
        materials.forEach((material) => material.dispose());
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
      if (labelHost) labelHost.innerHTML = "";
    },
  };
}