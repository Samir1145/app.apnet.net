// admin-panel/src/tests/dashboard_metrics.test.ts
import assert from 'assert';
import { calculateDashboardMetrics } from '../lib/services/metrics';
import { getMockStore } from '../lib/db/seed';

async function testDashboardMetrics() {
  console.log('=== Task 3: Testing Executive Dashboard Metrics Engine ===\n');

  const store = getMockStore();

  console.log('[Test 3.1] Computing metrics from database mock store...');
  const metrics = calculateDashboardMetrics(store);

  // 1. Telemetry downloads
  assert(metrics.downloads, 'Metrics must include downloads');
  assert.strictEqual(metrics.downloads.total, 10, 'Total downloads should match 10 seeded records');
  assert(metrics.downloads.growthPercent >= 0, 'Growth percent must be calculated');
  console.log('✔ Telemetry download metrics verified: total =', metrics.downloads.total);

  // 2. Active users & counts
  assert(metrics.users, 'Metrics must include user summary');
  assert.strictEqual(metrics.users.total, 7, 'Total users should be 7');
  assert.strictEqual(metrics.users.active, 6, 'Active users count should match non-suspended');
  assert.strictEqual(metrics.users.suspended, 1, 'Suspended users should be 1');
  console.log('✔ User status metrics verified: active =', metrics.users.active, 'suspended =', metrics.users.suspended);

  // 3. Billing & Revenue
  assert(metrics.revenue, 'Metrics must include revenue summary');
  assert(typeof metrics.revenue.totalInr === 'number', 'Total revenue INR must be numeric');
  assert(metrics.revenue.totalInr > 0, 'Total revenue should be greater than 0');
  console.log('✔ Central billing metrics verified: total INR = ₹', metrics.revenue.totalInr.toLocaleString('en-IN'));

  // 4. Activity stream
  assert(Array.isArray(metrics.recentActivity), 'Recent activity stream must be an array');
  assert(metrics.recentActivity.length > 0, 'Activity stream must contain recent log entries');
  console.log('✔ Activity stream verified: count =', metrics.recentActivity.length);

  console.log('\n✅ All Task 3 Dashboard Metrics tests passed successfully!');
}

testDashboardMetrics().catch(err => {
  console.error('\n❌ Task 3 Dashboard test failed:', err);
  process.exit(1);
});
