"use client";

import Image from "next/image";
import { type CSSProperties, useEffect, useMemo, useState } from "react";
import { AstronautViewer } from "@/components/model/AstronautViewer";

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function easeInOutCubic(value: number) {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(1);

  useEffect(() => {
    const update = () => {
      setScrollY(window.scrollY);
      setViewportHeight(window.innerHeight);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const meteors = useMemo(
    () =>
      [
        {
          top: "4%",
          left: "62%",
          width: 260,
          delay: "0s",
          duration: "7.2s",
          angle: 34,
          travel: 720,
          glow: "rgba(47,178,255,0.45)",
          trail: "linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(196,230,255,0.32)_18%,rgba(89,198,255,0.82)_58%,rgba(245,252,255,1)_100%)",
          blurTrail:
            "linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(138,201,255,0.18)_18%,rgba(82,208,255,0.56)_48%,rgba(181,244,255,0.92)_100%)",
          head: "radial-gradient(circle,rgba(255,255,255,0.86)_0%,rgba(132,225,255,0.42)_58%,rgba(132,225,255,0)_82%)",
        },
        {
          top: "10%",
          left: "78%",
          width: 220,
          delay: "1.1s",
          duration: "8.1s",
          angle: 31,
          travel: 640,
          glow: "rgba(165,92,255,0.38)",
          trail: "linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(221,184,255,0.28)_18%,rgba(173,107,255,0.78)_58%,rgba(255,242,255,1)_100%)",
          blurTrail:
            "linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(196,141,255,0.16)_18%,rgba(164,97,255,0.44)_46%,rgba(234,186,255,0.88)_100%)",
          head: "radial-gradient(circle,rgba(255,249,255,0.84)_0%,rgba(203,130,255,0.38)_58%,rgba(203,130,255,0)_82%)",
        },
        {
          top: "18%",
          left: "54%",
          width: 200,
          delay: "2.4s",
          duration: "6.8s",
          angle: 29,
          travel: 560,
          glow: "rgba(79,233,255,0.32)",
          trail: "linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(188,247,255,0.26)_18%,rgba(78,236,255,0.84)_62%,rgba(248,255,255,1)_100%)",
          blurTrail:
            "linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(135,240,255,0.14)_18%,rgba(74,224,255,0.42)_52%,rgba(179,250,255,0.82)_100%)",
          head: "radial-gradient(circle,rgba(255,255,255,0.84)_0%,rgba(114,240,255,0.34)_56%,rgba(114,240,255,0)_82%)",
        },
        {
          top: "24%",
          left: "32%",
          width: 300,
          delay: "0.8s",
          duration: "9.4s",
          angle: 36,
          travel: 760,
          glow: "rgba(79,96,255,0.36)",
          trail: "linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(187,197,255,0.2)_18%,rgba(104,132,255,0.58)_50%,rgba(182,244,255,0.98)_100%)",
          blurTrail:
            "linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(126,137,255,0.12)_18%,rgba(102,146,255,0.32)_48%,rgba(148,222,255,0.76)_100%)",
          head: "radial-gradient(circle,rgba(255,255,255,0.8)_0%,rgba(132,206,255,0.3)_56%,rgba(132,206,255,0)_82%)",
        },
        {
          top: "34%",
          left: "67%",
          width: 250,
          delay: "3.3s",
          duration: "7.7s",
          angle: 33,
          travel: 700,
          glow: "rgba(55,198,255,0.42)",
          trail: "linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(204,239,255,0.26)_18%,rgba(71,205,255,0.76)_58%,rgba(255,255,255,1)_100%)",
          blurTrail:
            "linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(142,224,255,0.16)_18%,rgba(76,198,255,0.44)_52%,rgba(191,246,255,0.88)_100%)",
          head: "radial-gradient(circle,rgba(255,255,255,0.92)_0%,rgba(111,228,255,0.4)_58%,rgba(111,228,255,0)_82%)",
        },
        {
          top: "42%",
          left: "44%",
          width: 230,
          delay: "1.8s",
          duration: "8.8s",
          angle: 30,
          travel: 650,
          glow: "rgba(148,75,255,0.38)",
          trail: "linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(211,185,255,0.24)_20%,rgba(133,118,255,0.5)_50%,rgba(238,177,255,0.98)_100%)",
          blurTrail:
            "linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(162,125,255,0.14)_18%,rgba(138,112,255,0.32)_48%,rgba(216,154,255,0.82)_100%)",
          head: "radial-gradient(circle,rgba(255,250,255,0.86)_0%,rgba(190,119,255,0.34)_56%,rgba(190,119,255,0)_82%)",
        },
        {
          top: "57%",
          left: "71%",
          width: 260,
          delay: "4.1s",
          duration: "7.1s",
          angle: 35,
          travel: 720,
          glow: "rgba(31,195,255,0.34)",
          trail: "linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(180,238,255,0.22)_22%,rgba(89,199,255,0.64)_58%,rgba(226,252,255,0.98)_100%)",
          blurTrail:
            "linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(126,210,255,0.14)_18%,rgba(85,182,255,0.32)_50%,rgba(161,241,255,0.8)_100%)",
          head: "radial-gradient(circle,rgba(255,255,255,0.82)_0%,rgba(104,223,255,0.3)_56%,rgba(104,223,255,0)_82%)",
        },
        {
          top: "69%",
          left: "24%",
          width: 320,
          delay: "2.7s",
          duration: "9.8s",
          angle: 37,
          travel: 820,
          glow: "rgba(94,64,255,0.34)",
          trail: "linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(192,205,255,0.2)_20%,rgba(110,112,255,0.48)_48%,rgba(173,239,255,0.96)_100%)",
          blurTrail:
            "linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(137,149,255,0.12)_18%,rgba(102,133,255,0.28)_46%,rgba(137,216,255,0.74)_100%)",
          head: "radial-gradient(circle,rgba(255,255,255,0.82)_0%,rgba(119,214,255,0.3)_56%,rgba(119,214,255,0)_82%)",
        },
        {
          top: "82%",
          left: "58%",
          width: 210,
          delay: "5.2s",
          duration: "8.6s",
          angle: 28,
          travel: 580,
          glow: "rgba(188,94,255,0.28)",
          trail: "linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(235,198,255,0.22)_20%,rgba(166,118,255,0.46)_50%,rgba(255,203,246,0.96)_100%)",
          blurTrail:
            "linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(184,136,255,0.12)_18%,rgba(172,120,255,0.28)_44%,rgba(245,164,255,0.76)_100%)",
          head: "radial-gradient(circle,rgba(255,250,255,0.82)_0%,rgba(222,126,255,0.28)_56%,rgba(222,126,255,0)_82%)",
        },
        {
          top: "14%",
          left: "18%",
          width: 260,
          delay: "1.6s",
          duration: "8.4s",
          angle: 34,
          travel: 740,
          glow: "rgba(74,205,255,0.46)",
          trail: "linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(202,236,255,0.26)_20%,rgba(86,197,255,0.74)_62%,rgba(255,255,255,1)_100%)",
          blurTrail:
            "linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(136,214,255,0.16)_18%,rgba(89,198,255,0.42)_48%,rgba(184,244,255,0.9)_100%)",
          head: "radial-gradient(circle,rgba(255,255,255,0.9)_0%,rgba(102,230,255,0.38)_58%,rgba(102,230,255,0)_82%)",
        },
        {
          top: "48%",
          left: "14%",
          width: 300,
          delay: "3.8s",
          duration: "9.1s",
          angle: 36,
          travel: 780,
          glow: "rgba(144,92,255,0.42)",
          trail: "linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(220,188,255,0.22)_22%,rgba(157,105,255,0.52)_50%,rgba(193,243,255,0.96)_100%)",
          blurTrail:
            "linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(165,124,255,0.12)_18%,rgba(137,114,255,0.28)_48%,rgba(145,220,255,0.8)_100%)",
          head: "radial-gradient(circle,rgba(255,255,255,0.84)_0%,rgba(139,211,255,0.32)_56%,rgba(139,211,255,0)_82%)",
        },
        {
          top: "8%",
          left: "6%",
          width: 240,
          delay: "0.4s",
          duration: "7.6s",
          angle: 32,
          travel: 700,
          glow: "rgba(255,116,189,0.38)",
          trail: "linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,208,230,0.22)_18%,rgba(255,118,208,0.62)_46%,rgba(188,246,255,1)_100%)",
          blurTrail:
            "linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,150,214,0.12)_18%,rgba(242,116,205,0.34)_46%,rgba(166,233,255,0.82)_100%)",
          head: "radial-gradient(circle,rgba(255,251,252,0.84)_0%,rgba(255,150,222,0.34)_56%,rgba(255,150,222,0)_82%)",
        },
        {
          top: "61%",
          left: "52%",
          width: 280,
          delay: "4.8s",
          duration: "8.9s",
          angle: 34,
          travel: 760,
          glow: "rgba(140,255,177,0.34)",
          trail: "linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(204,255,228,0.22)_18%,rgba(118,255,189,0.58)_44%,rgba(226,255,245,1)_100%)",
          blurTrail:
            "linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(146,255,198,0.12)_18%,rgba(111,244,193,0.32)_48%,rgba(184,255,227,0.84)_100%)",
          head: "radial-gradient(circle,rgba(255,255,255,0.84)_0%,rgba(146,255,202,0.3)_56%,rgba(146,255,202,0)_82%)",
        },
      ],
    []
  );

  const heroProgress = Math.min(scrollY / Math.max(viewportHeight, 1), 1);
  const backgroundOffset = heroProgress ;
  const astronautOffset = heroProgress * 190;
  const copyOffset = heroProgress * 145;
  const meteorOffset = heroProgress * 1000;
  const copyScaleProgress = easeInOutCubic(clamp((heroProgress - 0.06) / 0.72));
  const copyScale = 1 - copyScaleProgress * 0.24;

  return (
    <section id="top" className="relative min-h-[130vh] overflow-x-hidden">
      <div className="absolute inset-x-0 top-0 z-0 h-[130vh] overflow-hidden">
        <div
          className="absolute inset-x-0 top-0 h-[140vh] will-change-transform"
          style={{ transform: `translate3d(0, ${backgroundOffset}px, 0)` }}
        >
          <Image
            src="/img/背景.png"
            alt="Hero background"
            fill
            priority
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,10,19,0.86)_0%,rgba(5,10,19,0.54)_36%,rgba(5,10,19,0.2)_58%,rgba(5,10,19,0.74)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,17,31,0.18)_0%,rgba(9,17,31,0.42)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.08),transparent_24%),radial-gradient(circle_at_72%_18%,rgba(124,162,255,0.12),transparent_18%),radial-gradient(circle_at_26%_68%,rgba(255,255,255,0.06),transparent_18%)]" />
      </div>

      <div className="absolute inset-x-0 top-0 z-10 h-[130vh] overflow-hidden pointer-events-none">
        {meteors.map((meteor, index) => (
          <div
            key={`${meteor.top}-${meteor.left}-${index}`}
            className="absolute"
            style={{
              top: meteor.top,
              left: meteor.left,
              transform: `translate3d(0, ${meteorOffset * 0.35}px, 0)`,
            }}
          >
            <div
              className="meteor-flight"
              style={{
                width: `${meteor.width}px`,
                animation: `meteor-flight ${meteor.duration} linear infinite`,
                animationDelay: meteor.delay,
                "--meteor-from-x": `${Math.cos((meteor.angle * Math.PI) / 180) * meteor.travel * -0.32}px`,
                "--meteor-from-y": `${Math.sin((meteor.angle * Math.PI) / 180) * meteor.travel * -0.32}px`,
                "--meteor-to-x": `${Math.cos((meteor.angle * Math.PI) / 180) * meteor.travel}px`,
                "--meteor-to-y": `${Math.sin((meteor.angle * Math.PI) / 180) * meteor.travel}px`,
              } as CSSProperties}
            >
              <span
                className="meteor-streak"
                style={{
                  width: `${meteor.width}px`,
                  transform: `rotate(${meteor.angle}deg)`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="sticky top-0 z-20 h-screen overflow-visible">
        <div className="relative grid h-screen overflow-visible grid-cols-1 lg:grid-cols-[1fr_1fr]">
          <div
            className="relative flex min-h-[50vh] items-center justify-center lg:h-screen"
            style={{ transform: `translate3d(0, ${astronautOffset}px, 0)` }}
          >
            <div className="h-[68vh] w-full lg:h-[108vh]">
              <AstronautViewer />
            </div>
          </div>

          <div
            className="relative flex min-h-[50vh] items-center lg:h-screen"
            style={{ transform: `translate3d(0, ${copyOffset}px, 0)` }}
          >
            <div
              style={{
                transform: `scale(${copyScale})`,
                transformOrigin: "left center",
              }}
            >
              <div className="hero-title-panel flex flex-col items-start justify-center">
                <p className="hero-title-kicker">
                  <span>CHAPTER 01</span>
                  <span className="hero-title-kicker-line" />
                </p>
                <h1 className="hero-title" aria-label="Welcome To CoderZHH's World">
                  <span className="hero-title-line hero-title-welcome">Welcome To</span>
                  <span className="hero-title-line hero-title-main">CoderZHH&apos;s</span>
                  <span className="hero-title-line hero-title-world">World</span>
                </h1>
                <p className="hero-title-subcopy">
                  CoderZHH is all you need.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
