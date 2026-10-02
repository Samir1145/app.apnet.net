// admin-panel/src/tests/auth_rbac.test.ts
import assert from 'assert';
import { verifyRbacAccess } from '../lib/auth/rbac';

async function testRbacProtection() {
  console.log('=== Task 2: Testing RBAC Middleware & Role Verification ===\n');

  // Test 1: No auth token / guest
  console.log('[Test 2.1] Testing unauthenticated access to /admin/* routes...');
  const guestResult = verifyRbacAccess(null, '/admin/dashboard');
  assert.strictEqual(guestResult.allowed, false);
  assert.strictEqual(guestResult.redirect, '/login');
  console.log('✔ Unauthenticated access redirected to /login.');

  // Test 2: Standard Advocate / Client trying to access /admin/*
  console.log('[Test 2.2] Testing non-admin user role accessing /admin/*...');
  const advocateUser = {
    id: 'usr_adv_01',
    role: 'ADVOCATE',
    status: 'ACTIVE',
    email: 'r.rao@insolvencylaw.in'
  };
  const advocateResult = verifyRbacAccess(advocateUser, '/admin/users');
  assert.strictEqual(advocateResult.allowed, false);
  assert.strictEqual(advocateResult.status, 403);
  console.log('✔ Non-admin role correctly rejected with 403 Forbidden.');

  // Test 3: Suspended user attempting access
  console.log('[Test 2.3] Testing suspended user access...');
  const suspendedAdmin = {
    id: 'usr_admin_03',
    role: 'SUPER_ADMIN',
    status: 'SUSPENDED',
    email: 'suspended@hayagriva.app'
  };
  const suspendedResult = verifyRbacAccess(suspendedAdmin, '/admin/dashboard');
  assert.strictEqual(suspendedResult.allowed, false);
  assert.strictEqual(suspendedResult.status, 403);
  console.log('✔ Suspended user access denied.');

  // Test 4: SUPER_ADMIN accessing /admin/*
  console.log('[Test 2.4] Testing valid SUPER_ADMIN access...');
  const superAdmin = {
    id: 'usr_superadmin_01',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    email: 'superadmin@hayagriva.app'
  };
  const superAdminResult = verifyRbacAccess(superAdmin, '/admin/dashboard');
  assert.strictEqual(superAdminResult.allowed, true);
  assert.strictEqual(superAdminResult.redirect, undefined);
  console.log('✔ SUPER_ADMIN granted access.');

  console.log('\n✅ All Task 2 RBAC & Auth tests passed successfully!');
}

testRbacProtection().catch(err => {
  console.error('\n❌ Task 2 RBAC test failed:', err);
  process.exit(1);
});
