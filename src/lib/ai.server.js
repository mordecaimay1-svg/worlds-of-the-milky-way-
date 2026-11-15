// Server-only AI calls on Cloudflare Workers AI (the `AI` binding in wrangler.jsonc).
// No API key: usage is billed to the Cloudflare account in Neurons.
import { env } from "cloudflare:workers";

// Strong enough to follow the long brief and return clean JSON; swap for
// "@cf/meta/llama-3.1-8b-instruct-fast" to cut text cost roughly 6x.
const TEXT_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const IMAGE_MODEL = "@cf/black-forest-labs/flux-1-schnell";

function ai() {
  if (!env.AI) throw new Error("The AI binding is missing. Add it to wrangler.jsonc (see README).");
  return env.AI;
}

// Pulls the first JSON object out of a model reply, whether the runtime already
// parsed it or the model wrapped it in prose or a code fence.
function parseJson(response) {
  if (response && typeof response === "object") return response;
  const text = String(response ?? "");
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error("The model did not return JSON.");
  return JSON.parse(text.slice(start, end + 1));
}

export async function generateJson({ system, prompt, schema }) {
  const messages = [
    { role: "system", content: system },
    { role: "user", content: prompt },
  ];
  let lastError;
  // JSON mode first; if the runtime rejects the schema, retry once asking for plain JSON.
  for (const responseFormat of [{ type: "json_schema", json_schema: schema }, undefined]) {
    try {
      const result = await ai().run(TEXT_MODEL, {
        messages,
        max_tokens: 1800,
        temperature: 0.8,
        ...(responseFormat ? { response_format: responseFormat } : {}),
      });
      return parseJson(result?.response);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

// Returns a base64 JPEG, or null when image generation fails (the record is still saved).
export async function generateImage(prompt) {
  try {
    const result = await ai().run(IMAGE_MODEL, { prompt: prompt.slice(0, 2000), steps: 4 });
    return typeof result?.image === "string" && result.image.length > 0 ? result.image : null;
  } catch {
    return null;
  }
}
