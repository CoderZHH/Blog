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

function easeOutQuint(value: number) {
  return 1 - Math.pow(1 - value, 5);
}

function easeOutExpo(value: number) {
  if (value <= 0) {
    return 0;
  }

  if (value >= 1) {
    return 1;
  }

  return 1 - Math.pow(2, -10 * value);
}

function toGray(value: number) {
  const channel = Math.round(value);
  return `rgb(${channel}, ${channel}, ${channel})`;
}

function getResponsiveDots(isNarrow: boolean) {
  const outerLeft = isNarrow ? 4.8 : 4.4;
  const innerLeft = isNarrow ? 14.8 : 14.2;
  const innerRight = 100 - innerLeft;
  const outerRight = 100 - outerLeft;
  const topRow = isNarrow ? 25.5 : 26;
  const middleRow = isNarrow ? 40.5 : 41;
  const bottomRow = isNarrow ? 55.5 : 56;
  const topCenter = isNarrow ? 12.6 : 13;
  const bottomCenter = isNarrow ? 69.2 : 69.5;

  const leftDots: GridDot[] = [
    { id: "left-outer-top", motion: "left", x: outerLeft, y: topRow, fromX: -20, fromY: topRow - 2.4 },
    { id: "left-inner-top", motion: "left", x: innerLeft, y: topRow, fromX: -10.5, fromY: topRow - 0.8 },
    { id: "left-outer-middle", motion: "left", x: outerLeft, y: middleRow, fromX: -20, fromY: middleRow },
    { id: "left-inner-middle", motion: "left", x: innerLeft, y: middleRow, fromX: -10.5, fromY: middleRow },
    { id: "left-inner-bottom", motion: "left", x: innerLeft, y: bottomRow, fromX: -10.5, fromY: bottomRow + 0.8 },
    { id: "left-outer-bottom", motion: "left", x: outerLeft, y: bottomRow, fromX: -20, fromY: bottomRow + 2.4 },
  ];

  const rightDots: GridDot[] = [
    { id: "right-inner-top", motion: "right", x: innerRight, y: topRow, fromX: 110.5, fromY: topRow - 0.8 },
    { id: "right-outer-top", motion: "right", x: outerRight, y: topRow, fromX: 120, fromY: topRow - 2.4 },
    { id: "right-inner-middle", motion: "right", x: innerRight, y: middleRow, fromX: 110.5, fromY: middleRow },
    { id: "right-outer-middle", motion: "right", x: outerRight, y: middleRow, fromX: 120, fromY: middleRow },
    { id: "right-inner-bottom", motion: "right", x: innerRight, y: bottomRow, fromX: 110.5, fromY: bottomRow + 0.8 },
    { id: "right-outer-bottom", motion: "right", x: outerRight, y: bottomRow, fromX: 120, fromY: bottomRow + 2.4 },
  ];

  const verticalDots: GridDot[] = [
    { id: "top-center", motion: "top", x: 50, y: topCenter, fromX: 50, fromY: -12, size: 3.4 },
    { id: "bottom-center", motion: "bottom", x: 50, y: bottomCenter, fromX: 50, fromY: 112, size: 3.4 },
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
        const startLine = viewportHeight * 0.92;
        const travel = Math.max(rect.height - viewportHeight * 0.18, 1);
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

  const lineOneActivation = easeOutQuint(clamp((progress - 0.02) / 0.18));
  const obsidianActivation = easeOutQuint(clamp((progress - 0.18) / 0.22));
  const noteActivation = easeOutQuint(clamp((progress - 0.4) / 0.24));
  const textLift = mix(12, 0, easeOutCubic(progress));
  const textScale = mix(0.996, 1, easeOutCubic(progress));
  const textWidth = isNarrow ? "min(86vw, 33rem)" : "min(72vw, 56rem)";

  const lineOneGray = mix(224, 16, lineOneActivation);
  const obsidianGray = mix(232, 16, obsidianActivation);
  const noteGray = mix(234, 16, noteActivation);
  const lineOneBlur = mix(2.6, 0, lineOneActivation);
  const obsidianBlur = mix(2.8, 0, obsidianActivation);
  const noteBlur = mix(3, 0, noteActivation);
  const lineOneSpacing = mix(-0.018, -0.055, lineOneActivation);
  const lineTwoSpacing = mix(-0.01, -0.065, Math.max(obsidianActivation, noteActivation * 0.82));

  const dots = getResponsiveDots(isNarrow);

  return (
    <section
      ref={sectionRef}
      id="obsidian-focus"
      className="relative z-20 h-[138vh] bg-white text-[#101319] md:h-[152vh]"
    >
      <div className="sticky top-[6vh] h-[76vh] overflow-hidden bg-white md:top-[7vh] md:h-[80vh]">
        <div className="relative mx-auto h-full w-full max-w-[1680px]">
          {dots.map((dot) => {
            const revealWindow = dot.motion === "top" || dot.motion === "bottom" ? 0.34 : 0.4;
            const revealStart = dot.motion === "top" || dot.motion === "bottom" ? 0.04 : 0.08;
            const reveal = easeOutExpo(clamp((progress - revealStart) / revealWindow));
            const size = dot.size ?? 3;

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
                  opacity: mix(0.52, 0.82, reveal),
                  transform: `translate3d(-50%, -50%, 0) scale(${mix(0.92, 1, reveal)})`,
                  filter: `blur(${mix(0.8, 0, reveal)}px)`,
                }}
              />
            );
          })}

          <div className="absolute inset-x-0 top-[22%] flex justify-center px-6 md:top-[21%]">
            <div
              className="flex flex-col items-center text-center"
              style={{
                width: textWidth,
                transform: `translate3d(0, ${textLift}px, 0) scale(${textScale})`,
              }}
            >
              <h2
                className="m-0 font-[650] leading-[0.94] text-[clamp(2.4rem,5.8vw,5.9rem)]"
                style={{
                  color: toGray(lineOneGray),
                  filter: `blur(${lineOneBlur}px)`,
                  letterSpacing: `${lineOneSpacing}em`,
                  fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
                }}
              >
                What I&apos;m Busying
              </h2>

              <p
                className="mt-4 mb-0 text-[clamp(2rem,5vw,5rem)] font-[540] leading-[0.96] md:mt-5"
                style={{
                  letterSpacing: `${lineTwoSpacing}em`,
                  fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
                }}
              >
                <span
                  className="inline-block"
                  style={{
                    color: toGray(obsidianGray),
                    filter: `blur(${obsidianBlur}px)`,
                  }}
                >
                  Obsidian
                </span>
                <span
                  className="inline-block"
                  style={{
                    color: toGray(noteGray),
                    filter: `blur(${noteBlur}px)`,
                  }}
                >
                  Note
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
