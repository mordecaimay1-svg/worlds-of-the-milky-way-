export function normalizeSpecies(species) {
  if (!species) return null;

  return {
    name: species.species_name || species.name || "Unnamed organism",
    latin: species.latin_name || species.latin || "",
    summary: species.summary || "",
    bodyPlan: species.body_plan || species.bodyPlan || "",
    locomotion: species.locomotion || "",
    senses: species.senses || "",
    diet: species.diet || "",
    reproduction: species.reproduction || "",
    adaptations: (species.adaptations || []).map((item) => ({
      label: item.condition || item.parameter || "Condition",
      text: item.adaptation || item.trait || "",
    })),
    threats: species.threats || "",
    weakness: species.weakness || "",
    score: Number(species.survival_score ?? species.survivalScore ?? 0),
  };
}