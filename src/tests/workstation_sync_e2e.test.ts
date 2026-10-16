// admin-panel/src/tests/workstation_sync_e2e.test.ts
import assert from 'assert';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Route handlers
// @ts-ignore
import { GET as getSyncRoute } from '../app/api/v1/hub/sync/route';
// @ts-ignore
import { POST as postActivateRoute } from '../app/api/v1/activate/route';

// AnythingLLM Workstation HubSyncManager
const hayagrivaServerDir = process.env.HAYAGRIVA_SERVER_DIR || path.resolve(__dirname, '../../../HAYAGRIVA/server');
const { HubSyncManager } = require(path.join(hayagrivaServerDir, 'utils/hayagriva/hubSyncManager'));
const { getHardwareFingerprint } = require(path.join(hayagrivaServerDir, 'utils/hayagriva/licenseValidator'));

async function runWorkstationSyncE2E() {
  console.log('=== Task 7: End-to-End Handshake Verification with AnythingLLM Workstation ===\n');

  const testTempDir = path.join(os.tmpdir(), `hayagriva-e2e-${Date.now()}`);
  fs.mkdirSync(testTempDir, { recursive: true });

  const licenseKey = 'HAYA-ENT-8F92-K4X9-98QA';
  const machineFingerprint = getHardwareFingerprint();

  // Custom fetch function that routes directly to our Next.js App Router handlers
  const customFetch = async (url: string | URL | Request, init?: RequestInit): Promise<Response> => {
    const urlStr = typeof url === 'string' ? url : url.toString();
    const headers = new Headers(init?.headers);

    if (urlStr.includes('/api/v1/hub/sync')) {
      const mockReq = new Request(urlStr, {
        method: init?.method || 'GET',
        headers,
      });
      return await getSyncRoute(mockReq);
    }

    if (urlStr.includes('/api/v1/activate')) {
      const mockReq = new Request(urlStr, {
        method: init?.method || 'POST',
        headers,
        body: init?.body,
      });
      return await postActivateRoute(mockReq);
    }

    throw new Error(`Unhandled URL in E2E test: ${urlStr}`);
  };

  const syncManager = new HubSyncManager({ fetchFn: customFetch });

  try {
    // 1. Initial attempt with this machine's fingerprint should fail if not yet activated
    // (Note: seed activations has different hashes, this machine has machineFingerprint)
    console.log('[Step 1] Verifying unactivated workstation is rejected...');
    let rejected = false;
    try {
      await syncManager.syncFleet({
        portalUrl: 'http://localhost:3300',
        licenseKey,
        targetDir: testTempDir,
      });
    } catch (err: any) {
      rejected = true;
      assert.ok(
        err.message.includes('Hardware fingerprint not activated') ||
        err.message.includes('403'),
        `Unexpected error message: ${err.message}`
      );
      console.log('✔ Unactivated workstation properly rejected with 403.');
    }
    assert.strictEqual(rejected, true, 'Unactivated machine must fail sync');

    // 2. Activate workstation seat
    console.log('[Step 2] Activating workstation seat via /api/v1/activate...');
    const activateReq = new Request('http://localhost:3300/api/v1/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        license_key: licenseKey,
        hardware_fingerprint: machineFingerprint,
        device_name: 'Workstation Test Machine',
        os_info: `${os.platform()} ${os.arch()}`,
        move_seat: true,
      }),
    });
    const activateRes = await postActivateRoute(activateReq);
    assert.strictEqual(activateRes.status, 200, 'Activation should return 200');
    const activateData = await activateRes.json();
    assert.strictEqual(activateData.success, true, 'Activation must succeed');
    console.log('✔ Workstation successfully activated and bound to license.');

    // 3. Perform Fleet Synchronization
    console.log('[Step 3] Executing fleet sync via AnythingLLM HubSyncManager...');
    const syncResult = await syncManager.syncFleet({
      portalUrl: 'http://localhost:3300',
      licenseKey,
      targetDir: testTempDir,
    });

    assert.strictEqual(syncResult.success, true);
    assert.ok(syncResult.installedCount > 0, 'Should install items');
    assert.ok(syncResult.chamber, 'Should return chamber details');
    console.log(`✔ Fleet sync completed: ${syncResult.installedCount} items installed.`);

    // 4. Verify disk contents and sync receipt
    console.log('[Step 4] Verifying extracted files and sync receipts on disk...');
    // Find any installed item folder recursively
    function findSyncReceipt(dir) {
      const files = fs.readdirSync(dir);
      for (const f of files) {
        const full = path.join(dir, f);
        if (fs.statSync(full).isDirectory()) {
          const receipt = path.join(full, '.hayagriva_sync.json');
          if (fs.existsSync(receipt)) return receipt;
          const found = findSyncReceipt(full);
          if (found) return found;
        }
      }
      return null;
    }

    const receiptFile = findSyncReceipt(testTempDir);
    assert.ok(receiptFile, '.hayagriva_sync.json receipt must exist in installed items');
    const firstSkillPath = path.dirname(receiptFile);



    const receiptContent = JSON.parse(fs.readFileSync(receiptFile, 'utf8'));
    assert.ok(receiptContent.id, 'Receipt must have item id');
    assert.ok(receiptContent.syncedAt, 'Receipt must have syncedAt timestamp');
    console.log(`✔ Verified sync receipt: ${receiptContent.name} (${receiptContent.id})`);

    console.log('\n=== All E2E Handshake Tests PASSED Successfully! ===\n');
  } finally {
    // Cleanup temporary directory
    if (fs.existsSync(testTempDir)) {
      fs.rmSync(testTempDir, { recursive: true, force: true });
    }
  }
}

runWorkstationSyncE2E().catch((err) => {
  console.error('E2E Verification Failed:', err);
  process.exit(1);
});
