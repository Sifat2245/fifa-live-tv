"use client";

import { useEffect, useState } from "react";
import { parseISO, differenceInSeconds } from "date-fns";

interface CountdownTimerProps {
  kickoff: string;
}

export default function CountdownTimer({ kickoff }: CountdownTimerProps) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    function tick() {
      const diff = differenceInSeconds(parseISO(kickoff), new Date());
      if (diff <= 0) {
        setDisplay("Starting soon...");
        return;
      }
      const d = Math.floor(diff / 86400);
      const h = Math.floor((diff % 86400) / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;

      if (d > 0) {
        setDisplay(`in ${d}d ${h}h`);
      } else if (h > 0) {
        setDisplay(`in ${h}h ${m}m`);
      } else {
        setDisplay(`in ${m}m ${s}s`);
      }
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [kickoff]);

  return <span className="tabular-nums text-zinc-500">{display}</span>;
}
