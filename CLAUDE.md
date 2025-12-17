# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GGP Showroom is an immersive 3D clothing gallery website built with Next.js 15, React 19, and React Three Fiber. The application features a WebGL-powered 3D environment where users can explore clothing products through camera navigation and interactive elements.

## Development Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint check
```

### Testing

```bash
# E2E tests with Playwright
npx playwright test                        # Run all E2E tests
npx playwright test tests/e2e/showroom.spec.ts  # Single test file
npx playwright test --headed               # Run with browser visible
```

Note: Vitest is available as a dependency but no vitest.config exists yet.

## Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router) + React 19
- **3D Rendering**: Three.js via @react-three/fiber and @react-three/drei
- **Animation**: GSAP + Lenis (smooth scroll) + Framer Motion
- **State**: Zustand
- **Styling**: Tailwind CSS v4

### Component Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   └── page.tsx            # Main entry - orchestrates app phases
├── components/
│   ├── layout/             # Preloader, IntroSequence, Header
│   ├── three/              # 3D components (Scene, CameraController, ImagePlane, etc.)
│   └── ui/                 # CustomCursor, GlassPanel, UIOverlay, TransitionOverlay
├── store/
│   └── useStore.ts         # Zustand global state
├── data/
│   └── products.ts         # Product data with 3D positions
└── lib/
    └── utils.ts            # Utility functions (cn for classnames)
```

### Application Flow

The app uses a phase-based state machine managed in `useStore.ts`:

1. **loading** - Preloader shows while assets load
2. **intro** - IntroSequence displays brand animation
3. **entering** - Transition effect to 3D scene
4. **ready** - Full 3D gallery experience active

### 3D Scene Architecture

- `Scene.tsx` - Canvas setup with camera, lights, fog, and child components
- `CameraController.tsx` - Handles camera movement and lerping to targets
- `ImagePlane.tsx` - Individual product planes with hover/click interactions
- `GalleryEnvironment.tsx` - Floor and environment setup
- `WarpEffect.tsx` - Visual effect during camera transitions

### State Management (Zustand)

Key state in `useStore.ts`:
- `appPhase` - Current application phase
- `cameraTarget` - Camera position/lookAt for smooth transitions
- `travelState` - idle/traveling/arrived for product navigation
- `focusedProduct` / `selectedProduct` - Product interaction state
- `cursorState` / `cursorText` - Custom cursor feedback

### Path Aliases

`@/*` maps to `./src/*` (configured in tsconfig.json)

## Key Patterns

### Product Navigation
Products have 3D positions. Clicking a product triggers `travelToProduct()` which:
1. Sets `travelState` to 'traveling'
2. Enables warp effect
3. Updates camera target
4. CameraController lerps camera to new position

### Responsive Handling
Mobile detection via `isMobile` state affects:
- Custom cursor visibility
- Touch interaction handling
- UI element sizing
