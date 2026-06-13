"use client";

import { useEffect } from "react";

export default function NoInspect() {
  useEffect(() => {
    // Block right-click
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Block keyboard shortcuts for devtools
    const onKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12") {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C
      if (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) {
        e.preventDefault();
        return false;
      }
      // Ctrl+U (view source)
      if (e.ctrlKey && e.key.toUpperCase() === "U") {
        e.preventDefault();
        return false;
      }
      // Ctrl+S (save page)
      if (e.ctrlKey && e.key.toUpperCase() === "S") {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null;
}
