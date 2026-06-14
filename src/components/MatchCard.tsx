"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import { getFlagUrl, isLive, isFinished, getLocalTime } from "@/lib/utils";
import CountdownTimer from "./CountdownTimer";
import LiveBadge from "./LiveBadge";
import MatchDetailModal from "./MatchDetailModal";
import type { Match } from "@/lib/types";

interface MatchCardProps {
  match: Match;
}

function getTeamColors(name: string): { badge: string; text: string } {
  const colors = [
    { badge: "from-emerald-700/40 to-emerald-900/40", text: "text-emerald-400" },
    { badge: "from-blue-700/40 to-blue-900/40", text: "text-blue-400" },
    { badge: "from-purple-700/40 to-purple-900/40", text: "text-purple-400" },
    { badge: "from-rose-700/40 to-rose-900/40", text: "text-rose-400" },
    { badge: "from-amber-700/40 to-amber-900/40", text: "text-amber-400" },
    { badge: "from-cyan-700/40 to-cyan-900/40", text: "text-cyan-400" },
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function MatchCard({ match }: MatchCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const homeFlag = match.homeTeam?.name ? getFlagUrl(match.homeTeam.name) : "";
  const awayFlag = match.awayTeam?.name ? getFlagUrl(match.awayTeam.name) : "";
  const live = isLive(match.status);
  const finished = isFinished(match.status);
  const upcoming = !live && !finished;
  const homeColors = getTeamColors(match.homeTeam.name);
  const awayColors = getTeamColors(match.awayTeam.name);

  const cardContent = (
    <>
      {/* Top accent bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${
        live ? "from-crimson via-red-500 to-crimson" : "from-gold/30 via-gold/10 to-transparent"
      }`} />

      <div className="flex flex-col p-4">
        {/* Main content */}
        <div className="flex items-center justify-between gap-2">
          {/* Home team */}
          <div className="flex flex-1 flex-col items-center gap-2">
            <div className={`relative flex h-12 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${homeColors.badge} border border-border-default`}>
              {homeFlag ? (
                <img src={homeFlag} alt={match.homeTeam.name} className="h-8 w-12 rounded object-cover" />
              ) : (
                <span className={`text-xs font-extrabold uppercase ${homeColors.text}`}>
                  {match.homeTeam.code || match.homeTeam.name?.slice(0, 3) || "?"}
                </span>
              )}
            </div>
            <span className="text-center text-[11px] font-semibold text-text-secondary leading-tight line-clamp-1 max-w-[80px]">
              {match.homeTeam.name}
            </span>
          </div>

          {/* Score / VS */}
          <div className="flex flex-col items-center gap-1 min-w-[60px]">
            {live || finished ? (
              <div className="flex items-center gap-1.5">
                <span className={`text-2xl font-black tabular-nums ${
                  live ? "text-text-primary" : "text-text-tertiary"
                }`}>
                  {match.score.home ?? "—"}
                </span>
                <span className={`text-sm font-bold ${live ? "text-crimson/60" : "text-text-subtle"}`}>:</span>
                <span className={`text-2xl font-black tabular-nums ${
                  live ? "text-text-primary" : "text-text-tertiary"
                }`}>
                  {match.score.away ?? "—"}
                </span>
              </div>
            ) : (
              <span className="text-base font-black text-gold tracking-wider font-accent">VS</span>
            )}

            {/* Status */}
            {live && <LiveBadge />}
            {finished && (
              <span className="rounded-md bg-surface-elevated px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-text-muted">
                FT
              </span>
            )}
          </div>

          {/* Away team */}
          <div className="flex flex-1 flex-col items-center gap-2">
            <div className={`relative flex h-12 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${awayColors.badge} border border-border-default`}>
              {awayFlag ? (
                <img src={awayFlag} alt={match.awayTeam.name} className="h-8 w-12 rounded object-cover" />
              ) : (
                <span className={`text-xs font-extrabold uppercase ${awayColors.text}`}>
                  {match.awayTeam.code || match.awayTeam.name?.slice(0, 3) || "?"}
                </span>
              )}
            </div>
            <span className="text-center text-[11px] font-semibold text-text-secondary leading-tight line-clamp-1 max-w-[80px]">
              {match.awayTeam.name}
            </span>
          </div>
        </div>

        {/* Bottom meta */}
        <div className="mt-3 flex items-center justify-between border-t border-border-default pt-2.5">
          <div className="flex items-center gap-1 text-[10px] text-text-muted">
            <MapPin className="h-3 w-3 text-text-subtle" />
            <span className="truncate max-w-[110px]">{match.venue?.split(",")[0] || "TBD"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
            {live ? (
              <span className="flex items-center gap-1 font-bold text-crimson">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-crimson opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-crimson" />
                </span>
                LIVE
              </span>
            ) : finished ? (
              <span className="text-text-muted">Full Time</span>
            ) : (
              <>
                <Clock className="h-3 w-3 text-text-subtle" />
                <span className="tabular-nums"><CountdownTimer kickoff={match.kickoff} /></span>
              </>
            )}
            {!live && !finished && (
              <span className="text-text-subtle">· {getLocalTime(match.kickoff)}</span>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {upcoming ? (
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          aria-haspopup="dialog"
          className="group card-glow relative flex flex-col overflow-hidden rounded-2xl border border-border-default bg-gradient-to-b from-surface-card to-surface-elevated transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-left w-full cursor-pointer"
        >
          {cardContent}
        </button>
      ) : (
        <Link
          href={`/match/${match.id}`}
          className="group card-glow relative flex flex-col overflow-hidden rounded-2xl border border-border-default bg-gradient-to-b from-surface-card to-surface-elevated transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          {cardContent}
        </Link>
      )}

      {modalOpen && (
        <MatchDetailModal
          match={match}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
