"use client";

import { useState } from "react";
import { Tv, Film, Globe } from "lucide-react";
import type { StreamChannel } from "@/lib/types";
import HLSPlayer from "./HLSPlayer";
import DASHPlayer from "./DASHPlayer";

interface StreamPlayerProps {
  channel: StreamChannel;
}

type PlayerMode = "youtube" | "iframe" | "hls" | "dash";

export default function StreamPlayer({ channel }: StreamPlayerProps) {
  const [mode, setMode] = useState<PlayerMode>(() => {
    if (channel.youtubeVideoId) return "youtube";
    if (channel.type === "iframe" && channel.embedUrl) return "iframe";
    if (channel.type === "dash") return "dash";
    return "hls";
  });

  const hasYouTube = !!channel.youtubeVideoId;
  const hasIframe = !!channel.embedUrl;
  const isDashStream = channel.type === "dash" || mode === "dash";
  const isHlsStream = channel.type === "hls" && !isDashStream;

  if (mode === "youtube" && hasYouTube) {
    return (
      <div className="relative w-full overflow-hidden rounded-xl bg-black shadow-2xl" style={{ aspectRatio: "16/9" }}>
        <iframe
          src={`https://www.youtube.com/embed/${channel.youtubeVideoId}?autoplay=1&rel=0`}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
        />
        {(hasIframe || channel.streamUrl) && (
          <div className="absolute bottom-3 left-3 z-10 flex gap-2">
            {hasIframe && (
              <button onClick={() => setMode("iframe")}
                className="rounded-lg bg-zinc-900/80 px-2.5 py-1.5 text-[10px] text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200">
                <Globe className="mr-1 inline h-3 w-3" />
                Embed
              </button>
            )}
            {channel.streamUrl && isHlsStream && (
              <button onClick={() => setMode("hls")}
                className="rounded-lg bg-zinc-900/80 px-2.5 py-1.5 text-[10px] text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200">
                <Tv className="mr-1 inline h-3 w-3" />
                HLS
              </button>
            )}
            {channel.streamUrl && isDashStream && (
              <button onClick={() => setMode("dash")}
                className="rounded-lg bg-zinc-900/80 px-2.5 py-1.5 text-[10px] text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200">
                <Tv className="mr-1 inline h-3 w-3" />
                DASH
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  if (mode === "iframe" && hasIframe) {
    return (
      <div className="relative w-full overflow-hidden rounded-xl bg-black shadow-2xl" style={{ aspectRatio: "16/9" }}>
        <iframe
          src={channel.embedUrl}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
        />
        <div className="absolute bottom-3 left-3 z-10 flex gap-2">
          {hasYouTube && (
            <button onClick={() => setMode("youtube")}
              className="rounded-lg bg-zinc-900/80 px-2.5 py-1.5 text-[10px] text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200">
              <Film className="mr-1 inline h-3 w-3" />
              YouTube
            </button>
          )}
          {channel.streamUrl && isHlsStream && (
            <button onClick={() => setMode("hls")}
              className="rounded-lg bg-zinc-900/80 px-2.5 py-1.5 text-[10px] text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200">
              <Tv className="mr-1 inline h-3 w-3" />
              HLS
            </button>
          )}
          {channel.streamUrl && isDashStream && (
            <button onClick={() => setMode("dash")}
              className="rounded-lg bg-zinc-900/80 px-2.5 py-1.5 text-[10px] text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200">
              <Tv className="mr-1 inline h-3 w-3" />
              DASH
            </button>
          )}
        </div>
      </div>
    );
  }

  if (mode === "dash" && channel.streamUrl) {
    return (
      <div className="relative">
        <DASHPlayer streamUrl={channel.streamUrl} />
        {(hasYouTube || hasIframe) && (
          <div className="absolute bottom-3 left-3 z-10 flex gap-2">
            {hasYouTube && (
              <button onClick={() => setMode("youtube")}
                className="rounded-lg bg-zinc-900/80 px-2.5 py-1.5 text-[10px] text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200">
                <Film className="mr-1 inline h-3 w-3" />
                YouTube
              </button>
            )}
            {hasIframe && (
              <button onClick={() => setMode("iframe")}
                className="rounded-lg bg-zinc-900/80 px-2.5 py-1.5 text-[10px] text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200">
                <Globe className="mr-1 inline h-3 w-3" />
                Embed
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  if (channel.streamUrl) {
    return (
      <div className="relative">
        <HLSPlayer streamUrl={channel.streamUrl} />
        {(hasYouTube || hasIframe) && (
          <div className="absolute bottom-3 left-3 z-10 flex gap-2">
            {hasYouTube && (
              <button onClick={() => setMode("youtube")}
                className="rounded-lg bg-zinc-900/80 px-2.5 py-1.5 text-[10px] text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200">
                <Film className="mr-1 inline h-3 w-3" />
                YouTube
              </button>
            )}
            {hasIframe && (
              <button onClick={() => setMode("iframe")}
                className="rounded-lg bg-zinc-900/80 px-2.5 py-1.5 text-[10px] text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200">
                <Globe className="mr-1 inline h-3 w-3" />
                Embed
              </button>
            )}
            {isDashStream && (
              <button onClick={() => setMode("dash")}
                className="rounded-lg bg-zinc-900/80 px-2.5 py-1.5 text-[10px] text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200">
                <Tv className="mr-1 inline h-3 w-3" />
                DASH
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-border-default bg-surface-elevated">
      <div className="flex flex-col items-center gap-3 text-center">
        <Tv className="h-10 w-10 text-text-muted" />
        <div>
          <p className="text-sm font-medium text-text-muted">No stream source configured</p>
          <p className="mt-1 text-xs text-text-subtle">
            Add a stream URL, embed URL, or YouTube video ID in Manage
          </p>
        </div>
      </div>
    </div>
  );
}
