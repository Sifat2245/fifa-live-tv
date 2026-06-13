"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface HLSPlayerProps {
  streamUrl: string;
  poster?: string;
}

export default function HLSPlayer({ streamUrl, poster }: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const hlsRef = useRef<Hls | null>(null);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const retryCount = useRef(0);

  const initPlayer = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    // Cleanup previous instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (!streamUrl) {
      setIsLoading(false);
      setHasError(true);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30,
        maxBufferLength: 30,
      });
      hlsRef.current = hls;

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          setHasError(true);
          setIsLoading(false);
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS (Safari)
      video.src = streamUrl;
      video.addEventListener("loadedmetadata", () => {
        setIsLoading(false);
        video.play().catch(() => {});
      });
      video.addEventListener("error", () => {
        setHasError(true);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
      setHasError(true);
    }
  }, [streamUrl]);

  useEffect(() => {
    initPlayer();
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [initPlayer]);

  // Auto-hide controls
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimer.current) {
      clearTimeout(controlsTimer.current);
    }
    if (isPlaying) {
      controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMouseMove = () => resetControlsTimer();
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseenter", () => setShowControls(true));
    container.addEventListener("mouseleave", () => {
      if (isPlaying) setShowControls(false);
    });

    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      clearTimeout(controlsTimer.current);
    };
  }, [isPlaying, resetControlsTimer]);

  // Video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("canplay", onCanPlay);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("canplay", onCanPlay);
    };
  }, []);

  // Fullscreen
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setIsPlaying(true); }
    else { v.pause(); setIsPlaying(false); }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const val = parseFloat(e.target.value);
    v.volume = val;
    setVolume(val);
    if (val === 0) { v.muted = true; setIsMuted(true); }
    else { v.muted = false; setIsMuted(false); }
  };

  const toggleFullscreen = async () => {
    const c = containerRef.current;
    if (!c) return;
    if (!document.fullscreenElement) {
      await c.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  const handleRetry = () => {
    retryCount.current += 1;
    initPlayer();
  };

  return (
    <div
      ref={containerRef}
      className="group relative w-full overflow-hidden rounded-xl bg-black shadow-2xl"
      style={{ aspectRatio: "16/9" }}
    >
      <video
        ref={videoRef}
        className="h-full w-full cursor-pointer object-contain"
        playsInline
        poster={poster}
        onClick={togglePlay}
        autoPlay
      />

      {/* Loading */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#C9A84C]/30 border-t-[#C9A84C]" />
            <span className="text-xs font-medium tracking-wider text-[#C9A84C] animate-pulse">
              Loading Stream
            </span>
          </div>
        </div>
      )}

      {/* Error */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 px-6 text-center">
            <AlertTriangle className="h-10 w-10 text-red-400" />
            <div>
              <p className="text-sm font-medium text-white">Stream Unavailable</p>
              <p className="mt-1 text-xs text-zinc-400">
                Try another channel or check back later
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleRetry(); }}
              className="flex items-center gap-2 rounded-lg bg-[#C9A84C] px-4 py-2 text-xs font-semibold text-[#0A0E1A] transition-colors hover:bg-[#D4B85A]"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Play overlay */}
      {!isPlaying && !isLoading && !hasError && (
        <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/20 backdrop-blur-[1px]" onClick={togglePlay}>
          <div className="transform rounded-full bg-[#C9A84C]/90 p-5 shadow-2xl shadow-[#C9A84C]/30 transition-all duration-300 hover:scale-110 hover:bg-[#C9A84C] active:scale-95">
            <svg className="h-10 w-10 text-[#0A0E1A]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-12 transition-all duration-300 ${
          showControls || !isPlaying ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <button onClick={togglePlay} className="rounded-full p-1.5 text-white transition-colors hover:bg-white/10">
            {isPlaying ? (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
            ) : (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>

          <div className="group/vol flex items-center gap-1.5">
            <button onClick={toggleMute} className="rounded-full p-1.5 text-white transition-colors hover:bg-white/10">
              {isMuted || volume === 0 ? (
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
              ) : (
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
              )}
            </button>
            <div className="w-0 overflow-hidden transition-all duration-200 group-hover/vol:w-20">
              <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={handleVolume}
                className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/30 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>
          </div>

          <div className="flex-1" />

          <button onClick={toggleFullscreen} className="rounded-full p-1.5 text-white transition-colors hover:bg-white/10">
            {isFullscreen ? (
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>
            ) : (
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
