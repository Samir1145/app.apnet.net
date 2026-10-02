// admin-panel/src/tests/token_engine.test.ts
import assert from 'assert';
import { 
  generateOfflineToken, 
  verifyOfflineToken, 
  generateMcpBearerToken, 
  hashMcpToken 
} from '../lib/security/tokens';

async function testTokenEngine() {
  console.log('=== Task 2.1: Testing Cryptographic Token Engine ===\n');

  // 1. Generate Offline Token
  console.log('[Test 2.1.1] Generating server-signed Offline Activation Token...');
  const payload = {
    licenseKey: 'HAYA-PRO-7X9K-4M2P-9Q8A',
    userId: 'usr_adv_01',
    hardwareFingerprint: 'a3f89e21bc047de193021fa4b732e91048a6df29c48e01934ba7109283f619a0',
    planTier: 'PROFESSIONAL',
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    issuedAt: new Date().toISOString(),
  };

  const offlineToken = generateOfflineToken(payload);
  assert(offlineToken && offlineToken.includes('.'), 'Token must be header.signature dot-separated');
  console.log('✔ Server-signed offline token generated.');

  // 2. Verify Valid Token
  console.log('[Test 2.1.2] Verifying valid offline token...');
  const verifyResult = verifyOfflineToken(offlineToken);
  assert.strictEqual(verifyResult.valid, true);
  assert.strictEqual(verifyResult.payload?.licenseKey, payload.licenseKey);
  assert.strictEqual(verifyResult.payload?.hardwareFingerprint, payload.hardwareFingerprint);
  console.log('✔ Valid offline token successfully verified.');

  // 3. Tamper Detection
  console.log('[Test 2.1.3] Testing tamper detection on modified payload...');
  const tamperedToken = offlineToken.slice(0, -5) + 'XXXXX';
  const tamperedResult = verifyOfflineToken(tamperedToken);
  assert.strictEqual(tamperedResult.valid, false);
  console.log('✔ Tampered signature rejected.');

  // 4. MCP Bearer Token Generation & Hashing
  console.log('[Test 2.1.4] Testing MCP Bearer Token generation...');
  const { rawToken, keyPrefix, keyHash } = generateMcpBearerToken();
  assert(rawToken.startsWith('mcp_live_'), 'MCP token must have mcp_live_ prefix');
  assert.strictEqual(keyPrefix, rawToken.slice(0, 16));
  assert.strictEqual(hashMcpToken(rawToken), keyHash, 'Hashed token must match SHA-256');
  console.log('✔ MCP Bearer token generated with SHA-256 hash:', keyPrefix);

  console.log('\n✅ All Token Engine tests passed successfully!');
}

testTokenEngine().catch(err => {
  console.error('\n❌ Token Engine test failed:', err);
  process.exit(1);
});
