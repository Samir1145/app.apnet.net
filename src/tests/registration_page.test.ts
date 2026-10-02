// admin-panel/src/tests/registration_page.test.ts
import fs from 'fs';
import path from 'path';

async function runTests() {
  console.log('=== Task 2: Testing Registration Page Component & Structure ===\n');

  const pagePath = path.join(__dirname, '../app/register/page.tsx');

  console.log('[Test 2.1] Verifying registration page file existence...');
  if (!fs.existsSync(pagePath)) {
    throw new Error('src/app/register/page.tsx does not exist');
  }
  console.log('✔ src/app/register/page.tsx exists.');

  const pageContent = fs.readFileSync(pagePath, 'utf8');

  console.log('[Test 2.2] Checking for required form fields and elements...');
  const requiredKeywords = [
    'name',
    'email',
    'password',
    'confirmPassword',
    'designation',
    'firmName',
    'barCouncilEnrollment',
    'termsAccepted',
    'DOWNLOAD HARNESS',
    'CREATE ACCOUNT',
    '/login',
    '/dashboard/licenses',
  ];

  for (const keyword of requiredKeywords) {
    if (!pageContent.includes(keyword)) {
      throw new Error(`Registration page missing keyword or element: "${keyword}"`);
    }
  }
  console.log('✔ All essential form fields, validation states, and navigation links present.');

  console.log('[Test 2.3] Checking for role selector options...');
  const roleKeywords = [
    'Advocate / Litigator',
    'Insolvency Professional (IP / IRP / RP)',
    'Law Firm Partner / Associate',
    'Chartered Accountant / Forensic Auditor',
    'Corporate In-House Counsel',
  ];

  for (const role of roleKeywords) {
    if (!pageContent.includes(role)) {
      throw new Error(`Registration page missing role option: "${role}"`);
    }
  }
  console.log('✔ All 5 professional practitioner roles available in dropdown.');

  console.log('\n✅ All Task 2 Registration Page tests passed successfully!');
}

runTests().catch((err) => {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
});
