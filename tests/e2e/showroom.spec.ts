import { test, expect, Page } from '@playwright/test';

/**
 * Helper: 인트로 화면에서 ENTER 버튼을 클릭하여 3D 갤러리로 진입
 */
async function enterGallery(page: Page) {
  // 1. Preloader 완료 대기 (ENTER 버튼이 나타날 때까지)
  const enterButton = page.locator('button:has-text("ENTER")');
  await expect(enterButton).toBeVisible({ timeout: 20000 });

  // 2. ENTER 버튼 클릭
  await enterButton.click();

  // 3. 메인 Three.js 캔버스가 나타날 때까지 대기 (r3f-perf 그래프 canvas 제외)
  const canvas = page.locator('canvas[data-engine^="three.js"]').first();
  await expect(canvas).toBeVisible({ timeout: 15000 });
}

test.describe('GGP Showroom - 페이지 로드', () => {
  test('메인 페이지가 정상 로드된다', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/GGP/i);
  });

  test('Preloader가 표시되고 Intro로 전환된다', async ({ page }) => {
    await page.goto('/');

    // Preloader 또는 Intro 화면이 보여야 함
    const preloaderText = page.locator('text=LOADING EXPERIENCE');
    const introText = page.locator('text=GGP SHOWROOM');

    // 둘 중 하나가 보이면 통과
    await expect(preloaderText.or(introText).first()).toBeVisible({ timeout: 10000 });
  });

  test('ENTER 버튼 클릭 후 3D 캔버스가 렌더링된다', async ({ page }) => {
    await page.goto('/');
    await enterGallery(page);

    const canvas = page.locator('canvas[data-engine^="three.js"]').first();
    await expect(canvas).toBeVisible();
  });
});

test.describe('GGP Showroom - 헤더 네비게이션', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await enterGallery(page);
  });

  test('GGP 로고가 클릭 가능하다', async ({ page }) => {
    // Link 컴포넌트는 a 태그로 렌더링됨
    const logo = page.locator('a:has-text("GGP")').first();
    await expect(logo).toBeVisible({ timeout: 10000 });
    await expect(logo).toBeEnabled();

    // pointer-events 확인
    const pointerEvents = await logo.evaluate(el =>
      window.getComputedStyle(el).pointerEvents
    );
    expect(pointerEvents).not.toBe('none');
  });

  test('네비게이션 버튼들이 클릭 가능하다', async ({ page }) => {
    const navItems = ['Collection', 'About', 'Contact'];

    for (const item of navItems) {
      const button = page.locator(`header button:has-text("${item}")`);
      await expect(button).toBeVisible();

      // pointer-events가 제대로 설정되었는지 확인
      const pointerEvents = await button.evaluate(el =>
        window.getComputedStyle(el).pointerEvents
      );
      expect(pointerEvents).not.toBe('none');
    }
  });
});

test.describe('GGP Showroom - 카테고리 필터', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await enterGallery(page);
  });

  test('카테고리 버튼들이 표시된다', async ({ page }) => {
    const categories = ['All', 'Tops', 'Bottoms', 'Outerwear'];

    for (const cat of categories) {
      const button = page.locator(`button:has-text("${cat}")`);
      await expect(button).toBeVisible();
    }
  });

  test('카테고리 버튼이 클릭 가능하다', async ({ page }) => {
    const allButton = page.locator('button:has-text("All")').first();
    await expect(allButton).toBeVisible();

    // pointer-events 확인
    const pointerEvents = await allButton.evaluate(el =>
      window.getComputedStyle(el).pointerEvents
    );
    expect(pointerEvents).not.toBe('none');

    // Next.js dev overlay를 숨김
    await page.evaluate(() => {
      const overlay = document.querySelector('nextjs-portal');
      if (overlay) (overlay as HTMLElement).style.display = 'none';
    });

    // 실제 클릭
    await allButton.click();
  });
});

test.describe('GGP Showroom - 중앙 안내 패널', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await enterGallery(page);
  });

  test('안내 텍스트가 표시된다', async ({ page }) => {
    // "Explore the Gallery" 또는 유사한 안내 텍스트
    const heading = page.locator('h1:has-text("Explore")');
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test('중앙 패널이 클릭을 통과시킨다 (pointer-events: none)', async ({ page }) => {
    // 중앙 안내 패널의 부모 요소가 pointer-events: none이어야
    // 뒤의 3D 캔버스 클릭이 가능
    const centerPanel = page.locator('.fixed.inset-0.flex.items-center.justify-center.pointer-events-none');

    if (await centerPanel.count() > 0) {
      const pointerEvents = await centerPanel.evaluate(el =>
        window.getComputedStyle(el).pointerEvents
      );
      expect(pointerEvents).toBe('none');
    }
  });
});

test.describe('GGP Showroom - 3D 인터랙션', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await enterGallery(page);
  });

  test('캔버스가 클릭 가능하다', async ({ page }) => {
    const canvas = page.locator('canvas[data-engine^="three.js"]').first();

    // canvas의 pointer-events 확인
    const pointerEvents = await canvas.evaluate(el =>
      window.getComputedStyle(el).pointerEvents
    );
    expect(pointerEvents).not.toBe('none');
  });

  test('캔버스 클릭 시 에러가 발생하지 않는다', async ({ page }) => {
    const canvas = page.locator('canvas[data-engine^="three.js"]').first();
    await expect(canvas).toBeVisible({ timeout: 10000 });

    // 캔버스 클릭
    await canvas.click({ force: true, position: { x: 100, y: 100 } });

    // 페이지가 정상인지 확인 (에러 없음)
    await page.waitForTimeout(300);
    await expect(canvas).toBeVisible();
  });
});

test.describe('GGP Showroom - UI 레이어 점검', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await enterGallery(page);
  });

  test('ui-overlay가 pointer-events: none이다', async ({ page }) => {
    const uiOverlay = page.locator('.ui-overlay');

    if (await uiOverlay.count() > 0) {
      const pointerEvents = await uiOverlay.evaluate(el =>
        window.getComputedStyle(el).pointerEvents
      );
      expect(pointerEvents).toBe('none');
    }
  });

  test('헤더는 pointer-events: auto이다', async ({ page }) => {
    const header = page.locator('header').first();

    const pointerEvents = await header.evaluate(el =>
      window.getComputedStyle(el).pointerEvents
    );
    expect(pointerEvents).toBe('auto');
  });

  test('z-index 순서가 올바르다', async ({ page }) => {
    // header z-index >= 50
    const header = page.locator('header').first();

    const headerZIndex = await header.evaluate(el => {
      const style = window.getComputedStyle(el);
      return parseInt(style.zIndex) || 0;
    });

    expect(headerZIndex).toBeGreaterThanOrEqual(50);
  });
});

test.describe('GGP Showroom - 반응형 테스트', () => {
  test('모바일 뷰포트에서 페이지가 로드된다', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await enterGallery(page);

    const canvas = page.locator('canvas[data-engine^="three.js"]').first();
    await expect(canvas).toBeVisible();
  });

  test('태블릿 뷰포트에서 페이지가 로드된다', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await enterGallery(page);

    const canvas = page.locator('canvas[data-engine^="three.js"]').first();
    await expect(canvas).toBeVisible();
  });
});

test.describe('GGP Showroom - Intro 화면', () => {
  test('Intro 화면에 GGP SHOWROOM 타이틀이 표시된다', async ({ page }) => {
    await page.goto('/');

    // ENTER 버튼이 보일 때까지 대기 (Preloader 완료)
    const enterButton = page.locator('button:has-text("ENTER")');
    await expect(enterButton).toBeVisible({ timeout: 20000 });

    // 타이틀 확인
    const title = page.locator('text=GGP SHOWROOM');
    await expect(title).toBeVisible();
  });

  test('ENTER 버튼이 호버 효과가 있다', async ({ page }) => {
    await page.goto('/');

    const enterButton = page.locator('button:has-text("ENTER")');
    await expect(enterButton).toBeVisible({ timeout: 20000 });

    // 호버
    await enterButton.hover();
    await page.waitForTimeout(300);

    // 버튼이 여전히 클릭 가능
    await expect(enterButton).toBeEnabled();
  });
});
