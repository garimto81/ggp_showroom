'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { useStore } from '@/store/useStore';

export function Preloader() {
  const { appPhase, setAppPhase, setIsLoading } = useStore();
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const exitAnimation = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoading(false);
        setAppPhase('intro');
      },
    });

    tl.to(progressBarRef.current, {
      scaleX: 0,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
    });

    tl.to(
      textRef.current,
      {
        y: -30,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
      },
      '-=0.2'
    );

    tl.to(
      container,
      {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      },
      '-=0.1'
    );
  }, [setAppPhase, setIsLoading]);

  useEffect(() => {
    if (appPhase !== 'loading') return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            exitAnimation();
          }, 300);
          return 100;
        }
        return prev + Math.random() * 12 + 3;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [appPhase, exitAnimation]);

  if (appPhase !== 'loading') return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #FAFAFA 0%, #F0F0F0 100%)',
      }}
    >
      <div ref={textRef} className="flex flex-col items-center">
        <div className="mb-8 relative">
          <div className="w-16 h-16 border border-[#1A1A1A] flex items-center justify-center">
            <span className="text-2xl font-extralight tracking-wider text-[#1A1A1A]">
              G
            </span>
          </div>
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-[#C9A66B]" />
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-[#C9A66B]" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-[#C9A66B]" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-[#C9A66B]" />
        </div>

        <p className="text-xs tracking-[0.4em] text-[#999] mb-8 font-light">
          LOADING EXPERIENCE
        </p>
      </div>

      <div className="w-48 relative">
        <div className="h-[1px] bg-[#E0E0E0] w-full" />
        <div
          ref={progressBarRef}
          className="absolute top-0 left-0 h-[1px] bg-[#C9A66B] origin-left transition-all duration-100"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <p className="mt-6 text-sm tracking-[0.2em] text-[#666] font-light tabular-nums">
        {Math.min(Math.round(progress), 100)}
        <span className="text-[#999]">%</span>
      </p>
    </div>
  );
}
