// admin-panel/src/tests/users_table.test.ts
import assert from 'assert';
import { queryUsersList, softDeleteUser } from '../lib/services/users';
import { getMockStore } from '../lib/db/seed';

async function testUsersManagement() {
  console.log('=== Task 4: Testing Users Management & Soft Deletion ===\n');

  const store = getMockStore();

  // 1. Query all non-deleted users
  console.log('[Test 4.1] Querying active users list...');
  const result1 = queryUsersList(store, { search: '', role: 'ALL', status: 'ALL' });
  assert(result1.users.length >= 6, 'Should return active users');
  console.log('✔ Initial active users count:', result1.users.length);

  // 2. Filter by search query
  console.log('[Test 4.2] Filtering users by search term "Rajeshwar"...');
  const result2 = queryUsersList(store, { search: 'Rajeshwar', role: 'ALL', status: 'ALL' });
  assert.strictEqual(result2.users.length, 1);
  assert.strictEqual(result2.users[0].email, 'r.rao@insolvencylaw.in');
  console.log('✔ Fuzzy search returned correct user:', result2.users[0].name);

  // 3. Filter by role
  console.log('[Test 4.3] Filtering users by role "ADVOCATE"...');
  const result3 = queryUsersList(store, { search: '', role: 'ADVOCATE', status: 'ALL' });
  assert(result3.users.every(u => u.role === 'ADVOCATE'));
  console.log('✔ Role filter returned', result3.users.length, 'advocates.');

  // 4. Soft Delete a user
  console.log('[Test 4.4] Executing soft delete on a client user...');
  const targetUser = store.users.find(u => u.role === 'CLIENT' && !u.isDeleted);
  assert(targetUser, 'Must find client user to delete');
  
  const deleteResult = softDeleteUser(store, targetUser.id, 'usr_superadmin_01', 'superadmin@hayagriva.app');
  assert.strictEqual(deleteResult.success, true);
  
  // Verify user is marked deleted
  const deletedInStore = store.users.find(u => u.id === targetUser.id);
  assert.strictEqual(deletedInStore?.isDeleted, true);
  assert(deletedInStore?.deletedAt, 'deletedAt must be set');
  assert.strictEqual(deletedInStore?.deletedBy, 'usr_superadmin_01');

  // Verify audit log entry was created
  const latestAudit = store.adminAuditLogs[store.adminAuditLogs.length - 1];
  assert.strictEqual(latestAudit.action, 'USER_SOFT_DELETED');
  assert.strictEqual(latestAudit.targetUserId, targetUser.id);
  console.log('✔ Soft-deletion and audit trail entry verified.');

  // Verify user is excluded from standard list
  const listAfterDelete = queryUsersList(store, { search: '', role: 'ALL', status: 'ALL' });
  assert(!listAfterDelete.users.some(u => u.id === targetUser.id), 'Deleted user must not appear in normal list');
  console.log('✔ Excluded soft-deleted user from active directory query.');

  console.log('\n✅ All Task 4 Users Table & Soft-Deletion tests passed successfully!');
}

testUsersManagement().catch(err => {
  console.error('\n❌ Task 4 Users test failed:', err);
  process.exit(1);
});
