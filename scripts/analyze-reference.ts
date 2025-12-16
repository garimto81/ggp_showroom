import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const URL = 'https://thevertmenthe.dault-lafon.fr/';
const OUTPUT_DIR = path.join(__dirname, '../docs/reference-captures');

async function analyzeReference() {
  // 출력 디렉토리 생성
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: OUTPUT_DIR,
      size: { width: 1920, height: 1080 }
    }
  });

  const page = await context.newPage();

  console.log('1. 사이트 접속 중...');
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);

  // 초기 화면 스크린샷
  console.log('2. 초기 화면 캡처...');
  await page.screenshot({
    path: path.join(OUTPUT_DIR, '01-initial.png'),
    fullPage: false
  });

  // 페이지 정보 추출
  console.log('3. 페이지 정보 추출...');
  const pageInfo = await page.evaluate(() => {
    const body = document.body;
    const computedStyle = window.getComputedStyle(body);

    return {
      backgroundColor: computedStyle.backgroundColor,
      color: computedStyle.color,
      fontFamily: computedStyle.fontFamily,
      hasCanvas: document.querySelectorAll('canvas').length > 0,
      canvasCount: document.querySelectorAll('canvas').length,
      title: document.title,
      bodyClasses: body.className,
      allColors: Array.from(document.querySelectorAll('*')).slice(0, 100).map(el => {
        const style = window.getComputedStyle(el);
        return {
          tag: el.tagName,
          bg: style.backgroundColor,
          color: style.color
        };
      }).filter(item => item.bg !== 'rgba(0, 0, 0, 0)')
    };
  });

  console.log('페이지 정보:', JSON.stringify(pageInfo, null, 2));

  // 스크롤 시뮬레이션 및 캡처
  console.log('4. 스크롤 시뮬레이션...');
  const scrollSteps = [0, 25, 50, 75, 100];

  for (let i = 0; i < scrollSteps.length; i++) {
    const percent = scrollSteps[i];
    await page.evaluate((p) => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, (maxScroll * p) / 100);
    }, percent);

    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, `02-scroll-${percent}percent.png`),
      fullPage: false
    });
    console.log(`   스크롤 ${percent}% 캡처 완료`);
  }

  // 마우스 이동 테스트
  console.log('5. 마우스 인터랙션 테스트...');
  await page.mouse.move(960, 540);
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(OUTPUT_DIR, '03-mouse-center.png'),
    fullPage: false
  });

  // 호버 테스트 - 이미지 요소 찾기
  const images = await page.$$('img, canvas, [class*="image"], [class*="gallery"]');
  if (images.length > 0) {
    await images[0].hover();
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '04-hover-element.png'),
      fullPage: false
    });
  }

  // HTML 구조 저장
  console.log('6. HTML 구조 저장...');
  const htmlContent = await page.content();
  fs.writeFileSync(path.join(OUTPUT_DIR, 'page-source.html'), htmlContent);

  // CSS 변수 추출
  const cssVars = await page.evaluate(() => {
    const root = document.documentElement;
    const styles = getComputedStyle(root);
    const vars: Record<string, string> = {};

    for (let i = 0; i < styles.length; i++) {
      const prop = styles[i];
      if (prop.startsWith('--')) {
        vars[prop] = styles.getPropertyValue(prop);
      }
    }
    return vars;
  });

  console.log('CSS 변수:', JSON.stringify(cssVars, null, 2));

  // 분석 결과 저장
  const analysisResult = {
    url: URL,
    timestamp: new Date().toISOString(),
    pageInfo,
    cssVars,
    screenshots: [
      '01-initial.png',
      '02-scroll-0percent.png',
      '02-scroll-25percent.png',
      '02-scroll-50percent.png',
      '02-scroll-75percent.png',
      '02-scroll-100percent.png',
      '03-mouse-center.png',
      '04-hover-element.png'
    ]
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'analysis-result.json'),
    JSON.stringify(analysisResult, null, 2)
  );

  console.log('7. 녹화 종료 중...');
  await page.waitForTimeout(2000);
  await context.close();
  await browser.close();

  console.log('\n분석 완료!');
  console.log(`결과 저장 위치: ${OUTPUT_DIR}`);
}

analyzeReference().catch(console.error);
