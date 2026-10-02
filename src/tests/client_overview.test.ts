// admin-panel/src/tests/client_overview.test.ts
import assert from 'assert';
import { getMockStore } from '../lib/db/seed';
import { calculateClientOverview } from '../lib/services/client_overview';

async function testClientOverview() {
  console.log('=== Task 4: Testing Practitioner Overview Metrics Service ===\n');

  const store = getMockStore();
  const userId = 'usr_adv_01'; // Adv. Rajeshwar Rao

  console.log('[Test 4.1] Calculating client overview metrics for Adv. Rajeshwar Rao...');
  const overview = calculateClientOverview(store, userId);

  // 1. License & Device metrics
  assert(overview.license, 'Overview must include license info');
  assert.strictEqual(overview.license.planTier, 'ENTERPRISE');
  assert.strictEqual(overview.license.maxDevices, 10);
  assert.strictEqual(overview.license.activeDevices, 2);
  console.log('✔ License & Device capacity verified: 2 / 10 active devices.');

  // 2. API & MCP usage metrics
  assert(overview.apiUsage, 'Overview must include API usage');
  assert(typeof overview.apiUsage.requestsUsed === 'number');
  assert(overview.apiUsage.monthlyLimit > 0);
  console.log('✔ API Usage verified: used =', overview.apiUsage.requestsUsed, 'limit =', overview.apiUsage.monthlyLimit);

  // 3. User scoped logs & activity
  assert(Array.isArray(overview.recentLogs), 'Recent logs must be an array');
  assert(overview.recentLogs.every(l => l.userId === userId || l.userId === null));
  console.log('✔ Recent activity feed verified (scoped to user): count =', overview.recentLogs.length);

  console.log('\n✅ All Task 4 Client Overview tests passed successfully!');
}

testClientOverview().catch(err => {
  console.error('\n❌ Task 4 Client Overview test failed:', err);
  process.exit(1);
});
