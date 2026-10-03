// admin-panel/src/tests/auth_login_api.test.ts
import assert from 'assert';
import { POST } from '../app/api/auth/login/route';

async function testAuthLoginApi() {
  console.log('=== Task 1: Testing Cloud Portal POST /api/auth/login Endpoint ===\n');

  // 1. Missing fields should return 400
  console.log('[Test 1.1] Testing missing fields handling...');
  const reqEmpty = new Request('http://localhost:3300/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  const resEmpty = await POST(reqEmpty);
  assert.strictEqual(resEmpty.status, 400, 'Empty body must return 400');
  const bodyEmpty = await resEmpty.json();
  assert.strictEqual(bodyEmpty.ok, false);
  console.log('✔ Empty credentials returned 400 with ok: false.');

  // 2. Valid Superadmin Login
  console.log('[Test 1.2] Testing valid credentials for superadmin@hayagriva.app...');
  const reqSuper = new Request('http://localhost:3300/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'superadmin@hayagriva.app',
      password: 'hayagriva_secure_password'
    })
  });
  const resSuper = await POST(reqSuper);
  assert.strictEqual(resSuper.status, 200, 'Valid credentials must return 200 OK');
  const bodySuper = await resSuper.json();
  assert.strictEqual(bodySuper.ok, true);
  assert.strictEqual(bodySuper.success, true);
  assert(bodySuper.token, 'Must return token');
  assert.strictEqual(bodySuper.user.email, 'superadmin@hayagriva.app');
  assert.strictEqual(bodySuper.user.role, 'SUPER_ADMIN');
  console.log('✔ Superadmin authenticated with token & user profile.');

  // 3. Valid Advocate Login with License
  console.log('[Test 1.3] Testing valid credentials for advocate r.rao@insolvencylaw.in...');
  const reqAdv = new Request('http://localhost:3300/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'r.rao@insolvencylaw.in',
      password: 'hayagriva_secure_password'
    })
  });
  const resAdv = await POST(reqAdv);
  assert.strictEqual(resAdv.status, 200);
  const bodyAdv = await resAdv.json();
  assert.strictEqual(bodyAdv.ok, true);
  assert.strictEqual(bodyAdv.user.name, 'Adv. Rajeshwar Rao');
  assert(bodyAdv.license, 'Advocate must return attached license if available');
  assert(bodyAdv.license.licenseKey, 'License must include key');
  console.log('✔ Advocate authenticated and active license attached:', bodyAdv.license.licenseKey);

  // 4. Invalid Password
  console.log('[Test 1.4] Testing invalid password rejection...');
  const reqBadPass = new Request('http://localhost:3300/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'superadmin@hayagriva.app',
      password: 'wrong_password_123'
    })
  });
  const resBadPass = await POST(reqBadPass);
  assert.strictEqual(resBadPass.status, 401, 'Invalid password must return 401');
  const bodyBadPass = await resBadPass.json();
  assert.strictEqual(bodyBadPass.ok, false);
  assert.strictEqual(bodyBadPass.error, 'Invalid email or password');
  console.log('✔ Invalid password rejected with 401 Unauthorized.');

  console.log('\n✔ ALL TESTS PASSED FOR CLOUD LOGIN API.');
}

testAuthLoginApi().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
