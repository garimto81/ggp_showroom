'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';

interface TransitionOverlayProps {
  className?: string;
}

export function TransitionOverlay({ className }: TransitionOverlayProps) {
  const { travelState } = useStore();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const speedLineData = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      rotation: -5 + (i * 17) % 10,
      duration: 0.3 + (i * 0.023) % 0.3,
    }));
  }, []);

  useEffect(() => {
    if (travelState === 'traveling') {
      setIsActive(true);
      const timer = setTimeout(() => {
        setIsActive(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [travelState]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setOrigin({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <div
        ref={overlayRef}
        className={`clip-transition ${isActive ? 'active' : ''} ${className || ''}`}
        style={{
          '--clip-origin-x': `${origin.x}%`,
          '--clip-origin-y': `${origin.y}%`,
        } as React.CSSProperties}
      />

      {travelState === 'traveling' && (
        <div
          className="fixed inset-0 z-[199] pointer-events-none transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${origin.x}% ${origin.y}%, transparent 0%, transparent 30%, rgba(0,0,0,0.3) 100%)`,
            opacity: isActive ? 1 : 0,
          }}
        />
      )}

      {travelState === 'traveling' && (
        <div className="fixed inset-0 z-[198] pointer-events-none overflow-hidden">
          {speedLineData.map((data, i) => (
            <div
              key={i}
              className="absolute h-[2px] bg-gradient-to-r from-transparent via-[#C9A66B] to-transparent"
              style={{
                top: `${10 + i * 7}%`,
                left: '-100%',
                right: '-100%',
                opacity: 0,
                transform: `rotate(${data.rotation}deg)`,
                animation: isActive
                  ? `speedLine ${data.duration}s ease-out ${i * 0.05}s forwards`
                  : 'none',
              }}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes speedLine {
          0% {
            opacity: 0;
            transform: translateX(-100%);
          }
          20% {
            opacity: 0.6;
          }
          100% {
            opacity: 0;
            transform: translateX(100%);
          }
        }
      `}</style>
    </>
  );
}
