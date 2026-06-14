import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Tv, Calendar } from "lucide-react";
import { fetchMatch, fetchMatches } from "@/lib/matches";
import { getFlagUrl, isLive, getStageLabel, getLocalTime, formatKickoff } from "@/lib/utils";
import ClientMatchPage from "./ClientMatchPage";

interface MatchPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const matches = await fetchMatches();
  return matches.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: MatchPageProps) {
  const { id } = await params;
  const match = await fetchMatch(id);
  if (!match) return { title: "Match Not Found - FIFA 2026 Live" };
  return {
    title: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
    description: `Watch ${match.homeTeam.name} vs ${match.awayTeam.name} live. ${getStageLabel(match.stage)} at ${match.venue}.`,
  };
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { id } = await params;
  const match = await fetchMatch(id);

  if (!match) {
    notFound();
  }

  const homeFlag = getFlagUrl(match.homeTeam.name);
  const awayFlag = getFlagUrl(match.awayTeam.name);
  const live = isLive(match.status);
  const finished = match.status === "FINISHED";

  // Get other matches today for sidebar
  const allMatches = await fetchMatches();

  return (
    <div className="flex-1">
      {/* ===== MATCH HEADER ===== */}
      <section className="relative overflow-hidden border-b border-border-default/60">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(201,168,76,0.06),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[length:20px_20px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Back button */}
          <Link
            href="/"
            className="glass-gold mb-5 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-medium text-gold transition-all duration-200 hover:bg-gold/20"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Matches
          </Link>

          {/* Scoreboard */}
          <div className="flex flex-col items-center py-4">
            {/* Teams row */}
            <div className="flex w-full items-center justify-center gap-4 sm:gap-8 lg:gap-12">
              {/* Home team */}
              <div className="flex flex-1 flex-col items-center gap-3 sm:flex-row sm:justify-end">
                <div className="flex h-14 w-20 items-center justify-center rounded-xl bg-surface-elevated border border-border-default sm:h-20 sm:w-28">
                  {homeFlag ? (
                    <img src={homeFlag} alt={match.homeTeam.name} className="h-10 w-16 rounded object-cover sm:h-14 sm:w-22" />
                  ) : (
                    <span className="text-sm font-black text-text-tertiary uppercase">
                      {match.homeTeam.code || match.homeTeam.name?.slice(0, 3) || "?"}
                    </span>
                  )}
                </div>
                <span className="text-sm font-bold text-text-secondary text-center sm:text-base sm:text-right sm:max-w-[120px]">
                  {match.homeTeam.name}
                </span>
              </div>

              {/* Score / VS */}
              <div className="flex flex-col items-center gap-2">
                {live || finished ? (
                  <div className="flex items-center gap-3">
                    <span className={`text-5xl font-black tabular-nums sm:text-7xl ${
                      live ? "text-text-primary" : "text-text-tertiary"
                    }`}>
                      {match.score.home ?? "—"}
                    </span>
                    <span className={`text-3xl font-black ${live ? "text-crimson/50" : "text-text-subtle"}`}>:</span>
                    <span className={`text-5xl font-black tabular-nums sm:text-7xl ${
                      live ? "text-text-primary" : "text-text-tertiary"
                    }`}>
                      {match.score.away ?? "—"}
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-black text-gold tracking-widest">VS</span>
                )}

                {/* Status badges */}
                <div className="flex items-center gap-2">
                  {live && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-crimson/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-crimson">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-crimson opacity-60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-crimson" />
                      </span>
                      Live
                    </span>
                  )}
                  {finished && (
                    <span className="rounded-full bg-surface-elevated px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                      Full Time
                    </span>
                  )}
                  {!live && !finished && (
                    <span className="text-xs font-medium text-text-muted">{getLocalTime(match.kickoff)}</span>
                  )}
                </div>
              </div>

              {/* Away team */}
              <div className="flex flex-1 flex-col items-center gap-3 sm:flex-row sm:justify-start">
                <span className="text-sm font-bold text-text-secondary text-center sm:text-base sm:text-left sm:max-w-[120px] order-2 sm:order-1">
                  {match.awayTeam.name}
                </span>
                <div className="flex h-14 w-20 items-center justify-center rounded-xl bg-surface-elevated border border-border-default sm:h-20 sm:w-28 order-1 sm:order-2">
                  {awayFlag ? (
                    <img src={awayFlag} alt={match.awayTeam.name} className="h-10 w-16 rounded object-cover sm:h-14 sm:w-22" />
                  ) : (
                    <span className="text-sm font-black text-text-tertiary uppercase">
                      {match.awayTeam.code || match.awayTeam.name?.slice(0, 3) || "?"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Meta info bar */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <span className="glass-gold rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gold">
                {getStageLabel(match.stage)}
              </span>
              {match.group && (
                <span className="glass rounded-lg px-3 py-1.5 text-[10px] font-medium text-text-tertiary">
                  {match.group}
                </span>
              )}
              <span className="glass flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] text-text-muted">
                <MapPin className="h-3 w-3 text-text-subtle" />
                {match.venue}
              </span>
              {match.matchDay && (
                <span className="glass rounded-lg px-3 py-1.5 text-[10px] text-text-muted">
                  Matchday {match.matchDay}
                </span>
              )}
              <span className="glass flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] text-text-muted">
                <Calendar className="h-3 w-3 text-text-subtle" />
                {formatKickoff(match.kickoff)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PLAYER + CHANNELS ===== */}
      <ClientMatchPage match={match} allMatches={allMatches} />
    </div>
  );
}
