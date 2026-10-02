// admin-panel/src/tests/admin_modules.test.ts
import assert from 'assert';
import { getMockStore } from '../lib/db/seed';
import { filterLogs, filterInvoices, aggregateDownloads, triageTickets } from '../lib/services/modules';

async function testSecondaryModules() {
  console.log('=== Task 6: Testing Logs, Invoices, Downloads & Tickets Services ===\n');

  const store = getMockStore();

  // 1. Logs Filtering
  console.log('[Test 6.1] Testing system logs filter by status code >= 400 (Errors)...');
  const errorLogs = filterLogs(store, { errorOnly: true });
  assert(errorLogs.length >= 2, 'Should return error logs');
  assert(errorLogs.every(l => l.statusCode >= 400), 'All returned logs must have statusCode >= 400');
  console.log('✔ Error logs filter verified: count =', errorLogs.length);

  // 2. Invoices Filtering
  console.log('[Test 6.2] Testing invoices filter by status "PAID"...');
  const paidInvoices = filterInvoices(store, { status: 'PAID' });
  assert(paidInvoices.length >= 4, 'Should return paid invoices');
  assert(paidInvoices.every(i => i.status === 'PAID'));
  console.log('✔ Paid invoices filter verified: count =', paidInvoices.length);

  // 3. Downloads Aggregation
  console.log('[Test 6.3] Testing download telemetry aggregation by country and platform...');
  const telemetrySummary = aggregateDownloads(store);
  assert.strictEqual(telemetrySummary.totalDownloads, 10);
  assert(telemetrySummary.platforms.MACOS_ARM64 >= 5, 'Must have at least 5 macOS ARM64 downloads');
  assert(telemetrySummary.countries.IN >= 8, 'India downloads should be >= 8');
  console.log('✔ Telemetry aggregation verified.');

  // 4. Support Ticket Status Triage
  console.log('[Test 6.4] Testing support tickets triage...');
  const openTickets = triageTickets(store, { status: 'OPEN' });
  assert.strictEqual(openTickets.length, 2, 'Should find 2 open tickets');
  console.log('✔ Open tickets triage verified: count =', openTickets.length);

  console.log('\n✅ All Task 6 Admin Modules tests passed successfully!');
}

testSecondaryModules().catch(err => {
  console.error('\n❌ Task 6 Admin Modules test failed:', err);
  process.exit(1);
});
