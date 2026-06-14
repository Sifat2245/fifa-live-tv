export default function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-crimson/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-crimson">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-crimson opacity-50" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-crimson" />
      </span>
      LIVE
    </span>
  );
}
