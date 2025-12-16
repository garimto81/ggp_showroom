# PRD-001: 의류 쇼룸 웹사이트

**Version**: 1.1.0
**Date**: 2025-12-16
**Status**: Draft
**Author**: Claude Code

---

## 1. 개요

### 1.1 프로젝트 명
**GGP Showroom** - 몰입형 3D 의류 쇼룸 웹사이트

### 1.2 목적
의류 제품을 환상적이고 몰입감 있는 3D 공간에서 미리 볼 수 있는 쇼룸 웹사이트 제작

### 1.3 영감 소스
- [ThevertMenthe](https://thevertmenthe.dault-lafon.fr/) - Awwwards Site of the Day (2025.12.13)
- 개발자: Etienne Dault-Lafon (모션/인터랙션 전문)

### 1.4 핵심 가치
```
┌─────────────────────────────────────────────────────────┐
│                    핵심 가치 제안                        │
├─────────────────────────────────────────────────────────┤
│  1. 몰입감 (Immersion)                                  │
│     → 3D 공간을 여행하는 듯한 경험                      │
│                                                         │
│  2. 인터랙티브 (Interactive)                            │
│     → 스크롤, 마우스에 반응하는 역동적 UI               │
│                                                         │
│  3. 프리미엄 (Premium)                                  │
│     → 고급스러운 브랜드 이미지 전달                     │
│                                                         │
│  4. 직관적 (Intuitive)                                  │
│     → 복잡한 조작 없이 자연스러운 탐색                  │
└─────────────────────────────────────────────────────────┘
```

---

## 2. 기술 스택

### 2.1 프론트엔드
| 기술 | 버전 | 용도 |
|------|------|------|
| Next.js | 15.x | React 프레임워크, SSR |
| React | 19.x | UI 라이브러리 |
| TypeScript | 5.x | 타입 안정성 |
| Tailwind CSS | 3.x | 스타일링 |

### 2.2 3D 렌더링
| 기술 | 버전 | 용도 |
|------|------|------|
| Three.js | 0.170.x | WebGL 3D 엔진 |
| @react-three/fiber | 8.x | React용 Three.js |
| @react-three/drei | 9.x | 유틸리티 컴포넌트 |
| @react-three/postprocessing | 2.x | 후처리 효과 |

### 2.3 애니메이션
| 기술 | 버전 | 용도 |
|------|------|------|
| GSAP | 3.x | 고급 애니메이션 |
| @gsap/react | 2.x | React 통합 |
| Lenis | 1.x | 스무스 스크롤 |
| Framer Motion | 11.x | UI 트랜지션 |

### 2.4 상태 관리
| 기술 | 버전 | 용도 |
|------|------|------|
| Zustand | 5.x | 전역 상태 관리 |

### 2.5 개발 도구
| 기술 | 용도 |
|------|------|
| ESLint | 코드 품질 |
| Prettier | 코드 포맷팅 |
| Vitest | 단위 테스트 |
| Playwright | E2E 테스트 |

---

## 3. 사이트 구조

### 3.1 페이지 맵
```
/                       → 메인 (3D 쇼룸)
├── /#intro            → 인트로 섹션
├── /#gallery          → 3D 갤러리 공간
├── /#collection-1     → 컬렉션 1 (상의)
├── /#collection-2     → 컬렉션 2 (하의)
├── /#collection-3     → 컬렉션 3 (아우터)
└── /#contact          → 연락처/푸터
```

### 3.2 사용자 플로우
```
┌─────────────────────────────────────────────────────────────┐
│                      USER JOURNEY                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [LOAD] 페이지 로딩                                          │
│     │                                                        │
│     ▼                                                        │
│  [PRELOADER] 로딩 애니메이션 (2-3초)                         │
│     │         - 프로그레스 바                                │
│     │         - 브랜드 로고 페이드 인                        │
│     ▼                                                        │
│  [INTRO] 히어로 섹션                                         │
│     │     - 브랜드명 타이포그래피                            │
│     │     - "Scroll to Explore" 인디케이터                   │
│     │     - 배경: 미묘한 파티클/그라데이션                   │
│     ▼                                                        │
│  [TRANSITION] 3D 공간 진입                                   │
│     │         - 카메라가 앞으로 이동                         │
│     │         - 워프/터널 효과 (선택)                        │
│     ▼                                                        │
│  [GALLERY] 3D 쇼룸 공간                                      │
│     │       - 의류 이미지가 3D 공간에 배치                   │
│     │       - 스크롤 = 카메라 이동                           │
│     │       - 호버 = 이미지 확대 + 정보 표시                 │
│     ▼                                                        │
│  [DETAIL] 제품 상세 (모달/섹션)                              │
│     │      - 클릭 시 확대 뷰                                 │
│     │      - 3D 틸트 효과                                    │
│     │      - 제품 정보                                       │
│     ▼                                                        │
│  [FOOTER] 연락처 & CTA                                       │
│           - 문의하기 버튼                                    │
│           - 소셜 링크                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. 핵심 기능

### 4.1 인트로 섹션
```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│                                                              │
│                      G G P                                   │
│                   S H O W R O O M                            │
│                                                              │
│                  ─────────────────                           │
│                                                              │
│                   Scroll to Explore                          │
│                         ▼                                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**구현 요소:**
- [ ] 로고 타이포그래피 애니메이션 (글자별 페이드/슬라이드)
- [ ] 배경 그라데이션 또는 파티클 효과
- [ ] 스크롤 인디케이터 바운스 애니메이션
- [ ] 마우스 커서 커스텀 (Blob 또는 원형)

### 4.2 3D 갤러리 공간
```
┌─────────────────────────────────────────────────────────────┐
│                        3D GALLERY                            │
│                                                              │
│        ┌───────┐                                             │
│        │       │                                             │
│        │  IMG  │     ← 이미지가 3D 공간에 떠있음             │
│        │       │                                             │
│        └───────┘                                             │
│                      ┌───────┐                               │
│                      │       │                               │
│                      │  IMG  │                               │
│      ┌───────┐       │       │                               │
│      │       │       └───────┘                               │
│      │  IMG  │                                               │
│      │       │              ┌───────┐                        │
│      └───────┘              │       │                        │
│                             │  IMG  │                        │
│   ○ ─────────────────────── │       │ ──────→ 카메라 경로    │
│                             └───────┘                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**구현 요소:**
- [ ] Three.js 씬 구성
- [ ] 이미지를 Plane Geometry에 텍스처로 적용
- [ ] 카메라 경로 정의 (곡선 또는 직선)
- [ ] ScrollTrigger로 스크롤-카메라 연동
- [ ] 이미지 호버 시 스케일 업 + 글로우 효과
- [ ] 이미지 클릭 시 상세 뷰 전환

### 4.3 마우스 인터랙션
```
┌─────────────────────────────────────────────────────────────┐
│                    MOUSE INTERACTIONS                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. 커스텀 커서                                              │
│     ┌───┐                                                    │
│     │ ● │  → 기본 상태: 작은 원                             │
│     └───┘                                                    │
│     ┌─────┐                                                  │
│     │  ●  │  → 호버 상태: 확대 + 텍스트                     │
│     │VIEW │                                                  │
│     └─────┘                                                  │
│                                                              │
│  2. 패럴랙스 효과                                            │
│     마우스 X,Y → 카메라/오브젝트 미세 이동                   │
│                                                              │
│  3. 3D 틸트                                                  │
│     이미지 호버 시 마우스 위치에 따라 3D 회전                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 4.4 스크롤 경험
```
스크롤 진행률: 0% ─────────────────────────────── 100%
               │                                    │
               ▼                                    ▼
            [INTRO]                             [FOOTER]
               │                                    │
               └── 3D 공간을 부드럽게 이동 ────────┘

Lenis 스무스 스크롤 + GSAP ScrollTrigger 연동
```

---

## 5. 디자인 시스템

### 5.1 컬러 팔레트
```css
:root {
  /* Primary */
  --color-bg: #0a0a0a;           /* 배경: 거의 검정 */
  --color-bg-secondary: #141414;  /* 보조 배경 */

  /* Text */
  --color-text: #ffffff;          /* 메인 텍스트: 흰색 */
  --color-text-muted: #888888;    /* 보조 텍스트 */

  /* Accent */
  --color-accent: #c9a66b;        /* 골드 악센트 */
  --color-accent-hover: #dbb87d;  /* 호버 시 */

  /* Effects */
  --color-glow: rgba(201, 166, 107, 0.3);  /* 글로우 효과 */
}
```

### 5.2 타이포그래피
```css
:root {
  /* Font Families */
  --font-display: 'Playfair Display', serif;  /* 헤드라인 */
  --font-body: 'Inter', sans-serif;            /* 본문 */
  --font-mono: 'JetBrains Mono', monospace;    /* 숫자/코드 */

  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
  --text-6xl: 4rem;      /* 64px */
  --text-hero: 8rem;     /* 128px - 히어로 타이틀 */
}
```

### 5.3 애니메이션 토큰
```css
:root {
  /* Durations */
  --duration-fast: 0.15s;
  --duration-normal: 0.3s;
  --duration-slow: 0.6s;
  --duration-slower: 1s;

  /* Easings */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-elastic: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

---

## 6. 컴포넌트 구조

### 6.1 디렉토리 구조
```
src/
├── app/
│   ├── layout.tsx              # 루트 레이아웃
│   ├── page.tsx                # 메인 페이지
│   ├── globals.css             # 글로벌 스타일
│   └── fonts/                  # 로컬 폰트
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # 헤더 (로고, 네비게이션)
│   │   ├── Footer.tsx          # 푸터
│   │   └── Preloader.tsx       # 로딩 화면
│   │
│   ├── sections/
│   │   ├── IntroSection.tsx    # 인트로 히어로
│   │   ├── GallerySection.tsx  # 3D 갤러리
│   │   ├── DetailSection.tsx   # 제품 상세
│   │   └── ContactSection.tsx  # 연락처
│   │
│   ├── three/
│   │   ├── Scene.tsx           # 메인 3D 씬
│   │   ├── Camera.tsx          # 카메라 컨트롤
│   │   ├── ImagePlane.tsx      # 이미지 평면
│   │   ├── Environment.tsx     # 환경 (조명, 배경)
│   │   └── Effects.tsx         # 후처리 효과
│   │
│   ├── ui/
│   │   ├── CustomCursor.tsx    # 커스텀 커서
│   │   ├── ScrollIndicator.tsx # 스크롤 인디케이터
│   │   ├── Button.tsx          # 버튼
│   │   └── Typography.tsx      # 타이포그래피
│   │
│   └── common/
│       ├── SmoothScroll.tsx    # Lenis 래퍼
│       └── AnimatedText.tsx    # 텍스트 애니메이션
│
├── hooks/
│   ├── useScrollProgress.ts    # 스크롤 진행률
│   ├── useMousePosition.ts     # 마우스 위치
│   ├── useLenis.ts             # Lenis 훅
│   └── useGSAP.ts              # GSAP 훅
│
├── lib/
│   ├── gsap.ts                 # GSAP 설정
│   ├── three.ts                # Three.js 유틸리티
│   └── utils.ts                # 공통 유틸리티
│
├── data/
│   └── products.ts             # 제품 데이터 (더미)
│
├── types/
│   └── index.ts                # TypeScript 타입
│
└── public/
    ├── images/
    │   ├── products/           # 제품 이미지
    │   └── textures/           # 텍스처
    └── fonts/                  # 폰트 파일
```

### 6.2 핵심 컴포넌트 명세

#### Scene.tsx
```typescript
interface SceneProps {
  products: Product[];
  scrollProgress: number;
}

// 기능:
// - Three.js 캔버스 렌더링
// - 카메라 경로 애니메이션
// - 이미지 평면 배치
// - 조명 설정
```

#### ImagePlane.tsx
```typescript
interface ImagePlaneProps {
  image: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  onHover?: () => void;
  onClick?: () => void;
}

// 기능:
// - 이미지 텍스처 로드
// - 호버 시 스케일/글로우 애니메이션
// - 클릭 이벤트 처리
// - 3D 틸트 효과
```

#### CustomCursor.tsx
```typescript
interface CursorState {
  x: number;
  y: number;
  isHovering: boolean;
  text?: string;
}

// 기능:
// - 마우스 위치 추적
// - 부드러운 따라가기 (lerp)
// - 호버 상태에 따른 변형
// - 텍스트 표시
```

---

## 7. 더미 데이터

### 7.1 제품 데이터 구조
```typescript
interface Product {
  id: string;
  name: string;
  category: 'tops' | 'bottoms' | 'outerwear';
  image: string;
  thumbnail: string;
  position: [number, number, number];  // 3D 공간 위치
  rotation?: [number, number, number]; // 3D 회전
  description?: string;
  price?: string;
}
```

### 7.2 더미 제품 목록
```typescript
const products: Product[] = [
  // 상의 (Tops)
  { id: 'top-1', name: 'Classic White Shirt', category: 'tops', ... },
  { id: 'top-2', name: 'Navy Sweater', category: 'tops', ... },
  { id: 'top-3', name: 'Striped Tee', category: 'tops', ... },

  // 하의 (Bottoms)
  { id: 'bottom-1', name: 'Tailored Trousers', category: 'bottoms', ... },
  { id: 'bottom-2', name: 'Denim Jeans', category: 'bottoms', ... },
  { id: 'bottom-3', name: 'Chino Pants', category: 'bottoms', ... },

  // 아우터 (Outerwear)
  { id: 'outer-1', name: 'Wool Coat', category: 'outerwear', ... },
  { id: 'outer-2', name: 'Leather Jacket', category: 'outerwear', ... },
  { id: 'outer-3', name: 'Trench Coat', category: 'outerwear', ... },
];
```

### 7.3 더미 이미지
플레이스홀더 이미지 생성 방법:
1. **Picsum Photos**: `https://picsum.photos/seed/{id}/800/1200`
2. **Placeholder.com**: `https://via.placeholder.com/800x1200/0a0a0a/c9a66b?text=Product`
3. **로컬 SVG**: 단색 배경 + 텍스트 SVG 생성

---

## 8. 성능 요구사항

### 8.1 로딩 성능
| 지표 | 목표 |
|------|------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3.5s |
| Total Bundle Size | < 500KB (gzipped) |

### 8.2 런타임 성능
| 지표 | 목표 |
|------|------|
| Frame Rate | 60fps |
| 3D 씬 메모리 | < 100MB |
| 이미지 로딩 | Progressive + Lazy |

### 8.3 최적화 전략
- [ ] 이미지 WebP 변환 + Next.js Image 최적화
- [ ] Three.js 인스턴싱 (동일 지오메트리 재사용)
- [ ] 텍스처 압축 (Basis Universal)
- [ ] Code Splitting (동적 import)
- [ ] Preload critical assets

---

## 9. 브라우저 지원

| 브라우저 | 최소 버전 |
|---------|----------|
| Chrome | 90+ |
| Firefox | 90+ |
| Safari | 15+ |
| Edge | 90+ |

**WebGL 2.0 필수** - 미지원 브라우저에는 폴백 메시지 표시

---

## 10. 마일스톤

### Phase 1: 기초 구축 (Day 1-2)
- [ ] Next.js 프로젝트 초기화
- [ ] 기본 레이아웃 구성
- [ ] Tailwind CSS 설정
- [ ] 폰트 및 컬러 시스템 적용

### Phase 2: 3D 씬 구축 (Day 3-4)
- [ ] React Three Fiber 설정
- [ ] 기본 씬 구성 (카메라, 조명)
- [ ] 이미지 평면 컴포넌트
- [ ] 더미 이미지 배치

### Phase 3: 애니메이션 (Day 5-6)
- [ ] Lenis 스무스 스크롤
- [ ] GSAP ScrollTrigger 연동
- [ ] 카메라 경로 애니메이션
- [ ] 호버/클릭 인터랙션

### Phase 4: 인터랙션 (Day 7-8)
- [ ] 커스텀 커서
- [ ] 마우스 패럴랙스
- [ ] 3D 틸트 효과
- [ ] 페이지 트랜지션

### Phase 5: 폴리싱 (Day 9-10)
- [ ] 프리로더
- [ ] 후처리 효과 (블룸, 비네팅)
- [ ] 반응형 처리
- [ ] 성능 최적화

---

## 11. 리스크 및 대응

| 리스크 | 영향 | 대응 방안 |
|--------|------|----------|
| WebGL 성능 이슈 | 높음 | LOD, 텍스처 최적화, 저사양 모드 |
| 모바일 지원 | 중간 | 터치 이벤트 처리, 간소화된 버전 |
| 브라우저 호환성 | 중간 | Feature detection, 폴백 UI |
| 이미지 로딩 지연 | 낮음 | 프리로더, Progressive loading |

---

## 12. 배포 전략

### 12.1 배포 플랫폼: Vercel

```
┌─────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT ARCHITECTURE                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [GitHub Repository]                                         │
│         │                                                    │
│         │  push / PR merge                                   │
│         ▼                                                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    Vercel                            │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │    │
│  │  │   Build     │→ │   Deploy    │→ │   CDN      │  │    │
│  │  │  (Next.js)  │  │  (Preview/  │  │  (Global)  │  │    │
│  │  │             │  │   Prod)     │  │            │  │    │
│  │  └─────────────┘  └─────────────┘  └────────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Edge Network (Global CDN)               │    │
│  │  [ICN] [NRT] [SIN] [FRA] [IAD] [SFO] ...            │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │                                   │
│                          ▼                                   │
│                     [End Users]                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 12.2 배포 환경

| 환경 | URL | 트리거 | 용도 |
|------|-----|--------|------|
| **Production** | `ggp-showroom.vercel.app` | `main` 브랜치 push | 운영 환경 |
| **Preview** | `ggp-showroom-{hash}.vercel.app` | PR 생성/업데이트 | 리뷰용 |
| **Development** | `localhost:3000` | 로컬 | 개발 |

### 12.3 CI/CD 파이프라인

```
┌─────────────────────────────────────────────────────────────┐
│                      CI/CD PIPELINE                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Code Push                                                │
│     └── GitHub Actions 트리거                                │
│                                                              │
│  2. Quality Gate                                             │
│     ├── ESLint 검사                                          │
│     ├── TypeScript 타입 체크                                 │
│     ├── Unit Tests (Vitest)                                  │
│     └── E2E Tests (Playwright)                               │
│                                                              │
│  3. Build                                                    │
│     ├── Next.js 빌드                                         │
│     ├── 이미지 최적화                                        │
│     └── 번들 분석                                            │
│                                                              │
│  4. Deploy                                                   │
│     ├── Preview (PR) → 자동 배포                             │
│     └── Production (main) → 자동 배포                        │
│                                                              │
│  5. Post-Deploy                                              │
│     ├── Lighthouse CI                                        │
│     └── 슬랙/디스코드 알림                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 12.4 Vercel 설정

```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "regions": ["icn1"],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

### 12.5 환경 변수

```env
# .env.local (개발용)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=

# Vercel 환경 변수 (프로덕션)
NEXT_PUBLIC_SITE_URL=https://ggp-showroom.vercel.app
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 12.6 도메인 설정

| 단계 | 도메인 | 비용 |
|------|--------|------|
| 초기 | `ggp-showroom.vercel.app` | 무료 |
| 커스텀 | `showroom.your-brand.com` | 도메인 비용만 |

### 12.7 GitHub Actions 워크플로우

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run test:e2e

  # Vercel이 자동으로 배포 처리
```

### 12.8 배포 체크리스트

**배포 전 (Pre-Deploy)**
- [ ] `/check --all` 통과
- [ ] 모든 테스트 통과
- [ ] 번들 사이즈 < 500KB (gzipped)
- [ ] Lighthouse 점수 > 90

**배포 후 (Post-Deploy)**
- [ ] 프로덕션 URL 접근 확인
- [ ] 3D 씬 로딩 확인
- [ ] 스크롤 애니메이션 동작 확인
- [ ] 모바일 반응형 확인
- [ ] 콘솔 에러 없음 확인

---

## 13. 참고 자료

### 기술 문서
- [Three.js 공식 문서](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Lenis](https://lenis.darkroom.engineering/)

### 영감 사이트
- [ThevertMenthe](https://thevertmenthe.dault-lafon.fr/)
- [Awwwards Three.js](https://www.awwwards.com/websites/three-js/)
- [Codrops Tutorials](https://tympanus.net/codrops/)

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.1.0 | 2025-12-16 | 배포 전략 섹션 추가 (Vercel, CI/CD, GitHub Actions) |
| 1.0.0 | 2025-12-16 | 초안 작성 |
