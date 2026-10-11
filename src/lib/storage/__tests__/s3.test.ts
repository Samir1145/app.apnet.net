import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getPresignedDownloadUrl, getPresignedUploadUrl } from '../s3';

describe('S3 Storage & Presigned URL Generator', () => {
  it('generates presigned download url with key and expiration', async () => {
    const url = await getPresignedDownloadUrl('skills/ibc-avoidance-v1.zip', 900);
    assert.strictEqual(typeof url, 'string');
    assert.ok(url.includes('skills/ibc-avoidance-v1.zip') || url.includes('ibc-avoidance-v1.zip'));
    assert.ok(url.startsWith('http://') || url.startsWith('https://'));
  });

  it('generates presigned upload url with content type', async () => {
    const url = await getPresignedUploadUrl('uploads/custom-agent-01.zip', 'application/zip', 600);
    assert.strictEqual(typeof url, 'string');
    assert.ok(url.includes('custom-agent-01.zip'));
    assert.ok(url.startsWith('http://') || url.startsWith('https://'));
  });
});
