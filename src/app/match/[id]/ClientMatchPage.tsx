"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Tv, Radio, Shield, ListVideo, Monitor } from "lucide-react";
import type { Match, StreamChannel } from "@/lib/types";
import StreamPlayer from "@/components/StreamPlayer";
import ChannelSelector from "@/components/ChannelSelector";
import { isToday, isLive as checkIsLive, getLocalTime, getFlagUrl } from "@/lib/utils";

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
  const finished = match.status === "FINISHED";
  const hasScore = live || finished;

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

  const homeFlag = getFlagUrl(match.homeTeam.name);
  const awayFlag = getFlagUrl(match.awayTeam.name);

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <div className="space-y-4">
        {/* ===== MAIN PLAYER ===== */}
        <div className="relative rounded-2xl overflow-hidden bg-black border border-border-default">
          {loading ? (
            <div className="flex aspect-video items-center justify-center bg-surface">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
                <span className="text-xs text-text-muted font-medium tracking-wide">Loading stream...</span>
              </div>
            </div>
          ) : activeChannel ? (
            <StreamPlayer key={activeChannel.id} channel={activeChannel} />
          ) : (
            <div className="flex aspect-video items-center justify-center bg-surface-elevated">
              <div className="flex flex-col items-center gap-3 text-center">
                <Monitor className="h-12 w-12 text-text-muted" />
                <div>
                  <p className="text-sm font-medium text-text-muted">
                    {channels.length > 0 ? "Select a channel to start watching" : "No streams configured"}
                  </p>
                  <p className="mt-1 text-xs text-text-subtle">
                    {channels.length > 0 ? "Click a channel below" : "Add stream URLs in Manage"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ===== BELOW PLAYER: Channels + Details ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Channel selector - takes 3 cols */}
          {channels.length > 0 && (
            <div className="lg:col-span-3 glass rounded-xl p-4">
              <div className="mb-3 flex items-center gap-2">
                <Radio className="h-4 w-4 text-gold" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
                  Available Channels
                </h3>
                <span className="rounded-full bg-border-default px-2 py-0.5 text-[10px] text-text-muted">
                  {channels.length}
                </span>
              </div>
              <ChannelSelector
                channels={channels}
                activeId={activeChannelId}
                onSelect={setActiveChannelId}
              />
            </div>
          )}

          {/* Match Details - takes 1 col */}
          <div className={`glass rounded-xl p-4 ${channels.length === 0 ? "lg:col-span-4" : ""}`}>
            <div className="mb-3 flex items-center gap-2">
              <ListVideo className="h-4 w-4 text-text-muted" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Match Details
              </h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Stage</span>
                <span className="text-text-secondary font-medium">{match.stage.replace(/_/g, " ")}</span>
              </div>
              {match.group && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Group</span>
                  <span className="text-text-secondary font-medium">{match.group}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-text-muted">Venue</span>
                <span className="text-right text-text-secondary font-medium max-w-[160px]">{match.venue}</span>
              </div>
              {match.matchDay && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Matchday</span>
                  <span className="text-text-secondary font-medium">{match.matchDay}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-text-muted">Kickoff</span>
                <span className="text-text-secondary font-medium text-right">{getLocalTime(match.kickoff)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-border-default">
                <span className="text-text-muted">Status</span>
                <span className={`font-bold ${
                  live ? "text-crimson" : finished ? "text-text-tertiary" : "text-gold"
                }`}>
                  {live ? "● Live" : finished ? "Full Time" : "Scheduled"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== OTHER MATCHES TODAY ===== */}
        {otherMatchesToday.length > 0 && (
          <div className="glass rounded-xl p-4">
            <div className="mb-3 flex items-center gap-2">
              <Tv className="h-4 w-4 text-text-muted" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Other Matches Today
              </h3>
              {otherMatchesToday.length > 4 && (
                <span className="rounded-full bg-border-default px-2 py-0.5 text-[10px] text-text-muted">
                  {otherMatchesToday.length}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {otherMatchesToday.slice(0, 8).map((m) => (
                <Link
                  key={m.id}
                  href={`/match/${m.id}`}
                  className="group flex items-center justify-between rounded-lg border border-border-default bg-surface-card/40 px-3 py-2.5 transition-all duration-200 hover:border-border-accent hover:bg-surface-hover"
                >
                  <div className="flex items-center gap-2 text-xs min-w-0">
                    <span className="text-text-tertiary group-hover:text-text-secondary transition-colors truncate">{m.homeTeam.name}</span>
                    <span className="text-text-muted flex-shrink-0">vs</span>
                    <span className="text-text-tertiary group-hover:text-text-secondary transition-colors truncate">{m.awayTeam.name}</span>
                  </div>
                  {checkIsLive(m.status) && (
                    <span className="text-[9px] font-bold text-crimson uppercase tracking-wider flex-shrink-0 ml-2">Live</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ===== MANAGE LINK ===== */}
        <Link
          href="/admin"
          className="glass flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs text-text-muted transition-all duration-200 hover:bg-surface-hover hover:text-text-tertiary hover:border-border-accent"
        >
          <Shield className="h-3.5 w-3.5" />
          Manage Streams
        </Link>
      </div>
    </div>
  );
}
