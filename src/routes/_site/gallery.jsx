import { createFileRoute, Link } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { listUserPlanets } from "@/lib/server-fns";
import SpecimenTile from "@/components/gallery/SpecimenTile";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/_site/gallery")({
  head: () => ({
    meta: [
      { title: "Species archive — Worlds of the Milky Way" },
      {
        name: "description",
        content:
          "Every world designed by visitors, paired with the AI-designed organism that survives on it.",
      },
    ],
  }),
  component: GalleryPage,
});

const PAGE_SIZE = 12;

function GalleryPage() {
  const query = useInfiniteQuery({
    queryKey: ["gallery"],
    queryFn: ({ pageParam }) => listUserPlanets({ data: { cursor: pageParam, limit: PAGE_SIZE } }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => (lastPage?.has_more ? lastPage.next_cursor : undefined),
  });

  const records = query.data?.pages.flatMap((page) => page.items || []) ?? [];

  return (
    <div className="mx-auto max-w-7xl px-5 pb-10 pt-10 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="mono-label text-[#00F2FF]/70">06 — The archive</p>
          <h1 className="mt-4 font-heading text-4xl font-medium tracking-[-0.03em] text-white sm:text-5xl">
            Designed worlds
          </h1>
          <p className="mt-4 max-w-xl text-white/55">
            Every planet Nine designed so far, each with the native organism that answers its
            conditions. Nothing here was written by a human.
          </p>
        </div>
        <Link
          to="/design"
          className="inline-flex items-center gap-2 rounded-full bg-[#00F2FF] px-6 py-3 font-heading text-sm font-semibold text-[#020408] transition-all hover:shadow-[0_0_30px_-6px_#00F2FF]"
        >
          <Sparkles className="h-4 w-4" />
          Add your world
        </Link>
      </div>

      {query.isLoading ? (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((key) => (
            <div key={key} className="glass h-[320px] animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : records.length === 0 ? (
        <div className="glass mt-12 rounded-3xl px-6 py-16 text-center">
          <p className="mono-label text-white/35">No records yet</p>
          <h2 className="mx-auto mt-4 max-w-md font-heading text-2xl text-white">
            The archive is empty. The ninth world is still unclaimed.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/50">
            Set a gravity, a temperature and an atmosphere, and the first specimen will appear here.
          </p>
          <Link
            to="/design"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-heading text-sm font-semibold text-[#020408]"
          >
            Design Planet Nine
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {records.map((record) => (
              <SpecimenTile key={record.id} record={record} />
            ))}
          </div>

          {query.hasNextPage ? (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => query.fetchNextPage()}
                disabled={query.isFetchingNextPage}
                className="rounded-full border border-white/15 px-7 py-3 font-heading text-sm text-white transition-colors hover:border-white/35 disabled:opacity-60"
              >
                {query.isFetchingNextPage ? "Loading…" : "Load more worlds"}
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}