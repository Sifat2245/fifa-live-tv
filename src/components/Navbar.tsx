"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, Tv, Settings, Radio } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const isManage = pathname.startsWith("/admin");
  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-border-accent bg-surface/95 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 transition-all duration-300 hover:opacity-90"
        >
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-gold to-gold-dark shadow-lg shadow-gold/25 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-gold/40">
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gold/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <Trophy className="relative h-5 w-5 text-navy" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold tracking-tight text-text-primary">
              FIFA<span className="text-gold"> 2026</span>
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-text-muted">
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
                    ? "text-text-primary bg-surface-hover"
                    : "text-text-tertiary hover:text-text-secondary hover:bg-surface-hover/50"
                }`}
              >
                <Tv className="h-3.5 w-3.5" />
                Matches
                {isActive("/") && (
                  <span className="absolute -bottom-px left-2 right-2 h-0.5 rounded-full bg-gold" />
                )}
              </Link>
              <Link
                href="/admin"
                className={`relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition-all duration-200 ${
                  isActive("/admin")
                    ? "text-text-primary bg-surface-hover"
                    : "text-text-muted hover:text-text-tertiary hover:bg-surface-hover/50"
                }`}
              >
                <Settings className="h-3.5 w-3.5" />
                Manage
              </Link>
            </>
          ) : (
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-lg bg-surface-hover px-3.5 py-2 text-xs font-medium text-text-tertiary transition-all duration-200 hover:bg-surface-hover hover:text-text-secondary"
            >
              <Radio className="h-3.5 w-3.5" />
              Back to Site
            </Link>
          )}

          {/* Theme Toggle */}
          <div className="ml-2 pl-2 border-l border-border-default">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
