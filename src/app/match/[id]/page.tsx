import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { fetchMatch, fetchMatches } from "@/lib/matches";
import { getFlagUrl, isLive, getStageLabel, getLocalTime } from "@/lib/utils";
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
      {/* ===== COMPACT MATCH HEADER ===== */}
      <section className="relative border-b border-border-default/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(201,168,76,0.05),transparent)]" />
        <div className="mx-auto max-w-7xl px-4 py-2.5 sm:px-6 lg:px-8">
          <div className="relative flex items-center gap-2 sm:gap-3 flex-nowrap">
            {/* Back button */}
            <Link
              href="/"
              className="glass-gold flex-shrink-0 inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-medium text-gold transition-all duration-200 hover:bg-gold/20"
            >
              <ArrowLeft className="h-3 w-3" />
              <span className="hidden sm:inline">All Matches</span>
            </Link>

            {/* Score / VS */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 text-sm flex-shrink-0">
              {homeFlag ? (
                <img src={homeFlag} alt="" className="h-4 w-6 rounded object-cover sm:h-5 sm:w-7" />
              ) : (
                <span className="text-[10px] font-bold text-text-tertiary uppercase w-6 text-center">
                  {match.homeTeam.code || match.homeTeam.name?.slice(0, 3) || "?"}
                </span>
              )}
              <span className="font-bold text-text-primary whitespace-nowrap hidden sm:inline">
                {match.homeTeam.name}
              </span>
              <span className="hidden sm:inline text-text-muted text-[10px]">vs</span>
              <span className="font-bold text-text-primary whitespace-nowrap hidden sm:inline">
                {match.awayTeam.name}
              </span>
              {awayFlag ? (
                <img src={awayFlag} alt="" className="h-4 w-6 rounded object-cover sm:h-5 sm:w-7" />
              ) : (
                <span className="text-[10px] font-bold text-text-tertiary uppercase w-6 text-center">
                  {match.awayTeam.code || match.awayTeam.name?.slice(0, 3) || "?"}
                </span>
              )}

              {live || finished ? (
                <span className={`ml-1 tabular-nums font-black ${
                  live ? "text-lg sm:text-xl text-text-primary" : "text-base sm:text-lg text-text-tertiary"
                }`}>
                  {match.score.home ?? "—"}
                  <span className={`mx-0.5 font-medium ${
                    live ? "text-crimson/50" : "text-text-subtle"
                  }`}>–</span>
                  {match.score.away ?? "—"}
                </span>
              ) : (
                <span className="ml-1 text-sm font-black text-gold tracking-widest">VS</span>
              )}
            </div>

            {/* Right side meta */}
            <div className="ml-auto flex items-center gap-2">
              {live && (
                <span className="inline-flex items-center gap-1 rounded-full bg-crimson/15 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-crimson">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-crimson opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-crimson" />
                  </span>
                  Live
                </span>
              )}
              {finished && (
                <span className="rounded-full bg-surface-elevated px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-text-muted">
                  FT
                </span>
              )}
              {!live && !finished && (
                <span className="text-[10px] text-text-muted whitespace-nowrap">
                  {getLocalTime(match.kickoff)}
                </span>
              )}
              <span className="text-[10px] text-text-muted hidden md:inline">
                {getStageLabel(match.stage)}
              </span>
              {match.venue && (
                <span className="text-[10px] text-text-muted hidden lg:inline">
                  {match.venue.split(",")[0]}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== PLAYER + CONTENT ===== */}
      <ClientMatchPage match={match} allMatches={allMatches} />
    </div>
  );
}
