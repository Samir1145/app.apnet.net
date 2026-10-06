// admin-panel/src/tests/admin_support_patch.test.ts
import assert from 'assert';
import { getMockStore, seedInitialData } from '../lib/db/seed';
import { updateTicket, triageTickets } from '../lib/services/modules';
import { PATCH, GET } from '../app/api/admin/support/route';

async function testAdminSupportResolution() {
  console.log('=== Testing Ticket Resolution & Reply (PATCH /api/admin/support) ===\n');

  // Initialize store
  seedInitialData();
  const store = getMockStore();

  // 1. Direct Service Unit Test: updateTicket
  console.log('[Test 1] Testing updateTicket service with status and admin response...');
  const targetId = 'TCK-8013'; // Pooja Singhania (IP), originally OPEN
  const initialTicket = store.supportTickets.find(t => t.id === targetId);
  assert(initialTicket, 'Initial ticket TCK-8013 must exist');
  assert.strictEqual(initialTicket.status, 'OPEN');

  const updateResult = updateTicket(
    store,
    targetId,
    {
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      adminResponse: 'Green Paper margin rules have been updated in the DOCX exporter.'
    },
    {
      adminId: 'usr_superadmin_01',
      adminEmail: 'superadmin@hayagriva.app'
    }
  );

  assert.strictEqual(updateResult.success, true);
  assert.strictEqual(updateResult.ticket?.status, 'IN_PROGRESS');
  assert.strictEqual(updateResult.ticket?.priority, 'HIGH');
  assert(updateResult.ticket?.adminResponse?.includes('Green Paper margin rules'));
  assert(updateResult.ticket?.respondedAt instanceof Date);

  // Verify Audit Log was recorded
  const auditEntry = store.adminAuditLogs.find(
    a => a.action === 'TICKET_STATUS_UPDATED' && (a.previousState as any)?.ticketId === targetId
  );
  assert(auditEntry, 'Audit log entry must be recorded for ticket update');
  console.log('✔ Service updateTicket verified with audit trail logging.');

  // 2. API Route Test: PATCH /api/admin/support with missing ticketId (400 check)
  console.log('[Test 2] Testing PATCH /api/admin/support validation for missing ID...');
  const badReq = new Request('http://localhost:3300/api/admin/support', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'RESOLVED' }),
  });
  const badRes = await PATCH(badReq);
  assert.strictEqual(badRes.status, 400);
  const badJson = await badRes.json();
  assert(badJson.error.includes('Ticket ID'));
  console.log('✔ Correctly returned 400 when ticketId is missing.');

  // 3. API Route Test: PATCH /api/admin/support marking ticket as RESOLVED
  console.log('[Test 3] Testing PATCH /api/admin/support marking ticket as RESOLVED...');
  const resolveReq = new Request('http://localhost:3300/api/admin/support', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ticketId: 'TCK-8014', // Ananya Deshmukh, account suspension clarification
      status: 'RESOLVED',
      priority: 'URGENT',
      adminResponse: 'NEFT payment reconciled against invoice INV-2026-0894. Accounting module unblocked.'
    }),
  });
  const resolveRes = await PATCH(resolveReq);
  assert.strictEqual(resolveRes.status, 200);
  const resolveJson = await resolveRes.json();
  assert.strictEqual(resolveJson.success, true);
  assert.strictEqual(resolveJson.ticket.status, 'RESOLVED');
  assert(resolveJson.ticket.adminResponse.includes('NEFT payment reconciled'));
  console.log('✔ Ticket TCK-8014 marked as RESOLVED with response dispatched.');

  // 4. API Route Test: GET /api/admin/support triage filtering
  console.log('[Test 4] Testing GET /api/admin/support filtering by RESOLVED status...');
  const getReq = new Request('http://localhost:3300/api/admin/support?status=RESOLVED');
  const getRes = await GET(getReq);
  assert.strictEqual(getRes.status, 200);
  const getJson = await getRes.json();
  assert(getJson.tickets.some((t: any) => t.id === 'TCK-8014'));
  console.log('✔ GET /api/admin/support reflects newly resolved ticket in filtered list.');

  // 5. Test 404 for nonexistent ticket
  console.log('[Test 5] Testing 404 for non-existent ticketId...');
  const notFoundReq = new Request('http://localhost:3300/api/admin/support', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ticketId: 'TCK-NONEXISTENT', status: 'RESOLVED' }),
  });
  const notFoundRes = await PATCH(notFoundReq);
  assert.strictEqual(notFoundRes.status, 404);
  console.log('✔ Correctly returned 404 for nonexistent ticket.');

  console.log('\n🎉 ALL ADMIN SUPPORT RESOLUTION & REPLY TESTS PASSED SUCCESSFULLY!\n');
}

testAdminSupportResolution().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
