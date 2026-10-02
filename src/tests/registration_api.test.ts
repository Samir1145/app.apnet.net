// admin-panel/src/tests/registration_api.test.ts
import { registerPractitioner } from '../lib/services/registration';
import { getMockStore } from '../lib/db/seed';

async function runTests() {
  console.log('=== Task 1: Testing Practitioner Registration & Auto-License Provisioning ===\n');

  const store = getMockStore();
  const initialUsersCount = store.users.length;
  const initialLicensesCount = store.licenses.length;

  // Test 1.1: Successful registration with auto-provisioned license
  console.log('[Test 1.1] Registering a new advocate...');
  const regResult = await registerPractitioner({
    name: 'Adv. Kabir Anand',
    email: 'kabir.anand@delhibar.in',
    password: 'password123',
    confirmPassword: 'password123',
    role: 'ADVOCATE',
    designation: 'Advocate / Litigator',
    firmName: 'Anand & Co. Chambers',
    barCouncilEnrollment: 'D/4412/2020',
  });

  if (!regResult.success || !regResult.user || !regResult.license || !regResult.sessionToken) {
    throw new Error('Registration failed to return user, license, or session token');
  }

  console.log(`✔ New user created: ${regResult.user.name} (${regResult.user.email})`);
  console.log(`✔ Auto-provisioned Starter License: ${regResult.license.licenseKey} (Max devices: ${regResult.license.maxDevices})`);

  if (!regResult.license.licenseKey.startsWith('HAYA-STR-')) {
    throw new Error(`Expected license key to start with HAYA-STR-, got ${regResult.license.licenseKey}`);
  }

  if (regResult.license.maxDevices !== 1) {
    throw new Error(`Expected maxDevices = 1, got ${regResult.license.maxDevices}`);
  }

  // Test 1.2: Reject duplicate email
  console.log('[Test 1.2] Attempting to register with duplicate email...');
  try {
    await registerPractitioner({
      name: 'Duplicate Kabir',
      email: 'kabir.anand@delhibar.in',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'ADVOCATE',
    });
    throw new Error('Expected duplicate email to be rejected');
  } catch (err: any) {
    if (err.code !== 'EMAIL_ALREADY_EXISTS') {
      throw new Error(`Expected error code EMAIL_ALREADY_EXISTS, got ${err.code}: ${err.message}`);
    }
    console.log('✔ Duplicate email correctly rejected with EMAIL_ALREADY_EXISTS.');
  }

  // Test 1.3: Reject password shorter than 8 characters
  console.log('[Test 1.3] Attempting to register with short password...');
  try {
    await registerPractitioner({
      name: 'Short Password User',
      email: 'short.pw@example.com',
      password: '123',
      confirmPassword: '123',
      role: 'ADVOCATE',
    });
    throw new Error('Expected short password to be rejected');
  } catch (err: any) {
    if (err.code !== 'INVALID_PASSWORD') {
      throw new Error(`Expected error code INVALID_PASSWORD, got ${err.code}: ${err.message}`);
    }
    console.log('✔ Short password correctly rejected with INVALID_PASSWORD.');
  }

  // Test 1.4: Reject non-matching confirmation password
  console.log('[Test 1.4] Attempting to register with mismatched passwords...');
  try {
    await registerPractitioner({
      name: 'Mismatch User',
      email: 'mismatch@example.com',
      password: 'password123',
      confirmPassword: 'password456',
      role: 'ADVOCATE',
    });
    throw new Error('Expected password mismatch to be rejected');
  } catch (err: any) {
    if (err.code !== 'PASSWORD_MISMATCH') {
      throw new Error(`Expected error code PASSWORD_MISMATCH, got ${err.code}: ${err.message}`);
    }
    console.log('✔ Password mismatch correctly rejected with PASSWORD_MISMATCH.');
  }

  console.log('\n✅ All Task 1 Registration Service tests passed successfully!');
}

runTests().catch((err) => {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
});
