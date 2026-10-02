// admin-panel/src/tests/auth_links.test.ts
import fs from 'fs';
import path from 'path';

async function runTests() {
  console.log('=== Task 3: Testing Login Page Links & Welcome Alert Integration ===\n');

  const loginPagePath = path.join(__dirname, '../app/login/page.tsx');
  const licensesPagePath = path.join(__dirname, '../app/dashboard/licenses/page.tsx');

  console.log('[Test 3.1] Verifying register links in login page...');
  const loginContent = fs.readFileSync(loginPagePath, 'utf8');

  if (!loginContent.includes('/register')) {
    throw new Error('Login page does not contain link to /register');
  }
  console.log('✔ Login page contains link to /register.');

  console.log('[Test 3.2] Verifying registration welcome banner on licenses page...');
  const licensesContent = fs.readFileSync(licensesPagePath, 'utf8');

  if (!licensesContent.includes('new_registration') && !licensesContent.includes('Welcome to Hayagriva')) {
    throw new Error('Licenses page does not handle new registration welcome banner');
  }
  console.log('✔ Licenses page contains welcome banner for newly registered users.');

  console.log('\n✅ All Task 3 Auth Links & Welcome Banner tests passed successfully!');
}

runTests().catch((err) => {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
});
