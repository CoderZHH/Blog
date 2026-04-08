"use client";

import Image from "next/image";
import { type CSSProperties, useEffect, useRef, useState } from "react";

type PortfolioWork = {
  id: string;
  label: string;
  heroSrc: string;
  mainSrc: string;
  mainAspect: string;
  mainRatio: number;
  titleLineOne: string;
  titleLineTwo: string;
  subtitleLineOne: string;
  subtitleLineTwo: string;
};

const WORKS: PortfolioWork[] = [
  {
    id: "finai",
    label: "FINAI",
    heroSrc: "/masterpiece/FINAIHERO.png",
    mainSrc: "/masterpiece/FINAIMAIN.png",
    mainAspect: "2704 / 1520",
    mainRatio: 2704 / 1520,
    titleLineOne: "FINAI",
    titleLineTwo: "LLM驱动的智能投研平台",
    subtitleLineOne: "快速配置模型和提示词",
    subtitleLineTwo: "实时盯盘->交易决策->结果分析",
  },
  {
    id: "finflow",
    label: "FINFLOW",
    heroSrc: "/masterpiece/FINFLOWHERO.png",
    mainSrc: "/masterpiece/FINFLOWMAIN.png",
    mainAspect: "2704 / 1696",
    mainRatio: 2704 / 1696,
    titleLineOne: "FINFLOW",
    titleLineTwo: "基于Agent的量化因子挖掘工作流平台",
    subtitleLineOne: "搭建量化因子工作流",
    subtitleLineTwo: "数据处理->模型训练->回测分析",
  },
];

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function easeInOutCubic(value: number) {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

type PortfolioWorkPanelProps = {
  index: number;
  isNarrow: boolean;
  progress: number;
  viewportHeight: number;
  viewportWidth: number;
  work: PortfolioWork;
};

function PortfolioWorkPanel({
  index,
  isNarrow,
  progress,
  viewportHeight,
  viewportWidth,
  work,
}: PortfolioWorkPanelProps) {
  const cardProgress = easeOutCubic(clamp((progress - 0.04) / 0.86));
  const splitProgress = cardProgress;
  const baseCardWidth = isNarrow ? viewportWidth * 0.86 : Math.min(viewportWidth * 0.74, 980);
  const baseCardHeight = baseCardWidth / work.mainRatio;
  const initialCardScale = isNarrow ? 0.82 : 0.58;
  const maxCardScale = Math.max(
    initialCardScale,
    Math.min((viewportWidth - 2) / baseCardWidth, (viewportHeight - 2) / baseCardHeight)
  );
  const cardScale = initialCardScale + (maxCardScale - initialCardScale) * cardProgress;
  const splitDistance = viewportWidth * (isNarrow ? 1.08 : 1.15);
  const splitOffset = splitDistance * splitProgress;
  const backgroundScale = 1.045 - cardProgress * 0.025;

  return (
    <article className="relative h-full min-w-full overflow-hidden bg-[#050914]" aria-label={work.label}>
      <div
        className="absolute inset-0 z-0 will-change-transform"
        style={{ transform: `scale(${backgroundScale})` }}
      >
        <Image
          src={work.heroSrc}
          alt={`${work.label} hero background`}
          fill
          priority={index === 0}
          quality={100}
          sizes="(max-width: 768px) 94vw, 1600px"
          unoptimized
          className="object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(2,7,18,0.3)_0%,rgba(2,7,18,0.08)_42%,rgba(2,7,18,0.5)_100%)]" />
      <div className="absolute inset-0 z-[2] bg-[linear-gradient(90deg,rgba(3,8,19,0.58)_0%,rgba(3,8,19,0.08)_38%,rgba(3,8,19,0.08)_62%,rgba(3,8,19,0.58)_100%)]" />

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-5">
        <div
          className="relative w-[74%] max-w-[980px] overflow-hidden rounded-lg border border-white/14 bg-black/20 shadow-[0_24px_70px_rgba(0,0,0,0.42),0_0_34px_rgba(154,207,255,0.14)] will-change-transform max-md:w-[86%]"
          style={
            {
              aspectRatio: work.mainAspect,
              transform: `scale(${cardScale})`,
            } as CSSProperties
          }
        >
          <Image
            src={work.mainSrc}
            alt={`${work.label} main screen`}
            fill
            priority={index === 0}
            quality={100}
            sizes="(max-width: 768px) 94vw, 1600px"
            unoptimized
            className="object-cover object-center"
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4 text-center">
        <h2
          className="m-0 max-w-[96%] font-sans text-[clamp(2.25rem,8.6vw,8.4rem)] leading-[0.88] text-white"
          aria-label={`${work.titleLineOne} ${work.titleLineTwo}`}
          style={{
            fontFamily:
              '"Inter", "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          <span
            className="block font-extrabold text-white will-change-transform"
            style={{
              transform: `translate3d(${splitOffset}px, 0, 0)`,
              textShadow:
                "0 18px 58px rgba(5,14,34,0.3), 0 6px 26px rgba(92,132,190,0.18), 0 0 38px rgba(255,255,255,0.1)",
            }}
          >
            {work.titleLineOne}
          </span>
          <span
            className="mt-3 block text-[0.58em] font-medium leading-[1.06] text-[#f7fbff] will-change-transform md:mt-5"
            style={{
              transform: `translate3d(${-splitOffset}px, 0, 0)`,
              textShadow:
                "0 16px 52px rgba(5,14,34,0.28), 0 6px 24px rgba(92,132,190,0.16), 0 0 34px rgba(255,255,255,0.09)",
            }}
          >
            {work.titleLineTwo}
          </span>
        </h2>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-8 z-20 px-4 text-center text-white md:bottom-10">
        <p
          className="m-0 text-[clamp(0.92rem,1.28vw,1.18rem)] font-medium leading-tight tracking-[0.24em] text-white will-change-transform"
          style={{
            transform: `translate3d(${splitOffset}px, 0, 0)`,
            textShadow:
              "0 12px 36px rgba(5,14,34,0.3), 0 4px 18px rgba(92,132,190,0.18), 0 0 22px rgba(255,255,255,0.08)",
          }}
        >
          {work.subtitleLineOne}
        </p>
        <p
          className="m-0 mt-3 text-[clamp(0.62rem,0.78vw,0.74rem)] font-normal uppercase leading-tight tracking-[0.42em] text-white/68 will-change-transform"
          style={{
            transform: `translate3d(${-splitOffset}px, 0, 0)`,
            textShadow:
              "0 10px 30px rgba(5,14,34,0.28), 0 3px 14px rgba(92,132,190,0.14), 0 0 18px rgba(255,255,255,0.07)",
          }}
        >
          {work.subtitleLineTwo}
        </p>
      </div>
    </article>
  );
}

export function PortfolioSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [isNarrow, setIsNarrow] = useState(false);
  const [stageHeight, setStageHeight] = useState(720);
  const [stageWidth, setStageWidth] = useState(1280);

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
        setStageHeight(viewportHeight * (window.innerWidth < 768 ? 0.78 : 0.82));
        setStageWidth(Math.min(window.innerWidth * 0.94, 1600));

        if (!section) {
          setProgress(0);
          return;
        }

        const rect = section.getBoundingClientRect();
        const scrollableHeight = Math.max(rect.height - viewportHeight, 1);
        setProgress(clamp(-rect.top / scrollableHeight));
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

  const firstPanelProgress = clamp(progress / 0.38);
  const trackProgress = easeInOutCubic(clamp((progress - 0.38) / 0.24));
  const secondPanelProgress = clamp((progress - 0.62) / 0.38);

  return (
    <section ref={sectionRef} id="work" className="relative h-[520vh] bg-white text-white">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-white px-4 py-8 md:px-8">
        <div
          className="relative h-[82vh] w-[min(94vw,1600px)] overflow-hidden rounded-lg bg-[#050914] shadow-[0_32px_90px_rgba(15,23,42,0.22),0_0_0_1px_rgba(15,23,42,0.08)] max-md:h-[78vh]"
        >
          <div
            className="pointer-events-none absolute left-1/2 top-4 z-40 -translate-x-1/2 bg-[linear-gradient(100deg,#ffffff_0%,#d7f4ff_42%,#8fcfff_100%)] bg-clip-text font-sans text-[clamp(0.8rem,1vw,1rem)]  font-semibold uppercase tracking-[0.44em] text-transparent"
            style={{
              fontFamily:
                '"Inter", "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              textShadow:
                "0 0 18px rgba(143,207,255,0.28), 0 8px 28px rgba(5,14,34,0.24)",
            }}
          >
            CHAPTER 02
          </div>
          <div
            className="flex h-full w-full will-change-transform"
            style={{ transform: `translate3d(${-trackProgress * 100}%, 0, 0)` }}
          >
            <PortfolioWorkPanel
              index={0}
              isNarrow={isNarrow}
              progress={firstPanelProgress}
              viewportHeight={stageHeight}
              viewportWidth={stageWidth}
              work={WORKS[0]}
            />
            <PortfolioWorkPanel
              index={1}
              isNarrow={isNarrow}
              progress={secondPanelProgress}
              viewportHeight={stageHeight}
              viewportWidth={stageWidth}
              work={WORKS[1]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
