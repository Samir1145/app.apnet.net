import assert from 'node:assert';
import { ASSET_CATALOG } from '../lib/catalog';
import { getPresignedDownloadUrl } from '../lib/storage/s3';

async function runTests() {
  console.log('Testing GARUDA Asset Catalog & Cloudflare R2 Presign...');

  // 1. Verify Catalog Completeness
  assert(ASSET_CATALOG.length >= 20, 'Catalog should have at least 20 assets');
  const gguf = ASSET_CATALOG.find(i => i.id === 'legalparam-2.9b.gguf');
  assert(gguf, 'LegalParam 2.9B GGUF must exist');
  assert.strictEqual(gguf?.r2Key, 'models/legalparam-2.9b.gguf');

  const vault = ASSET_CATALOG.find(i => i.id === 'cases_vault_2026-W31.zip');
  assert(vault, 'Cases Vault must exist');
  assert.strictEqual(vault?.r2Key, 'vaults/cases_vault_2026-W31.zip');

  // 2. Verify Presigned URL Generator
  const downloadUrl = await getPresignedDownloadUrl(gguf.r2Key, 900);
  assert(downloadUrl && typeof downloadUrl === 'string', 'Download URL must be a valid string');
  assert(downloadUrl.includes('legalparam-2.9b.gguf'), 'URL must reference model key');

  console.log('✔ All asset catalog and R2 URL tests passed successfully!');
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
