'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';

export function Header() {
  const { setCursorState } = useStore();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1 }}
      className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center mix-blend-difference"
    >
      <Link
        href="/"
        className="text-lg tracking-[0.3em] text-white font-light"
        onMouseEnter={() => setCursorState('hover')}
        onMouseLeave={() => setCursorState('default')}
      >
        GGP
      </Link>

      <nav className="hidden md:flex gap-8">
        {['Collection', 'About', 'Contact'].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-sm tracking-widest text-white/70 hover:text-white transition-colors"
            onMouseEnter={() => setCursorState('hover')}
            onMouseLeave={() => setCursorState('default')}
          >
            {item}
          </a>
        ))}
      </nav>

      <button
        className="md:hidden text-white"
        onMouseEnter={() => setCursorState('hover')}
        onMouseLeave={() => setCursorState('default')}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </motion.header>
  );
}
