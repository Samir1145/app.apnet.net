// admin-panel/src/lib/storage/s3.ts
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Bucket = process.env.S3_BUCKET_NAME || 'resolution-bazaar-assets';
const s3Region = process.env.S3_REGION || 'us-east-1';
const s3Endpoint = process.env.S3_ENDPOINT;
const accessKeyId = process.env.S3_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;

let s3ClientInstance: S3Client | null = null;

export function getS3Client(): S3Client | null {
  if (accessKeyId && secretAccessKey) {
    if (!s3ClientInstance) {
      s3ClientInstance = new S3Client({
        region: s3Region,
        endpoint: s3Endpoint || undefined,
        forcePathStyle: Boolean(s3Endpoint || process.env.S3_FORCE_PATH_STYLE === 'true'),
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
    }
    return s3ClientInstance;
  }
  return null;
}

export async function getPresignedDownloadUrl(
  key: string,
  ttlSeconds: number = 900
): Promise<string> {
  const client = getS3Client();

  if (client) {
    const command = new GetObjectCommand({
      Bucket: s3Bucket,
      Key: key,
    });
    return getSignedUrl(client, command, { expiresIn: ttlSeconds });
  }

  // Fallback simulated signed download URL for local development / test environments
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3300';
  const expires = Math.floor(Date.now() / 1000) + ttlSeconds;
  return `${baseUrl}/api/v1/hub/download/${encodeURIComponent(key)}?expires=${expires}&signature=dev_mock_sig`;
}

export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  ttlSeconds: number = 900
): Promise<string> {
  const client = getS3Client();

  if (client) {
    const command = new PutObjectCommand({
      Bucket: s3Bucket,
      Key: key,
      ContentType: contentType,
    });
    return getSignedUrl(client, command, { expiresIn: ttlSeconds });
  }

  // Fallback simulated signed upload URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3300';
  const expires = Math.floor(Date.now() / 1000) + ttlSeconds;
  return `${baseUrl}/api/v1/hub/upload/${encodeURIComponent(key)}?contentType=${encodeURIComponent(
    contentType
  )}&expires=${expires}&signature=dev_mock_sig`;
}
