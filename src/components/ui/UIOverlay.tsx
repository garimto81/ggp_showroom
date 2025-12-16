'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { GlassPanel, GlassButton } from './GlassPanel';

export function UIOverlay() {
  const {
    focusedProduct,
    travelState,
    setCursorState,
    appPhase,
    setFocusedProduct,
    setTravelState,
    setCameraTarget
  } = useStore();

  if (appPhase !== 'ready') return null;

  const handleBackToGallery = () => {
    setFocusedProduct(null);
    setTravelState('traveling');
    setCameraTarget({
      position: [0, 1.5, 8],
      lookAt: [0, 1.5, 0],
    });
    setTimeout(() => setTravelState('idle'), 1500);
  };

  return (
    <div className="ui-overlay">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 pointer-events-auto"
      >
        <GlassPanel
          variant="dark"
          blur="xl"
          padding="sm"
          rounded="lg"
          className="flex justify-between items-center px-6 py-3"
        >
          <Link
            href="/"
            className="text-base tracking-[0.3em] text-white font-light hover:text-[var(--color-accent)] transition-colors"
            onMouseEnter={() => setCursorState('hover')}
            onMouseLeave={() => setCursorState('default')}
          >
            GGP
          </Link>

          <nav className="hidden md:flex gap-6">
            {['Collection', 'About', 'Contact'].map((item) => (
              <button
                key={item}
                className="text-xs tracking-[0.2em] text-white/70 hover:text-white transition-colors uppercase"
                onMouseEnter={() => setCursorState('hover')}
                onMouseLeave={() => setCursorState('default')}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
            <span className="text-xs text-white/70">9</span>
          </div>
        </GlassPanel>
      </motion.header>

      <AnimatePresence>
        {travelState === 'idle' && !focusedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none"
          >
            <GlassPanel
              variant="light"
              blur="lg"
              padding="lg"
              rounded="lg"
              className="text-center max-w-md"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xs tracking-[0.3em] text-[var(--color-text-muted)] uppercase mb-4"
              >
                2025 Collection
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-2xl md:text-3xl font-extralight tracking-[0.15em] text-[var(--color-text)] mb-3"
              >
                Explore the Gallery
              </motion.h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="w-12 h-[1px] bg-[var(--color-accent)] mx-auto mb-4"
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-sm text-[var(--color-text-muted)] font-light"
              >
                Click on any piece to travel
              </motion.p>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {travelState === 'traveling' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-[100]"
          >
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-0 w-16 h-16 rounded-full border border-[var(--color-accent)]"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="w-3 h-3 rounded-full bg-[var(--color-accent)] glow-accent"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {focusedProduct && travelState === 'arrived' && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-8 top-1/2 -translate-y-1/2 w-80 pointer-events-auto"
          >
            <GlassPanel
              variant="dark"
              blur="xl"
              padding="lg"
              rounded="lg"
              glow
            >
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-[10px] tracking-[0.2em] uppercase bg-[var(--color-accent)]/20 text-[var(--color-accent)] rounded-full border border-[var(--color-accent)]/30">
                  {focusedProduct.category}
                </span>
              </div>

              <h2 className="text-xl font-light tracking-wider text-white mb-2">
                {focusedProduct.name}
              </h2>

              <p className="text-sm text-white/60 mb-4 font-light leading-relaxed">
                {focusedProduct.description}
              </p>

              <div className="h-[1px] bg-white/10 mb-4" />

              <p className="text-2xl font-light text-[var(--color-accent)] mb-6">
                {focusedProduct.price}
              </p>

              <div className="flex gap-3">
                <GlassButton
                  variant="accent"
                  size="md"
                  className="flex-1"
                  onMouseEnter={() => setCursorState('hover')}
                  onMouseLeave={() => setCursorState('default')}
                >
                  View Details
                </GlassButton>
              </div>

              <button
                onClick={handleBackToGallery}
                className="mt-4 w-full text-center text-xs text-white/40 hover:text-white/70 transition-colors tracking-wider uppercase"
                onMouseEnter={() => setCursorState('hover')}
                onMouseLeave={() => setCursorState('default')}
              >
                Back to Gallery
              </button>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="fixed left-8 bottom-8 pointer-events-auto"
      >
        <GlassPanel variant="dark" blur="lg" padding="sm" rounded="lg">
          <div className="flex gap-2">
            {['All', 'Tops', 'Bottoms', 'Outerwear'].map((cat) => (
              <button
                key={cat}
                className="px-4 py-2 text-[10px] tracking-[0.15em] uppercase text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-all"
                onMouseEnter={() => setCursorState('hover')}
                onMouseLeave={() => setCursorState('default')}
              >
                {cat}
              </button>
            ))}
          </div>
        </GlassPanel>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed right-8 bottom-8"
      >
        <p className="text-[10px] tracking-[0.2em] text-[var(--color-text-muted)] uppercase">
          Scroll to explore
        </p>
      </motion.div>
    </div>
  );
}
