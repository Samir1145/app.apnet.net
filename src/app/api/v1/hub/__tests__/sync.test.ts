import { describe, it } from 'node:test';
import assert from 'node:assert';
import { GET } from '../sync/route';

describe('/api/v1/hub/sync fleet sync endpoint', () => {
  const validLicense = 'HAYA-ENT-8F92-K4X9-98QA';
  const activeFingerprint = 'a3f89e21bc047de193021fa4b732e91048a6df29c48e01934ba7109283f619a0';
  const deactivatedFingerprint = 'f49a8102bdc9472183e91029ba834190cba72189304192847102938475102938';
  const unknownFingerprint = '0000000000000000000000000000000000000000000000000000000000000000';

  it('rejects request when X-Hayagriva-License is missing', async () => {
    const req = new Request('http://localhost:3300/api/v1/hub/sync', {
      headers: {
        'x-hayagriva-fingerprint': activeFingerprint,
      },
    });
    const res = await GET(req);
    assert.strictEqual(res.status, 401);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.ok(data.error.includes('Missing chamber license'));
  });

  it('rejects request when X-Hayagriva-Fingerprint is missing', async () => {
    const req = new Request('http://localhost:3300/api/v1/hub/sync', {
      headers: {
        'x-hayagriva-license': validLicense,
      },
    });
    const res = await GET(req);
    assert.strictEqual(res.status, 403);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.ok(data.error.includes('Hardware fingerprint'));
  });

  it('rejects request when hardware fingerprint is deactivated or not bound to license', async () => {
    const req = new Request('http://localhost:3300/api/v1/hub/sync', {
      headers: {
        'x-hayagriva-license': validLicense,
        'x-hayagriva-fingerprint': deactivatedFingerprint,
      },
    });
    const res = await GET(req);
    assert.strictEqual(res.status, 403);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.ok(data.error.includes('not activated'));
  });

  it('accepts valid license and active hardware fingerprint, returning items and presigned URLs', async () => {
    const req = new Request('http://localhost:3300/api/v1/hub/sync', {
      headers: {
        'x-hayagriva-license': validLicense,
        'x-hayagriva-fingerprint': activeFingerprint,
      },
    });
    const res = await GET(req);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.chamber);
    assert.ok(Array.isArray(data.items));
    assert.ok(data.items.length > 0);

    // Verify presigned download URL is attached to items
    const sampleItem = data.items[0];
    assert.ok(sampleItem.packageDownloadUrl);
    assert.ok(typeof sampleItem.packageDownloadUrl === 'string');
    assert.ok(sampleItem.packageDownloadUrl.startsWith('http'));
  });
});
