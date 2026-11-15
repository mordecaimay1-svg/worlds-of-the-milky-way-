# Worlds of the Milky Way

An interactive journey through the solar system: eight planets, the native species adapted to each, and a ninth world visitors design themselves. An AI biologist invents an organism for their world.

Built with [TanStack Start](https://tanstack.com/start) (React 19, plain JavaScript) and runs entirely on Cloudflare:

| Piece | Cloudflare product | Where in the code |
| --- | --- | --- |
| Hosting + server | Workers | `src/server.js`, `wrangler.jsonc` |
| Database (designed planets, images, rate limits) | D1 | `src/lib/db.server.js` |
| Species text (Llama 3.3 70B) and image (FLUX.1 schnell) | Workers AI | `src/lib/ai.server.js` |
| Server functions the pages call | — | `src/lib/server-fns.js` |
| Image endpoint | — | `src/routes/api/specimen-image.$id.js` |

No API keys anywhere: D1 and Workers AI are bindings declared in `wrangler.jsonc`.

## Deploy (first time, about 5 minutes)

1. Create a free account at [dash.cloudflare.com](https://dash.cloudflare.com/sign-up).
2. **Workers & Pages → Create → Import a repository**, connect GitHub and pick this repo.
3. Build command: `npm run build`. Deploy command: `npx wrangler deploy`. Save and deploy.

The first deploy creates the D1 database automatically, and the app creates its tables on first use. Every push to `main` redeploys.

**Before the demo:** the free plan includes 10,000 Workers AI Neurons per day, roughly 30–40 designed worlds. For 500+ visitors, switch the account to **Workers Paid ($5/month)**; 500 designs then cost about $1–2 in AI usage on top.

## Spend guards

Every generation spends AI budget and the server functions are public, so `wrangler.jsonc` → `vars` caps usage:

- `HOURLY_LIMIT_PER_VISITOR` (default 6): generations per visitor (hashed IP) per hour.
- `DAILY_GENERATION_LIMIT` (default 1500): generations for the whole app per UTC day.

Visitors who hit a cap see a friendly message instead of an error.

## Run locally

```bash
npm ci
npx wrangler login   # Workers AI always runs on Cloudflare, even in dev
npm run dev
```

D1 runs locally in dev (state in `.wrangler/`). `npm run lint` before committing.

## History

Originally generated in Base44 and exported to this repo; the Base44 platform dependencies (SDK, auth, entities, AI gateway) were replaced with the Cloudflare stack above.
