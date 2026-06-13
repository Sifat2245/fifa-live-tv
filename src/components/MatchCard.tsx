"use client";

import Link from "next/link";
import { Clock, MapPin, Tv } from "lucide-react";
import { getFlagUrl, isLive, isFinished, getLocalTime } from "@/lib/utils";
import CountdownTimer from "./CountdownTimer";
import LiveBadge from "./LiveBadge";
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
  const homeFlag = match.homeTeam?.name ? getFlagUrl(match.homeTeam.name) : "";
  const awayFlag = match.awayTeam?.name ? getFlagUrl(match.awayTeam.name) : "";
  const live = isLive(match.status);
  const finished = isFinished(match.status);
  const homeColors = getTeamColors(match.homeTeam.name);
  const awayColors = getTeamColors(match.awayTeam.name);

  return (
    <Link
      href={`/match/${match.id}`}
      className="group card-glow relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800/50 bg-gradient-to-b from-[#111827] to-[#0F1625] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
    >
      {/* Top accent bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${
        live ? "from-[#C41E3A] via-red-500 to-[#C41E3A]" : "from-[#C9A84C]/30 via-[#C9A84C]/10 to-transparent"
      }`} />

      <div className="flex flex-col p-4">
        {/* Main content */}
        <div className="flex items-center justify-between gap-2">
          {/* Home team */}
          <div className="flex flex-1 flex-col items-center gap-2">
            <div className={`relative flex h-12 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${homeColors.badge} border border-zinc-700/30`}>
              {homeFlag ? (
                <img src={homeFlag} alt={match.homeTeam.name} className="h-8 w-12 rounded object-cover" />
              ) : (
                <span className={`text-xs font-extrabold uppercase ${homeColors.text}`}>
                  {match.homeTeam.code || match.homeTeam.name?.slice(0, 3) || "?"}
                </span>
              )}
            </div>
            <span className="text-center text-[11px] font-semibold text-zinc-300 leading-tight line-clamp-1 max-w-[80px]">
              {match.homeTeam.name}
            </span>
          </div>

          {/* Score / VS */}
          <div className="flex flex-col items-center gap-1 min-w-[60px]">
            {live || finished ? (
              <div className="flex items-center gap-1.5">
                <span className={`text-2xl font-black tabular-nums ${
                  live ? "text-white" : "text-zinc-300"
                }`}>
                  {match.score.home ?? "-"}
                </span>
                <span className={`text-sm font-bold ${live ? "text-[#C41E3A]/60" : "text-zinc-600"}`}>:</span>
                <span className={`text-2xl font-black tabular-nums ${
                  live ? "text-white" : "text-zinc-300"
                }`}>
                  {match.score.away ?? "-"}
                </span>
              </div>
            ) : (
              <span className="text-base font-black text-[#C9A84C] tracking-wider">VS</span>
            )}

            {/* Status */}
            {live && <LiveBadge />}
            {finished && (
              <span className="rounded-md bg-zinc-800/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                FT
              </span>
            )}
          </div>

          {/* Away team */}
          <div className="flex flex-1 flex-col items-center gap-2">
            <div className={`relative flex h-12 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${awayColors.badge} border border-zinc-700/30`}>
              {awayFlag ? (
                <img src={awayFlag} alt={match.awayTeam.name} className="h-8 w-12 rounded object-cover" />
              ) : (
                <span className={`text-xs font-extrabold uppercase ${awayColors.text}`}>
                  {match.awayTeam.code || match.awayTeam.name?.slice(0, 3) || "?"}
                </span>
              )}
            </div>
            <span className="text-center text-[11px] font-semibold text-zinc-300 leading-tight line-clamp-1 max-w-[80px]">
              {match.awayTeam.name}
            </span>
          </div>
        </div>

        {/* Bottom meta */}
        <div className="mt-3 flex items-center justify-between border-t border-zinc-800/30 pt-2.5">
          <div className="flex items-center gap-1 text-[10px] text-zinc-500">
            <MapPin className="h-3 w-3 text-zinc-600" />
            <span className="truncate max-w-[110px]">{match.venue?.split(",")[0] || "TBD"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
            {live ? (
              <span className="flex items-center gap-1 font-bold text-red-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
                </span>
                LIVE
              </span>
            ) : finished ? (
              <span className="text-zinc-600">Full Time</span>
            ) : (
              <>
                <Clock className="h-3 w-3 text-zinc-600" />
                <span className="tabular-nums"><CountdownTimer kickoff={match.kickoff} /></span>
              </>
            )}
            {!live && !finished && (
              <span className="text-zinc-600">· {getLocalTime(match.kickoff)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
