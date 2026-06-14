import { fetchMatches } from "@/lib/matches";
import MatchGrid from "@/components/MatchGrid";
import { isLive, isToday, getDateGroupKey, formatDateGroup, getFlagUrl } from "@/lib/utils";
import { Bolt, Calendar, Trophy, Tv, Radio } from "lucide-react";
import LiveBadge from "@/components/LiveBadge";

export const revalidate = 60;

export default async function HomePage() {
  const matches = await fetchMatches();

  const liveMatches = matches.filter((m) => isLive(m.status));
  const todayMatches = matches.filter(
    (m) => isToday(m.kickoff) && !isLive(m.status)
  );
  const upcomingMatches = matches.filter(
    (m) => !isLive(m.status) && !isToday(m.kickoff) && m.status !== "FINISHED"
  );

  // Group upcoming by date
  const grouped = new Map<string, typeof upcomingMatches>();
  for (const match of upcomingMatches) {
    const key = getDateGroupKey(match.kickoff);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(match);
  }

  const hasMatches = matches.length > 0;

  return (
    <div className="flex-1">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden border-b border-gold/10">
        {/* Stadium lights glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(201,168,76,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_120%,rgba(196,30,58,0.05),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[length:24px_24px]" />

        {/* Trophy watermark */}
        <div className="absolute -right-20 -top-20 opacity-[0.015] pointer-events-none select-none">
          <Trophy className="h-[500px] w-[500px] text-text-primary" strokeWidth={0.5} />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 text-center">
            {/* Badge */}
            <div className="glass-gold inline-flex items-center gap-2.5 rounded-full px-5 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold">
                FIFA World Cup 2026
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              <span className="text-text-primary">Watch Every</span>
              <span className="block mt-1 text-gradient-gold font-accent">
                World Cup Match
              </span>
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-text-tertiary sm:text-lg">
              Live streaming from global broadcasters. Free HD quality,
              no registration, zero ads. Select a match and start watching instantly.
            </p>

            {/* Quick stats */}
            <div className="mt-4 flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10">
                  <Tv className="h-4 w-4 text-gold" />
                </div>
                <span className="text-text-tertiary font-medium">{matches.length} Matches</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-crimson/10">
                  <Radio className="h-4 w-4 text-crimson" />
                </div>
                <span className="text-text-tertiary font-medium">{liveMatches.length} Live Now</span>
              </div>
              {liveMatches.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                    <Bolt className="h-4 w-4 text-green-400" />
                  </div>
                  <span className="text-green-400 font-semibold animate-pulse">Watch Live</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== LIVE TICKER (if any live matches) ===== */}
      {liveMatches.length > 0 && (
        <section className="border-b border-crimson/10 bg-crimson/[0.02]">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 overflow-x-auto">
              <div className="flex shrink-0 items-center gap-2 pr-4 border-r border-border-default">
                <LiveBadge />
                <span className="text-xs font-bold text-text-primary uppercase tracking-wider">Now</span>
              </div>
              {liveMatches.slice(0, 5).map((m) => {
                const homeFlag = getFlagUrl(m.homeTeam.name);
                const awayFlag = getFlagUrl(m.awayTeam.name);
                return (
                  <a
                    key={m.id}
                    href={`/match/${m.id}`}
                    className="glass flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-1.5 transition-all duration-200 hover:bg-surface-hover hover:border-crimson/30"
                  >
                    <div className="flex items-center gap-1.5">
                      {homeFlag && <img src={homeFlag} className="h-4 w-6 rounded object-cover" alt="" />}
                      <span className="text-xs font-semibold text-text-tertiary whitespace-nowrap">{m.homeTeam.name}</span>
                    </div>
                    <span className="text-sm font-bold text-text-primary tabular-nums">
                      {m.score.home ?? "—"}:{m.score.away ?? "—"}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-text-tertiary whitespace-nowrap">{m.awayTeam.name}</span>
                      {awayFlag && <img src={awayFlag} className="h-4 w-6 rounded object-cover" alt="" />}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== MATCHES CONTENT ===== */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {!hasMatches ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-default bg-surface-card/50 py-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-elevated mb-4">
              <Trophy className="h-8 w-8 text-text-muted" />
            </div>
            <p className="text-sm font-medium text-text-muted">Match schedule coming soon</p>
            <p className="mt-1.5 text-xs text-text-subtle">
              Check back for the latest FIFA World Cup 2026 fixtures
            </p>
          </div>
        ) : (
          <>
            {/* Live & Today section */}
            {(liveMatches.length > 0 || todayMatches.length > 0) && (
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-crimson/20 to-red-900/20 border border-crimson/20">
                  <Bolt className="h-4 w-4 text-crimson" />
                </div>
                <h2 className="text-base font-bold text-text-primary uppercase tracking-wider">
                  Live & Today
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-border-default to-transparent" />
              </div>
            )}

            {liveMatches.length > 0 && (
              <MatchGrid
                title=""
                matches={liveMatches}
                icon={null}
              />
            )}

            {todayMatches.length > 0 && (
              <div className="mb-10">
                <div className="mb-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gold" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gold">
                    Today&apos;s Matches
                  </span>
                  <span className="rounded-full bg-border-default px-2 py-0.5 text-xs text-text-muted">
                    {todayMatches.length}
                  </span>
                </div>
                <MatchGrid
                  title=""
                  matches={todayMatches}
                  icon={null}
                />
              </div>
            )}

            {/* Upcoming matches */}
            {grouped.size > 0 && (
              <section>
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold/20 to-amber-900/20 border border-gold/20">
                    <Calendar className="h-4 w-4 text-gold" />
                  </div>
                  <h2 className="text-base font-bold text-text-primary uppercase tracking-wider">
                    Upcoming Fixtures
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-border-default to-transparent" />
                </div>

                {Array.from(grouped.entries()).map(([dateKey, dateMatches]) => (
                  <div key={dateKey} className="mb-10">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="text-xs font-black tracking-[0.15em] text-gold">
                        {formatDateGroup(dateKey)}
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-r from-gold/15 to-transparent" />
                      <span className="text-xs text-text-muted">{dateMatches.length} matches</span>
                    </div>
                    <MatchGrid
                      title=""
                      matches={dateMatches}
                      emptyMessage=""
                    />
                  </div>
                ))}
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
