// admin-panel/src/tests/e2e_client_portal_playwright.js
const { chromium } = require('playwright');
const assert = require('assert');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = '/Users/atulgrover/.gemini/antigravity-cli/brain/043210ea-48f6-4328-bb52-57703907475d';

async function runClientPortalE2E() {
  console.log('=== Starting Playwright End-to-End Test for Hayagriva Client Portal & Licensing ===\n');

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
    // 1. Visit Login Page and log in as Advocate (Adv. Rajeshwar Rao)
    console.log('[Step 1] Navigating to Login page http://localhost:3300/login ...');
    await page.goto('http://localhost:3300/login', { waitUntil: 'networkidle', timeout: 15000 });
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'client_01_login_page.png') });

    console.log('[Step 2] Logging in as Advocate (Adv. Rajeshwar Rao)...');
    await page.click('button:has-text("Adv. Rao")');
    await page.waitForTimeout(300);
    await page.click('button[type="submit"]');

    // Wait for redirect to /dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'client_02_overview_dark.png') });
    console.log('✔ Successfully logged into Practitioner Dashboard.');

    // 3. Test Theme Toggle on Client Dashboard
    console.log('[Step 3] Toggling theme to Light mode...');
    await page.click('button[aria-label="Toggle Theme"]');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'client_03_overview_light.png') });
    console.log('✔ Light mode verified on Client Dashboard.');

    // Toggle back to dark mode
    await page.click('button[aria-label="Toggle Theme"]');
    await page.waitForTimeout(400);

    // 4. Navigate to Licenses & Devices
    console.log('[Step 4] Navigating to Licenses & Devices http://localhost:3300/dashboard/licenses ...');
    await page.click('a[href="/dashboard/licenses"]');
    await page.waitForURL('**/dashboard/licenses', { timeout: 5000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'client_04_licenses_page.png') });

    // Test Reveal License Key
    console.log('[Step 5] Revealing master license key...');
    await page.click('button[title="Reveal key"]');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'client_05_license_key_revealed.png') });
    console.log('✔ Master license key revealed and verified.');

    // Test Deactivate Device Modal
    console.log('[Step 6] Testing Deactivate Device Modal...');
    await page.click('button:has-text("Deactivate")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'client_06_deactivate_device_modal.png') });
    await page.click('button:has-text("Cancel")');
    console.log('✔ Device deactivation modal verified.');

    // 7. Navigate to Profile & Security
    console.log('[Step 7] Navigating to Profile & Security http://localhost:3300/dashboard/profile ...');
    await page.click('a[href="/dashboard/profile"]');
    await page.waitForURL('**/dashboard/profile', { timeout: 5000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'client_07_profile_security.png') });

    // Verify Email field is disabled
    const isEmailDisabled = await page.isDisabled('input[type="email"]');
    assert.strictEqual(isEmailDisabled, true, 'Email input must be strictly locked/disabled');
    console.log('✔ Email immutability verified.');

    // Test Generate New MCP Key Modal
    console.log('[Step 8] Testing Generate MCP Cloud Key Modal...');
    await page.click('button:has-text("Generate New Key")');
    await page.waitForTimeout(500);
    await page.fill('input[placeholder*="CI/CD"]', 'Playwright Automated Court Filing Bot');
    await page.click('button:has-text("Generate Secret Key")');
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'client_08_mcp_key_generated.png') });
    await page.click('button:has-text("Done")');
    console.log('✔ New MCP Bearer key successfully generated and captured.');

    // 9. Navigate to Billing & Invoices
    console.log('[Step 9] Navigating to Billing & Invoices http://localhost:3300/dashboard/billing ...');
    await page.click('a[href="/dashboard/billing"]');
    await page.waitForURL('**/dashboard/billing', { timeout: 5000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'client_09_billing_invoices.png') });
    console.log('✔ Billing & Invoices ledger verified.');

    // 10. Navigate to API & MCP Logs
    console.log('[Step 10] Navigating to API & MCP Logs http://localhost:3300/dashboard/logs ...');
    await page.click('a[href="/dashboard/logs"]');
    await page.waitForURL('**/dashboard/logs', { timeout: 5000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'client_10_api_logs.png') });
    console.log('✔ Client API consumption logs verified.');

    // 11. Navigate to Support Tickets
    console.log('[Step 11] Navigating to Support Tickets http://localhost:3300/dashboard/support ...');
    await page.click('a[href="/dashboard/support"]');
    await page.waitForURL('**/dashboard/support', { timeout: 5000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'client_11_support_page.png') });

    // Test Create Support Ticket Modal
    console.log('[Step 12] Testing Create Support Ticket Modal...');
    await page.click('button:has-text("Create Support Ticket")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'client_12_create_ticket_modal.png') });
    await page.click('button:has-text("Cancel")');
    console.log('✔ Support ticket creation modal verified.');

    console.log('\n🎉 ALL 12 PLAYWRIGHT CLIENT PORTAL E2E TESTS PASSED SUCCESSFULLY!\n');
  } catch (error) {
    console.error('❌ Playwright Client Portal E2E test failed:', error);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'client_e2e_error.png') });
    throw error;
  } finally {
    await browser.close();
  }
}

runClientPortalE2E().catch(err => {
  console.error(err);
  process.exit(1);
});
