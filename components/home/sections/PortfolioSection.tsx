"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import { type CSSProperties, type MutableRefObject, useEffect, useRef, useState } from "react";

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

type PortfolioStageIcon = {
  id: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  floatX: number;
  floatY: number;
  duration: number;
  delay: number;
};

const IconGoogle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M21.9999 12.24C21.9999 11.4933 21.9333 10.76 21.8066 10.0533H12.3333V14.16H17.9533C17.7333 15.3467 17.0133 16.3733 15.9666 17.08V19.68H19.5266C21.1933 18.16 21.9999 15.4533 21.9999 12.24Z"
      fill="#4285F4"
    />
    <path
      d="M12.3333 22C15.2333 22 17.6866 21.0533 19.5266 19.68L15.9666 17.08C15.0199 17.7333 13.7933 18.16 12.3333 18.16C9.52659 18.16 7.14659 16.28 6.27992 13.84H2.59326V16.5133C4.38659 20.0267 8.05992 22 12.3333 22Z"
      fill="#34A853"
    />
    <path
      d="M6.2799 13.84C6.07324 13.2267 5.9599 12.58 5.9599 11.92C5.9599 11.26 6.07324 10.6133 6.2799 10L2.59326 7.32667C1.86659 8.78667 1.45326 10.32 1.45326 11.92C1.45326 13.52 1.86659 15.0533 2.59326 16.5133L6.2799 13.84Z"
      fill="#FBBC05"
    />
    <path
      d="M12.3333 5.68C13.8933 5.68 15.3133 6.22667 16.3866 7.24L19.6 4.02667C17.68 2.29333 15.2266 1.33333 12.3333 1.33333C8.05992 1.33333 4.38659 3.97333 2.59326 7.32667L6.27992 10C7.14659 7.56 9.52659 5.68 12.3333 5.68Z"
      fill="#EA4335"
    />
  </svg>
);

const IconGitHub = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const IconMicrosoft = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.4 2H2v9.4h9.4V2Z" fill="#F25022" />
    <path d="M22 2h-9.4v9.4H22V2Z" fill="#7FBA00" />
    <path d="M11.4 12.6H2V22h9.4V12.6Z" fill="#00A4EF" />
    <path d="M22 12.6h-9.4V22H22V12.6Z" fill="#FFB900" />
  </svg>
);

const IconSlack = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.5 10a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" fill="#36C5F0" />
    <path d="M9 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill="#2EB67D" />
    <path d="M14 8.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" fill="#ECB22E" />
    <path d="M15.5 15a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" fill="#E01E5A" />
    <path d="M10 14h4v-1.5a1.5 1.5 0 0 0-1.5-1.5h-1a1.5 1.5 0 0 0-1.5 1.5V14Z" fill="#E01E5A" />
    <path d="M8.5 14a1.5 1.5 0 0 0 1.5 1.5h1.5v-1a1.5 1.5 0 0 0-1.5-1.5H8.5v1Z" fill="#ECB22E" />
    <path d="M15.5 10a1.5 1.5 0 0 0-1.5-1.5H12.5v4a1.5 1.5 0 0 0 1.5 1.5h1.5v-4Z" fill="#36C5F0" />
    <path d="M14 8.5a1.5 1.5 0 0 0-1.5-1.5h-1v4a1.5 1.5 0 0 0 1.5 1.5h1v-4Z" fill="#2EB67D" />
  </svg>
);

const IconDropbox = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8l-6 4 6 4 6-4-6-4z" fill="#0061FF" />
    <path d="M6 12l6 4 6-4-6-4-6 4z" fill="#007BFF" />
    <path d="M12 16l6-4-6-4-6 4 6 4z" fill="#4DA3FF" />
    <path d="M18 12l-6-4-6 4 6 4 6-4z" fill="#0061FF" />
  </svg>
);

const IconVercel = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 22h20L12 2z" />
  </svg>
);

const IconStripe = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z" fill="#635BFF" />
    <path d="M6 7H18V9H6V7Z" fill="white" />
    <path d="M6 11H18V13H6V11Z" fill="white" />
    <path d="M6 15H14V17H6V15Z" fill="white" />
  </svg>
);

const IconDiscord = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.317 4.482a1.88 1.88 0 0 0-1.635-.482C17.398 3.42 16.02 3 12 3s-5.398.42-6.682 1.001a1.88 1.88 0 0 0-1.635.483c-1.875 1.2-2.325 3.61-1.568 5.711 1.62 4.47 5.063 7.8 9.885 7.8s8.265-3.33 9.885-7.8c.757-2.1-.307-4.51-1.568-5.711Z" fill="#5865F2" />
    <path d="M8.45 13.4c-.825 0-1.5-.75-1.5-1.65s.675-1.65 1.5-1.65c.825 0 1.5.75 1.5 1.65s-.675 1.65-1.5 1.65Zm7.1 0c-.825 0-1.5-.75-1.5-1.65s.675-1.65 1.5-1.65c.825 0 1.5.75 1.5 1.65s-.675 1.65-1.5 1.65Z" fill="white" />
  </svg>
);



const IconSpotify = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.125 14.175c-.188.3-.563.413-.863.225-2.437-1.5-5.5-1.725-9.15-1.012-.338.088-.675-.15-.763-.488-.088-.337.15-.675.488-.762 3.937-.787 7.287-.525 9.975 1.125.3.187.412.562.225.862zm.9-2.7c-.225.363-.675.488-1.037.263-2.7-1.65-6.825-2.1-9.975-1.162-.413.113-.825-.15-1-.562-.15-.413.15-.825.563-1 .362-.112 3.487-.975 6.6 1.312.362.225.487.675.262 1.038v.112zm.113-2.887c-3.225-1.875-8.55-2.025-11.512-1.125-.487.15-.975-.15-1.125-.637-.15-.488.15-.975.638-1.125 3.337-.975 9.15-.787 12.825 1.312.45.263.6.825.337 1.275-.263.45-.825.6-1.275.337v-.038z" fill="#1DB954" />
  </svg>
);

const IconTwitch = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.149 0L.707 3.028v17.944h5.66v3.028h3.028l3.028-3.028h4.243l7.07-7.07V0H2.15zm19.799 13.434l-3.535 3.535h-4.95l-3.029 3.029v-3.03H5.14V1.414h16.808v12.02z" fill="#9146FF" />
    <path d="M15.53 5.303h2.12v6.36h-2.12v-6.36zm-4.95 0h2.12v6.36h-2.12v-6.36z" fill="#9146FF" />
  </svg>
);

const IconLinear = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="portfolio-linear-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5E5CE6" />
        <stop offset="100%" stopColor="#2C2C2C" />
      </linearGradient>
    </defs>
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-4 9h8v2H8v-2z" fill="url(#portfolio-linear-grad)" />
  </svg>
);

const IconYouTube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.582 6.186A2.482 2.482 0 0 0 19.82 4.42C18.1 4 12 4 12 4s-6.1 0-7.82.42c-.98.26-1.74.98-1.762 1.766C2 7.94 2 12 2 12s0 4.06.418 5.814c.022.786.782 1.506 1.762 1.766C6.1 20 12 20 12 20s6.1 0 7.82-.42c.98-.26 1.74-.98 1.762-1.766C22 16.06 22 12 22 12s0-4.06-.418-5.814zM9.75 15.5V8.5L15.75 12 9.75 15.5z" fill="#FF0000" />
  </svg>
);

const IconFigma = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2z" fill="#2C2C2C" />
    <path d="M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5V7z" fill="#0ACF83" />
    <path d="M12 12a5 5 0 0 1-5-5 5 5 0 0 1 5-5v10z" fill="#A259FF" />
    <path d="M12 17a5 5 0 0 1-5-5h10a5 5 0 0 1-5 5z" fill="#F24E1E" />
    <path d="M7 12a5 5 0 0 1 5 5v-5H7z" fill="#FF7262" />
  </svg>
);

const PORTFOLIO_STAGE_ICONS: PortfolioStageIcon[] = [
  { id: "google", icon: IconGoogle, x: 14, y: 15, scale: 1.04, rotation: -5, floatX: 10, floatY: 12, duration: 9.8, delay: 0.2 },
  { id: "github", icon: IconGitHub, x: 33, y: 10, scale: 0.96, rotation: 4, floatX: 9, floatY: 10, duration: 10.4, delay: 1.1 },
  { id: "linear", icon: IconLinear, x: 69, y: 10, scale: 0.88, rotation: -3, floatX: 8, floatY: 10, duration: 9.1, delay: 0.8 },
  { id: "slack", icon: IconSlack, x: 80, y: 11, scale: 0.88, rotation: 3, floatX: 10, floatY: 9, duration: 10.9, delay: 1.9 },
  { id: "dropbox", icon: IconDropbox, x: 92, y: 28, scale: 0.92, rotation: -5, floatX: 9, floatY: 12, duration: 9.6, delay: 2.8 },
  { id: "stripe", icon: IconStripe, x: 78, y: 46, scale: 1.02, rotation: 2, floatX: 8, floatY: 11, duration: 9.9, delay: 1.4 },
  { id: "discord", icon: IconDiscord, x: 73, y: 82, scale: 1, rotation: -4, floatX: 9, floatY: 12, duration: 10.5, delay: 0.5 },
  { id: "figma", icon: IconFigma, x: 89, y: 82, scale: 0.96, rotation: 5, floatX: 8, floatY: 10, duration: 11.2, delay: 3.1 },
  { id: "spotify", icon: IconSpotify, x: 8, y: 61, scale: 1.02, rotation: -4, floatX: 9, floatY: 11, duration: 10.8, delay: 1.7 },
  { id: "microsoft", icon: IconMicrosoft, x: 15, y: 91, scale: 1, rotation: 3, floatX: 10, floatY: 12, duration: 10.1, delay: 2.1 },
  { id: "vercel", icon: IconVercel, x: 29, y: 91, scale: 0.9, rotation: 2, floatX: 8, floatY: 10, duration: 9.4, delay: 3 },
  { id: "twitch", icon: IconTwitch, x: 54, y: 94, scale: 0.94, rotation: -4, floatX: 8, floatY: 12, duration: 10.3, delay: 0.9 },
  { id: "youtube", icon: IconYouTube, x: 41, y: 65, scale: 0.98, rotation: 5, floatX: 10, floatY: 11, duration: 11, delay: 2.5 },
];

const MACBOOK_KEYS = Array.from({ length: 44 }, (_, index) => index);

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function mix(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function easeInOutCubic(value: number) {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function projectPointOutside(
  centerX: number,
  centerY: number,
  directionX: number,
  directionY: number,
  width: number,
  height: number,
  margin: number
) {
  const candidates = [
    directionX > 0
      ? (width + margin - centerX) / directionX
      : directionX < 0
        ? (-margin - centerX) / directionX
        : Number.POSITIVE_INFINITY,
    directionY > 0
      ? (height + margin - centerY) / directionY
      : directionY < 0
        ? (-margin - centerY) / directionY
        : Number.POSITIVE_INFINITY,
  ].filter((value) => Number.isFinite(value) && value > 0);

  const distance = candidates.length > 0 ? Math.min(...candidates) : 0;

  return {
    x: centerX + directionX * distance,
    y: centerY + directionY * distance,
  };
}

type PortfolioFloatingIconsProps = {
  stageHeight: number;
  stageWidth: number;
  introProgress: number;
  spreadProgress: number;
  screenRevealProgress: number;
  isNarrow: boolean;
  mouseX: MutableRefObject<number>;
  mouseY: MutableRefObject<number>;
};

type PortfolioFloatingIconNodeProps = {
  icon: PortfolioStageIcon;
  left: number;
  top: number;
  size: number;
  opacity: number;
  isNarrow: boolean;
  mouseX: MutableRefObject<number>;
  mouseY: MutableRefObject<number>;
};

function PortfolioFloatingIconNode({
  icon,
  left,
  top,
  size,
  opacity,
  isNarrow,
  mouseX,
  mouseY,
}: PortfolioFloatingIconNodeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 22 });
  const springY = useSpring(y, { stiffness: 300, damping: 22 });

  useEffect(() => {
    const handleMouseMove = () => {
      if (!ref.current) {
        return;
      }

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(mouseX.current - centerX, mouseY.current - centerY);

      if (distance < 150) {
        const angle = Math.atan2(mouseY.current - centerY, mouseX.current - centerX);
        const force = (1 - distance / 150) * 44;
        x.set(-Math.cos(angle) * force);
        y.set(-Math.sin(angle) * force);
        return;
      }

      x.set(0);
      y.set(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, x, y]);

  const IconSvg = icon.icon;

  return (
    <motion.div
      ref={ref}
      className="portfolio-floating-icon"
      style={{ left, top, width: size, height: size, opacity, x: springX, y: springY }}
    >
      <div
        className="portfolio-floating-icon__float"
        style={
          {
            "--float-x": `${icon.floatX * (isNarrow ? 0.8 : 1)}px`,
            "--float-y": `${icon.floatY * (isNarrow ? 0.84 : 1)}px`,
            "--icon-duration": `${icon.duration}s`,
            "--icon-delay": `${-icon.delay}s`,
            "--icon-tilt": `${mix(3, 7, icon.scale)}deg`,
          } as CSSProperties
        }
      >
        <div className="portfolio-floating-icon__card" style={{ transform: `rotate(${icon.rotation}deg)` }}>
          <IconSvg className="h-[44%] w-[44%] text-[#232936]" />
        </div>
      </div>
    </motion.div>
  );
}

function PortfolioFloatingIcons({
  stageHeight,
  stageWidth,
  introProgress,
  spreadProgress,
  screenRevealProgress,
  isNarrow,
  mouseX,
  mouseY,
}: PortfolioFloatingIconsProps) {
  const opacityBase = easeOutCubic(clamp((introProgress - 0.05) / 0.42));
  const centerX = stageWidth / 2;
  const centerY = stageHeight / 2;

  return (
    <div className="portfolio-floating-icons" aria-hidden="true">
      {PORTFOLIO_STAGE_ICONS.map((icon) => {
        const iconSize = clamp(stageWidth * 0.058 * icon.scale, isNarrow ? 54 : 58, isNarrow ? 78 : 92);
        const safePad = iconSize * 0.52 + 54;
        const spreadX = (icon.x - 50) * mix(0.18, 0.42, opacityBase);
        const spreadY = (icon.y - 50) * mix(0.12, 0.26, opacityBase);
        const anchorLeft = clamp((stageWidth * icon.x) / 100 + spreadX, safePad, stageWidth - safePad);
        const anchorTop = clamp((stageHeight * icon.y) / 100 + spreadY, safePad, stageHeight - safePad);
        const dx = anchorLeft - centerX;
        const dy = anchorTop - centerY;
        const length = Math.hypot(dx, dy) || 1;
        const directionX = dx / length || (icon.x < 50 ? -1 : 1);
        const directionY = dy / length || (icon.y < 50 ? -1 : 1);
        const target = projectPointOutside(
          centerX,
          centerY,
          directionX,
          directionY,
          stageWidth,
          stageHeight,
          iconSize * 1.25
        );
        const left = mix(anchorLeft, target.x, spreadProgress);
        const top = mix(anchorTop, target.y, spreadProgress);
        const opacity = opacityBase * mix(1, 0.92, screenRevealProgress * 0.3) * (1 - spreadProgress * 0.08);

        return (
          <PortfolioFloatingIconNode
            key={icon.id}
            icon={icon}
            left={left}
            top={top}
            size={iconSize}
            opacity={opacity}
            isNarrow={isNarrow}
            mouseX={mouseX}
            mouseY={mouseY}
          />
        );
      })}
    </div>
  );
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
  const zoomProgress = easeOutCubic(clamp((progress - 0.2) / 0.8));
  const splitProgress = easeOutCubic(clamp((progress - 0.28) / 0.72));
  const cardProgress = zoomProgress;
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
  const macbookActivatedRef = useRef(false);
  const mouseX = useRef(Number.POSITIVE_INFINITY);
  const mouseY = useRef(Number.POSITIVE_INFINITY);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [introProgress, setIntroProgress] = useState(0);
  const [isMacbookActive, setIsMacbookActive] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);
  const [stageHeight, setStageHeight] = useState(720);
  const [stageWidth, setStageWidth] = useState(1280);
  const [viewportHeight, setViewportHeight] = useState(900);
  const [viewportWidth, setViewportWidth] = useState(1440);

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

        setViewportHeight(viewportHeight);
        setViewportWidth(window.innerWidth || 1);
        setIsNarrow(isNarrowViewport);
        setStageWidth(nextStageWidth);
        setStageHeight(nextStageWidth * (9 / 16));

        if (!section) {
          setIntroProgress(0);
          setScrollOffset(0);
          return;
        }

        const rect = section.getBoundingClientRect();
        const introStart = viewportHeight * (isNarrowViewport ? 0.86 : 0.82);
        const introDistance = viewportHeight * (isNarrowViewport ? 0.48 : 0.54);
        const nextIntroProgress = easeInOutCubic(
          clamp((introStart - rect.top) / Math.max(introDistance, 1))
        );
        setIntroProgress(nextIntroProgress);

        if (
          !macbookActivatedRef.current &&
          nextIntroProgress > (isNarrowViewport ? 0.42 : 0.36) &&
          rect.top < viewportHeight * (isNarrowViewport ? 0.72 : 0.64) &&
          rect.bottom > viewportHeight * 0.35
        ) {
          macbookActivatedRef.current = true;
          setIsMacbookActive(true);
        }

        const scrollableHeight = Math.max(rect.height - viewportHeight, 1);
        setScrollOffset(clamp(-rect.top, 0, scrollableHeight));
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

  const rotateStartPx = viewportHeight * 0.12;
  const rotateDistancePx = viewportHeight * (isNarrow ? 1.38 : 1.56);
  const breakHoldPx = viewportHeight * 0.08;
  const breakDistancePx = viewportHeight * (isNarrow ? 0.82 : 0.94);
  const revealDistancePx = viewportHeight * 0.44;
  const workDistancePx = viewportHeight * 3.84;
  const breakStartPx = rotateStartPx + rotateDistancePx + breakHoldPx;
  const revealStartPx = breakStartPx + breakDistancePx * 0.08;
  const workStartPx = revealStartPx + revealDistancePx * 0.72;

  const rotateProgress = easeInOutCubic(clamp((scrollOffset - rotateStartPx) / rotateDistancePx));
  const loadProgress = rotateProgress;
  const breakProgress = easeInOutCubic(clamp((scrollOffset - breakStartPx) / breakDistancePx));
  const revealProgress = easeOutCubic(clamp((scrollOffset - revealStartPx) / revealDistancePx));
  const screenRevealProgress = revealProgress;
  const workProgress = clamp((scrollOffset - workStartPx) / workDistancePx);
  const totalAnimationDistancePx = workStartPx + workDistancePx;
  const sectionHeightPx = viewportHeight + totalAnimationDistancePx + viewportHeight * 0.08;
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
  const stageIntroProgress = introProgress;
  const stageShellWidth = (isNarrow ? 92 : 72) + stageIntroProgress * (isNarrow ? 8 : 28);
  const stageShellTranslate = (1 - stageIntroProgress) * (isNarrow ? 22 : 28);
  const stageShellRadius = (1 - stageIntroProgress) * 38;
  const rawScreenSkew = -30 * (1 - rotateProgress);
  const rawUnderRotate = -30 * (1 - rotateProgress);
  const rawUnderSkew = 30 * (1 - rotateProgress);
  const screenSkew = Math.abs(rawScreenSkew) < 1.2 ? 0 : rawScreenSkew;
  const underRotate = Math.abs(rawUnderRotate) < 1.2 ? 0 : rawUnderRotate;
  const underSkew = Math.abs(rawUnderSkew) < 1.2 ? 0 : rawUnderSkew;
  const macbookTransform = [
    "perspective(1600px)",
    `translate3d(${displayCenterXFromMacbookCenter * centerCorrection}px, ${
      displayCenterYFromMacbookCenter * centerCorrection
    }px, 0)`,
    `scale(${frontScale})`,
  ].join(" ");
  const keyboardOpacity = 1 - clamp((rotateProgress - 0.04) / 0.38);
  const frameBurstScale = mix(1, isNarrow ? 1.03 : 1.045, breakProgress);
  const frameBurstOpacity = 1 - clamp(breakProgress * 1.08);
  const frameBurstBlur = mix(0, 0.9, breakProgress);
  const iconSpreadProgress = easeOutCubic(clamp((rotateProgress - 0.12) / 0.7));
  const shellHorizontalPadding = isNarrow ? 16 : 32;
  const shellVerticalPadding = 32;
  const stageShellPixelWidth = (viewportWidth * stageShellWidth) / 100;
  const iconFieldWidth = Math.max(stageShellPixelWidth - shellHorizontalPadding * 2, 1);
  const iconFieldHeight = Math.max(viewportHeight - shellVerticalPadding * 2, 1);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    mouseX.current = event.clientX;
    mouseY.current = event.clientY;
  };

  const handleMouseLeave = () => {
    mouseX.current = Number.POSITIVE_INFINITY;
    mouseY.current = Number.POSITIVE_INFINITY;
  };

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative z-30 -mt-[72vh] bg-transparent text-white md:-mt-[78vh]"
      style={{ height: `${sectionHeightPx}px` }}
    >
      <div
        className="sticky top-0 h-screen overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="portfolio-stage-shell absolute inset-y-0 left-1/2"
          style={{
            width: `${stageShellWidth}%`,
            transform: `translate3d(-50%, ${stageShellTranslate}vh, 0)`,
            transformOrigin: "center bottom",
            borderTopLeftRadius: `${stageShellRadius}px`,
            borderTopRightRadius: `${stageShellRadius}px`,
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-white" />
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden px-4 py-8 md:px-8">
            <div className="portfolio-floating-icons-scope">
              <PortfolioFloatingIcons
                stageWidth={iconFieldWidth}
                stageHeight={iconFieldHeight}
                introProgress={stageIntroProgress}
                spreadProgress={iconSpreadProgress}
                screenRevealProgress={screenRevealProgress}
                isNarrow={isNarrow}
                mouseX={mouseX}
                mouseY={mouseY}
              />
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-4 py-8 md:px-8">
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
              <div className={`portfolio-macbook-scope ${isMacbookActive ? "is-active" : ""}`}>
                <div className="container">
                  <div
                    className="macbook"
                    style={
                      {
                        "--macbook-transform": macbookTransform,
                        "--screen-skew": `${screenSkew}deg`,
                        "--under-rotate": `${underRotate}deg`,
                        "--under-skew": `${underSkew}deg`,
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
                        "--frame-burst-scale": frameBurstScale,
                        "--frame-burst-opacity": frameBurstOpacity,
                        "--frame-burst-blur": `${frameBurstBlur}px`,
                        "--screen-reveal-progress": screenRevealProgress,
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
                        >
                        </div>
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
                style={
                  {
                    left: `${(stageWidth - overlayWidth) / 2}px`,
                    top: `${(stageHeight - overlayHeight) / 2}px`,
                    width: `${overlayWidth}px`,
                    height: `${overlayHeight}px`,
                    opacity: screenRevealProgress,
                    borderRadius: `${screenRadiusPx}px`,
                    "--screen-burst-scale": frameBurstScale,
                    "--screen-burst-opacity": frameBurstOpacity,
                    "--screen-burst-blur": `${frameBurstBlur}px`,
                    "--screen-reveal-progress": screenRevealProgress,
                  } as CSSProperties
                }
              >
                <div className="portfolio-screen-clip">
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
            </div>
          </div>
        </div>
        <style>{`
          .portfolio-stage-shell {
            bottom: 0;
            overflow: hidden;
            will-change: width, transform, border-radius;
          }

          .portfolio-macbook-stage {
            position: relative;
            max-width: 100%;
            max-height: 100%;
          }

          .portfolio-floating-icons-scope {
            position: absolute;
            inset: 0;
            z-index: 0;
            overflow: hidden;
            pointer-events: none;
          }

          .portfolio-floating-icons {
            position: absolute;
            inset: 0;
          }

          .portfolio-floating-icon {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            will-change: left, top, transform, opacity;
          }

          .portfolio-floating-icon__float {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            animation: portfolio-floating-icon-drift var(--icon-duration) ease-in-out infinite;
            animation-delay: var(--icon-delay);
          }

          .portfolio-floating-icon__card {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            border: 1px solid rgba(18, 26, 41, 0.04);
            border-radius: 1.9rem;
            background: rgba(255, 255, 255, 0.92);
            box-shadow:
              0 22px 48px rgba(22, 34, 56, 0.08),
              0 12px 20px rgba(22, 34, 56, 0.05),
              inset 0 1px 0 rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(12px);
          }

          .portfolio-floating-icon__card svg {
            display: block;
            filter: drop-shadow(0 2px 10px rgba(11, 18, 29, 0.08));
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
            opacity: calc(var(--frame-burst-opacity) * (1 - var(--screen-reveal-progress)));
            filter: blur(var(--frame-burst-blur));
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
            transform: scale(var(--frame-burst-scale));
            transform-origin: center center;
            opacity: calc(var(--frame-burst-opacity) * (1 - var(--screen-reveal-progress)));
            filter: blur(var(--frame-burst-blur));
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
            opacity: calc(
              var(--silver-opacity) * var(--frame-burst-opacity) * (1 - var(--screen-reveal-progress))
            );
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
            transform: scale(var(--frame-burst-scale));
            transform-origin: center center;
            opacity: calc(var(--frame-burst-opacity) * (1 - var(--screen-reveal-progress)));
            filter: blur(var(--frame-burst-blur));
          }

          .portfolio-macbook-scope .macbook__display::before {
            content: "";
            position: absolute;
            inset: 0;
            z-index: 30;
            border-radius: inherit;
            background: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.28) 0%,
              rgba(255, 255, 255, 0.1) 12%,
              rgba(255, 255, 255, 0.02) 24%,
              rgba(255, 255, 255, 0) 42%
            );
            transform: scale(var(--frame-burst-scale));
            transform-origin: center center;
            opacity: calc(0.85 * var(--frame-burst-opacity) * (1 - var(--screen-reveal-progress)));
            filter: blur(var(--frame-burst-blur));
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

          @keyframes portfolio-floating-icon-drift {
            0%,
            100% {
              transform: translate3d(0, 0, 0) rotate(0deg);
            }

            25% {
              transform: translate3d(calc(var(--float-x) * 0.35), calc(var(--float-y) * -0.85), 0)
                rotate(calc(var(--icon-tilt) * 0.55));
            }

            50% {
              transform: translate3d(var(--float-x), calc(var(--float-y) * -0.35), 0) rotate(var(--icon-tilt));
            }

            75% {
              transform: translate3d(calc(var(--float-x) * -0.32), var(--float-y), 0)
                rotate(calc(var(--icon-tilt) * -0.42));
            }
          }

          .portfolio-screen-overlay {
            position: absolute;
            z-index: 4;
            overflow: visible;
            background: transparent;
            pointer-events: none;
            will-change: left, top, width, height, opacity;
          }

          .portfolio-screen-clip {
            position: absolute;
            inset: 0;
            z-index: 1;
            overflow: hidden;
            border-radius: inherit;
            background: transparent;
          }

          .portfolio-screen-clip::before {
            content: "";
            position: absolute;
            inset: 0;
            z-index: 0;
            border-radius: inherit;
            background: #050914;
            transform: scale(var(--screen-burst-scale));
            transform-origin: center center;
            opacity: calc(var(--screen-burst-opacity) * (1 - var(--screen-reveal-progress)));
            filter: blur(var(--screen-burst-blur));
            pointer-events: none;
          }

          .portfolio-screen-overlay::before {
            content: none;
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
            --load-width: 80em;
            --load-height: 6em;
            --load-radius: 3em;
          }

          .portfolio-macbook-scope .macbook__load::before {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            width: var(--load-width);
            height: var(--load-height);
            transform: translate(-50%, -50%);
            border-radius: var(--load-radius);
            box-sizing: border-box;
            border: solid 1em #fff;
          }

          .portfolio-macbook-scope .macbook__load::after {
            content: "";
            position: absolute;
            top: 50%;
            left: calc(50% - (var(--load-width) / 2));
            width: calc(var(--load-width) * var(--load-progress));
            height: var(--load-height);
            transform: translateY(-50%);
            border-radius: var(--load-radius);
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

          @media (prefers-reduced-motion: reduce) {
            .portfolio-floating-icon__float {
              animation: none;
            }
          }

        `}</style>
      </div>
    </section>
  );
}
