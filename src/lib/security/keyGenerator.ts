// admin-panel/src/lib/security/keyGenerator.ts
import crypto from "crypto";

/**
 * Crockford Base32 Alphabet (32 symbols)
 * Standard Crockford Base32: 0-9, A-Z excluding I, L, O, U
 */
export const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

const MASTER_KEY_SECRET = process.env.HAYAGRIVA_KEY_GEN_SECRET || "hayagriva_key_seed_2026";

export interface LicenseMeta {
  tier: "ENTERPRISE" | "PROFESSIONAL" | "STARTER";
  tierCode: "E" | "P" | "S";
  year: number;
  seats: number;
}

/**
 * Normalizes user input: converts to uppercase, replaces O->0, I->1, L->1
 */
export function normalizeKey(key: string): string {
  if (!key) return "";
  return key
    .trim()
    .toUpperCase()
    .replace(/O/g, "0")
    .replace(/[IL]/g, "1");
}

/**
 * Generates a 24-character cryptographic product key in 5 blocks:
 * Format: HAYA-[TierYearSeats]-[EntropyBlock1]-[EntropyBlock2]-[HMACChecksum]
 * Example: HAYA-E261-8K9M-7W2P-X7A4
 */
export function generateSovereignLicenseKey(
  tier: "ENTERPRISE" | "PROFESSIONAL" | "STARTER" = "ENTERPRISE",
  seats = 1
): string {
  const tierCode = tier === "ENTERPRISE" ? "E" : tier === "PROFESSIONAL" ? "P" : "S";
  const yearCode = "26"; // 2026 epoch
  const seatCode = Math.min(Math.max(seats, 1), 9).toString();
  const metaBlock = `${tierCode}${yearCode}${seatCode}`;

  // 8 random characters (40 bits entropy) via CSPRNG
  const randomBytes = crypto.randomBytes(8);
  let payload = "";
  for (let i = 0; i < 8; i++) {
    payload += ALPHABET[randomBytes[i] % ALPHABET.length];
  }
  const payloadBlock1 = payload.slice(0, 4);
  const payloadBlock2 = payload.slice(4, 8);

  const rawBody = `HAYA-${metaBlock}-${payloadBlock1}-${payloadBlock2}`;

  // Cryptographic Checksum: HMAC-SHA256 truncated to 4 Crockford characters
  const hmac = crypto.createHmac("sha256", MASTER_KEY_SECRET);
  hmac.update(rawBody);
  const hashDigest = hmac.digest();

  let checksum = "";
  for (let i = 0; i < 4; i++) {
    checksum += ALPHABET[hashDigest[i] % ALPHABET.length];
  }

  return `${rawBody}-${checksum}`;
}

/**
 * Validates key format and HMAC checksum mathematically without database lookup.
 */
export function verifyLicenseKeyChecksum(rawKey: string): {
  valid: boolean;
  metadata?: LicenseMeta;
  error?: string;
  normalizedKey?: string;
} {
  if (!rawKey || typeof rawKey !== "string") {
    return { valid: false, error: "Key is empty" };
  }

  const normalized = normalizeKey(rawKey);
  const parts = normalized.split("-");

  if (parts.length !== 5 || parts[0] !== "HAYA") {
    return { valid: false, error: "Invalid key structure. Expected HAYA-XXXX-XXXX-XXXX-XXXX" };
  }

  const [prefix, metaBlock, block1, block2, checksum] = parts;

  // Validate characters
  const allChars = `${metaBlock}${block1}${block2}${checksum}`;
  for (const c of allChars) {
    if (!ALPHABET.includes(c)) {
      return { valid: false, error: `Invalid character "${c}" in license key` };
    }
  }

  // Verify HMAC checksum
  const rawBody = `${prefix}-${metaBlock}-${block1}-${block2}`;
  const hmac = crypto.createHmac("sha256", MASTER_KEY_SECRET);
  hmac.update(rawBody);
  const hashDigest = hmac.digest();

  let expectedChecksum = "";
  for (let i = 0; i < 4; i++) {
    expectedChecksum += ALPHABET[hashDigest[i] % ALPHABET.length];
  }

  if (checksum !== expectedChecksum) {
    return { valid: false, error: "Typo detected: Cryptographic checksum mismatch" };
  }

  // Decode metadata block
  const tierLetter = metaBlock[0];
  const tier =
    tierLetter === "E" ? "ENTERPRISE" : tierLetter === "P" ? "PROFESSIONAL" : "STARTER";
  const year = 2000 + parseInt(metaBlock.slice(1, 3), 10);
  const seats = parseInt(metaBlock[3], 10) || 1;

  return {
    valid: true,
    normalizedKey: normalized,
    metadata: {
      tier,
      tierCode: tierLetter as "E" | "P" | "S",
      year,
      seats,
    },
  };
}
