"use client";

import { useEffect, useRef, useState } from "react";

type GridDot = {
  id: string;
  x: number;
  y: number;
  motion: "top" | "bottom" | "left" | "right";
  fromX: number;
  fromY: number;
  size?: number;
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function mix(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function easeOutQuad(value: number) {
  return 1 - (1 - value) * (1 - value);
}

function easeOutQuint(value: number) {
  return 1 - Math.pow(1 - value, 5);
}

function toGray(value: number) {
  const channel = Math.round(value);
  return `rgb(${channel}, ${channel}, ${channel})`;
}

function getResponsiveDots(isNarrow: boolean) {
  const outerLeft = isNarrow ? 16 : 18;
  const innerLeft = isNarrow ? 24 : 26;
  const innerRight = 100 - innerLeft;
  const outerRight = 100 - outerLeft;
  const topRow = isNarrow ? 27 : 28;
  const middleRow = isNarrow ? 45.5 : 46.5;
  const bottomRow = isNarrow ? 64 : 65;
  const topCenter = topRow;
  const bottomCenter = bottomRow;

  const leftDots: GridDot[] = [
    {
      id: "left-outer-top",
      motion: "left",
      x: outerLeft,
      y: topRow,
      fromX: 2,
      fromY: topRow,
      size: 4.6,
    },
    {
      id: "left-inner-top",
      motion: "left",
      x: innerLeft,
      y: topRow,
      fromX: 10,
      fromY: topRow,
      size: 4.6,
    },
    {
      id: "left-outer-middle",
      motion: "left",
      x: outerLeft,
      y: middleRow,
      fromX: 10,
      fromY: middleRow,
      size: 4.6,
    },
    {
      id: "left-inner-middle",
      motion: "left",
      x: innerLeft,
      y: middleRow,
      fromX: 18,
      fromY: middleRow,
      size: 4.6,
    },
    {
      id: "left-inner-bottom",
      motion: "left",
      x: innerLeft,
      y: bottomRow,
      fromX: 10,
      fromY: bottomRow,
      size: 4.6,
    },
    {
      id: "left-outer-bottom",
      motion: "left",
      x: outerLeft,
      y: bottomRow,
      fromX: 2,
      fromY: bottomRow,
      size: 4.6,
    },
  ];

  const rightDots: GridDot[] = [
    {
      id: "right-inner-top",
      motion: "right",
      x: innerRight,
      y: topRow,
      fromX: 90,
      fromY: topRow,
      size: 4.6,
    },
    {
      id: "right-outer-top",
      motion: "right",
      x: outerRight,
      y: topRow,
      fromX: 98,
      fromY: topRow,
      size: 4.6,
    },
    {
      id: "right-inner-middle",
      motion: "right",
      x: innerRight,
      y: middleRow,
      fromX: 82,
      fromY: middleRow,
      size: 4.6,
    },
    {
      id: "right-outer-middle",
      motion: "right",
      x: outerRight,
      y: middleRow,
      fromX: 92,
      fromY: middleRow,
      size: 4.6,
    },
    {
      id: "right-inner-bottom",
      motion: "right",
      x: innerRight,
      y: bottomRow,
      fromX: 90,
      fromY: bottomRow,
      size: 4.6,
    },
    {
      id: "right-outer-bottom",
      motion: "right",
      x: outerRight,
      y: bottomRow,
      fromX: 98,
      fromY: bottomRow,
      size: 4.6,
    },
  ];

  const verticalDots: GridDot[] = [
    { id: "top-center", motion: "top", x: 50, y: topCenter, fromX: 50, fromY: 2, size: 5 },
    { id: "bottom-center", motion: "bottom", x: 50, y: bottomCenter, fromX: 50, fromY: 98, size: 5 },
  ];

  return [...verticalDots, ...leftDots, ...rightDots];
}

export function ObsidianFocusSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        frame = 0;

        const viewportHeight = window.innerHeight || 1;
        const section = sectionRef.current;

        setIsNarrow(window.innerWidth < 768);

        if (!section) {
          setProgress(0);
          return;
        }

        const rect = section.getBoundingClientRect();
        const startLine = viewportHeight * 0.82;
        const travel = Math.max(rect.height + viewportHeight * 0.18, 1);
        setProgress(clamp((startLine - rect.top) / travel));
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const lineOneActivation = easeOutQuint(clamp((progress - 0.24) / 0.72));
  const textFloat = easeOutCubic(clamp((progress - 0.14) / 0.76));
  const textLift = mix(52, 0, textFloat);
  const textScale = mix(0.945, 1, easeOutCubic(clamp((progress - 0.16) / 0.9)));
  const textWidth = isNarrow ? "min(80vw, 22rem)" : "min(62vw, 52rem)";

  const lineOneGray = mix(224, 16, lineOneActivation);
  const lineOneBlur = mix(10, 0, lineOneActivation);
  const lineOneSpacing = mix(0.01, -0.05, lineOneActivation);

  const dots = getResponsiveDots(isNarrow);

  return (
    <section
      ref={sectionRef}
      id="obsidian-focus"
      className="relative z-20 h-[24svh] bg-white text-[#101319] md:h-[24vh]"
    >
      <div className="relative h-full overflow-hidden bg-white">
        <div className="relative mx-auto h-full w-full max-w-[1680px]">
          {dots.map((dot) => {
            const isVertical = dot.motion === "top" || dot.motion === "bottom";
            const revealWindow = isVertical ? 0.88 : 0.82;
            const revealStart = isVertical
              ? dot.motion === "top"
                ? 0.14
                : 0.2
              : dot.id.includes("outer")
                ? 0.16
                : 0.22;
            const reveal = easeOutQuad(clamp((progress - revealStart) / revealWindow));
            const size = dot.size ?? 4.8;
            const opacity =
              isVertical
                ? 0.78
                : mix(0.42, 0.82, reveal);

            return (
              <div
                key={dot.id}
                className="absolute rounded-full bg-[#101319]"
                aria-hidden="true"
                style={{
                  left: `${mix(dot.fromX, dot.x, reveal)}%`,
                  top: `${mix(dot.fromY, dot.y, reveal)}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  opacity,
                  transform: `translate3d(-50%, -50%, 0) scale(${mix(0.58, 1, reveal)})`,
                  filter: `blur(${mix(1.6, 0, reveal)}px)`,
                }}
              />
            );
          })}

          <div className="absolute inset-x-0 top-[48%] flex -translate-y-1/2 justify-center px-6">
            <div
              className="flex flex-col items-center text-center"
              style={{
                width: textWidth,
                transform: `translate3d(0, ${textLift}px, 0) scale(${textScale})`,
              }}
            >
              <h2
                className="m-0 font-[680] leading-[0.92] text-[clamp(2rem,4vw,4.1rem)]"
                style={{
                  color: toGray(lineOneGray),
                  filter: `blur(${lineOneBlur}px)`,
                  letterSpacing: `${lineOneSpacing}em`,
                  fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
                }}
              >
                What I&apos;m Busying
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
