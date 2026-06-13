export default function HomeLoading() {
  return (
    <div className="flex-1">
      {/* Hero skeleton */}
      <section className="border-b border-zinc-800/10">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6">
            <div className="h-8 w-52 animate-pulse rounded-full bg-zinc-800/50" />
            <div className="h-16 w-96 animate-pulse rounded-lg bg-zinc-800/30" />
            <div className="h-5 w-80 animate-pulse rounded bg-zinc-800/30" />
            <div className="flex gap-6 mt-2">
              <div className="h-10 w-28 animate-pulse rounded-lg bg-zinc-800/30" />
              <div className="h-10 w-28 animate-pulse rounded-lg bg-zinc-800/30" />
            </div>
          </div>
        </div>
      </section>

      {/* Matches skeleton */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 h-6 w-32 animate-pulse rounded bg-zinc-800/40" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-zinc-800/30 bg-[#111827] p-4 animate-pulse">
              <div className="flex items-center justify-between mb-3">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-12 w-16 rounded-xl bg-zinc-800/50" />
                  <div className="h-3 w-16 rounded bg-zinc-800/50" />
                </div>
                <div className="h-8 w-12 rounded bg-zinc-800/40" />
                <div className="flex flex-col items-center gap-2">
                  <div className="h-12 w-16 rounded-xl bg-zinc-800/50" />
                  <div className="h-3 w-16 rounded bg-zinc-800/50" />
                </div>
              </div>
              <div className="h-4 w-full rounded bg-zinc-800/30" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
