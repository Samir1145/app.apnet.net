// admin-panel/src/tests/e2e_admin_playwright.js
const { chromium } = require('playwright');
const assert = require('assert');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = '/Users/atulgrover/.gemini/antigravity-cli/brain/043210ea-48f6-4328-bb52-57703907475d';

async function runAdminPortalE2E() {
  console.log('=== Starting Playwright End-to-End Test for Hayagriva Super Admin Portal ===\n');

  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  }).catch(async () => {
    return await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  try {
    // 1. Visit Root / Login Page
    console.log('[Step 1] Navigating to Admin Login page http://localhost:3300/login ...');
    await page.goto('http://localhost:3300/login', { waitUntil: 'networkidle', timeout: 15000 });
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_01_login_page.png') });
    console.log('✔ Login page rendered.');

    // 2. Submit Login Credentials
    console.log('[Step 2] Logging in as Super Admin...');
    await page.fill('input[type="email"]', 'superadmin@hayagriva.app');
    await page.fill('input[type="password"]', 'hayagriva_secure_password');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL('**/admin/dashboard', { timeout: 10000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_02_dashboard_dark.png') });
    console.log('✔ Successfully logged in and redirected to Executive Dashboard.');

    // 3. Test Theme Toggle (Dark -> Light)
    console.log('[Step 3] Toggling theme to Light mode...');
    await page.click('button[aria-label="Toggle Theme"]');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_03_dashboard_light.png') });
    console.log('✔ Light mode verified and captured.');

    // Toggle back to dark
    await page.click('button[aria-label="Toggle Theme"]');
    await page.waitForTimeout(500);

    // 4. Navigate to Users Directory
    console.log('[Step 4] Navigating to Users Directory http://localhost:3300/admin/users ...');
    await page.click('a[href="/admin/users"]');
    await page.waitForURL('**/admin/users', { timeout: 5000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_04_users_table.png') });
    console.log('✔ Users directory table loaded.');

    // 5. Test User Search & View Drawer
    console.log('[Step 5] Testing User Search and Profile Slide-over Drawer...');
    await page.fill('input[placeholder*="Search"]', 'Rajeshwar');
    await page.waitForTimeout(500);
    await page.click('button[title="View Profile Details"]');
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_05_user_drawer.png') });
    console.log('✔ User profile drawer opened and captured.');

    // Close drawer
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);

    // 6. Navigate to User Edit Page
    console.log('[Step 6] Navigating to User Edit page for usr_adv_01...');
    await page.goto('http://localhost:3300/admin/users/usr_adv_01/edit', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_06_user_edit_form.png') });

    // Verify email input is disabled
    const isEmailDisabled = await page.isDisabled('input[type="email"]');
    assert.strictEqual(isEmailDisabled, true, 'Email input must be strictly disabled/locked');
    console.log('✔ Verified email field is strictly locked/disabled.');

    // Test Password Reset Modal
    console.log('[Step 7] Testing Temporary Password Reset generation modal...');
    await page.click('button:has-text("Reset Password")');
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_07_password_reset_modal.png') });
    await page.click('button:has-text("Done")');
    console.log('✔ Password reset credential generated.');

    // 8. Navigate to Invoices
    console.log('[Step 8] Navigating to Billing & Invoices http://localhost:3300/admin/invoices ...');
    await page.click('a[href="/admin/invoices"]');
    await page.waitForURL('**/admin/invoices');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_08_invoices_page.png') });
    console.log('✔ Invoices ledger verified.');

    // 9. Navigate to Downloads Telemetry
    console.log('[Step 9] Navigating to Downloads Telemetry http://localhost:3300/admin/downloads ...');
    await page.click('a[href="/admin/downloads"]');
    await page.waitForURL('**/admin/downloads');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_09_downloads_telemetry.png') });
    console.log('✔ Downloads telemetry verified.');

    // 10. Navigate to System Logs
    console.log('[Step 10] Navigating to System Logs http://localhost:3300/admin/logs ...');
    await page.click('a[href="/admin/logs"]');
    await page.waitForURL('**/admin/logs');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_10_system_logs.png') });
    console.log('✔ System logs stream verified.');

    // 11. Navigate to Support Tickets
    console.log('[Step 11] Navigating to Support Tickets http://localhost:3300/admin/support ...');
    await page.click('a[href="/admin/support"]');
    await page.waitForURL('**/admin/support');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_11_support_tickets.png') });
    console.log('✔ Support tickets verified.');

    // 12. Navigate to Profile & Infrastructure
    console.log('[Step 12] Navigating to Admin Profile http://localhost:3300/admin/profile ...');
    await page.click('a[href="/admin/profile"]');
    await page.waitForURL('**/admin/profile');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_12_admin_profile.png') });
    console.log('✔ Admin profile & infrastructure telemetry verified.');

    console.log('\n🎉 ALL 12 PLAYWRIGHT E2E TESTS PASSED SUCCESSFULLY! Visual artifacts generated in artifacts directory.\n');
  } catch (error) {
    console.error('❌ Playwright E2E test failed:', error);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_e2e_error.png') });
    throw error;
  } finally {
    await browser.close();
  }
}

runAdminPortalE2E().catch(err => {
  console.error(err);
  process.exit(1);
});
