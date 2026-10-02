// admin-panel/src/tests/client_portal_rbac.test.ts
import assert from 'assert';
import { verifyRbacAccess } from '../lib/auth/rbac';

async function testClientPortalRbac() {
  console.log('=== Task 3: Testing Client Portal Role-Aware Routing & Scoping ===\n');

  // 1. Advocate accessing /dashboard/*
  console.log('[Test 3.1] Testing Advocate access to /dashboard/overview...');
  const advocateUser = {
    id: 'usr_adv_01',
    role: 'ADVOCATE',
    status: 'ACTIVE',
    email: 'r.rao@insolvencylaw.in'
  };

  const advDashboardAccess = verifyRbacAccess(advocateUser, '/dashboard');
  assert.strictEqual(advDashboardAccess.allowed, true, 'Advocate must be allowed on /dashboard');
  console.log('✔ Advocate granted access to /dashboard.');

  // 2. Advocate attempting to access /admin/*
  console.log('[Test 3.2] Testing Advocate attempting access to /admin/users...');
  const advAdminAccess = verifyRbacAccess(advocateUser, '/admin/users');
  assert.strictEqual(advAdminAccess.allowed, false, 'Advocate must be blocked from /admin/*');
  assert.strictEqual(advAdminAccess.status, 403);
  console.log('✔ Advocate strictly blocked from /admin/* with 403 Forbidden.');

  // 3. Super Admin accessing /dashboard/*
  console.log('[Test 3.3] Testing Super Admin access to /dashboard/*...');
  const superAdmin = {
    id: 'usr_superadmin_01',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    email: 'superadmin@hayagriva.app'
  };

  const superAdminAccess = verifyRbacAccess(superAdmin, '/dashboard');
  assert.strictEqual(superAdminAccess.allowed, true, 'Super Admin can view client dashboard');
  console.log('✔ Super Admin allowed on /dashboard.');

  // 4. Unauthenticated user accessing /dashboard/*
  console.log('[Test 3.4] Testing Unauthenticated access to /dashboard/licenses...');
  const guestAccess = verifyRbacAccess(null, '/dashboard/licenses');
  assert.strictEqual(guestAccess.allowed, false);
  assert.strictEqual(guestAccess.redirect, '/login');
  console.log('✔ Unauthenticated guest redirected to /login.');

  console.log('\n✅ All Task 3 Client Portal RBAC tests passed successfully!');
}

testClientPortalRbac().catch(err => {
  console.error('\n❌ Task 3 RBAC test failed:', err);
  process.exit(1);
});
