export default function HomeLoading() {
  return (
    <div className="flex-1">
      {/* Hero skeleton */}
      <section className="border-b border-border-default/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6">
            <div className="h-8 w-52 skeleton rounded-full" />
            <div className="h-16 w-96 skeleton rounded-lg" />
            <div className="h-5 w-80 skeleton rounded" />
            <div className="flex gap-6 mt-2">
              <div className="h-10 w-28 skeleton rounded-lg" />
              <div className="h-10 w-28 skeleton rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Matches skeleton */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 h-6 w-32 skeleton rounded" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border-default bg-surface-card overflow-hidden">
              <div className="h-1 w-full skeleton" />
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-12 w-16 skeleton rounded-xl" />
                    <div className="h-3 w-16 skeleton rounded" />
                  </div>
                  <div className="h-8 w-12 skeleton rounded" />
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-12 w-16 skeleton rounded-xl" />
                    <div className="h-3 w-16 skeleton rounded" />
                  </div>
                </div>
                <div className="h-4 w-full skeleton rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
