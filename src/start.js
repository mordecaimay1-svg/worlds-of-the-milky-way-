import { createStart } from "@tanstack/react-start";

// The Start instance. No global middleware: server functions read Cloudflare
// bindings directly (`import { env } from "cloudflare:workers"`).
export const startInstance = createStart(() => ({}));
