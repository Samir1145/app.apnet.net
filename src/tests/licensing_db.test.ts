// admin-panel/src/tests/licensing_db.test.ts
import assert from 'assert';
import { licenses, activations, apiKeys } from '../lib/db/schema';
import { getMockStore, seedInitialData } from '../lib/db/seed';

async function testLicensingSchemaAndSeed() {
  console.log('=== Task 1: Testing Licensing Schema Tables & Seed Data ===\n');

  // 1. Schema Definitions Check
  console.log('[Test 1.1] Verifying Drizzle Schema table exports for licensing...');
  assert(licenses, 'licenses table must be defined');
  assert(activations, 'activations table must be defined');
  assert(apiKeys, 'apiKeys table must be defined');
  console.log('✔ licenses, activations, and apiKeys tables defined.');

  // 2. Seed Store Check
  console.log('[Test 1.2] Testing mock store seed initialization for licensing...');
  const store = seedInitialData();
  assert(store.licenses && store.licenses.length >= 2, 'Seed store must include initial licenses');
  assert(store.activations && store.activations.length >= 2, 'Seed store must include active hardware devices');
  assert(store.apiKeys && store.apiKeys.length >= 2, 'Seed store must include programmatic API keys');

  // Check Advocate License Details
  const advLicense = store.licenses.find(l => l.userId === 'usr_adv_01');
  assert(advLicense, 'Must have license for Adv. Rajeshwar Rao');
  assert.strictEqual(advLicense.planTier, 'ENTERPRISE');
  assert.strictEqual(advLicense.maxDevices, 10);
  assert(advLicense.licenseKey.startsWith('HAYA-'), 'License key must match HAYA prefix');

  // Check Device Activations
  const userDevices = store.activations.filter(a => a.userId === 'usr_adv_01' && a.isActive);
  assert(userDevices.length >= 1, 'Advocate must have at least 1 active registered device');
  console.log('✔ Advocate license and registered hardware devices verified in seed data.');

  console.log('\n✅ All Task 1 Licensing Schema & Seed tests passed successfully!');
}

testLicensingSchemaAndSeed().catch(err => {
  console.error('\n❌ Task 1 Licensing DB test failed:', err);
  process.exit(1);
});
