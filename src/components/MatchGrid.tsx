"use client";

import type { Match } from "@/lib/types";
import MatchCard from "./MatchCard";

interface MatchGridProps {
  title: string;
  matches: Match[];
  emptyMessage?: string;
  icon?: React.ReactNode;
}

export default function MatchGrid({
  title,
  matches,
  emptyMessage = "No matches scheduled",
  icon,
}: MatchGridProps) {
  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-semibold text-text-secondary">{title}</h2>
        <span className="rounded-full bg-border-default px-2 py-0.5 text-xs text-text-muted">
          {matches.length}
        </span>
      </div>

      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-default bg-surface-card/40 py-12">
          <p className="text-sm text-text-muted">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </section>
  );
}
