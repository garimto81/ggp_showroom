'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const { cursorState, cursorText, isMobile } = useStore();

  useEffect(() => {
    if (isMobile) return;

    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX - 24,
        y: e.clientY - 24,
        duration: 0.5,
        ease: 'power3.out',
      });

      gsap.to(cursorDot, {
        x: e.clientX - 4,
        y: e.clientY - 4,
        duration: 0.1,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    if (cursorState === 'hover') {
      gsap.to(cursor, {
        scale: 1.5,
        duration: 0.3,
        ease: 'power2.out',
      });
    } else {
      gsap.to(cursor, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [cursorState, isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Main cursor circle */}
      <div
        ref={cursorRef}
        className={cn(
          'fixed top-0 left-0 w-12 h-12 pointer-events-none z-[9999]',
          'rounded-full border border-[var(--color-text)]',
          'flex items-center justify-center',
          'transition-colors duration-200',
          cursorState === 'hover' && 'border-[var(--color-accent)] bg-[var(--color-accent)]/10'
        )}
      >
        {cursorText && (
          <span className="text-[8px] text-[var(--color-text)] font-medium uppercase tracking-wider">
            {cursorText}
          </span>
        )}
      </div>

      {/* Cursor dot */}
      <div
        ref={cursorDotRef}
        className={cn(
          'fixed top-0 left-0 w-2 h-2 pointer-events-none z-[9999]',
          'rounded-full bg-[var(--color-accent)]'
        )}
      />
    </>
  );
}
