// admin-panel/src/tests/client_licenses_ui.test.ts
import assert from 'assert';
import { getMockStore } from '../lib/db/seed';
import { deactivateDevice } from '../lib/services/licensing';

async function testClientLicensesUi() {
  console.log('=== Task 5: Testing Licenses & Hardware Device Management ===\n');

  const store = getMockStore();
  const userId = 'usr_adv_01'; // Adv. Rajeshwar Rao

  // 1. Query user license and active devices
  console.log('[Test 5.1] Querying licenses and devices for advocate...');
  const userLicense = store.licenses.find(l => l.userId === userId);
  assert(userLicense, 'Must find license');
  
  const userDevices = store.activations.filter(a => a.userId === userId);
  assert(userDevices.length >= 2, 'Advocate must have registered devices');
  console.log('✔ Found license', userLicense.licenseKey, 'with', userDevices.length, 'registered hardware devices.');

  // 2. Deactivate second device
  console.log('[Test 5.2] Deactivating device "Chamber Drafting Station"...');
  const targetDevice = userDevices.find(d => d.deviceName.includes('Chamber'));
  assert(targetDevice, 'Must find target device to deactivate');

  const deactResult = deactivateDevice(store, targetDevice.id, userLicense.licenseKey);
  assert.strictEqual(deactResult.success, true);
  assert.strictEqual(deactResult.freedSlots, 1);

  // Verify device is marked isActive = false
  const updatedDevice = store.activations.find(a => a.id === targetDevice.id);
  assert.strictEqual(updatedDevice?.isActive, false);
  assert(updatedDevice?.deactivatedAt, 'deactivatedAt timestamp must be recorded');
  console.log('✔ Hardware device slot successfully deactivated and freed.');

  console.log('\n✅ All Task 5 Licenses & Device UI tests passed successfully!');
}

testClientLicensesUi().catch(err => {
  console.error('\n❌ Task 5 Licenses test failed:', err);
  process.exit(1);
});
