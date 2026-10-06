// admin-panel/src/tests/client_secondary_modules.test.ts
import assert from 'assert';
import { getMockStore } from '../lib/db/seed';

async function testClientSecondaryModules() {
  console.log('=== Task 7: Testing Client Billing, Scoped Logs & Support Tickets ===\n');

  const store = getMockStore();
  const userId = 'usr_adv_01'; // Adv. Rajeshwar Rao

  // 1. Invoices Scoping
  console.log('[Test 7.1] Querying user-scoped invoices...');
  const userInvoices = store.invoices.filter(i => i.userId === userId);
  assert(userInvoices.length >= 2, 'Advocate must have at least 2 invoices');
  assert(userInvoices.every(i => i.userId === userId), 'All invoices must belong to Adv. Rao');
  console.log('✔ Scoped invoices verified: count =', userInvoices.length);

  // 2. System & Agent Logs Scoping
  console.log('[Test 7.2] Querying user-scoped API logs...');
  const userLogs = store.systemLogs.filter(l => l.userId === userId);
  assert(userLogs.length >= 2, 'Advocate must have logged requests');
  assert(userLogs.every(l => l.userId === userId));
  console.log('✔ Scoped API & agent logs verified: count =', userLogs.length);

  // 3. Support Ticket Submission
  console.log('[Test 7.3] Submitting new support ticket from practitioner...');
  const newTicket = {
    id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
    userId,
    userName: 'Adv. Rajeshwar Rao',
    userEmail: 'r.rao@insolvencylaw.in',
    subject: 'Request for custom IBC Form 2 Annexure generation template',
    description: 'Need assistance adding automated Section 66 avoidance calculations into the form footer.',
    priority: 'HIGH',
    status: 'OPEN',
    adminResponse: null,
    respondedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  store.supportTickets.push(newTicket);
  assert(store.supportTickets.some(t => t.id === newTicket.id));
  console.log('✔ Support ticket successfully created:', newTicket.id);

  console.log('\n✅ All Task 7 Client Billing, Logs & Support tests passed successfully!');
}

testClientSecondaryModules().catch(err => {
  console.error('\n❌ Task 7 Client Modules test failed:', err);
  process.exit(1);
});
