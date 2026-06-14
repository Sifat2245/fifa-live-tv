export default function AdminLoading() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
        <span className="text-xs text-text-muted font-medium">Loading...</span>
      </div>
    </div>
  );
}
