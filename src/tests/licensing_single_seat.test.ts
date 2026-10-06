// admin-panel/src/tests/licensing_single_seat.test.ts
import assert from 'assert';
import { getMockStore } from '../lib/db/seed';
import { activateDevice, transferSeat } from '../lib/services/licensing';

console.log('=== Task 1 Test: 1-Seat Licensing & 1-Click Hardware Transfer ===\n');

const store = getMockStore();

// Find a test license (e.g. Adv. Rajeshwar Rao's license)
const license = store.licenses.find(l => l.userId === 'usr_adv_01')!;
assert(license, 'Must have license for usr_adv_01');

// Ensure license has maxDevices = 1
license.maxDevices = 1;

// Clear any existing activations for clean test
store.activations = store.activations.filter(a => a.licenseId !== license.id);

console.log('[Test 1.1] Activating Machine A (Chamber MacBook Pro)...');
const resA = activateDevice(store, {
  licenseKey: license.licenseKey,
  hardwareFingerprint: 'fp_macbook_m3_chamber_001',
  deviceName: "Advocate's MacBook Pro M3",
  osInfo: 'macOS 15.1 (ARM64)',
  ipAddress: '192.168.1.10',
});

assert.strictEqual(resA.success, true, 'Machine A activation must succeed');
assert.strictEqual(resA.license?.activeDevices, 1, 'Active devices count must be 1');
console.log('✔ Machine A activated successfully as sole seat (1/1 active).\n');

console.log('[Test 1.2] Attempting to activate Machine B (Courtroom ThinkPad X1) without transfer...');
const resB = activateDevice(store, {
  licenseKey: license.licenseKey,
  hardwareFingerprint: 'fp_thinkpad_courtroom_002',
  deviceName: 'Courtroom ThinkPad X1',
  osInfo: 'Windows 11 Pro',
  ipAddress: '10.0.4.15',
});

assert.strictEqual(resB.success, false, 'Machine B activation must be rejected');
assert.strictEqual(resB.error, 'SEAT_TRANSFER_REQUIRED', 'Error code must be SEAT_TRANSFER_REQUIRED');
assert(resB.message?.includes('Transfer your seat'), 'Message must inform user to transfer seat on web portal');
assert.strictEqual(resB.activeDevice?.hardwareFingerprint, 'fp_macbook_m3_chamber_001', 'Must identify currently bound machine');
console.log('✔ Machine B rejected with SEAT_TRANSFER_REQUIRED.\n');

console.log('[Test 1.3] Executing 1-Click Seat Transfer to Machine B...');
const transferRes = transferSeat(store, license.id, {
  deviceName: 'Courtroom ThinkPad X1',
  osInfo: 'Windows 11 Pro',
  hardwareFingerprint: 'fp_thinkpad_courtroom_002',
  ipAddress: '10.0.4.15',
});

assert.strictEqual(transferRes.success, true, 'Seat transfer must succeed');
assert.strictEqual(transferRes.previousDeviceDeactivated, true, 'Previous machine must be deactivated');

// Verify Machine A is now inactive and Machine B is active
const activeActivations = store.activations.filter(a => a.licenseId === license.id && a.isActive);
assert.strictEqual(activeActivations.length, 1, 'Only 1 seat must be active after transfer');
assert.strictEqual(activeActivations[0].hardwareFingerprint, 'fp_thinkpad_courtroom_002', 'Machine B must now hold the active seat');

console.log('✔ Machine B successfully transferred and active; Machine A deactivated.\n');

console.log('[Test 1.4] Activating Machine B after transfer should succeed (refresh ping)...');
const resB2 = activateDevice(store, {
  licenseKey: license.licenseKey,
  hardwareFingerprint: 'fp_thinkpad_courtroom_002',
  deviceName: 'Courtroom ThinkPad X1',
  osInfo: 'Windows 11 Pro',
  ipAddress: '10.0.4.15',
});

assert.strictEqual(resB2.success, true, 'Machine B should now activate/refresh cleanly');
console.log('✔ Machine B recognized as active bound seat.\n');

console.log('🎉 ALL 1-SEAT LICENSING & SEAT TRANSFER TESTS PASSED!\n');
