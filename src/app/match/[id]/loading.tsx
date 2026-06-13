export default function MatchLoading() {
  return (
    <div className="flex-1">
      {/* Header skeleton */}
      <section className="border-b border-zinc-800/40">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="h-8 w-24 animate-pulse rounded-lg bg-zinc-800/50 mb-5" />

          <div className="flex items-center justify-center gap-4 py-4">
            <div className="flex flex-col items-center gap-3">
              <div className="h-14 w-20 animate-pulse rounded-xl bg-zinc-800/50 sm:h-20 sm:w-28" />
              <div className="h-4 w-20 animate-pulse rounded bg-zinc-800/50" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-24 animate-pulse rounded bg-zinc-800/50" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-zinc-800/50" />
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="h-14 w-20 animate-pulse rounded-xl bg-zinc-800/50 sm:h-20 sm:w-28" />
              <div className="h-4 w-20 animate-pulse rounded bg-zinc-800/50" />
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <div className="h-6 w-24 animate-pulse rounded-lg bg-zinc-800/50" />
            <div className="h-6 w-20 animate-pulse rounded-lg bg-zinc-800/50" />
            <div className="h-6 w-40 animate-pulse rounded-lg bg-zinc-800/50" />
          </div>
        </div>
      </section>

      {/* Player skeleton */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <div className="aspect-video animate-pulse rounded-2xl bg-zinc-900" />
            <div className="mt-4 h-12 animate-pulse rounded-xl bg-zinc-900/50" />
          </div>
          <div className="space-y-4">
            <div className="h-48 animate-pulse rounded-xl bg-zinc-900/50" />
            <div className="h-32 animate-pulse rounded-xl bg-zinc-900/50" />
          </div>
        </div>
      </div>
    </div>
  );
}
