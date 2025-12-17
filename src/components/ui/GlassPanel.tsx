'use client';

import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'light' | 'dark' | 'accent';
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  border?: boolean;
  glow?: boolean;
}

const blurMap = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl',
};

const paddingMap = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-8',
};

const roundedMap = {
  none: '',
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-full',
};

const variantStyles = {
  light: 'bg-white/15 border-white/20',
  dark: 'bg-black/40 border-white/10',
  accent: 'bg-[#C9A66B]/20 border-[#C9A66B]/50 text-white',
};

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  (
    {
      children,
      className,
      variant = 'light',
      blur = 'lg',
      padding = 'md',
      rounded = 'lg',
      border = true,
      glow = false,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'relative transition-all duration-300',
          // Backdrop blur
          blurMap[blur],
          // Variant background
          variantStyles[variant],
          // Padding
          paddingMap[padding],
          // Rounded corners
          roundedMap[rounded],
          // Border
          border && 'border',
          // Glow effect
          glow && 'shadow-lg shadow-[#C9A66B]/20',
          // Custom className
          className
        )}
        style={{
          WebkitBackdropFilter: `blur(${blur === 'sm' ? 8 : blur === 'md' ? 12 : blur === 'lg' ? 16 : 24}px)`,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassPanel.displayName = 'GlassPanel';

// Glass Button variant
interface GlassButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'light' | 'dark' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ children, className, variant = 'light', size = 'md', disabled, ...props }, ref) => {
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-8 py-4 text-base',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          // Base
          'relative overflow-hidden font-light tracking-wider uppercase',
          'backdrop-blur-md rounded-lg border transition-all duration-300',
          // Variant
          variantStyles[variant],
          // Size
          sizeStyles[size],
          // Hover
          'hover:bg-white/25 hover:border-white/30',
          'hover:shadow-lg hover:shadow-[#C9A66B]/10',
          // Active
          'active:scale-[0.98]',
          // Disabled
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {/* Shine effect on hover */}
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
        <span className="relative">{children}</span>
      </button>
    );
  }
);

GlassButton.displayName = 'GlassButton';
