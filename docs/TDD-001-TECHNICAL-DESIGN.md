# TDD-001: 기술 설계서

**Version**: 1.0.0
**Date**: 2025-12-16
**PRD Reference**: PRD-001-CLOTHING-SHOWROOM

---

## 1. 아키텍처 개요

### 1.1 시스템 구조
```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   Next.js App                        │    │
│  │  ┌─────────────────────────────────────────────┐    │    │
│  │  │              React Components               │    │    │
│  │  │  ┌─────────┐  ┌─────────┐  ┌─────────┐    │    │    │
│  │  │  │   UI    │  │ Layout  │  │ Section │    │    │    │
│  │  │  └─────────┘  └─────────┘  └─────────┘    │    │    │
│  │  └─────────────────────────────────────────────┘    │    │
│  │                        │                             │    │
│  │  ┌─────────────────────▼─────────────────────────┐  │    │
│  │  │            React Three Fiber                   │  │    │
│  │  │  ┌─────────┐  ┌─────────┐  ┌─────────┐       │  │    │
│  │  │  │  Scene  │  │ Camera  │  │ Objects │       │  │    │
│  │  │  └─────────┘  └─────────┘  └─────────┘       │  │    │
│  │  └────────────────────────────────────────────────┘  │    │
│  │                        │                             │    │
│  │  ┌─────────────────────▼─────────────────────────┐  │    │
│  │  │                 Three.js                       │  │    │
│  │  │           (WebGL Renderer)                     │  │    │
│  │  └────────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │    GSAP      │  │    Lenis     │  │   Framer     │       │
│  │ ScrollTrigger│  │ SmoothScroll │  │   Motion     │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 데이터 흐름
```
User Input (Scroll/Mouse)
        │
        ▼
┌───────────────────┐
│  Event Listeners  │
│  (Lenis/GSAP)     │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  State Update     │
│  (Zustand/React)  │
└─────────┬─────────┘
          │
    ┌─────┴─────┐
    ▼           ▼
┌───────┐  ┌────────┐
│ React │  │ Three  │
│  DOM  │  │ Canvas │
└───────┘  └────────┘
```

---

## 2. 3D 씬 설계

### 2.1 좌표계 및 공간 배치
```
                    Y (위)
                    │
                    │
                    │
                    │
       ─────────────┼─────────────── X (오른쪽)
                   ╱│
                  ╱ │
                 ╱  │
                ╱   │
               Z (카메라 방향)


카메라 시작 위치: (0, 0, 50)
카메라 종료 위치: (0, 0, -50)
이동 거리: 100 units
```

### 2.2 이미지 배치 전략
```
Z축 기준 이미지 배치 (스크롤 방향):

Z = 40   ┌───┐         (인트로 직후 첫 이미지)
         │ 1 │
         └───┘

Z = 30        ┌───┐
              │ 2 │
              └───┘

Z = 20   ┌───┐
         │ 3 │
         └───┘

Z = 10             ┌───┐
                   │ 4 │
                   └───┘

Z = 0    ┌───┐
         │ 5 │    (갤러리 중앙)
         └───┘

Z = -10       ┌───┐
              │ 6 │
              └───┘

... (반복)

배치 규칙:
- Z 간격: 10 units
- X 오프셋: -5 ~ +5 (랜덤 또는 패턴)
- Y 오프셋: -2 ~ +2 (랜덤 또는 패턴)
- 회전: Y축 기준 -15° ~ +15°
```

### 2.3 카메라 경로
```typescript
// 카메라 경로 정의
const cameraPath = {
  start: { position: [0, 0, 50], lookAt: [0, 0, 0] },
  end: { position: [0, 0, -50], lookAt: [0, 0, -100] },
};

// 스크롤 진행률 (0~1)에 따른 보간
function getCameraPosition(progress: number): Vector3 {
  return new Vector3(
    0,
    0,
    50 - progress * 100  // 50 → -50
  );
}
```

---

## 3. 애니메이션 시스템

### 3.1 스크롤 연동 구조
```
┌─────────────────────────────────────────────────────────────┐
│                    SCROLL SYSTEM                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Lenis] ──────────────────────────────────────────────┐    │
│     │                                                   │    │
│     │  scroll event                                     │    │
│     ▼                                                   │    │
│  ┌─────────────────┐                                   │    │
│  │ scrollProgress  │  0.0 ────────────────────── 1.0   │    │
│  │ (normalized)    │                                    │    │
│  └────────┬────────┘                                   │    │
│           │                                             │    │
│     ┌─────┴─────────────────────────┐                  │    │
│     │                               │                  │    │
│     ▼                               ▼                  │    │
│  ┌──────────────┐            ┌──────────────┐         │    │
│  │ GSAP         │            │ R3F          │         │    │
│  │ ScrollTrigger│            │ useFrame     │         │    │
│  └──────┬───────┘            └──────┬───────┘         │    │
│         │                           │                  │    │
│         ▼                           ▼                  │    │
│  ┌──────────────┐            ┌──────────────┐         │    │
│  │ DOM          │            │ Camera       │         │    │
│  │ Animations   │            │ Position     │         │    │
│  └──────────────┘            └──────────────┘         │    │
│                                                         │    │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 애니메이션 타임라인
```
Scroll Progress: 0% ─────────────────────────────────── 100%

[0% - 10%]  INTRO
            - 로고 페이드 아웃
            - 스크롤 인디케이터 숨김
            - 카메라 전진 시작

[10% - 20%] TRANSITION
            - 3D 공간 진입 효과
            - 첫 번째 이미지 등장

[20% - 80%] GALLERY
            - 카메라 이동
            - 이미지들 지나침
            - 각 이미지 영역에서 포커스 효과

[80% - 90%] OUTRO
            - 마지막 이미지
            - 푸터 등장 준비

[90% - 100%] FOOTER
             - CTA 표시
             - 연락처 정보
```

### 3.3 이미지 인터랙션 상태
```typescript
type ImageState = 'idle' | 'approaching' | 'visible' | 'passed';

// 카메라 Z 위치에 따른 상태 변화
function getImageState(imageZ: number, cameraZ: number): ImageState {
  const distance = cameraZ - imageZ;

  if (distance > 20) return 'idle';        // 아직 멀리 있음
  if (distance > 5) return 'approaching';  // 다가오는 중
  if (distance > -5) return 'visible';     // 현재 보이는 영역
  return 'passed';                          // 지나감
}
```

---

## 4. 컴포넌트 상세 설계

### 4.1 Scene 컴포넌트
```typescript
// src/components/three/Scene.tsx

interface SceneProps {
  scrollProgress: number;
}

export function Scene({ scrollProgress }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 50], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <Environment />
        <CameraController progress={scrollProgress} />
        <Gallery progress={scrollProgress} />
        <Effects />
      </Suspense>
    </Canvas>
  );
}
```

### 4.2 CameraController 컴포넌트
```typescript
// src/components/three/CameraController.tsx

interface CameraControllerProps {
  progress: number;
}

export function CameraController({ progress }: CameraControllerProps) {
  const { camera } = useThree();

  useFrame(() => {
    // 스크롤 진행률에 따라 카메라 Z 위치 보간
    const targetZ = 50 - progress * 100;
    camera.position.z = MathUtils.lerp(camera.position.z, targetZ, 0.1);
  });

  return null;
}
```

### 4.3 ImagePlane 컴포넌트
```typescript
// src/components/three/ImagePlane.tsx

interface ImagePlaneProps {
  image: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  cameraZ: number;
  onClick?: () => void;
}

export function ImagePlane({
  image,
  position,
  rotation = [0, 0, 0],
  cameraZ,
  onClick,
}: ImagePlaneProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const texture = useTexture(image);

  // 상태 계산
  const state = getImageState(position[2], cameraZ);
  const isVisible = state === 'visible' || state === 'approaching';

  // 호버 시 스케일 업
  useFrame(() => {
    if (!meshRef.current) return;
    const targetScale = hovered ? 1.1 : 1;
    meshRef.current.scale.setScalar(
      MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1)
    );
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      <planeGeometry args={[4, 6]} />
      <meshStandardMaterial
        map={texture}
        transparent
        opacity={isVisible ? 1 : 0.3}
      />
    </mesh>
  );
}
```

### 4.4 CustomCursor 컴포넌트
```typescript
// src/components/ui/CustomCursor.tsx

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  // GSAP로 부드러운 따라가기
  useGSAP(() => {
    gsap.to(cursorRef.current, {
      x: position.x - 16,
      y: position.y - 16,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, [position]);

  return (
    <div
      ref={cursorRef}
      className={cn(
        'fixed pointer-events-none z-50 mix-blend-difference',
        'w-8 h-8 rounded-full bg-white',
        'transition-transform duration-200',
        isHovering && 'scale-150'
      )}
    />
  );
}
```

---

## 5. 상태 관리

### 5.1 전역 상태 (Zustand)
```typescript
// src/store/useStore.ts

interface AppState {
  // 스크롤 상태
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;

  // 로딩 상태
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // 선택된 제품
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;

  // 커서 상태
  cursorState: 'default' | 'hover' | 'click';
  setCursorState: (state: CursorState) => void;
}

export const useStore = create<AppState>((set) => ({
  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),

  isLoading: true,
  setIsLoading: (loading) => set({ isLoading: loading }),

  selectedProduct: null,
  setSelectedProduct: (product) => set({ selectedProduct: product }),

  cursorState: 'default',
  setCursorState: (state) => set({ cursorState: state }),
}));
```

### 5.2 컨텍스트 구조
```
App
 │
 ├── StoreProvider (Zustand)
 │    │
 │    ├── SmoothScrollProvider (Lenis)
 │    │    │
 │    │    ├── Layout
 │    │    │    ├── Header
 │    │    │    ├── Main
 │    │    │    │    ├── IntroSection
 │    │    │    │    ├── Scene (R3F Canvas)
 │    │    │    │    └── ContactSection
 │    │    │    └── Footer
 │    │    │
 │    │    └── CustomCursor
 │    │
 │    └── Preloader
```

---

## 6. 성능 최적화

### 6.1 이미지 최적화
```typescript
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

### 6.2 Three.js 최적화
```typescript
// 텍스처 최적화
function optimizeTexture(texture: Texture) {
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
}

// Instancing (동일 지오메트리 재사용)
function useInstancedMesh(count: number) {
  const geometry = useMemo(() => new PlaneGeometry(4, 6), []);
  const material = useMemo(() => new MeshStandardMaterial(), []);

  return (
    <instancedMesh args={[geometry, material, count]}>
      {/* 인스턴스 매트릭스 설정 */}
    </instancedMesh>
  );
}
```

### 6.3 렌더링 최적화
```typescript
// Canvas 설정
<Canvas
  gl={{
    antialias: true,
    powerPreference: 'high-performance',
    stencil: false,
    depth: true,
  }}
  dpr={[1, 2]}  // 디바이스 픽셀 비율 제한
  frameloop="demand"  // 필요시만 렌더링
>
```

---

## 7. 반응형 설계

### 7.1 브레이크포인트
```css
/* Tailwind 기본 브레이크포인트 사용 */
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### 7.2 3D 씬 반응형
```typescript
function useResponsiveCamera() {
  const { viewport } = useThree();

  // 뷰포트 크기에 따라 FOV 조정
  const fov = useMemo(() => {
    if (viewport.width < 768) return 60;  // 모바일: 넓은 시야각
    return 50;  // 데스크톱
  }, [viewport.width]);

  return fov;
}
```

### 7.3 모바일 대응
```typescript
// 모바일에서는 간소화된 경험
function useMobileOptimization() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return {
    enablePostProcessing: !isMobile,
    shadowQuality: isMobile ? 'low' : 'high',
    particleCount: isMobile ? 50 : 200,
  };
}
```

---

## 8. 테스트 전략

### 8.1 단위 테스트
```typescript
// __tests__/components/ImagePlane.test.tsx
describe('ImagePlane', () => {
  it('renders with correct position', () => {
    // ...
  });

  it('changes scale on hover', () => {
    // ...
  });

  it('calculates visibility correctly', () => {
    // ...
  });
});
```

### 8.2 E2E 테스트 (Playwright)
```typescript
// e2e/scroll.spec.ts
test('scroll through gallery', async ({ page }) => {
  await page.goto('/');

  // 스크롤 시뮬레이션
  await page.evaluate(() => window.scrollTo(0, 1000));

  // 3D 씬 로드 확인
  await expect(page.locator('canvas')).toBeVisible();

  // 이미지 인터랙션 테스트
  // ...
});
```

---

## 9. 배포 설정

### 9.1 Vercel 설정
```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "regions": ["icn1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### 9.2 환경 변수
```env
# .env.local
NEXT_PUBLIC_SITE_URL=https://ggp-showroom.vercel.app
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0.0 | 2025-12-16 | 초안 작성 |
