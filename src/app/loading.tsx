export default function HomeLoading() {
  return (
    <div className="flex-1">
      {/* Hero skeleton */}
      <section className="border-b border-border-default/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8">
            <div className="h-8 w-52 skeleton rounded-full" />
            {/* Featured match card skeleton */}
            <div className="w-full max-w-3xl">
              <div className="rounded-2xl border border-border-default bg-surface-card overflow-hidden p-6 sm:p-8">
                {/* Teams row */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-1 flex-col items-center gap-3">
                    <div className="h-20 w-28 skeleton rounded-2xl" />
                    <div className="h-4 w-20 skeleton rounded" />
                  </div>
                  <div className="flex flex-col items-center gap-3 min-w-[100px]">
                    <div className="h-10 w-16 skeleton rounded" />
                    <div className="h-5 w-16 skeleton rounded-full" />
                  </div>
                  <div className="flex flex-1 flex-col items-center gap-3">
                    <div className="h-20 w-28 skeleton rounded-2xl" />
                    <div className="h-4 w-20 skeleton rounded" />
                  </div>
                </div>
                {/* Divider */}
                <div className="my-5 border-t border-border-default/30" />
                {/* Bottom row */}
                <div className="flex items-center justify-between">
                  <div className="h-4 w-48 skeleton rounded" />
                  <div className="h-10 w-32 skeleton rounded-xl" />
                </div>
              </div>
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
