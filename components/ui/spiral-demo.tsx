'use client'

import { type CSSProperties, useEffect, useMemo, useState } from 'react'
import { SpiralAnimation } from '@/components/ui/spiral-animation'

type IntroPhase = 'idle' | 'feedback' | 'warp' | 'reveal' | 'done'

interface SpiralDemoProps {
  introPhase: IntroPhase
  onEnter: () => void
}

export function SpiralDemo({ introPhase, onEnter }: SpiralDemoProps) {
  const [startVisible, setStartVisible] = useState(false)
  const [showEnter, setShowEnter] = useState(false)
  const enterText = useMemo(() => 'Enter'.split(''), [])

  const isClickable = introPhase === 'idle'
  const isFeedback = introPhase === 'feedback'
  const isTransitioning = introPhase !== 'idle' && introPhase !== 'done'

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartVisible(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isTransitioning) {
      setShowEnter(false)
    }
  }, [isTransitioning])

  const handleClick = () => {
    if (!isClickable) {
      return
    }

    onEnter()
  }

  const showEnterState = showEnter && !isTransitioning

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0">
        <SpiralAnimation />
      </div>

      <div
        aria-hidden
        className={`
          pointer-events-none absolute inset-0 transition-all duration-700 ease-out
          ${isFeedback ? 'opacity-100' : isTransitioning ? 'opacity-70' : 'opacity-0'}
        `}
      >
        <div className="spiral-awaken-glow absolute inset-0" />
      </div>

      <div
        className={`
          absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2
          transition-all duration-1500 ease-out
          ${startVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          ${isTransitioning ? 'pointer-events-none' : ''}
        `}
      >
        <button
          onClick={handleClick}
          onMouseEnter={() => setShowEnter(true)}
          onMouseLeave={() => setShowEnter(false)}
          onFocus={() => setShowEnter(true)}
          onBlur={() => setShowEnter(false)}
          disabled={!isClickable}
          className={`relative inline-flex items-center justify-center text-2xl font-extralight uppercase tracking-[0.2em] text-white transition-all duration-700 hover:tracking-[0.3em] ${isClickable ? 'animate-pulse cursor-pointer' : 'cursor-default'}`}
          aria-label="Enter CoderZHH's World"
        >
          <span className="sr-only">Enter</span>

          <span
            aria-hidden
            className={`relative inline-flex h-[1.2em] items-center justify-center leading-[1.2] transition-[transform,opacity,filter] duration-700 ease-[cubic-bezier(0.2,0.9,0.25,1)] ${isFeedback ? 'scale-110 opacity-0 blur-md' : 'scale-100 opacity-100 blur-0'}`}
          >
            <span className="invisible whitespace-nowrap">CoderZHH&apos;s World</span>

            <span
              className={`absolute inset-0 flex items-center justify-center overflow-hidden transition-[opacity,filter] duration-700 ease-[cubic-bezier(0.2,0.9,0.25,1)] ${showEnterState ? 'opacity-0 blur-md' : 'opacity-100 blur-0'}`}
            >
              <span className={`spiral-single-roll ${showEnterState ? 'spiral-roll-paused' : ''}`}>
                <span className="spiral-single-item">Welcome To</span>
                <span className="spiral-single-item">CoderZHH&apos;s World</span>
                <span className="spiral-single-item">Welcome To</span>
              </span>
            </span>

            <span aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
              {enterText.map((char, index) => {
                const offset = index - (enterText.length - 1) / 2
                const enterStyle: CSSProperties = {
                  transform: showEnterState
                    ? 'translate3d(0, 0, 0) scale(1) rotate(0deg)'
                    : `translate3d(${offset * 1.05}em, ${offset % 2 === 0 ? -1.1 : 1.1}em, 0) scale(0.35) rotate(${offset * 14}deg)`,
                  opacity: showEnterState ? 1 : 0,
                  filter: showEnterState ? 'blur(0px)' : 'blur(9px)',
                  transitionDelay: `${70 + index * 42}ms`,
                }

                return (
                  <span
                    key={`${char}-${index}`}
                    className="inline-block whitespace-pre leading-[1.2] transition-[transform,opacity,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={enterStyle}
                  >
                    {char}
                  </span>
                )
              })}
            </span>
          </span>
        </button>
      </div>

      <style jsx>{`
        .spiral-single-roll {
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: spiral-single-roll 5.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          will-change: transform;
        }

        .spiral-single-item {
          display: block;
          height: 1.2em;
          line-height: 1.2;
          white-space: nowrap;
        }

        .spiral-roll-paused {
          animation-play-state: paused;
        }

        .spiral-awaken-glow {
          background:
            radial-gradient(circle at 50% 55%, rgba(39, 109, 198, 0.42) 0%, rgba(19, 67, 140, 0.2) 28%, rgba(4, 12, 31, 0.64) 54%, rgba(1, 3, 8, 0.96) 100%),
            radial-gradient(circle at 52% 52%, rgba(115, 195, 255, 0.22) 0%, rgba(115, 195, 255, 0) 36%);
          filter: blur(4px);
          animation: spiral-awaken-pulse 760ms ease-out forwards;
        }

        @keyframes spiral-single-roll {
          0%,
          36% {
            transform: translateY(0%);
          }
          48%,
          84% {
            transform: translateY(-33.333333%);
          }
          100% {
            transform: translateY(-66.666667%);
          }
        }

        @keyframes spiral-awaken-pulse {
          0% {
            transform: scale(0.96);
            opacity: 0;
          }

          35% {
            transform: scale(1);
            opacity: 0.95;
          }

          100% {
            transform: scale(1.06);
            opacity: 0.84;
          }
        }
      `}</style>
    </section>
  )
}
