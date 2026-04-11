"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SpiralDemo } from "@/components/ui/spiral-demo";

type IntroPhase = "idle" | "feedback" | "warp" | "reveal" | "done";
const MAIN_HOME_ROUTE = "/home";

export function IntroHeroFlow() {
  const [introPhase, setIntroPhase] = useState<IntroPhase>("idle");
  const router = useRouter();
  const timersRef = useRef<number[]>([]);

  const clearTransitionTimers = useCallback(() => {
    for (const timer of timersRef.current) {
      window.clearTimeout(timer);
    }
    timersRef.current = [];
  }, []);

  const startIntroTransition = useCallback(() => {
    if (introPhase !== "idle") {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setIntroPhase("done");
      router.push(MAIN_HOME_ROUTE);
      return;
    }

    setIntroPhase("feedback");
    clearTransitionTimers();

    timersRef.current.push(
      window.setTimeout(() => setIntroPhase("warp"), 520),
      window.setTimeout(() => router.push(MAIN_HOME_ROUTE), 760),
      window.setTimeout(() => setIntroPhase("reveal"), 1120),
      window.setTimeout(() => setIntroPhase("done"), 2180)
    );
  }, [clearTransitionTimers, introPhase, router]);

  useEffect(() => {
    router.prefetch(MAIN_HOME_ROUTE);
  }, [router]);

  useEffect(() => {
    return () => clearTransitionTimers();
  }, [clearTransitionTimers]);

  const showTransitionLayer = introPhase === "warp" || introPhase === "reveal";

  return (
    <>
      {showTransitionLayer ? (
        <div
          aria-hidden
          className={`cosmic-transition-layer ${introPhase === "warp" ? "is-warp" : "is-reveal"}`}
        >
          <div className="cosmic-transition-bg" />
          <div className="cosmic-transition-halo" />
          <div className="cosmic-transition-arc" />
          <div className="cosmic-transition-stars" />
        </div>
      ) : null}

      <SpiralDemo introPhase={introPhase} onEnter={startIntroTransition} />
    </>
  );
}
