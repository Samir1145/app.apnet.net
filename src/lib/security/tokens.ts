// admin-panel/src/lib/security/tokens.ts
import crypto from 'crypto';

const SERVER_SIGNING_SECRET = process.env.HAYAGRIVA_LICENSE_SECRET || 'hayagriva_sovereign_chamber_secret_key_2026';

export interface OfflineTokenPayload {
  licenseKey: string;
  userId: string;
  hardwareFingerprint: string;
  planTier: string;
  expiresAt: string;
  issuedAt: string;
}

export function generateOfflineToken(payload: OfflineTokenPayload): string {
  const jsonStr = JSON.stringify(payload);
  const payloadBase64 = Buffer.from(jsonStr).toString('base64url');

  const hmac = crypto.createHmac('sha256', SERVER_SIGNING_SECRET);
  hmac.update(payloadBase64);
  const signatureBase64 = hmac.digest('base64url');

  return `${payloadBase64}.${signatureBase64}`;
}

export function verifyOfflineToken(token: string): { valid: boolean; payload?: OfflineTokenPayload; error?: string } {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) {
      return { valid: false, error: 'Malformed token structure' };
    }

    const [payloadBase64, signatureBase64] = parts;

    // Verify signature
    const hmac = crypto.createHmac('sha256', SERVER_SIGNING_SECRET);
    hmac.update(payloadBase64);
    const expectedSignature = hmac.digest('base64url');

    if (signatureBase64 !== expectedSignature) {
      return { valid: false, error: 'Invalid cryptographic signature' };
    }

    const jsonStr = Buffer.from(payloadBase64, 'base64url').toString('utf8');
    const payload: OfflineTokenPayload = JSON.parse(jsonStr);

    // Verify expiration
    if (new Date(payload.expiresAt).getTime() < Date.now()) {
      return { valid: false, payload, error: 'Token has expired' };
    }

    return { valid: true, payload };
  } catch (err: any) {
    return { valid: false, error: err?.message || 'Token verification failed' };
  }
}

export function generateMcpBearerToken() {
  const randomBytes = crypto.randomBytes(24).toString('hex');
  const rawToken = `mcp_live_${randomBytes}`;
  const keyPrefix = rawToken.slice(0, 16);
  const keyHash = hashMcpToken(rawToken);

  return {
    rawToken,
    keyPrefix,
    keyHash
  };
}

export function hashMcpToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}
