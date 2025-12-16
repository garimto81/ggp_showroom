import { create } from 'zustand';
import type { Product } from '@/data/products';

type CursorState = 'default' | 'hover' | 'click';
type TravelState = 'idle' | 'traveling' | 'arrived';
type AppPhase = 'loading' | 'intro' | 'entering' | 'ready';

interface CameraTarget {
  position: [number, number, number];
  lookAt: [number, number, number];
}

interface AppState {
  appPhase: AppPhase;
  setAppPhase: (phase: AppPhase) => void;

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  cameraTarget: CameraTarget;
  setCameraTarget: (target: CameraTarget) => void;

  travelState: TravelState;
  setTravelState: (state: TravelState) => void;

  focusedProduct: Product | null;
  setFocusedProduct: (product: Product | null) => void;

  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;

  travelToProduct: (product: Product) => void;

  cursorState: CursorState;
  cursorText: string;
  setCursorState: (state: CursorState, text?: string) => void;

  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;

  isWarping: boolean;
  setIsWarping: (warping: boolean) => void;
}

const INITIAL_CAMERA: CameraTarget = {
  position: [0, 1.5, 8],
  lookAt: [0, 1.5, 0],
};

export const useStore = create<AppState>((set, get) => ({
  appPhase: 'loading',
  setAppPhase: (phase) => set({ appPhase: phase }),

  isLoading: true,
  setIsLoading: (loading) => set({ isLoading: loading }),

  cameraTarget: INITIAL_CAMERA,
  setCameraTarget: (target) => set({ cameraTarget: target }),

  travelState: 'idle',
  setTravelState: (state) => set({ travelState: state }),

  focusedProduct: null,
  setFocusedProduct: (product) => set({ focusedProduct: product }),

  selectedProduct: null,
  setSelectedProduct: (product) => set({ selectedProduct: product }),

  travelToProduct: (product) => {
    const { travelState } = get();
    if (travelState === 'traveling') return;

    set({
      travelState: 'traveling',
      isWarping: true,
      focusedProduct: product,
    });

    const [px, py, pz] = product.position;
    set({
      cameraTarget: {
        position: [px, py + 0.5, pz + 3],
        lookAt: [px, py, pz],
      },
    });
  },

  cursorState: 'default',
  cursorText: '',
  setCursorState: (state, text = '') => set({ cursorState: state, cursorText: text }),

  isMobile: false,
  setIsMobile: (isMobile) => set({ isMobile }),

  isWarping: false,
  setIsWarping: (warping) => set({ isWarping: warping }),
}));
