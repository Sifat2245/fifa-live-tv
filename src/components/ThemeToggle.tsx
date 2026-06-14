"use client";

import { useTheme } from "@/lib/ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="theme-toggle-glow relative flex h-8 w-8 items-center justify-center rounded-lg border border-border-default bg-surface-card text-text-tertiary transition-all duration-300 hover:border-gold/40 hover:text-gold active:scale-95"
    >
      <div className="relative h-4 w-4">
        {/* Sun */}
        <Sun
          className={`absolute inset-0 h-full w-full transition-all duration-500 ${
            theme === "light"
              ? "rotate-0 scale-100 opacity-100"
              : "rotate-90 scale-0 opacity-0"
          }`}
        />
        {/* Moon */}
        <Moon
          className={`absolute inset-0 h-full w-full transition-all duration-500 ${
            theme === "dark"
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </div>
    </button>
  );
}
