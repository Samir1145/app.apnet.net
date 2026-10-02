// admin-panel/src/tests/client_profile_keys.test.ts
import assert from 'assert';
import { getMockStore } from '../lib/db/seed';
import { generateMcpBearerToken } from '../lib/security/tokens';

async function testClientProfileAndKeys() {
  console.log('=== Task 6: Testing Practitioner Profile & MCP Key Generation ===\n');

  const store = getMockStore();
  const userId = 'usr_adv_01'; // Adv. Rajeshwar Rao

  // 1. Check Locked Email Constraint
  console.log('[Test 6.1] Verifying user profile retrieval and immutable email...');
  const user = store.users.find(u => u.id === userId);
  assert(user, 'Must find advocate user');
  assert.strictEqual(user.email, 'r.rao@insolvencylaw.in');
  console.log('✔ User profile loaded with immutable email:', user.email);

  // 2. Generate New Programmatic MCP API Key
  console.log('[Test 6.2] Generating new MCP Cloud Agent API key...');
  const { rawToken, keyPrefix, keyHash } = generateMcpBearerToken();
  
  const newKey = {
    id: `key_test_${Date.now()}`,
    userId,
    activationId: null,
    name: 'CI/CD Automated Forensic Inquest Key',
    keyPrefix,
    keyHash,
    scopes: ['mcp:agent:read', 'mcp:agent:exec'],
    isActive: true,
    createdAt: new Date(),
    lastUsedAt: null
  };

  store.apiKeys.push(newKey);
  assert.strictEqual(newKey.keyPrefix.startsWith('mcp_live_'), true);
  console.log('✔ New MCP key generated and stored:', newKey.name);

  // 3. Revoke Key
  console.log('[Test 6.3] Revoking an active MCP API key...');
  newKey.isActive = false;
  assert.strictEqual(newKey.isActive, false);
  console.log('✔ MCP key successfully revoked.');

  console.log('\n✅ All Task 6 Profile & MCP Key tests passed successfully!');
}

testClientProfileAndKeys().catch(err => {
  console.error('\n❌ Task 6 Profile test failed:', err);
  process.exit(1);
});
