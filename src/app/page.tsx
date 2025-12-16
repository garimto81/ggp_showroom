'use client';

import { useEffect } from 'react';
import { Preloader, IntroSequence } from '@/components/layout';
import { CustomCursor, TransitionOverlay } from '@/components/ui';
import { Scene } from '@/components/three';
import { UIOverlay } from '@/components/ui/UIOverlay';
import { useStore } from '@/store/useStore';

export default function Home() {
  const { setIsMobile, appPhase } = useStore();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMobile]);

  const isSceneVisible = appPhase === 'entering' || appPhase === 'ready';

  return (
    <>
      <Preloader />
      <IntroSequence />
      <CustomCursor />
      {isSceneVisible && (
        <div
          className="transition-opacity duration-1000"
          style={{ opacity: appPhase === 'ready' ? 1 : 0 }}
        >
          <Scene />
          <UIOverlay />
          <TransitionOverlay />
        </div>
      )}
    </>
  );
}
