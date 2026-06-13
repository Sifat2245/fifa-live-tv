export default function AdminLoading() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C9A84C]/30 border-t-[#C9A84C]" />
        <span className="text-xs text-zinc-500 font-medium">Loading...</span>
      </div>
    </div>
  );
}
