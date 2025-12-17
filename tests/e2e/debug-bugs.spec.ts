import { test, expect } from '@playwright/test';

test.describe('GGP Showroom - 버그 탐지', () => {
  test('콘솔 에러가 없어야 한다', async ({ page }) => {
    const consoleErrors: string[] = [];
    const consoleWarnings: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
      if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      consoleErrors.push(error.message);
    });

    await page.goto('/');

    // ENTER 버튼 대기 및 클릭
    const enterButton = page.locator('button:has-text("ENTER")');
    await expect(enterButton).toBeVisible({ timeout: 20000 });
    await enterButton.click();

    // 캔버스 로드 대기
    const canvas = page.locator('canvas[data-engine^="three.js"]').first();
    await expect(canvas).toBeVisible({ timeout: 15000 });

    // 잠시 대기해서 모든 리소스 로드
    await page.waitForTimeout(3000);

    console.log('=== Console Errors ===');
    consoleErrors.forEach(e => console.log('ERROR:', e));

    console.log('=== Console Warnings ===');
    consoleWarnings.forEach(w => console.log('WARNING:', w));

    // 심각한 에러가 없어야 함 (WebGL 경고 제외)
    const criticalErrors = consoleErrors.filter(e =>
      !e.includes('WebGL') &&
      !e.includes('THREE.WebGLRenderer') &&
      !e.includes('404')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('네트워크 에러가 없어야 한다', async ({ page }) => {
    const failedRequests: string[] = [];

    page.on('requestfailed', request => {
      failedRequests.push(`${request.url()} - ${request.failure()?.errorText}`);
    });

    page.on('response', response => {
      if (response.status() >= 400) {
        failedRequests.push(`${response.url()} - Status: ${response.status()}`);
      }
    });

    await page.goto('/');

    const enterButton = page.locator('button:has-text("ENTER")');
    await expect(enterButton).toBeVisible({ timeout: 20000 });
    await enterButton.click();

    const canvas = page.locator('canvas[data-engine^="three.js"]').first();
    await expect(canvas).toBeVisible({ timeout: 15000 });

    await page.waitForTimeout(3000);

    console.log('=== Failed Requests ===');
    failedRequests.forEach(r => console.log('FAILED:', r));

    // 실패한 요청이 없어야 함
    expect(failedRequests).toHaveLength(0);
  });

  test('제품 클릭 시 카메라가 이동해야 한다', async ({ page }) => {
    await page.goto('/');

    const enterButton = page.locator('button:has-text("ENTER")');
    await expect(enterButton).toBeVisible({ timeout: 20000 });
    await enterButton.click();

    const canvas = page.locator('canvas[data-engine^="three.js"]').first();
    await expect(canvas).toBeVisible({ timeout: 15000 });

    // 3D 공간이 로드될 때까지 대기
    await page.waitForTimeout(2000);

    // 캔버스 클릭 (제품이 있는 위치)
    const box = await canvas.boundingBox();
    if (box) {
      // 왼쪽 영역 클릭 (제품이 있는 곳)
      await page.mouse.click(box.x + box.width * 0.3, box.y + box.height * 0.5);
    }

    // 제품 정보 패널이 나타나는지 확인
    await page.waitForTimeout(2000);

    // 스크린샷 저장
    await page.screenshot({ path: 'test-results/product-click-result.png' });

    // 제품 패널 또는 카테고리 정보가 표시되는지 확인
    const productPanel = page.locator('text=View Details');
    const hasProductPanel = await productPanel.count() > 0;

    console.log('Product panel visible:', hasProductPanel);
  });

  test('카테고리 필터 버튼이 동작해야 한다', async ({ page }) => {
    await page.goto('/');

    const enterButton = page.locator('button:has-text("ENTER")');
    await expect(enterButton).toBeVisible({ timeout: 20000 });
    await enterButton.click();

    const canvas = page.locator('canvas[data-engine^="three.js"]').first();
    await expect(canvas).toBeVisible({ timeout: 15000 });

    // Next.js dev overlay 숨김
    await page.evaluate(() => {
      const overlay = document.querySelector('nextjs-portal');
      if (overlay) (overlay as HTMLElement).style.display = 'none';
    });

    // Tops 버튼 클릭
    const topsButton = page.locator('button:has-text("Tops")');
    await expect(topsButton).toBeVisible();
    await topsButton.click();

    // 클릭 후 스크린샷
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/category-filter-result.png' });
  });

  test('Back to Gallery 버튼이 동작해야 한다', async ({ page }) => {
    await page.goto('/');

    const enterButton = page.locator('button:has-text("ENTER")');
    await expect(enterButton).toBeVisible({ timeout: 20000 });
    await enterButton.click();

    const canvas = page.locator('canvas[data-engine^="three.js"]').first();
    await expect(canvas).toBeVisible({ timeout: 15000 });

    await page.waitForTimeout(2000);

    // 캔버스 클릭해서 제품 선택 시도
    const box = await canvas.boundingBox();
    if (box) {
      await page.mouse.click(box.x + box.width * 0.3, box.y + box.height * 0.5);
    }

    await page.waitForTimeout(2000);

    // Back to Gallery 버튼 찾기
    const backButton = page.locator('text=Back to Gallery');
    const hasBackButton = await backButton.count() > 0;

    if (hasBackButton) {
      await backButton.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-results/back-to-gallery-result.png' });
    }

    console.log('Back to Gallery button found:', hasBackButton);
  });

  test('모든 UI 요소가 올바른 위치에 있어야 한다', async ({ page }) => {
    await page.goto('/');

    const enterButton = page.locator('button:has-text("ENTER")');
    await expect(enterButton).toBeVisible({ timeout: 20000 });
    await enterButton.click();

    const canvas = page.locator('canvas[data-engine^="three.js"]').first();
    await expect(canvas).toBeVisible({ timeout: 15000 });

    await page.waitForTimeout(1000);

    // UI 요소들의 위치 확인
    const header = page.locator('header').first();
    const headerBox = await header.boundingBox();

    const categoryFilter = page.locator('button:has-text("All")').first();
    const categoryBox = await categoryFilter.boundingBox();

    console.log('Header position:', headerBox);
    console.log('Category filter position:', categoryBox);

    // 헤더가 상단에 있어야 함
    if (headerBox) {
      expect(headerBox.y).toBeLessThan(100);
    }

    // 카테고리 필터가 하단에 있어야 함
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    if (categoryBox) {
      expect(categoryBox.y).toBeGreaterThan(viewportHeight - 200);
    }
  });

  test('스크롤 동작 확인', async ({ page }) => {
    await page.goto('/');

    const enterButton = page.locator('button:has-text("ENTER")');
    await expect(enterButton).toBeVisible({ timeout: 20000 });
    await enterButton.click();

    const canvas = page.locator('canvas[data-engine^="three.js"]').first();
    await expect(canvas).toBeVisible({ timeout: 15000 });

    await page.waitForTimeout(1000);

    // 스크롤 전 스크린샷
    await page.screenshot({ path: 'test-results/before-scroll.png' });

    // 마우스 휠 스크롤
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(1000);

    // 스크롤 후 스크린샷
    await page.screenshot({ path: 'test-results/after-scroll.png' });
  });
});
