// The Worker's entry (wrangler.jsonc `main`): TanStack Start's default request handler.
import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";

export default { fetch: createStartHandler(defaultStreamHandler) };
