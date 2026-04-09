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

const MACBOOK_KEYS = Array.from({ length: 44 }, (_, index) => index);

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
  const titleFontSize = clamp(viewportWidth * 0.092, 12, 112);
  const subtitleFontSize = clamp(viewportWidth * 0.013, 4, 19);
  const captionFontSize = clamp(viewportWidth * 0.008, 3, 12);

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
          className="m-0 max-w-[96%] font-sans leading-[0.88] text-white"
          aria-label={`${work.titleLineOne} ${work.titleLineTwo}`}
          style={{
            fontFamily:
              '"Inter", "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontSize: `${titleFontSize}px`,
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
          className="m-0 font-medium leading-tight tracking-[0.24em] text-white will-change-transform"
          style={{
            fontSize: `${subtitleFontSize}px`,
            transform: `translate3d(${splitOffset}px, 0, 0)`,
            textShadow:
              "0 12px 36px rgba(5,14,34,0.3), 0 4px 18px rgba(92,132,190,0.18), 0 0 22px rgba(255,255,255,0.08)",
          }}
        >
          {work.subtitleLineOne}
        </p>
        <p
          className="m-0 mt-3 font-normal uppercase leading-tight tracking-[0.42em] text-white/68 will-change-transform"
          style={{
            fontSize: `${captionFontSize}px`,
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
  const [isMacbookActive, setIsMacbookActive] = useState(false);
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

        const isNarrowViewport = window.innerWidth < 768;
        const maxStageWidth = Math.min(window.innerWidth * (isNarrowViewport ? 0.94 : 0.94), 1880);
        const maxStageHeight = viewportHeight * (isNarrowViewport ? 0.76 : 0.92);
        const nextStageWidth = Math.min(maxStageWidth, maxStageHeight * (16 / 9));

        setIsNarrow(isNarrowViewport);
        setStageWidth(nextStageWidth);
        setStageHeight(nextStageWidth * (9 / 16));

        if (!section) {
          setProgress(0);
          return;
        }

        const rect = section.getBoundingClientRect();
        if (rect.top < viewportHeight * 0.86 && rect.bottom > 0) {
          setIsMacbookActive(true);
        }

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

  const rotateProgress = easeInOutCubic(clamp((progress - 0.02) / 0.26));
  const loadProgress = rotateProgress;
  const revealProgress = easeOutCubic(clamp((progress - 0.3) / 0.06));
  const screenRevealProgress = revealProgress;
  const workProgress = clamp((progress - 0.36) / 0.64);
  const firstPanelProgress = clamp(workProgress / 0.38);
  const trackProgress = easeInOutCubic(clamp((workProgress - 0.38) / 0.24));
  const secondPanelProgress = clamp((workProgress - 0.62) / 0.38);
  const macbookUnit = Math.min(stageWidth * 0.78 / 228, stageHeight * 0.9 / 260);
  const frameWidthEm = 128 + 54 * rotateProgress;
  const frameHeightEm = 116 + 0.5 * rotateProgress;
  const displayLeftEm = 12 - 9 * rotateProgress;
  const displayTopEm = 17 - 14 * rotateProgress;
  const displayWidthEm = 116 + 60 * rotateProgress;
  const displayHeightEm = 98 + 12.5 * rotateProgress;
  const displayWidth = displayWidthEm * macbookUnit;
  const displayHeight = displayHeightEm * macbookUnit;
  const targetFrontScale = Math.max(
    1,
    Math.min((stageWidth * 0.98) / Math.max(displayWidth, 1), (stageHeight * 0.96) / Math.max(displayHeight, 1))
  );
  const frontScale = 1 + rotateProgress * (targetFrontScale - 1);
  const screenRadiusPx = 6 * macbookUnit * (1 - rotateProgress) + 8 * rotateProgress;
  const screenRadiusEm = screenRadiusPx / Math.max(macbookUnit * frontScale, 1);
  const displayCenterXFromMacbookCenter = (114 - displayLeftEm - displayWidthEm / 2) * macbookUnit;
  const displayCenterYFromMacbookCenter = (130 - 34 - displayTopEm - displayHeightEm / 2) * macbookUnit;
  const centerCorrection = frontScale + rotateProgress - 1;
  const overlayWidth = displayWidth * frontScale;
  const overlayHeight = displayHeight * frontScale;
  const macbookTransform = [
    "perspective(1600px)",
    `translate3d(${displayCenterXFromMacbookCenter * centerCorrection}px, ${
      displayCenterYFromMacbookCenter * centerCorrection
    }px, 0)`,
    `scale(${frontScale})`,
  ].join(" ");
  const keyboardOpacity = 1 - clamp((rotateProgress - 0.04) / 0.38);

  return (
    <section ref={sectionRef} id="work" className="relative h-[680vh] bg-white text-white">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-[#f5f6f8] px-4 py-8 md:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.96)_0%,rgba(247,248,250,0.94)_26%,rgba(239,241,245,0.86)_56%,rgba(229,233,238,0.78)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(214,220,228,0.14)_0%,rgba(245,247,250,0)_18%,rgba(245,247,250,0)_82%,rgba(214,220,228,0.14)_100%)]" />
        <div
          className="portfolio-macbook-stage"
          style={
            {
              width: `${stageWidth}px`,
              height: `${stageHeight}px`,
              "--mac-u": `${macbookUnit}px`,
            } as CSSProperties
          }
        >
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: `${stageWidth * (isNarrow ? 0.72 : 0.62)}px`,
              height: `${stageHeight * (isNarrow ? 0.58 : 0.48)}px`,
              background:
                "radial-gradient(circle, rgba(220,228,238,0.52) 0%, rgba(232,238,245,0.26) 42%, rgba(245,247,250,0) 76%)",
              filter: `blur(${48 * macbookUnit}px)`,
              opacity: 0.92 - rotateProgress * 0.24,
            }}
          />
          <div
            className="pointer-events-none absolute left-1/2 top-[74%] z-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: `${stageWidth * (isNarrow ? 0.54 : 0.38)}px`,
              height: `${stageHeight * (isNarrow ? 0.14 : 0.12)}px`,
              background:
                "radial-gradient(circle, rgba(65,76,92,0.18) 0%, rgba(90,102,118,0.1) 34%, rgba(140,152,166,0.04) 58%, rgba(245,247,250,0) 82%)",
              filter: `blur(${26 * macbookUnit}px)`,
              opacity: 0.58 + rotateProgress * 0.12,
              transform: `translate(-50%, -50%) scale(${1 + rotateProgress * 0.28})`,
            }}
          />
          <div className={`portfolio-macbook-scope ${isMacbookActive ? "is-active" : ""}`}>
            <div className="container">
              <div
                className="macbook"
                style={
                  {
                    "--macbook-transform": macbookTransform,
                    "--screen-skew": `${-30 * (1 - rotateProgress)}deg`,
                    "--under-rotate": `${-30 * (1 - rotateProgress)}deg`,
                    "--under-skew": `${30 * (1 - rotateProgress)}deg`,
                    "--under-opacity": keyboardOpacity,
                    "--frame-width": `${frameWidthEm}em`,
                    "--frame-height": `${frameHeightEm}em`,
                    "--frame-inset-x": `${6 * (1 - rotateProgress)}em`,
                    "--frame-inset-y": `${8 * (1 - rotateProgress)}em`,
                    "--silver-opacity": 1 - rotateProgress,
                    "--display-left": `${displayLeftEm}em`,
                    "--display-top": `${displayTopEm}em`,
                    "--display-width": `${displayWidthEm}em`,
                    "--display-height": `${displayHeightEm}em`,
                    "--screen-radius": `${screenRadiusEm}em`,
                    "--screen-glare-opacity": 1 - rotateProgress,
                  } as CSSProperties
                }
              >
                <div className="macbook__topBord">
                  <div className="macbook__display">
                    <div
                      className="macbook__load"
                      style={
                        {
                          "--load-progress": loadProgress,
                          opacity: 1 - revealProgress,
                        } as CSSProperties
                      }
                    />
                  </div>
                </div>
                <div className="macbook__underBord">
                  <div className="macbook__keybord">
                    <div className="keybord">
                      <div className="keybord__touchbar" />
                      <ul className="keybord__keyBox">
                        {MACBOOK_KEYS.slice(0, 13).map((key) => (
                          <li key={key} className={`keybord__key key--${String(key + 1).padStart(2, "0")}`} />
                        ))}
                      </ul>
                      <ul className="keybord__keyBox--under">
                        {MACBOOK_KEYS.slice(13, 24).map((key) => (
                          <li key={key} className={`keybord__key key--${String(key + 1).padStart(2, "0")}`} />
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="portfolio-screen-overlay"
            style={{
              left: `${(stageWidth - overlayWidth) / 2}px`,
              top: `${(stageHeight - overlayHeight) / 2}px`,
              width: `${overlayWidth}px`,
              height: `${overlayHeight}px`,
              opacity: rotateProgress > 0.98 ? screenRevealProgress : 0,
              borderRadius: `${screenRadiusPx}px`,
            }}
          >
            <div
              className="pointer-events-none absolute left-1/2 top-[2%] z-20 -translate-x-1/2 bg-[linear-gradient(100deg,#ffffff_0%,#d7f4ff_42%,#8fcfff_100%)] bg-clip-text font-sans text-[clamp(0.52rem,0.68vw,0.72rem)] font-semibold uppercase tracking-[0.44em] text-transparent"
              style={{
                fontFamily:
                  '"Inter", "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                textShadow: "0 0 18px rgba(143,207,255,0.28), 0 8px 28px rgba(5,14,34,0.24)",
                opacity: screenRevealProgress,
              }}
            >
              CHAPTER 02
            </div>
            <div
              className="portfolio-screen-content"
              style={{
                transform: `translate3d(${-trackProgress * 100}%, 0, 0) scale(${
                  0.985 + screenRevealProgress * 0.015
                })`,
              }}
            >
              <PortfolioWorkPanel
                index={0}
                isNarrow={isNarrow}
                progress={firstPanelProgress}
                viewportHeight={overlayHeight}
                viewportWidth={overlayWidth}
                work={WORKS[0]}
              />
              <PortfolioWorkPanel
                index={1}
                isNarrow={isNarrow}
                progress={secondPanelProgress}
                viewportHeight={overlayHeight}
                viewportWidth={overlayWidth}
                work={WORKS[1]}
              />
            </div>
          </div>
        </div>
        <style>{`
          .portfolio-macbook-stage {
            position: relative;
            max-width: 100%;
            max-height: 100%;
          }

          .portfolio-macbook-scope {
            position: absolute;
            inset: 0;
            z-index: 1;
          }

          .portfolio-macbook-scope .container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
          }

          .portfolio-macbook-scope .macbook {
            position: relative;
            width: 228em;
            height: 260em;
            font-size: var(--mac-u);
            transform: var(--macbook-transform);
            transform-origin: center center;
            will-change: transform;
          }

          .portfolio-macbook-scope .macbook__topBord {
            position: absolute;
            z-index: 2;
            top: 34em;
            left: 0;
            width: var(--frame-width);
            height: var(--frame-height);
            border-radius: 6em;
            transform-origin: center;
            background: linear-gradient(-135deg, #c8c9c9 52%, #8c8c8c 56%);
            transform: scale(0) skewY(var(--screen-skew));
            box-shadow: 0 28em 58em rgba(15, 23, 42, 0.2);
          }

          .portfolio-macbook-scope.is-active .macbook__topBord {
            animation: portfolio-topbord 0.4s 1.7s ease-out forwards;
          }

          .portfolio-macbook-scope .macbook__topBord::before {
            content: "";
            position: absolute;
            z-index: 2;
            top: var(--frame-inset-y);
            left: var(--frame-inset-x);
            width: 100%;
            height: 100%;
            border-radius: var(--screen-radius);
            background: #000;
          }

          .portfolio-macbook-scope .macbook__topBord::after {
            content: "";
            position: absolute;
            z-index: 1;
            bottom: -7em;
            left: 8em;
            width: 168em;
            height: 12em;
            transform-origin: left bottom;
            transform: rotate(-42deg) skew(-4deg);
            background: linear-gradient(-135deg, #c8c9c9 52%, #8c8c8c 56%);
            opacity: var(--silver-opacity);
          }

          .portfolio-macbook-scope .macbook__display {
            position: absolute;
            top: var(--display-top);
            left: var(--display-left);
            z-index: 3;
            width: var(--display-width);
            height: var(--display-height);
            overflow: hidden;
            border-radius: var(--screen-radius);
            background: #000;
          }

          .portfolio-macbook-scope .macbook__display::before {
            content: "";
            position: absolute;
            z-index: 30;
            top: -9em;
            left: -6em;
            width: calc(100% + 12em);
            height: calc(100% + 18em);
            border-radius: 6em;
            background: linear-gradient(
              60deg,
              rgba(255, 255, 255, 0) 60%,
              rgba(255, 255, 255, 0.24) 60%
            );
            opacity: var(--screen-glare-opacity);
            pointer-events: none;
          }

          .portfolio-screen-content {
            position: absolute;
            inset: 0;
            z-index: 1;
            display: flex;
            height: 100%;
            width: 100%;
            will-change: transform, opacity;
            transform-origin: center;
          }

          .portfolio-screen-overlay {
            position: absolute;
            z-index: 2;
            overflow: hidden;
            background: #050914;
            pointer-events: none;
            will-change: left, top, width, height, opacity;
          }

          .portfolio-screen-overlay::before {
            content: none;
            position: absolute;
            inset: 0;
            z-index: 30;
            background: linear-gradient(
              60deg,
              rgba(255, 255, 255, 0) 60%,
              rgba(255, 255, 255, 0.18) 60%
            );
            pointer-events: none;
          }

          .portfolio-macbook-scope .macbook__load {
            position: absolute;
            inset: 0;
            z-index: 20;
            width: 100%;
            height: 100%;
            background: #222;
            pointer-events: none;
            --load-progress: 0;
          }

          .portfolio-macbook-scope .macbook__load::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            width: 80em;
            height: 6em;
            border-radius: 3em;
            box-sizing: border-box;
            border: solid 1em #fff;
          }

          .portfolio-macbook-scope .macbook__load::after {
            content: "";
            position: absolute;
            top: 0;
            left: 18em;
            bottom: 0;
            margin: auto;
            width: calc(80em * var(--load-progress));
            height: 6em;
            border-radius: 3em;
            background: #fff;
          }

          .portfolio-macbook-scope .macbook__underBord {
            position: relative;
            left: 42em;
            bottom: -145em;
            width: 150em;
            height: 90em;
            border-radius: 6em;
            transform-origin: center;
            transform: scale(0) rotate(var(--under-rotate)) skew(var(--under-skew));
            background: linear-gradient(-45deg, #c8c9c9 61%, #8c8c8c 66%);
            opacity: 0;
          }

          .portfolio-macbook-scope.is-active .macbook__underBord {
            animation: portfolio-modal 0.5s 1s ease-out forwards;
          }

          .portfolio-macbook-scope .macbook__underBord::before {
            content: "";
            position: absolute;
            z-index: 3;
            top: -8em;
            left: 8em;
            width: 100%;
            height: 100%;
            border-radius: 6em;
            background: #dcdede;
          }

          .portfolio-macbook-scope .macbook__underBord::after {
            content: "";
            position: absolute;
            z-index: 2;
            top: -8em;
            left: 12em;
            width: 170em;
            height: 15em;
            transform-origin: top left;
            background: linear-gradient(-45deg, #c8c9c9 61%, #8c8c8c 66%);
            transform: rotate(31deg) skew(-16deg);
          }

          .portfolio-macbook-scope .macbook__keybord {
            position: relative;
            top: 0;
            left: 16em;
            z-index: 3;
            border-radius: 3em;
            width: calc(100% - 16em);
            height: 45em;
            background: #c8c9c9;
          }

          .portfolio-macbook-scope .macbook__keybord::before {
            content: "";
            position: absolute;
            bottom: -30em;
            left: 0;
            right: 0;
            margin: 0 auto;
            width: 40em;
            height: 25em;
            border-radius: 3em;
            background: #c8c9c9;
          }

          .portfolio-macbook-scope .keybord {
            position: relative;
            top: 2em;
            left: 2em;
            display: flex;
            flex-direction: column;
            width: calc(100% - 3em);
            height: calc(100% - 4em);
          }

          .portfolio-macbook-scope .keybord__touchbar {
            width: 100%;
            height: 6em;
            border-radius: 3em;
            background: #000;
          }

          .portfolio-macbook-scope .keybord__keyBox {
            display: grid;
            grid-template-rows: 3fr 1fr;
            grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
            width: 100%;
            height: 24em;
            margin: 1em 0 0 0;
            padding: 0 0 0 1em;
            box-sizing: border-box;
            list-style: none;
          }

          .portfolio-macbook-scope .keybord__keyBox--under {
            margin: 0;
            padding: 0 0 0 1em;
            box-sizing: border-box;
            list-style: none;
            display: flex;
          }

          .portfolio-macbook-scope .keybord__key {
            position: relative;
            width: 8em;
            height: 7em;
            margin: 1em;
            background: #000;
          }

          .portfolio-macbook-scope .keybord__keyBox .keybord__key {
            transform: translate(60em, -60em);
            opacity: 0;
          }

          .portfolio-macbook-scope.is-active .keybord__keyBox .keybord__key {
            animation: portfolio-key 0.2s 1.4s ease-out forwards;
          }

          .portfolio-macbook-scope .keybord__keyBox .keybord__key::before,
          .portfolio-macbook-scope .keybord__keyBox .keybord__key::after {
            content: "";
            position: absolute;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
          }

          .portfolio-macbook-scope .keybord__key::before {
            top: 8em;
            transform: translate(20em, -20em);
          }

          .portfolio-macbook-scope .keybord__key::after {
            top: 16em;
            transform: translate(40em, -40em);
          }

          .portfolio-macbook-scope.is-active .keybord__key::before {
            animation: portfolio-key1 0.2s 1.5s ease-out forwards;
          }

          .portfolio-macbook-scope.is-active .keybord__key::after {
            animation: portfolio-key2 0.2s 1.6s ease-out forwards;
          }

          .portfolio-macbook-scope .keybord__keyBox--under .keybord__key {
            transform: translate(80em, -80em);
            opacity: 0;
          }

          .portfolio-macbook-scope.is-active .keybord__keyBox--under .keybord__key {
            animation: portfolio-key3 0.3s 1.6s linear forwards;
          }

          .portfolio-macbook-scope .key--01 {
            grid-row: 1 / 2;
            grid-column: 1 / 2;
          }

          .portfolio-macbook-scope .key--02 {
            grid-row: 1 / 2;
            grid-column: 2 / 3;
          }

          .portfolio-macbook-scope .key--03 {
            grid-row: 1 / 2;
            grid-column: 3 / 4;
          }

          .portfolio-macbook-scope .key--04 {
            grid-row: 1 / 2;
            grid-column: 4 / 5;
          }

          .portfolio-macbook-scope .key--05 {
            grid-row: 1 / 2;
            grid-column: 5 / 6;
          }

          .portfolio-macbook-scope .key--06 {
            grid-row: 1 / 2;
            grid-column: 6 / 7;
          }

          .portfolio-macbook-scope .key--07 {
            grid-row: 1 / 2;
            grid-column: 7 / 8;
          }

          .portfolio-macbook-scope .key--08 {
            grid-row: 1 / 2;
            grid-column: 8 / 9;
          }

          .portfolio-macbook-scope .key--09 {
            grid-row: 1 / 2;
            grid-column: 9 / 10;
          }

          .portfolio-macbook-scope .key--10 {
            grid-row: 1 / 2;
            grid-column: 10 / 11;
          }

          .portfolio-macbook-scope .key--11 {
            grid-row: 1 / 2;
            grid-column: 11 / 12;
          }

          .portfolio-macbook-scope .key--12 {
            grid-row: 1 / 2;
            grid-column: 12 / 13;
          }

          .portfolio-macbook-scope .key--13 {
            grid-row: 1 / 2;
            grid-column: 13 / 14;
          }

          .portfolio-macbook-scope .keybord__keyBox .key--12::before {
            width: 10em;
          }

          .portfolio-macbook-scope .keybord__keyBox .key--13::before {
            height: 10em;
          }

          .portfolio-macbook-scope .key--19 {
            width: 28em;
          }

          @keyframes portfolio-topbord {
            0% {
              transform: scale(0) skewY(var(--screen-skew));
            }
            30% {
              transform: scale(1.1) skewY(var(--screen-skew));
            }
            45% {
              transform: scale(0.9) skewY(var(--screen-skew));
            }
            60% {
              transform: scale(1.05) skewY(var(--screen-skew));
            }
            75% {
              transform: scale(0.95) skewY(var(--screen-skew));
            }
            90% {
              transform: scale(1.02) skewY(var(--screen-skew));
            }
            100% {
              transform: scale(1) skewY(var(--screen-skew));
            }
          }

          @keyframes portfolio-modal {
            0% {
              transform: scale(0) rotate(var(--under-rotate)) skew(var(--under-skew));
              opacity: 0;
            }
            30% {
              transform: scale(1.1) rotate(var(--under-rotate)) skew(var(--under-skew));
              opacity: var(--under-opacity);
            }
            45% {
              transform: scale(0.9) rotate(var(--under-rotate)) skew(var(--under-skew));
              opacity: var(--under-opacity);
            }
            60% {
              transform: scale(1.05) rotate(var(--under-rotate)) skew(var(--under-skew));
              opacity: var(--under-opacity);
            }
            75% {
              transform: scale(0.95) rotate(var(--under-rotate)) skew(var(--under-skew));
              opacity: var(--under-opacity);
            }
            90% {
              transform: scale(1.02) rotate(var(--under-rotate)) skew(var(--under-skew));
              opacity: var(--under-opacity);
            }
            100% {
              transform: scale(1) rotate(var(--under-rotate)) skew(var(--under-skew));
              opacity: var(--under-opacity);
            }
          }

          @keyframes portfolio-key {
            0% {
              transform: translate(60em, -60em);
              opacity: 0;
            }
            100% {
              transform: translate(0, 0);
              opacity: 1;
            }
          }

          @keyframes portfolio-key1 {
            0% {
              transform: translate(20em, -20em);
              opacity: 0;
            }
            100% {
              transform: translate(0, 0);
              opacity: 1;
            }
          }

          @keyframes portfolio-key2 {
            0% {
              transform: translate(40em, -40em);
              opacity: 0;
            }
            100% {
              transform: translate(0, 0);
              opacity: 1;
            }
          }

          @keyframes portfolio-key3 {
            0% {
              transform: translate(80em, -80em);
              opacity: 0;
            }
            100% {
              transform: translate(0, 0);
              opacity: 1;
            }
          }

        `}</style>
      </div>
    </section>
  );
}
