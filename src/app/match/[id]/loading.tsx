export default function MatchLoading() {
  return (
    <div className="flex-1">
      {/* Header skeleton */}
      <section className="border-b border-border-default/60">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="h-8 w-24 skeleton rounded-lg mb-5" />

          <div className="flex items-center justify-center gap-4 py-4">
            <div className="flex flex-col items-center gap-3">
              <div className="h-14 w-20 skeleton rounded-xl sm:h-20 sm:w-28" />
              <div className="h-4 w-20 skeleton rounded" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-24 skeleton rounded" />
              <div className="h-5 w-16 skeleton rounded-full" />
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="h-14 w-20 skeleton rounded-xl sm:h-20 sm:w-28" />
              <div className="h-4 w-20 skeleton rounded" />
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <div className="h-6 w-24 skeleton rounded-lg" />
            <div className="h-6 w-20 skeleton rounded-lg" />
            <div className="h-6 w-40 skeleton rounded-lg" />
          </div>
        </div>
      </section>

      {/* Player skeleton */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <div className="aspect-video skeleton rounded-2xl" />
            <div className="mt-4 h-12 skeleton rounded-xl" />
          </div>
          <div className="space-y-4">
            <div className="h-48 skeleton rounded-xl" />
            <div className="h-32 skeleton rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
