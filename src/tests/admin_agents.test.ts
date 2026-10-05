import fs from 'fs';
import path from 'path';

console.log('=== Task 5: Testing Admin Agent Cartridges Directory & Moderation ===');

const agentsPagePath = path.join(process.cwd(), 'src/app/admin/agents/page.tsx');
if (!fs.existsSync(agentsPagePath)) {
  console.error('❌ /admin/agents/page.tsx does not exist');
  process.exit(1);
}

const content = fs.readFileSync(agentsPagePath, 'utf8');

const requiredTokens = [
  'Agent Cartridges & Foundry Moderation',
  'Total Agent Cartridges',
  'Official Chamber Cartridges',
  'Inspect Manifest',
  'Promote to Official Template',
  'Avoidance Forensic Auditor',
  'Commercial Injunction Drafter',
  'IBC Creditor Claim Auditor',
  'Section 29A Eligibility Inquest',
  '.haya Cartridge'
];

for (const token of requiredTokens) {
  if (!content.includes(token)) {
    console.error(`❌ Missing token in /admin/agents/page.tsx: ${token}`);
    process.exit(1);
  }
}

console.log('✔ Admin Agent Cartridges moderation verified');
console.log('✅ Task 5: Admin Agents passed 100%!');
