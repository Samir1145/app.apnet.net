// admin-panel/src/tests/activation_handshake.test.ts
import assert from 'assert';
import { getMockStore } from '../lib/db/seed';
import { activateDevice, deactivateDevice } from '../lib/services/licensing';

async function testActivationHandshake() {
  console.log('=== Task 2.2: Testing Desktop IDE Activation Handshake & Limits ===\n');

  const store = getMockStore();
  const proLicense = store.licenses.find(l => l.userId === 'usr_adv_02');
  assert(proLicense, 'Must find Pro license for Pooja');

  // 1. Test Normal Activation
  console.log('[Test 2.2.1] Activating a second hardware device under Pro license (Limit: 3)...');
  const result1 = activateDevice(store, {
    licenseKey: proLicense.licenseKey,
    hardwareFingerprint: 'hw_macbook_pro_m3_chamber_002',
    deviceName: 'Pooja Chamber Desktop',
    osInfo: 'macOS Darwin 24.1.0 (arm64)',
    ipAddress: '49.36.18.92'
  });

  assert.strictEqual(result1.success, true);
  assert(result1.tokens?.offlineToken, 'Must return signed offline token');
  assert(result1.tokens?.mcpBearerToken, 'Must return generated MCP bearer token');
  assert.strictEqual(result1.license?.activeDevices, 2);
  console.log('✔ Device activated successfully. Active count = 2 / 3');

  // 2. Test Idempotent Re-Activation from same hardware
  console.log('[Test 2.2.2] Re-activating from existing registered hardware...');
  const resultReactivate = activateDevice(store, {
    licenseKey: proLicense.licenseKey,
    hardwareFingerprint: 'hw_macbook_pro_m3_chamber_002',
    deviceName: 'Pooja Chamber Desktop',
    osInfo: 'macOS Darwin 24.1.0 (arm64)',
    ipAddress: '49.36.18.92'
  });

  assert.strictEqual(resultReactivate.success, true);
  assert.strictEqual(resultReactivate.license?.activeDevices, 2, 'Re-activation must not increment device count');
  console.log('✔ Idempotent re-activation confirmed.');

  // 3. Activate 3rd device (reaching limit)
  console.log('[Test 2.2.3] Activating 3rd hardware device...');
  const result3 = activateDevice(store, {
    licenseKey: proLicense.licenseKey,
    hardwareFingerprint: 'hw_dell_travel_laptop_003',
    deviceName: 'Pooja Travel Laptop',
    osInfo: 'Windows NT 10.0 (x64)',
    ipAddress: '122.161.48.33'
  });
  assert.strictEqual(result3.success, true);
  assert.strictEqual(result3.license?.activeDevices, 3);
  console.log('✔ 3rd device activated. Max devices reached (3 / 3).');

  // 4. Test Device Limit Exceeded Rejection (4th device on Pro plan)
  console.log('[Test 2.2.4] Attempting to activate 4th device on Pro plan (Limit: 3)...');
  const result4 = activateDevice(store, {
    licenseKey: proLicense.licenseKey,
    hardwareFingerprint: 'hw_unauthorized_4th_pc',
    deviceName: 'Unauthorized Device',
    osInfo: 'Linux x86_64',
    ipAddress: '103.44.52.88'
  });

  assert.strictEqual(result4.success, false);
  assert.strictEqual(result4.error, 'DEVICE_LIMIT_EXCEEDED');
  console.log('✔ 4th device correctly rejected with DEVICE_LIMIT_EXCEEDED.');

  // 5. Test Deactivate Device
  console.log('[Test 2.2.5] Deactivating 3rd device to free a hardware slot...');
  const activationToDeactivate = store.activations.find(a => a.hardwareFingerprint === 'hw_dell_travel_laptop_003');
  assert(activationToDeactivate, 'Must find activation record');

  const deactResult = deactivateDevice(store, activationToDeactivate.id, proLicense.licenseKey);
  assert.strictEqual(deactResult.success, true);
  assert.strictEqual(deactResult.remainingActiveDevices, 2);

  // Now 4th device can be activated
  console.log('[Test 2.2.6] Activating new device into the freed slot...');
  const resultFreed = activateDevice(store, {
    licenseKey: proLicense.licenseKey,
    hardwareFingerprint: 'hw_unauthorized_4th_pc',
    deviceName: 'Newly Authorized Laptop',
    osInfo: 'Linux x86_64',
    ipAddress: '103.44.52.88'
  });
  assert.strictEqual(resultFreed.success, true);
  assert.strictEqual(resultFreed.license?.activeDevices, 3);
  console.log('✔ New device successfully activated into freed slot.');

  console.log('\n✅ All Activation Handshake & Limit tests passed successfully!');
}

testActivationHandshake().catch(err => {
  console.error('\n❌ Activation Handshake test failed:', err);
  process.exit(1);
});
