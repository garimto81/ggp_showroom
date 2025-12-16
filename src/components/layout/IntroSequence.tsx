'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useStore } from '@/store/useStore';

export function IntroSequence() {
  const { appPhase, setAppPhase } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const enterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (appPhase !== 'intro') return;

    const container = containerRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const line = lineRef.current;
    const enter = enterRef.current;

    if (!container || !title || !subtitle || !line || !enter) return;

    const tl = gsap.timeline();

    tl.fromTo(
      title.querySelectorAll('.char'),
      { yPercent: 100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.05,
      }
    );

    tl.fromTo(
      subtitle,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.4'
    );

    tl.fromTo(
      line,
      { scaleX: 0 },
      { scaleX: 1, duration: 1, ease: 'power2.inOut' },
      '-=0.4'
    );

    tl.fromTo(
      enter,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.2'
    );

    return () => {
      tl.kill();
    };
  }, [appPhase]);

  const handleEnter = () => {
    const container = containerRef.current;
    if (!container) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setAppPhase('entering');
        setTimeout(() => setAppPhase('ready'), 800);
      },
    });

    tl.to(container.querySelectorAll('.intro-element'), {
      yPercent: -120,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.inOut',
      stagger: 0.05,
    });

    tl.to(
      container,
      {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      },
      '-=0.3'
    );
  };

  if (appPhase !== 'intro') return null;

  const titleChars = 'GGP SHOWROOM'.split('');

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9997] flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(180deg, #F8F8F8 0%, #EFEFEF 100%)',
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(201, 166, 107, 0.2) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(201, 166, 107, 0.15) 0%, transparent 70%)',
          }}
        />
      </div>

      <div ref={titleRef} className="intro-element overflow-hidden mb-4">
        <div className="flex">
          {titleChars.map((char, i) => (
            <span
              key={i}
              className="char inline-block text-5xl md:text-7xl lg:text-8xl font-extralight tracking-[0.2em] text-[#1A1A1A]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>
      </div>

      <div ref={subtitleRef} className="intro-element text-center mb-12">
        <p className="text-sm md:text-base tracking-[0.4em] text-[#666] font-light uppercase">
          Immersive Fashion Experience
        </p>
      </div>

      <div
        ref={lineRef}
        className="intro-element w-24 h-[1px] bg-[#C9A66B] origin-center mb-12"
      />

      <div ref={enterRef} className="intro-element">
        <button onClick={handleEnter} className="group relative px-12 py-4 overflow-hidden">
          <span
            className="absolute inset-0 border border-[#1A1A1A] transition-all duration-500 group-hover:border-[#C9A66B]"
            style={{ borderWidth: '1px' }}
          />
          <span className="absolute inset-0 bg-[#1A1A1A] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          <span className="relative text-sm tracking-[0.3em] text-[#1A1A1A] group-hover:text-white transition-colors duration-500 font-light">
            ENTER
          </span>
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <p className="text-xs tracking-[0.2em] text-[#999] font-light">
          CLICK TO EXPLORE
        </p>
      </div>
    </div>
  );
}
