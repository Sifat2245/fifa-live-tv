"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function MatchError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-5 text-center max-w-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-crimson/20">
          <AlertTriangle className="h-8 w-8 text-crimson" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-text-primary mb-1">Something went wrong</h2>
          <p className="text-sm text-text-tertiary">
            Failed to load match data. This might be a temporary issue.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-xs font-semibold text-navy transition-colors hover:bg-gold-light"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg border border-border-default px-4 py-2 text-xs font-medium text-text-tertiary transition-colors hover:bg-surface-hover"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
