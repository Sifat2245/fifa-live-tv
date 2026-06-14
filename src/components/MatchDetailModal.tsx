"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X, MapPin, Calendar, Clock, Trophy, Eye } from "lucide-react";
import { format, parseISO } from "date-fns";
import { getFlagUrl, getLocalTime, getStageLabel } from "@/lib/utils";
import CountdownTimer from "./CountdownTimer";
import type { Match } from "@/lib/types";

interface MatchDetailModalProps {
  match: Match;
  onClose: () => void;
}

export default function MatchDetailModal({ match, onClose }: MatchDetailModalProps) {
  const homeFlag = match.homeTeam?.name ? getFlagUrl(match.homeTeam.name) : "";
  const awayFlag = match.awayTeam?.name ? getFlagUrl(match.awayTeam.name) : "";

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" style={{ animation: "fadeIn 0.3s ease-out" }} />

      {/* Modal */}
      <div className="relative w-full max-w-lg animate-scale-in" role="dialog" aria-modal="true" aria-label={`${match.homeTeam.name} vs ${match.awayTeam.name} match details`}>
        <div className="glass rounded-2xl border border-border-default overflow-hidden shadow-2xl shadow-black/40">
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-gold/40 via-gold to-gold/40" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface-elevated/80 border border-border-default text-text-muted hover:text-text-primary hover:bg-surface-hover transition-all duration-200"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="p-6 sm:p-8">
            {/* Teams */}
            <div className="flex items-center justify-between gap-4 mb-6">
              {/* Home team */}
              <div className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-16 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-surface-elevated to-surface-card border border-border-default overflow-hidden">
                  {homeFlag ? (
                    <img src={homeFlag} alt={match.homeTeam.name} className="h-11 w-16 rounded object-cover" />
                  ) : (
                    <span className="text-xs font-extrabold uppercase text-text-tertiary">
                      {match.homeTeam.code || match.homeTeam.name?.slice(0, 3) || "?"}
                    </span>
                  )}
                </div>
                <span className="text-center text-sm font-bold text-text-primary leading-tight max-w-[120px]">
                  {match.homeTeam.name}
                </span>
              </div>

              {/* VS */}
              <div className="flex flex-col items-center gap-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 border border-gold/20">
                  <span className="text-lg font-black text-gold tracking-wider font-accent">VS</span>
                </div>
              </div>

              {/* Away team */}
              <div className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-16 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-surface-elevated to-surface-card border border-border-default overflow-hidden">
                  {awayFlag ? (
                    <img src={awayFlag} alt={match.awayTeam.name} className="h-11 w-16 rounded object-cover" />
                  ) : (
                    <span className="text-xs font-extrabold uppercase text-text-tertiary">
                      {match.awayTeam.code || match.awayTeam.name?.slice(0, 3) || "?"}
                    </span>
                  )}
                </div>
                <span className="text-center text-sm font-bold text-text-primary leading-tight max-w-[120px]">
                  {match.awayTeam.name}
                </span>
              </div>
            </div>

            {/* Date & Time — Hero section */}
            <div className="flex flex-col items-center gap-2 mb-6 py-4 rounded-xl bg-surface-card/60 border border-border-subtle">
              <div className="flex items-center gap-2 text-gold">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-bold uppercase tracking-wider text-gold">
                  Match Day
                </span>
              </div>
              <div className="text-center">
                <p className="text-xl font-black text-text-primary tabular-nums">
                  {format(parseISO(match.kickoff), "EEEE, MMMM d, yyyy")}
                </p>
                <p className="text-base font-semibold text-text-secondary mt-1 tabular-nums">
                  {getLocalTime(match.kickoff)}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-text-tertiary mt-1 font-medium">
                <Clock className="h-3.5 w-3.5 text-text-subtle" />
                <CountdownTimer kickoff={match.kickoff} />
              </div>
            </div>

            {/* Match Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border-default/50">
                <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Stage</span>
                <span className="text-sm font-semibold text-text-secondary">{getStageLabel(match.stage)}</span>
              </div>
              {match.group && (
                <div className="flex items-center justify-between py-2 border-b border-border-default/50">
                  <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Group</span>
                  <span className="text-sm font-semibold text-text-secondary">{match.group}</span>
                </div>
              )}
              <div className="flex items-center justify-between py-2 border-b border-border-default/50">
                <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Venue</span>
                <span className="text-sm font-semibold text-text-secondary text-right max-w-[200px]">{match.venue}</span>
              </div>
              {match.matchDay && (
                <div className="flex items-center justify-between py-2 border-b border-border-default/50">
                  <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Matchday</span>
                  <span className="text-sm font-semibold text-text-secondary">{match.matchDay}</span>
                </div>
              )}
              <div className="flex items-center justify-between py-2">
                <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Status</span>
                <span className="text-sm font-bold text-gold">Scheduled</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
