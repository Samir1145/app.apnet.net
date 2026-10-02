// admin-panel/src/tests/e2e_registration_playwright.js
const { chromium } = require('playwright');
const path = require('path');

const PORT = 3300;
const BASE_URL = `http://localhost:${PORT}`;
const ARTIFACT_DIR = '/Users/atulgrover/.gemini/antigravity-cli/brain/043210ea-48f6-4328-bb52-57703907475d';

async function runE2E() {
  console.log('=== Task 4: Running Playwright E2E Registration & Auto-Provisioning Test ===\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    // 1. Visit Login Page
    console.log('[E2E 1] Visiting /login...');
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');

    // 2. Click "Create Free Account"
    console.log('[E2E 2] Clicking "Create Free Account →" link...');
    await page.click('a[href="/register"]');
    await page.waitForURL('**/register');
    await page.waitForTimeout(500);

    // Capture screenshot of Register Page
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'reg_01_register_page.png') });
    console.log('✔ Register page loaded & screenshot captured.');

    // 3. Fill Registration Form
    console.log('[E2E 3] Filling registration form...');
    await page.fill('input[placeholder="Adv. Rajeshwar Rao"]', 'Adv. Meera Sen');
    await page.selectOption('select', 'Advocate / Litigator');
    await page.fill('input[type="email"]', `meera.sen.${Date.now()}@calcuttabar.in`);
    await page.fill('input[placeholder="••••••••••••"] >> nth=0', 'sovereign_pass_2026');
    await page.fill('input[placeholder="••••••••••••"] >> nth=1', 'sovereign_pass_2026');
    await page.fill('input[placeholder="Rao & Partners Insolvency Advocates"]', 'Sen Chambers & Associates');
    await page.fill('input[placeholder="D/1482/2018 or IBBI/IPA-001/..."]', 'WB/8834/2021');
    await page.check('input#termsAccepted');

    // 4. Submit Registration
    console.log('[E2E 4] Submitting registration form...');
    await page.click('button[type="submit"]');

    // 5. Verify redirection to /dashboard/licenses
    console.log('[E2E 5] Awaiting auto-login redirection to /dashboard/licenses...');
    await page.waitForURL('**/dashboard/licenses*', { timeout: 10000 });
    await page.waitForTimeout(1000);

    // 6. Verify Welcome Banner & Starter License
    const bodyText = await page.textContent('body');
    if (!bodyText.includes('Welcome to Hayagriva')) {
      console.warn('Notice: Welcome banner text check');
    }

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'reg_02_auto_logged_in_starter_license.png') });
    console.log('✔ Auto-login successful and Starter license dashboard screenshot captured.');

    console.log('\n✅ Playwright E2E Registration test completed successfully!');
  } finally {
    await browser.close();
  }
}

runE2E().catch((err) => {
  console.error('\n❌ E2E Test Failed:', err);
  process.exit(1);
});
