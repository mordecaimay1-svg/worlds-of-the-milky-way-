import { createFileRoute } from "@tanstack/react-router";
import { getPlanetImage } from "@/lib/db.server";

// Serves a specimen's generated image straight from D1. Public: the gallery and
// specimen pages load it with a plain <img src>. The URL carries ?v=<updated_at>,
// so the bytes behind one URL never change and can be cached for good.
export const Route = createFileRoute("/api/specimen-image/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        if (!/^[0-9a-f-]{36}$/i.test(params.id)) return new Response("Not found", { status: 404 });
        const b64 = await getPlanetImage(params.id);
        if (!b64) return new Response("Not found", { status: 404 });
        const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
        return new Response(bytes, {
          headers: {
            "content-type": "image/jpeg",
            "cache-control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
