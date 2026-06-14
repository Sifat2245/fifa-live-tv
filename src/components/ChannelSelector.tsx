"use client";

import { useState, useMemo } from "react";
import { Check, Search, Tv, Film, Globe, X } from "lucide-react";
import type { StreamChannel } from "@/lib/types";

const COUNTRY_NAMES: Record<string, string> = {
  INT: "International",
  US: "United States",
  ES: "Spain",
  AU: "Australia",
  TR: "Turkey",
  FR: "France",
  LAT: "Latin America",
  AR: "Argentina",
  CL: "Chile",
  CO: "Colombia",
  MX: "Mexico",
  CA: "Canada",
  IT: "Italy",
  DE: "Germany",
  SA: "Saudi Arabia",
  BD: "Bangladesh",
  IN: "India",
};

interface ChannelSelectorProps {
  channels: StreamChannel[];
  activeId: string;
  onSelect: (id: string) => void;
}

export default function ChannelSelector({
  channels,
  activeId,
  onSelect,
}: ChannelSelectorProps) {
  const [search, setSearch] = useState("");

  // Separate default channels and group the rest by country
  const { defaultChannels, groupedChannels } = useMemo(() => {
    const filtered = channels.filter(
      (ch) =>
        ch.name.toLowerCase().includes(search.toLowerCase()) ||
        ch.country.toLowerCase().includes(search.toLowerCase()) ||
        (COUNTRY_NAMES[ch.country] || "")
          .toLowerCase()
          .includes(search.toLowerCase())
    );

    const defaults = filtered.filter((ch) => ch.isDefault);
    const others = filtered.filter((ch) => !ch.isDefault);

    const groups: Record<string, StreamChannel[]> = {};
    for (const ch of others) {
      const country = ch.country || "Other";
      if (!groups[country]) groups[country] = [];
      groups[country].push(ch);
    }

    const sortedGroups = Object.entries(groups).sort(([a], [b]) => {
      const nameA = COUNTRY_NAMES[a] || a;
      const nameB = COUNTRY_NAMES[b] || b;
      return nameA.localeCompare(nameB);
    });

    return { defaultChannels: defaults, groupedChannels: sortedGroups };
  }, [channels, search]);

  const renderChannel = (ch: StreamChannel) => {
    const isActive = ch.id === activeId;
    return (
      <button
        key={ch.id}
        onClick={() => {
          onSelect(ch.id);
          setSearch("");
        }}
        className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-xs transition-all duration-200 ${
          isActive
            ? "border-[#C9A84C]/60 bg-[#C9A84C]/10 text-[#C9A84C] shadow-sm shadow-[#C9A84C]/10"
            : "border-zinc-800/60 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300"
        }`}
      >
        {/* Logo or icon */}
        {ch.logo ? (
          <img
            src={ch.logo}
            alt=""
            className="h-5 w-5 shrink-0 rounded object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-zinc-800">
            {ch.youtubeVideoId ? (
              <Film className="h-3 w-3 text-red-400" />
            ) : ch.type === "iframe" ? (
              <Globe className="h-3 w-3 text-blue-400" />
            ) : (
              <Tv className="h-3 w-3 text-green-400" />
            )}
          </div>
        )}

        {/* Name */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {isActive && (
              <Check className="h-3 w-3 shrink-0 text-[#C9A84C]" />
            )}
            <span className="truncate font-medium">{ch.name}</span>
          </div>
        </div>

        {/* Country badge */}
        <span className="shrink-0 rounded border border-zinc-800/60 px-1.5 py-0.5 text-[9px] font-medium text-zinc-600">
          {ch.country}
        </span>
      </button>
    );
  };

  if (channels.length === 0) {
    return (
      <div className="rounded-lg bg-zinc-900/50 px-4 py-3 text-center text-xs text-zinc-500">
        No channels configured for this match
      </div>
    );
  }

  return (
    <div>
      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          placeholder="Search channels by name or country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-zinc-800/60 bg-zinc-900/60 py-2 pl-9 pr-8 text-xs text-zinc-300 placeholder-zinc-600 transition-colors focus:border-[#C9A84C]/40 focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/20"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Channel list */}
      <div className="max-h-[420px] space-y-4 overflow-y-auto pr-1">
        {/* Default channels section */}
        {defaultChannels.length > 0 && (
          <div>
            <div className="sticky top-0 z-10 mb-1.5 flex items-center gap-2 bg-zinc-900/95 py-1.5 backdrop-blur-sm">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A84C]/80">
                ★ Featured
              </span>
              <span className="rounded-full bg-[#C9A84C]/10 px-1.5 py-0.5 text-[9px] font-medium text-[#C9A84C]/60">
                {defaultChannels.length}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {defaultChannels.map((ch) => renderChannel(ch))}
            </div>
          </div>
        )}

        {/* Other channels grouped by country */}
        {groupedChannels.length > 0 && (
          <div>
            {/* Divider */}
            {defaultChannels.length > 0 && (
              <div className="my-3 border-t border-zinc-800/40" />
            )}

            {groupedChannels.map(([country, countryChannels]) => (
              <div key={country} className="mb-4">
                {/* Sticky country header */}
                <div className="sticky top-0 z-10 mb-1.5 flex items-center gap-2 bg-zinc-900/95 py-1.5 backdrop-blur-sm">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    {COUNTRY_NAMES[country] || country}
                  </span>
                  <span className="rounded-full bg-zinc-800 px-1.5 py-0.5 text-[9px] font-medium text-zinc-600">
                    {countryChannels.length}
                  </span>
                </div>

                {/* Channel grid */}
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {countryChannels.map((ch) => renderChannel(ch))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {defaultChannels.length === 0 && groupedChannels.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <Search className="h-6 w-6 text-zinc-700" />
            <p className="text-xs text-zinc-500">
              No channels match{" "}
              <span className="text-zinc-400">&ldquo;{search}&rdquo;</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
