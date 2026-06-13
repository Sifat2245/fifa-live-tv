"use client";

import { Check, Film, Globe, Tv } from "lucide-react";
import type { StreamChannel } from "@/lib/types";

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
  if (channels.length === 0) {
    return (
      <div className="rounded-lg bg-zinc-900/50 px-4 py-3 text-center text-xs text-zinc-500">
        No channels configured for this match
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2 pb-1">
        {channels.map((ch) => {
          const isActive = ch.id === activeId;
          return (
            <button
              key={ch.id}
              onClick={() => onSelect(ch.id)}
              className={`flex shrink-0 items-center gap-2 rounded-lg border px-3.5 py-2.5 text-left text-xs transition-all duration-200 ${
                isActive
                  ? "border-[#C9A84C]/60 bg-[#C9A84C]/10 text-[#C9A84C] shadow-sm shadow-[#C9A84C]/10"
                  : "border-zinc-800/60 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300"
              }`}
            >
              {isActive && <Check className="h-3.5 w-3.5 shrink-0" />}
              <div className="flex flex-col">
                <span className="font-medium">{ch.name}</span>
                <span className="flex items-center gap-1 text-[10px] text-zinc-500">
                  {ch.youtubeVideoId ? (
                    <Film className="h-3 w-3 text-red-400" />
                  ) : ch.type === "iframe" ? (
                    <Globe className="h-3 w-3 text-blue-400" />
                  ) : (
                    <Tv className="h-3 w-3 text-green-400" />
                  )}
                  {ch.country}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
