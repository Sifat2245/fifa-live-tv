"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, Tv, Settings, Radio } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const isManage = pathname.startsWith("/admin");
  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-[#C9A84C]/15 bg-[#0A0E1A]/95 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 transition-all duration-300 hover:opacity-90"
        >
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#A68B2E] shadow-lg shadow-[#C9A84C]/25 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-[#C9A84C]/40">
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#C9A84C]/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <Trophy className="relative h-5 w-5 text-[#0A0E1A]" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold tracking-tight text-white">
              FIFA<span className="text-[#C9A84C]"> 2026</span>
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
              Live Streams
            </span>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {!isManage ? (
            <>
              <Link
                href="/"
                className={`relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition-all duration-200 ${
                  isActive("/")
                    ? "text-white bg-white/10"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                }`}
              >
                <Tv className="h-3.5 w-3.5" />
                Matches
                {isActive("/") && (
                  <span className="absolute -bottom-px left-2 right-2 h-0.5 rounded-full bg-[#C9A84C]" />
                )}
              </Link>
              <Link
                href="/admin"
                className={`relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition-all duration-200 ${
                  isActive("/admin")
                    ? "text-white bg-white/10"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                }`}
              >
                <Settings className="h-3.5 w-3.5" />
                Manage
              </Link>
            </>
          ) : (
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3.5 py-2 text-xs font-medium text-zinc-300 transition-all duration-200 hover:bg-white/10 hover:text-white"
            >
              <Radio className="h-3.5 w-3.5" />
              Back to Site
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
