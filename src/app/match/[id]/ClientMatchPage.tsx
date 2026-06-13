"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Tv, RefreshCw, Radio, Shield, ListVideo, Monitor } from "lucide-react";
import type { Match, StreamChannel } from "@/lib/types";
import StreamPlayer from "@/components/StreamPlayer";
import ChannelSelector from "@/components/ChannelSelector";
import { isToday, isLive as checkIsLive, getLocalTime } from "@/lib/utils";

interface ClientMatchPageProps {
  match: Match;
  allMatches: Match[];
}

export default function ClientMatchPage({
  match: initialMatch,
  allMatches: initialAllMatches,
}: ClientMatchPageProps) {
  const [match, setMatch] = useState(initialMatch);
  const [allMatches, setAllMatches] = useState(initialAllMatches);
  const [channels, setChannels] = useState<StreamChannel[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const live = checkIsLive(match.status);

  // Fetch channels
  useEffect(() => {
    async function loadChannels() {
      try {
        setLoading(true);
        const res = await fetch(`/api/channels/${match.id}`);
        const data = await res.json();
        setChannels(data.channels || []);
        setActiveChannelId(data.primaryChannel || data.channels?.[0]?.id || "");
      } catch {
        setChannels([]);
      } finally {
        setLoading(false);
      }
    }
    loadChannels();
  }, [match.id]);

  // Live score polling
  useEffect(() => {
    if (!live) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/matches");
        const data = await res.json();
        if (data.matches) {
          const updated = data.matches.find((m: Match) => m.id === match.id);
          if (updated) setMatch(updated);
          setAllMatches(data.matches);
        }
      } catch { /* silent */ }
    }, 30000);
    return () => clearInterval(interval);
  }, [live, match.id]);

  const activeChannel = channels.find((ch) => ch.id === activeChannelId);
  const otherMatchesToday = allMatches.filter(
    (m) => m.id !== match.id && isToday(m.kickoff)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* ===== LIVE SCORE BANNER ===== */}
      {live && (
        <div className="glass mb-5 flex items-center gap-3 rounded-xl border-[#C41E3A]/20 px-5 py-3">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C41E3A] opacity-60" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-[#C41E3A]" />
          </span>
          <span className="text-sm font-black text-white tracking-tight">
            <span className="text-zinc-300 font-bold">{match.homeTeam.name}</span>{" "}
            <span className="text-2xl mx-1.5 tabular-nums">{match.score.home ?? "-"}</span>
            <span className="text-zinc-600">—</span>
            <span className="text-2xl mx-1.5 tabular-nums">{match.score.away ?? "-"}</span>{" "}
            <span className="text-zinc-300 font-bold">{match.awayTeam.name}</span>
          </span>
          <RefreshCw className="ml-auto h-3.5 w-3.5 animate-spin text-zinc-500" />
          <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Live</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* ===== MAIN CONTENT ===== */}
        <div className="lg:col-span-3 space-y-4">
          {/* Player */}
          <div className="rounded-2xl overflow-hidden bg-black border border-zinc-800/40">
            {loading ? (
              <div className="flex aspect-video items-center justify-center bg-zinc-900">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#C9A84C]/20 border-t-[#C9A84C]" />
                  <span className="text-xs text-zinc-500 font-medium tracking-wide">Loading stream...</span>
                </div>
              </div>
            ) : activeChannel ? (
              <StreamPlayer key={activeChannel.id} channel={activeChannel} />
            ) : (
              <div className="flex aspect-video items-center justify-center bg-zinc-900/80">
                <div className="flex flex-col items-center gap-3 text-center">
                  <Monitor className="h-12 w-12 text-zinc-700" />
                  <div>
                    <p className="text-sm font-medium text-zinc-500">
                      {channels.length > 0 ? "Select a channel to start watching" : "No streams configured"}
                    </p>
                    <p className="mt-1 text-xs text-zinc-600">
                      {channels.length > 0 ? "Click a channel below" : "Add stream URLs in Manage"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Channel selector */}
          <div className="glass rounded-xl p-4">
            <div className="mb-3 flex items-center gap-2">
              <Radio className="h-4 w-4 text-[#C9A84C]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Available Channels
              </h3>
              <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-500">
                {channels.length}
              </span>
            </div>
            <ChannelSelector
              channels={channels}
              activeId={activeChannelId}
              onSelect={setActiveChannelId}
            />
          </div>
        </div>

        {/* ===== SIDEBAR ===== */}
        <div className="space-y-4">
          {/* Match details */}
          <div className="glass rounded-xl p-4">
            <div className="mb-3 flex items-center gap-2">
              <ListVideo className="h-4 w-4 text-zinc-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Match Details
              </h3>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Stage</span>
                <span className="text-zinc-200 font-medium">{match.stage.replace(/_/g, " ")}</span>
              </div>
              {match.group && (
                <div className="flex justify-between">
                  <span className="text-zinc-500">Group</span>
                  <span className="text-zinc-200 font-medium">{match.group}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-zinc-500">Venue</span>
                <span className="text-right text-zinc-200 font-medium max-w-[140px]">{match.venue}</span>
              </div>
              {match.matchDay && (
                <div className="flex justify-between">
                  <span className="text-zinc-500">Matchday</span>
                  <span className="text-zinc-200 font-medium">{match.matchDay}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-zinc-500">Kickoff</span>
                <span className="text-zinc-200 font-medium">{getLocalTime(match.kickoff)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-zinc-800/30">
                <span className="text-zinc-500">Status</span>
                <span className={`font-bold ${
                  live ? "text-[#C41E3A]" : match.status === "FINISHED" ? "text-zinc-400" : "text-[#C9A84C]"
                }`}>
                  {live ? "● Live" : match.status === "FINISHED" ? "Full Time" : "Scheduled"}
                </span>
              </div>
            </div>
          </div>

          {/* Other matches today */}
          {otherMatchesToday.length > 0 && (
            <div className="glass rounded-xl p-4">
              <div className="mb-3 flex items-center gap-2">
                <Tv className="h-4 w-4 text-zinc-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Other Matches Today
                </h3>
              </div>
              <div className="space-y-2">
                {otherMatchesToday.slice(0, 4).map((m) => (
                  <Link
                    key={m.id}
                    href={`/match/${m.id}`}
                    className="group flex items-center justify-between rounded-lg border border-zinc-800/30 bg-zinc-900/30 px-3 py-2.5 transition-all duration-200 hover:border-zinc-700/60 hover:bg-zinc-900/60"
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-zinc-300 group-hover:text-white transition-colors">{m.homeTeam.name}</span>
                      <span className="text-zinc-600">vs</span>
                      <span className="text-zinc-300 group-hover:text-white transition-colors">{m.awayTeam.name}</span>
                    </div>
                    {checkIsLive(m.status) && (
                      <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider">Live</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Manage link */}
          <Link
            href="/admin"
            className="glass flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs text-zinc-500 transition-all duration-200 hover:bg-white/[0.02] hover:text-zinc-400 hover:border-zinc-700"
          >
            <Shield className="h-3.5 w-3.5" />
            Manage Streams
          </Link>
        </div>
      </div>
    </div>
  );
}
