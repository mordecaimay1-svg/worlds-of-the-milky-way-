# AGENTS.md

## Project context

Worlds of the Milky Way: a **TanStack Start** app (React 19, plain JavaScript — no TypeScript) deployed as a single **Cloudflare Worker**. File-based routes, server functions, server-side rendering by default. Read `README.md` first.

## Key files

- `src/routes/__root.jsx`: the HTML document and providers. There is no `index.html`.
- `src/routes/_site.jsx`: layout (header, footer, background) for every page under `src/routes/_site/`.
- `src/routes/api/*.js`: server routes (raw HTTP endpoints), e.g. the specimen image endpoint.
- `src/lib/server-fns.js`: server functions (`createServerFn`) — the only way pages talk to the server.
- `src/lib/db.server.js`: D1 access (binding `DB`). Tables are created on first use; change the schema there.
- `src/lib/ai.server.js`: Workers AI calls (binding `AI`): text model and image model.
- `src/data/solar-system.js`: the eight planets and their species (static content).
- `wrangler.jsonc`: Worker entry, bindings and spend-limit `vars`. Keep `main` and `nodejs_compat`.
- `vite.config.js`: `cloudflare()`, `tanstackStart()`, `react()` — keep that order. `PREBUNDLE` pre-bundles every runtime dependency.
- `src/routeTree.gen.ts` is generated on every dev/build run — never edit or commit it.

## Rules

- Bindings are read only in server code: `import { env } from "cloudflare:workers"`, in `*.server.js` files or server function handlers. Never in components.
- Every server function and server route is a public endpoint. Validate input with zod (`.validator(...)`), bound strings and arrays, and use `z.enum` for choices.
- Anything that calls Workers AI goes through `spendGeneration()` in `server-fns.js` (per-visitor and daily caps). Don't add an AI endpoint without it.
- Errors safe to show visitors are thrown with a `RATE_LIMITED:` prefix and rendered via `friendlyError()`.
- Server and first client render must match: touch `window`/`document`/storage only in effects and handlers.
- Write JavaScript/JSX only. Run `npm run lint` and `npm run build` before committing.
