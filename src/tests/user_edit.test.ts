// admin-panel/src/tests/user_edit.test.ts
import assert from 'assert';
import { updateUser } from '../lib/services/users';
import { generateTemporaryPassword } from '../lib/services/passwords';
import { getMockStore } from '../lib/db/seed';

async function testUserEditConstraints() {
  console.log('=== Task 5: Testing User Edit Constraints & Password Reset ===\n');

  const store = getMockStore();
  const targetUser = store.users.find(u => u.role === 'ADVOCATE' && !u.isDeleted);
  assert(targetUser, 'Must find advocate user');

  // 1. Test Email Immutability Constraint (Must NOT allow email in updates)
  console.log('[Test 5.1] Updating user details (name, org, plan, status)...');
  const updateResult = updateUser(
    store,
    targetUser.id,
    {
      name: 'Adv. Rajeshwar Rao, Senior Counsel',
      org: 'Rao Chambers & Associates',
      plan: 'ENTERPRISE',
      status: 'ACTIVE'
    },
    'usr_superadmin_01',
    'superadmin@hayagriva.app'
  );

  assert.strictEqual(updateResult.success, true);
  assert.strictEqual(updateResult.user?.name, 'Adv. Rajeshwar Rao, Senior Counsel');
  assert.strictEqual(updateResult.user?.email, targetUser.email, 'Email must remain strictly unchanged');
  console.log('✔ User details successfully updated while keeping email immutable.');

  // 2. Test Temporary Password Reset Generation
  console.log('[Test 5.2] Generating temporary password reset credential...');
  const resetResult = generateTemporaryPassword(
    store,
    targetUser.id,
    'usr_superadmin_01',
    'superadmin@hayagriva.app'
  );

  assert.strictEqual(resetResult.success, true);
  assert(resetResult.tempPassword, 'Must generate temporary password');
  assert.strictEqual(resetResult.tempPassword.length >= 12, true, 'Password must be at least 12 chars');
  assert(resetResult.expiresAt, 'Must include expiration timestamp');

  // Verify audit log recorded the password reset
  const audit = store.adminAuditLogs[store.adminAuditLogs.length - 1];
  assert.strictEqual(audit.action, 'PASSWORD_RESET_GENERATED');
  assert.strictEqual(audit.targetUserId, targetUser.id);
  console.log('✔ Temporary password generated and audit log captured.');

  console.log('\n✅ All Task 5 User Edit & Password Reset tests passed successfully!');
}

testUserEditConstraints().catch(err => {
  console.error('\n❌ Task 5 User Edit test failed:', err);
  process.exit(1);
});
