import Link from "next/link";
import { fetchMatches } from "@/lib/matches";
import bannerBg from "@/assets/bannerimg.jpg";
import MatchGrid from "@/components/MatchGrid";
import {
  isLive,
  isFinished,
  isToday,
  getDateGroupKey,
  formatDateGroup,
  getFlagUrl,
  getLocalTime,
  getStageLabel,
} from "@/lib/utils";
import { Bolt, Calendar, Trophy, MapPin, Play } from "lucide-react";
import LiveBadge from "@/components/LiveBadge";
import CountdownTimer from "@/components/CountdownTimer";

export const revalidate = 60;

export default async function HomePage() {
  const matches = await fetchMatches();

  const liveMatches = matches.filter((m) => isLive(m.status));

  // Find featured match for the hero banner:
  // - Prioritise the first live match
  // - Otherwise the closest upcoming match
  const featuredMatch =
    liveMatches.length > 0
      ? liveMatches[0]
      : matches
          .filter((m) => !isLive(m.status) && !isFinished(m.status))
          .sort(
            (a, b) =>
              new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime()
          )[0] ?? null;
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
      <section className="relative overflow-hidden border-b border-gold/10 min-h-[420px] sm:min-h-[580px]">
        {/* Banner background image */}
        <img
          src={bannerBg.src}
          alt=""
          className="absolute inset-0 w-full h-full object-contain sm:object-cover sm:scale-100"
          aria-hidden="true"
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface/95 via-surface/70 to-surface/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(201,168,76,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_120%,rgba(196,30,58,0.08),transparent)]" />

        {/* Trophy watermark */}
        <div className="absolute -right-20 -top-20 opacity-[0.02] pointer-events-none select-none">
          <Trophy className="h-[500px] w-[500px] text-text-primary" strokeWidth={0.5} />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {featuredMatch ? (
            <div className="flex flex-col items-center gap-8">
              {/* FIFA badge */}
              <div className="glass-gold inline-flex items-center gap-2.5 rounded-full px-5 py-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold">
                  FIFA World Cup 2026
                </span>
              </div>

              {/* Featured match card */}
              <div className="w-full max-w-5xl">
                <div className="glass relative overflow-hidden rounded-2xl border border-gold/20 p-6 sm:p-8">
                  {/* Teams row */}
                  <div className="flex items-center justify-between gap-4">
                    {/* Home team */}
                    <div className="flex flex-1 flex-col items-center gap-3">
                      <div className="relative flex h-20 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-surface-elevated to-surface-card border border-border-default shadow-lg">
                        {(() => {
                          const flag = getFlagUrl(featuredMatch.homeTeam.name);
                          return flag ? (
                            <img
                              src={flag}
                              alt={featuredMatch.homeTeam.name}
                              className="h-14 w-20 rounded-xl object-cover"
                            />
                          ) : (
                            <span className="text-lg font-black uppercase text-text-muted">
                              {featuredMatch.homeTeam.code ||
                                featuredMatch.homeTeam.name.slice(0, 3)}
                            </span>
                          );
                        })()}
                      </div>
                      <span className="text-sm font-bold text-text-primary text-center leading-tight">
                        {featuredMatch.homeTeam.name}
                      </span>
                    </div>

                    {/* Score / VS */}
                    <div className="flex flex-col items-center gap-3 min-w-[100px]">
                      {isLive(featuredMatch.status) ? (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-4xl font-black text-text-primary tabular-nums">
                              {featuredMatch.score.home ?? "—"}
                            </span>
                            <span className="text-xl font-bold text-crimson/60">:</span>
                            <span className="text-4xl font-black text-text-primary tabular-nums">
                              {featuredMatch.score.away ?? "—"}
                            </span>
                          </div>
                          <LiveBadge />
                        </>
                      ) : (
                        <>
                          <span className="text-4xl font-black text-gold tracking-wider font-accent">
                            VS
                          </span>
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-xs font-semibold text-text-tertiary">
                              {getLocalTime(featuredMatch.kickoff)}
                            </span>
                            <CountdownTimer kickoff={featuredMatch.kickoff} />
                          </div>
                        </>
                      )}
                    </div>

                    {/* Away team */}
                    <div className="flex flex-1 flex-col items-center gap-3">
                      <div className="relative flex h-20 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-surface-elevated to-surface-card border border-border-default shadow-lg">
                        {(() => {
                          const flag = getFlagUrl(featuredMatch.awayTeam.name);
                          return flag ? (
                            <img
                              src={flag}
                              alt={featuredMatch.awayTeam.name}
                              className="h-14 w-20 rounded-xl object-cover"
                            />
                          ) : (
                            <span className="text-lg font-black uppercase text-text-muted">
                              {featuredMatch.awayTeam.code ||
                                featuredMatch.awayTeam.name.slice(0, 3)}
                            </span>
                          );
                        })()}
                      </div>
                      <span className="text-sm font-bold text-text-primary text-center leading-tight">
                        {featuredMatch.awayTeam.name}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-5 border-t border-gold/10" />

                  {/* Bottom row: venue + watch button */}
                  <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-text-muted">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-text-subtle" />
                        <span>{featuredMatch.venue?.split(",")[0] || "TBD"}</span>
                      </div>
                      <span className="hidden sm:inline text-text-subtle">·</span>
                      <span>{getStageLabel(featuredMatch.stage)}</span>
                      {featuredMatch.group && (
                        <>
                          <span className="hidden sm:inline text-text-subtle">·</span>
                          <span>{featuredMatch.group}</span>
                        </>
                      )}
                    </div>
                    <Link
                      href={`/match/${featuredMatch.id}`}
                      className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-dark px-6 py-3 text-sm font-bold text-navy transition-all duration-300 hover:from-gold-light hover:to-gold hover:shadow-lg hover:shadow-gold/20 active:scale-[0.97]"
                    >
                      {isLive(featuredMatch.status) ? (
                        <>
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-navy opacity-40" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-navy" />
                          </span>
                          Watch Live
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                          Watch Now
                        </>
                      )}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Fallback when no matches available */
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="glass-gold inline-flex items-center gap-2.5 rounded-full px-5 py-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold">
                  FIFA World Cup 2026
                </span>
              </div>
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
            </div>
          )}
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
