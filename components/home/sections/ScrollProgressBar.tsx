"use client";

import { useEffect, useState } from "react";

export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = scrollHeight <= 0 ? 0 : Math.min(scrollTop / scrollHeight, 1);
      setProgress(nextProgress);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-8 pointer-events-none">
      <div className="absolute inset-x-0 top-1/2 h-4 -translate-y-1/2 bg-[repeating-linear-gradient(90deg,transparent_0_4px,rgba(255,244,230,0.2)_4px_6px,transparent_6px_9px)]" />
      <div
        className="absolute left-0 top-1/2 h-4 -translate-y-1/2 overflow-hidden"
        style={{ width: `${progress * 100}%` }}
      >
        <div className="h-full w-[100vw] bg-[repeating-linear-gradient(90deg,transparent_0_4px,rgba(255,244,230,0.98)_4px_6px,transparent_6px_9px)]" />
      </div>
    </div>
  );
}
