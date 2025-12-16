# PRD-002: GGP Showroom UI/UX Enhancement

**Version**: 1.0
**Date**: 2025-12-16
**Status**: Draft
**Priority**: High

---

## 1. Overview

GGP Showroom의 UI/UX를 2025년 최신 웹 디자인 트렌드에 맞게 개선합니다.
Glassmorphism, 풀 3D 인터랙션, 클립 패스 전환 효과를 적용하여 몰입감 있는 럭셔리 패션 쇼룸 경험을 제공합니다.

### 1.1 Goals
- 세련된 Glassmorphism UI 적용
- 호버 tilt, 파티클 등 풀 3D 인터랙션 구현
- 클립 패스 마스킹 전환 효과 추가
- r3f-perf 성능 모니터링 도입
- 60fps 유지하며 시각적 품질 향상

### 1.2 References
- [Awwwards 3D Websites](https://www.awwwards.com/websites/3d/)
- [Cartier Watches & Wonders](https://www.awwwards.com/watches-wonders-immersive-experience-for-cartier.html)
- [Glassmorphism UI Trend 2025](https://www.designstudiouiux.com/blog/what-is-glassmorphism-ui-trend/)

---

## 2. Technical Specifications

### 2.1 UI Style: Glassmorphism

```css
/* Glassmorphism 기본 스타일 */
.glass-panel {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* 다크 글래스 변형 */
.glass-panel-dark {
  background: rgba(26, 26, 26, 0.6);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

**적용 대상:**
| 컴포넌트 | 스타일 | 용도 |
|----------|--------|------|
| ProductDetail | glass-panel | 제품 상세 정보 |
| Navigation | glass-panel-dark | 상단 네비게이션 |
| CategoryFilter | glass-panel | 카테고리 필터 |
| BackButton | glass-panel-dark | 뒤로가기 버튼 |

### 2.2 3D Interactions

#### 2.2.1 Hover Tilt Effect
마우스 위치에 따른 3D 기울기 효과

```typescript
// ImagePlane에 추가
const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
  if (!meshRef.current) return;

  const { uv } = e;
  if (!uv) return;

  // UV 좌표를 -1 ~ 1 범위로 변환
  const tiltX = (uv.y - 0.5) * 0.3; // 최대 ±15도
  const tiltY = (uv.x - 0.5) * -0.3;

  gsap.to(meshRef.current.rotation, {
    x: tiltX,
    y: tiltY,
    duration: 0.3,
    ease: 'power2.out'
  });
};
```

#### 2.2.2 Particle Trail Effect
카메라 이동 시 파티클 트레일

```typescript
// WarpEffect 개선
const TRAIL_PARTICLE_COUNT = 200;

// 스피드 라인 + 글로우 파티클 조합
// 카메라 방향에 따라 파티클 흐름 조정
```

#### 2.2.3 Camera Easing Enhancement
더 부드러운 카메라 이동

```typescript
// CameraController 개선
gsap.to(camera.position, {
  duration: 1.5, // 1.2 → 1.5
  ease: 'power3.inOut', // power2 → power3
  onUpdate: () => {
    // 부드러운 lookAt 보간
    lookAtTarget.lerp(newLookAt, 0.05);
    camera.lookAt(lookAtTarget);
  }
});
```

### 2.3 Clip Path Masking Transition

제품 선택 시 원형 마스킹 전환 효과

```typescript
// TransitionOverlay.tsx (신규)
interface ClipPathTransition {
  type: 'circle' | 'rectangle' | 'diagonal';
  origin: [number, number]; // 클릭 위치
  duration: number;
}

// CSS
.transition-mask {
  position: fixed;
  inset: 0;
  background: var(--color-bg);
  clip-path: circle(0% at var(--origin-x) var(--origin-y));
  transition: clip-path 0.8s cubic-bezier(0.77, 0, 0.175, 1);
}

.transition-mask.active {
  clip-path: circle(150% at var(--origin-x) var(--origin-y));
}
```

### 2.4 Performance Monitoring

r3f-perf 설치 및 설정

```bash
npm install r3f-perf
```

```typescript
// Scene.tsx
import { Perf } from 'r3f-perf';

function SceneContent() {
  return (
    <>
      {process.env.NODE_ENV === 'development' && (
        <Perf position="top-left" />
      )}
      {/* ... */}
    </>
  );
}
```

---

## 3. Component Structure

### 3.1 New Components

```
src/components/
├── ui/
│   ├── GlassPanel.tsx        # Glassmorphism 패널
│   ├── TransitionOverlay.tsx # 클립 패스 전환
│   └── TiltCard.tsx          # 3D 기울기 카드
├── three/
│   ├── ParticleTrail.tsx     # 파티클 트레일
│   └── EnhancedImagePlane.tsx # 개선된 이미지 플레인
└── layout/
    └── GlassHeader.tsx       # 글래스 헤더
```

### 3.2 Modified Components

| 컴포넌트 | 변경 사항 |
|----------|----------|
| `ImagePlane.tsx` | 호버 tilt 효과 추가 |
| `WarpEffect.tsx` | 파티클 트레일 개선 |
| `CameraController.tsx` | 이징 곡선 개선 |
| `UIOverlay.tsx` | Glassmorphism 적용 |
| `Scene.tsx` | r3f-perf 추가 |

---

## 4. Implementation Plan

### Phase 1: Glassmorphism UI (Day 1)
- [ ] `GlassPanel.tsx` 컴포넌트 생성
- [ ] CSS 변수 및 유틸리티 클래스 추가
- [ ] `UIOverlay` Glassmorphism 적용
- [ ] `Header` Glassmorphism 적용

### Phase 2: 3D Interactions (Day 1-2)
- [ ] `ImagePlane` 호버 tilt 효과 추가
- [ ] `WarpEffect` 파티클 트레일 개선
- [ ] `CameraController` 이징 개선
- [ ] 호버 시 글로우 효과 강화

### Phase 3: Transition Effects (Day 2)
- [ ] `TransitionOverlay.tsx` 생성
- [ ] 클립 패스 마스킹 구현
- [ ] 제품 선택 시 전환 연동
- [ ] 뒤로가기 역방향 전환

### Phase 4: Performance & Polish (Day 3)
- [ ] r3f-perf 설치 및 설정
- [ ] 성능 최적화 (60fps 목표)
- [ ] 모바일 대응
- [ ] 최종 테스트

---

## 5. Design Mockup (ASCII)

### 5.1 Glassmorphism UI

```
┌─────────────────────────────────────────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░  ┌─────────────────────────────────────────────────┐  ░░  │
│  ░░  │  GGP SHOWROOM              [TOPS] [BOTTOMS] [ALL]│  ░░  │
│  ░░  └─────────────────────────────────────────────────┘  ░░  │
│  ░░                     Glass Header                      ░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                                                 │
│       ┌─────────┐                       ┌─────────┐             │
│       │ ╭─────╮ │                       │ ╭─────╮ │             │
│       │ │     │ │   ← Tilt on hover →   │ │     │ │             │
│       │ │ 👕  │ │                       │ │ 👔  │ │             │
│       │ ╰─────╯ │                       │ ╰─────╯ │             │
│       └─────────┘                       └─────────┘             │
│                                                                 │
│                    ┌───────────────────┐                        │
│                    │ ╭───────────────╮ │                        │
│                    │ │               │ │                        │
│                    │ │     👗       │ │                        │
│                    │ ╰───────────────╯ │                        │
│                    └───────────────────┘                        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   │
│  │ ░░  Classic White Shirt                              ░░ │   │
│  │ ░░  $120 | Timeless elegance                         ░░ │   │
│  │ ░░                                    [VIEW DETAILS] ░░ │   │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                        Glass Panel                              │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Clip Path Transition

```
┌─────────────────────┐     ┌─────────────────────┐
│                     │     │          ○          │
│    Click Product    │  →  │        ○○○○○        │
│         ↓           │     │      ○○○○○○○○○      │
│        [👕]         │     │    ○○○○○○○○○○○○○    │
│                     │     │  ○○○○○○○○○○○○○○○○○  │
└─────────────────────┘     └─────────────────────┘
                                      ↓
┌─────────────────────┐     ┌─────────────────────┐
│○○○○○○○○○○○○○○○○○○○○○│     │                     │
│○○○○○○○○○○○○○○○○○○○○○│  →  │   Product Detail    │
│○○○○○○○○○○○○○○○○○○○○○│     │      View           │
│○○○○○○○○○○○○○○○○○○○○○│     │                     │
│○○○○○○○○○○○○○○○○○○○○○│     │                     │
└─────────────────────┘     └─────────────────────┘
```

---

## 6. Success Metrics

| 메트릭 | 목표 | 측정 방법 |
|--------|------|----------|
| FPS | >= 60fps | r3f-perf |
| First Contentful Paint | < 1.5s | Lighthouse |
| Interaction Response | < 100ms | Performance API |
| Draw Calls | < 200 | r3f-perf |
| Bundle Size | < 500KB | build output |

---

## 7. Dependencies

### New Packages
```json
{
  "r3f-perf": "^7.x"
}
```

### Existing (No Change)
- @react-three/fiber
- @react-three/drei
- gsap
- framer-motion
- zustand

---

## 8. Risks & Mitigations

| 리스크 | 영향 | 완화 방안 |
|--------|------|----------|
| backdrop-filter 성능 | 모바일 느림 | 모바일에서 blur 감소 |
| 파티클 과다 | FPS 저하 | 동적 파티클 수 조절 |
| 클립 패스 호환성 | 구형 브라우저 | fallback 페이드 효과 |

---

## 9. Timeline

```
Day 1: Phase 1 (Glassmorphism) + Phase 2 시작
Day 2: Phase 2 완료 + Phase 3 (Transitions)
Day 3: Phase 4 (Performance) + 최종 테스트
```

---

## 10. Related Documents

- [PRD-001: GGP Clothing Showroom](./PRD-001-CLOTHING-SHOWROOM.md)
- [Awwwards 3D Collection](https://www.awwwards.com/websites/3d/)
- [R3F Performance Guide](https://r3f.docs.pmnd.rs/advanced/scaling-performance)

---

**Next Steps**: `/todo` 실행하여 Task 목록 생성
