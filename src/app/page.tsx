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
      <section className="relative overflow-hidden border-b border-[#C9A84C]/10">
        {/* Stadium lights glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(201,168,76,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_120%,rgba(196,30,58,0.05),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[length:24px_24px]" />

        {/* Trophy watermark */}
        <div className="absolute -right-20 -top-20 opacity-[0.02] pointer-events-none select-none">
          <Trophy className="h-[500px] w-[500px] text-white" strokeWidth={0.5} />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 text-center">
            {/* Badge */}
            <div className="glass-gold inline-flex items-center gap-2.5 rounded-full px-5 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C9A84C] opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C9A84C]" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#C9A84C]">
                FIFA World Cup 2026
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              <span className="text-white">Watch Every</span>
              <span className="block mt-1 text-gradient-gold">
                World Cup Match
              </span>
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
              Live streaming from global broadcasters. Free HD quality,
              no registration, zero ads. Select a match and start watching instantly.
            </p>

            {/* Quick stats */}
            <div className="mt-4 flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C9A84C]/10">
                  <Tv className="h-4 w-4 text-[#C9A84C]" />
                </div>
                <span className="text-zinc-400 font-medium">{matches.length} Matches</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C41E3A]/10">
                  <Radio className="h-4 w-4 text-[#C41E3A]" />
                </div>
                <span className="text-zinc-400 font-medium">{liveMatches.length} Live Now</span>
              </div>
              {liveMatches.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-zinc-500">
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
        <section className="border-b border-[#C41E3A]/10 bg-[#C41E3A]/[0.02]">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 overflow-x-auto">
              <div className="flex shrink-0 items-center gap-2 pr-4 border-r border-zinc-800/40">
                <LiveBadge />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Now</span>
              </div>
              {liveMatches.slice(0, 5).map((m) => {
                const homeFlag = getFlagUrl(m.homeTeam.name);
                const awayFlag = getFlagUrl(m.awayTeam.name);
                return (
                  <a
                    key={m.id}
                    href={`/match/${m.id}`}
                    className="glass flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-1.5 transition-all duration-200 hover:bg-white/5 hover:border-[#C41E3A]/30"
                  >
                    <div className="flex items-center gap-1.5">
                      {homeFlag && <img src={homeFlag} className="h-4 w-6 rounded object-cover" alt="" />}
                      <span className="text-xs font-semibold text-zinc-300 whitespace-nowrap">{m.homeTeam.name}</span>
                    </div>
                    <span className="text-sm font-bold text-white tabular-nums">
                      {m.score.home ?? "-"}:{m.score.away ?? "-"}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-zinc-300 whitespace-nowrap">{m.awayTeam.name}</span>
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
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 py-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800/50 mb-4">
              <Trophy className="h-8 w-8 text-zinc-600" />
            </div>
            <p className="text-sm font-medium text-zinc-500">Match schedule coming soon</p>
            <p className="mt-1.5 text-xs text-zinc-600">
              Check back for the latest FIFA World Cup 2026 fixtures
            </p>
          </div>
        ) : (
          <>
            {/* Live & Today section */}
            {(liveMatches.length > 0 || todayMatches.length > 0) && (
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#C41E3A]/20 to-red-900/20 border border-[#C41E3A]/20">
                  <Bolt className="h-4 w-4 text-red-400" />
                </div>
                <h2 className="text-base font-bold text-white uppercase tracking-wider">
                  Live & Today
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
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
                  <Calendar className="h-4 w-4 text-[#C9A84C]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C9A84C]">
                    Today&apos;s Matches
                  </span>
                  <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-500">
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
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#C9A84C]/20 to-amber-900/20 border border-[#C9A84C]/20">
                    <Calendar className="h-4 w-4 text-[#C9A84C]" />
                  </div>
                  <h2 className="text-base font-bold text-white uppercase tracking-wider">
                    Upcoming Fixtures
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
                </div>

                {Array.from(grouped.entries()).map(([dateKey, dateMatches]) => (
                  <div key={dateKey} className="mb-10">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="text-xs font-black tracking-[0.15em] text-[#C9A84C]">
                        {formatDateGroup(dateKey)}
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-r from-[#C9A84C]/15 to-transparent" />
                      <span className="text-xs text-zinc-600">{dateMatches.length} matches</span>
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
