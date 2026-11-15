export const SUN = {
  name: "The Sun",
  kind: "G2V main-sequence star",
  color: "#FFB347",
  light: "#FFE9B0",
  dark: "#C05A10",
  glow: "rgba(255,180,70,0.55)",
  tagline: "99.86% of the system's mass.",
};


// Sources for verified planetary data. Only the three core facts in
// verifiedFacts are tied to a source here. The other entries in facts
// (atmosphere, day length, radiation, surface) were carried over from
// the earlier build and do not yet have a source attached, so do not
// present them as verified until a source is added for them.
export const SOURCES = [
  {
    id: "nasa-factsheet-metric",
    title: "NASA NSSDCA Planetary Fact Sheet (Metric)",
    publisher: "NASA Goddard Space Flight Center",
    url: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/index.html",
    lastUpdated: "2026-11-13",
  },
];

export const getSource = (id) => SOURCES.find((source) => source.id === id);

export const PLANETS = [
  {
    slug: "mercury",
    name: "Mercury",
    kind: "Terrestrial · innermost",
    order: 1,
    au: 0.39,
    distance: "57.9 million km from the Sun",
    size: 40,
    color: "#9A8F86",
    light: "#D6C9BC",
    dark: "#332F2B",
    glow: "rgba(154,143,134,0.35)",
    teaser: "Heat-shielded burrowers that ride out 430 °C days underground.",
    tagline: "A scorched world of ice-shadowed craters.",
    facts: {
      gravity: "0.38 g · 3.7 m/s²",
      temperature: "−180 °C to 430 °C (avg 167 °C)",
      atmosphere: "Trace exosphere, oxygen, sodium, hydrogen",
      day: "176 Earth days (solar day)",
      radiation: "7× Earth, no protective magnetosphere",
      surface: "Impact-cratered basaltic rock",
      distance: "0.39 AU · 57.9 million km",
    },
    verifiedFacts: {
      meanTemperature: {
        label: "Mean temperature",
        value: "167 °C",
        sourceIds: ["nasa-factsheet-metric"],
      },
      surfaceGravity: {
        label: "Surface gravity",
        value: "3.7 m/s²",
        sourceIds: ["nasa-factsheet-metric"],
      },
      distanceFromSun: {
        label: "Distance from the Sun",
        value: "57.9 million km (0.39 AU)",
        sourceIds: ["nasa-factsheet-metric"],
      },
    },
    species: {
      name: "Cindralisk",
      latin: "Vulcanis testudo",
      summary:
        "A wedge-bodied burrower that never leaves the terminator, tunneling through regolith to stay a few centimetres ahead of the Sun.",
      bodyPlan:
        "A flattened 1.2 m armoured wedge with a multi-layered silica shell and six stubby locomotor pads set low beneath the body.",
      locomotion:
        "Peristaltic crawling, shell segments expand and contract in sequence, walking the organism through loose regolith rather than over it.",
      senses:
        "Seismic hairs read micrometeorite impacts and its own echo; no eyes, only heat pits along the shell rim.",
      diet:
        "Chemosynthetic, metabolises iron sulphides and solar-wind-implanted hydrogen bound in the soil.",
      adaptations: [
        {
          condition: "Temperature swing of 610 °C",
          adaptation: "A vacuum-gapped, mirrored silica shell that vents absorbed heat from the night side.",
        },
        {
          condition: "No atmosphere, constant micrometeorite flux",
          adaptation: "Recessed sensory pits sealed with self-healing glass that re-solidifies over punctures.",
        },
        {
          condition: "0.38 g surface gravity",
          adaptation: "An iron-dense core and wide basal skirt, so it hugs the ground instead of bouncing free of it.",
        },
        {
          condition: "Solar radiation at 7× Earth",
          adaptation: "A metal-doped shell lattice scatters charged particles before they reach soft tissue.",
        },
        {
          condition: "Water exists only as polar ice",
          adaptation: "Hibernation keyed to ice sublimation; the organism can idle for decades at −170 °C.",
        },
      ],
      threats: "Micrometeorite strikes, solar flares, the loss of its polar ice reserve.",
      weakness: "It cannot cross the equator, day-side heat sterilises it within minutes.",
      survivalScore: 68,
    },
  },
  {
    slug: "venus",
    name: "Venus",
    kind: "Terrestrial · runaway greenhouse",
    order: 2,
    au: 0.72,
    distance: "108.2 million km from the Sun",
    size: 58,
    color: "#E6C07B",
    light: "#FFF0C6",
    dark: "#6B4A18",
    glow: "rgba(230,192,123,0.4)",
    teaser: "Floating cloud-dwellers that harvest energy from sulfuric aerosols.",
    tagline: "A world of acid clouds and crushing heat.",
    facts: {
      gravity: "0.91 g · 8.9 m/s²",
      temperature: "464 °C at the surface · 30 °C at 55 km altitude",
      atmosphere: "96% CO₂, 3.5% N₂, sulfuric acid clouds",
      day: "2,802 hours (retrograde rotation)",
      radiation: "Surface shielded by atmosphere; upper clouds ≈1.5× Earth",
      surface: "Volcanic plains under 90 bar of pressure",
      distance: "0.72 AU · 108.2 million km",
    },
    verifiedFacts: {
      meanTemperature: {
        label: "Mean temperature",
        value: "464 °C",
        sourceIds: ["nasa-factsheet-metric"],
      },
      surfaceGravity: {
        label: "Surface gravity",
        value: "8.9 m/s²",
        sourceIds: ["nasa-factsheet-metric"],
      },
      distanceFromSun: {
        label: "Distance from the Sun",
        value: "108.2 million km (0.72 AU)",
        sourceIds: ["nasa-factsheet-metric"],
      },
    },
    species: {
      name: "Auroveil",
      latin: "Aerostat sulphureus",
      summary:
        "A translucent aerostat that drifts 55 km above the surface, feeding on sulfuric aerosols instead of sunlight.",
      bodyPlan:
        "A four-metre gas envelope of layered protein film, trailing a fan of fine tendrils. No skeleton, no limbs, the whole organism is membrane and pressure.",
      locomotion:
        "Buoyancy control: it pumps heavier and lighter gases between internal bladders to rise and sink through the cloud decks.",
      senses:
        "Pressure-sensitive membrane reads wind shear; chemical receptors along the tendrils taste the shifting aerosol mix.",
      diet:
        "Aerosol grazer, converts sulfuric droplets and CO₂ into stored thiols, using ambient heat as its energy source.",
      adaptations: [
        {
          condition: "464 °C surface temperature",
          adaptation: "It never descends: life is confined to the cloud deck where pressure and heat resemble Earth's surface.",
        },
        {
          condition: "Sulfuric acid clouds",
          adaptation: "Acid-proof fluorinated protein skin that regrows faster than the acid can dissolve it.",
        },
        {
          condition: "90 bar surface pressure",
          adaptation: "Pressure-equalising bladders keep the envelope inflated without a rigid structure.",
        },
        {
          condition: "360 km/h cloud-deck winds",
          adaptation: "A teardrop profile and collapsible tendrils that ride the jet stream instead of fighting it.",
        },
        {
          condition: "Ultraviolet flux 1.5× Earth",
          adaptation: "A pigment layer that re-emits absorbed UV as visible light, feeding the envelope from inside.",
        },
      ],
      threats: "Downdrafts into the hot lower deck, lightning, acid rain.",
      weakness: "It must keep rising; a long descent is fatal within hours.",
      survivalScore: 74,
    },
  },
  {
    slug: "earth",
    name: "Earth",
    kind: "Terrestrial · inhabited",
    order: 3,
    au: 1,
    distance: "149.6 million km from the Sun",
    size: 60,
    color: "#3E7CB1",
    light: "#9BD8E8",
    dark: "#0E2E45",
    glow: "rgba(90,180,220,0.42)",
    teaser: "A tool-making ape whose adaptation is culture, not anatomy.",
    tagline: "The only world we know that invented its own observers.",
    facts: {
      gravity: "1 g · 9.8 m/s²",
      temperature: "−89 °C to 57 °C (avg 15 °C)",
      atmosphere: "78% N₂, 21% O₂, 0.04% CO₂",
      day: "23 h 56 min",
      radiation: "1×, shielded by magnetosphere and atmosphere",
      surface: "Rocky crust, 71% liquid water, active biosphere",
      distance: "1 AU · 149.6 million km",
    },
    verifiedFacts: {
      meanTemperature: {
        label: "Mean temperature",
        value: "15 °C",
        sourceIds: ["nasa-factsheet-metric"],
      },
      surfaceGravity: {
        label: "Surface gravity",
        value: "9.8 m/s²",
        sourceIds: ["nasa-factsheet-metric"],
      },
      distanceFromSun: {
        label: "Distance from the Sun",
        value: "149.6 million km (1.00 AU)",
        sourceIds: ["nasa-factsheet-metric"],
      },
    },
    species: {
      name: "Homo sapiens",
      latin: "Homo sapiens",
      summary:
        "A tool-making ape whose real adaptation is not anatomy but culture: it builds the environment it cannot evolve fast enough to survive.",
      bodyPlan:
        "Bipedal tetrapod, 1.6–1.9 m, large brain, dexterous hands, naked skin with sweat glands and almost no fur.",
      locomotion:
        "Two-legged walking and endurance running, extended by machines that carry the species off the surface entirely.",
      senses:
        "Trichromatic vision, full-spectrum hearing, fine touch, and external sensors that extend every one of them.",
      diet:
        "Omnivore. Cooking, agriculture and refrigeration let it eat almost anything, almost anywhere.",
      adaptations: [
        {
          condition: "1 g surface gravity",
          adaptation: "Skeleton and circulation tuned to a single constant, away from it, the body begins to fail.",
        },
        {
          condition: "15 °C average with extreme climate range",
          adaptation: "Sweat glands plus fire, clothing and shelter: behaviour replaces fur.",
        },
        {
          condition: "Oxygen-rich atmosphere (21% O₂)",
          adaptation: "Iron-haemoglobin blood tuned to one gas mix; thin air and acid clouds are both lethal.",
        },
        {
          condition: "A 24-hour light cycle",
          adaptation: "A circadian clock entrained to exactly one day length.",
        },
        {
          condition: "Predators, pathogens and rivals",
          adaptation: "Immune systems, language and medicine, collective memory used as a survival organ.",
        },
      ],
      threats: "Itself: habitat destruction, engineered pathogens, nuclear weapons.",
      weakness:
        "It needs an intact biosphere and roughly 21% oxygen. No other world in the system supplies both.",
      survivalScore: 97,
    },
  },
  {
    slug: "mars",
    name: "Mars",
    kind: "Terrestrial · cryogenic desert",
    order: 4,
    au: 1.52,
    distance: "228.0 million km from the Sun",
    size: 48,
    color: "#C1440E",
    light: "#EE9A66",
    dark: "#4A1606",
    glow: "rgba(193,68,14,0.4)",
    teaser: "Dormant, radiation-resistant microbial colonies in the regolith.",
    tagline: "A frozen desert that keeps a little water locked in the dirt.",
    facts: {
      gravity: "0.38 g · 3.7 m/s²",
      temperature: "−143 °C to 35 °C (avg −65 °C)",
      atmosphere: "95% CO₂ at 6 millibar, 0.6% of Earth's pressure",
      day: "24 h 37 min",
      radiation: "0.6× Earth at the surface; no global magnetic field",
      surface: "Iron-oxide regolith, buried ice, perchlorate salts",
      distance: "1.52 AU · 228.0 million km",
    },
    verifiedFacts: {
      meanTemperature: {
        label: "Mean temperature",
        value: "−65 °C",
        sourceIds: ["nasa-factsheet-metric"],
      },
      surfaceGravity: {
        label: "Surface gravity",
        value: "3.7 m/s²",
        sourceIds: ["nasa-factsheet-metric"],
      },
      distanceFromSun: {
        label: "Distance from the Sun",
        value: "228.0 million km (1.52 AU)",
        sourceIds: ["nasa-factsheet-metric"],
      },
    },
    species: {
      name: "Sediment Cryptomite",
      latin: "Consortium ferrireductans",
      summary:
        "A colony organism that spends most of its life frozen, waking only for the brief warm, wet films inside Martian soil.",
      bodyPlan:
        "A microscopic consortium, mineral-plated cells strung into filaments a fraction of a millimetre wide, forming mats two to three centimetres across.",
      locomotion:
        "No travel. Colonies creep by slow filament extension, a few micrometres a day, following moisture gradients through the rock.",
      senses:
        "Light-sensitive protein spots and chemical receptors detect the first hint of liquid brine anywhere in the mat.",
      diet:
        "Chemolithotrophic, oxidises perchlorates and iron in the regolith, releasing oxygen internally.",
      adaptations: [
        {
          condition: "Radiation at 0.6× Earth with no global field",
          adaptation: "Iron-mineral plating and a radioprotective melanin layer; damaged filaments are simply replaced.",
        },
        {
          condition: "Perchlorate-laden toxic soil",
          adaptation: "An enzyme splits perchlorate into chloride and oxygen, the poison becomes the fuel.",
        },
        {
          condition: "−65 °C average temperature",
          adaptation: "Trehalose glassing of the cytoplasm; colonies freeze into dormancy and revive in meltwater.",
        },
        {
          condition: "6 millibar atmospheric pressure",
          adaptation: "No gas exchange with the air at all, every reaction happens inside brine films in the soil.",
        },
        {
          condition: "0.38 g",
          adaptation: "Filaments never leave capillary films; the colony cannot support itself in open air, so it stays in the rock.",
        },
      ],
      threats: "Dust storms that strip surface mats, UV flares, permanently dry regolith.",
      weakness: "Colonies need a liquid film, a dry decade can end a lineage.",
      survivalScore: 71,
    },
  },
  {
    slug: "jupiter",
    name: "Jupiter",
    kind: "Gas giant · 2.5× all other planets",
    order: 5,
    au: 5.2,
    distance: "778.5 million km from the Sun",
    size: 96,
    color: "#C9A87C",
    light: "#F3DFC0",
    dark: "#5B4028",
    glow: "rgba(201,168,124,0.38)",
    teaser: "Gas-layer drifters with hydrogen bladders, weightless by design.",
    tagline: "A failed star with weather instead of a surface.",
    facts: {
      gravity: "2.36 g · 23.1 m/s² at the 1-bar level",
      temperature: "−110 °C mean (1-bar level)",
      atmosphere: "90% H₂, 10% He, ammonia and water cloud decks",
      day: "9 h 56 min, the fastest spin in the system",
      radiation: "27× Earth at the cloud tops; magnetosphere extends 21× Jupiter's radius",
      surface: "None, gas all the way down to metallic hydrogen",
      distance: "5.20 AU · 778.5 million km",
    },
    verifiedFacts: {
      meanTemperature: {
        label: "Mean temperature",
        value: "−110 °C",
        sourceIds: ["nasa-factsheet-metric"], note: "At the 1-bar level",
      },
      surfaceGravity: {
        label: "Surface gravity",
        value: "23.1 m/s²",
        sourceIds: ["nasa-factsheet-metric"], note: "At the 1-bar level",
      },
      distanceFromSun: {
        label: "Distance from the Sun",
        value: "778.5 million km (5.20 AU)",
        sourceIds: ["nasa-factsheet-metric"],
      },
    },
    species: {
      name: "Convectid",
      latin: "Aeroballoon jovianus",
      summary:
        "A kilometre-wide hydrogen balloon-creature that lives inside Jupiter's cloud decks, rising and sinking on the planet's own convection.",
      bodyPlan:
        "A central gas bladder 300 m across, ringed by lung-like folds and trailing grazing curtains of fine combs. Nothing load-bearing.",
      locomotion:
        "Neutral buoyancy plus controlled venting, it migrates between deck layers and never touches anything solid.",
      senses:
        "Pressure gradients, magnetic-field orientation, and long-range acoustic sensing through the surrounding gas.",
      diet:
        "Filter-feeds organic haze and ammonia crystals carried up from below; a photosynthetic film supplements it near the cloud tops.",
      adaptations: [
        {
          condition: "2.36 g gravity",
          adaptation: "An internal hydrogen bladder whose lift exactly offsets its weight at depth, it is weightless by construction.",
        },
        {
          condition: "Radiation belts at 27× Earth",
          adaptation: "A magnetosome-lined membrane steers it away from the belts using the planet's own magnetic field.",
        },
        {
          condition: "No solid surface anywhere",
          adaptation: "No skeleton, no shell, no load-bearing geometry, every structure is gas or membrane.",
        },
        {
          condition: "400 km/h jet streams",
          adaptation: "A kite-shaped profile and retractable combs let it ride shear zones rather than cross them.",
        },
        {
          condition: "A ten-hour day",
          adaptation: "Circadian rhythm replaced by a pressure cycle; it sleeps and wakes with the convection, not the Sun.",
        },
      ],
      threats: "Descending into the crushing metallic-hydrogen interior, lightning, radiation belts.",
      weakness: "A puncture it cannot reseal drops it below its buoyancy depth within hours.",
      survivalScore: 66,
    },
  },
  {
    slug: "saturn",
    name: "Saturn",
    kind: "Gas giant · ringed",
    order: 6,
    au: 9.57,
    distance: "1,432.0 million km from the Sun",
    size: 88,
    ring: true,
    color: "#E3C98F",
    light: "#FFF2CE",
    dark: "#6E5424",
    glow: "rgba(227,201,143,0.38)",
    teaser: "Ring-dwelling ice grazers that skate the ring plane.",
    tagline: "A world lighter than water, wearing its own debris field.",
    facts: {
      gravity: "0.92 g · 9.0 m/s² at the 1-bar level",
      temperature: "−140 °C mean (1-bar level)",
      atmosphere: "96% H₂, 3% He, trace methane and ammonia",
      day: "10 h 42 min",
      radiation: "≈10× Earth; rings absorb and scatter much of the belt flux",
      surface: "None, gas giant with an icy ring plane 280,000 km wide",
      distance: "9.57 AU · 1,432.0 million km",
    },
    verifiedFacts: {
      meanTemperature: {
        label: "Mean temperature",
        value: "−140 °C",
        sourceIds: ["nasa-factsheet-metric"], note: "At the 1-bar level",
      },
      surfaceGravity: {
        label: "Surface gravity",
        value: "9.0 m/s²",
        sourceIds: ["nasa-factsheet-metric"], note: "At the 1-bar level",
      },
      distanceFromSun: {
        label: "Distance from the Sun",
        value: "1,432.0 million km (9.57 AU)",
        sourceIds: ["nasa-factsheet-metric"],
      },
    },
    species: {
      name: "Annulid",
      latin: "Glacies cursor",
      summary:
        "A flat, sunlit ice-grazer that lives in Saturn's rings, skating from boulder to boulder and hiding inside the ring plane.",
      bodyPlan:
        "A two-metre dorsoventrally flattened body with six rigid skates and a wide dorsal sail for collecting sunlight.",
      locomotion:
        "Low-impulse skating, pushes off icy ring chunks with its skates, borrowing the ring's own orbital velocity as transport.",
      senses:
        "A polarised-light compass reads the Sun's direction; vibration receptors catch collisions; a magnetite ring-sense reads Saturn's field lines.",
      diet:
        "Ice grazer, rasps water ice for trapped organics and ammonia, supplemented by solar energy on the sail.",
      adaptations: [
        {
          condition: "0.92 g combined with microgravity in the ring plane",
          adaptation: "An extremely light, flat body on skates: it never has to support its own weight, only redirect it.",
        },
        {
          condition: "−140 °C ambient temperature",
          adaptation: "Antifreeze glycoproteins and a metabolically slow cold heart that beats twice a minute.",
        },
        {
          condition: "Radiation at 10× Earth",
          adaptation: "Ice-and-carbon shielding layered into its shell, renewed each time it grazes.",
        },
        {
          condition: "Constant ring collisions and debris",
          adaptation: "Collapsible hull plates and a fold-down reflective sail let it slip between chunks.",
        },
        {
          condition: "A 10.7-hour day on a sunlit ring plane",
          adaptation: "It follows the terminator around the rings, staying always in the same band of light.",
        },
      ],
      threats: "Ring-plane debris, ring rain, drifting out of the ring system entirely.",
      weakness: "It cannot survive open gravity, outside the rings its own weight breaks it apart.",
      survivalScore: 63,
    },
  },
  {
    slug: "uranus",
    name: "Uranus",
    kind: "Ice giant · tipped on its side",
    order: 7,
    au: 19.16,
    distance: "2,867.0 million km from the Sun",
    size: 68,
    color: "#7FDBE3",
    light: "#CFF6FA",
    dark: "#1E5E68",
    glow: "rgba(127,219,227,0.4)",
    teaser: "Cold-ocean dwellers built for 100,000× Earth's pressure.",
    tagline: "A blue-green giant that rolls around the Sun on its side.",
    facts: {
      gravity: "0.89 g · 8.7 m/s² at the 1-bar level",
      temperature: "−195 °C mean (1-bar level)",
      atmosphere: "83% H₂, 15% He, 2% methane",
      day: "17 h 14 min, with a 98° axial tilt",
      radiation: "≈5× Earth; magnetosphere tilted 59° from the spin axis",
      surface: "Icy mantle over a supercritical water-ammonia ocean",
      distance: "19.16 AU · 2,867.0 million km",
    },
    verifiedFacts: {
      meanTemperature: {
        label: "Mean temperature",
        value: "−195 °C",
        sourceIds: ["nasa-factsheet-metric"], note: "At the 1-bar level",
      },
      surfaceGravity: {
        label: "Surface gravity",
        value: "8.7 m/s²",
        sourceIds: ["nasa-factsheet-metric"], note: "At the 1-bar level",
      },
      distanceFromSun: {
        label: "Distance from the Sun",
        value: "2,867.0 million km (19.16 AU)",
        sourceIds: ["nasa-factsheet-metric"],
      },
    },
    species: {
      name: "Cryobath",
      latin: "Bathyal uranides",
      summary:
        "A deep-dwelling organism of Uranus' buried ocean, built to survive under thousands of bars of pressure and daylight that never arrives.",
      bodyPlan:
        "A radially symmetric six-metre sphere of gel-filled compartments wrapped around a diamond-hard mineral core.",
      locomotion:
        "Slow jet propulsion, cycles fluid through internal channels, moving a few kilometres a day.",
      senses:
        "Pressure and chemical gradients, plus a magnetic sense that reads the planet's 59°-tilted field.",
      diet:
        "Chemosynthetic, consumes hydrogen sulphide and methane hydrates vented from the ocean floor.",
      adaptations: [
        {
          condition: "Extreme pressure (1,000+ bar)",
          adaptation: "A fluid-filled, incompressible body with no gas cavities anywhere in it.",
        },
        {
          condition: "−195 °C mean temperature",
          adaptation: "Metabolism runs on ammonia-water eutectics, which stay liquid far below water's freezing point.",
        },
        {
          condition: "No light reaches the ocean",
          adaptation: "No eyes at all; bioluminescent pulses are used for signalling, never for seeing.",
        },
        {
          condition: "Methane-rich, oxygen-poor chemistry",
          adaptation: "Respires sulphur and hydrogen instead of oxygen.",
        },
        {
          condition: "A 59°-tilted magnetic field at 0.89 g",
          adaptation: "Radial symmetry means 'up' never matters; a dense core keeps it oriented within the field.",
        },
      ],
      threats: "Thermal vent collapse, mantle upwellings, absolute isolation.",
      weakness: "It cannot tolerate decompression, its internal fluids would boil if raised fifty kilometres.",
      survivalScore: 69,
    },
  },
  {
    slug: "neptune",
    name: "Neptune",
    kind: "Ice giant · the outer reach",
    order: 8,
    au: 30.18,
    distance: "4,515.0 million km from the Sun",
    size: 66,
    color: "#3B5BD9",
    light: "#8FA8FF",
    dark: "#101F63",
    glow: "rgba(59,91,217,0.45)",
    teaser: "Wind riders that tack across 2,100 km/h storms.",
    tagline: "The farthest world we have, screaming with wind.",
    facts: {
      gravity: "1.12 g · 11.0 m/s² at the 1-bar level",
      temperature: "−200 °C mean (1-bar level)",
      atmosphere: "80% H₂, 19% He, 1.5% methane",
      day: "16 h 6 min",
      radiation: "≈6× Earth; a heavily tilted, offset magnetosphere",
      surface: "None, supercritical ocean beneath a gas envelope",
      distance: "30.18 AU · 4,515.0 million km",
    },
    verifiedFacts: {
      meanTemperature: {
        label: "Mean temperature",
        value: "−200 °C",
        sourceIds: ["nasa-factsheet-metric"], note: "At the 1-bar level",
      },
      surfaceGravity: {
        label: "Surface gravity",
        value: "11.0 m/s²",
        sourceIds: ["nasa-factsheet-metric"], note: "At the 1-bar level",
      },
      distanceFromSun: {
        label: "Distance from the Sun",
        value: "4,515.0 million km (30.18 AU)",
        sourceIds: ["nasa-factsheet-metric"],
      },
    },
    species: {
      name: "Maelstromid",
      latin: "Velifer neptunius",
      summary:
        "A wind rider, a sail-bearing organism that harvests Neptune's 2,100 km/h storms for propulsion, then dives into the warm depths to feed.",
      bodyPlan:
        "A bullet-shaped three-metre hull with four lattice sails and a muscular pressure valve at the tail.",
      locomotion:
        "Tacks across the storm bands like a kite; floods its hull to dive, expels warm methane to climb.",
      senses:
        "Infrasound reads storm structure, pressure receptors measure depth, and a magnetic compass holds latitude.",
      diet:
        "Predatory filter-feeder on hydrocarbon ices and dissolved organics in the deep supercritical ocean.",
      adaptations: [
        {
          condition: "2,100 km/h winds",
          adaptation: "Four sail surfaces that reef and unfurl, turning shear into controllable thrust.",
        },
        {
          condition: "1.12 g with pressure rising steeply with depth",
          adaptation: "A foldable lattice hull that compresses with depth instead of resisting it.",
        },
        {
          condition: "−200 °C mean temperature",
          adaptation: "Two metabolisms, a cold-tolerant surface mode and a high-energy deep mode.",
        },
        {
          condition: "Methane-rich, oxygen-poor atmosphere",
          adaptation: "Chemosynthetic lungs crack methane for energy rather than breathing it as waste.",
        },
        {
          condition: "A 16-hour day in permanent darkness",
          adaptation: "No light sensitivity at all; it times its dives by pressure tides, not daylight.",
        },
      ],
      threats: "The shear of the Great Dark Spot, lightning, being flung out of the atmosphere.",
      weakness: "Its sails are fragile; without a storm band to tack against it drifts helplessly.",
      survivalScore: 64,
    },
  },
];

export const PLANET_NINE = {
  name: "Planet Nine",
  slug: "planet-nine",
  kind: "Unclassified · awaiting definition",
  color: "#8A2BE2",
  light: "#D9A8FF",
  dark: "#2A0A4A",
  glow: "rgba(138,43,226,0.55)",
  tagline: "Design your own world and the organism that survives it.",
};

export const getPlanet = (slug) => PLANETS.find((planet) => planet.slug === slug);