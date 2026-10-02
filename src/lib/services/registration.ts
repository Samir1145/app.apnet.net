// admin-panel/src/lib/services/registration.ts
import crypto from 'crypto';
import { db, schema } from '../db';
import { getMockStore } from '../db/seed';
import { User, License } from '../db/schema';
import { generateMcpBearerToken } from '../security/tokens';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role?: string;
  designation?: string;
  firmName?: string;
  barCouncilEnrollment?: string;
}

export interface RegisterResult {
  success: boolean;
  message: string;
  user: User;
  license: License;
  sessionToken: string;
}

function generateStarterLicenseKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const chunk = () => {
    let res = '';
    for (let i = 0; i < 4; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };
  return `HAYA-STR-${chunk()}-${chunk()}-${chunk()}`;
}

export async function registerPractitioner(input: RegisterInput): Promise<RegisterResult> {
  const name = input.name?.trim();
  const email = input.email?.trim().toLowerCase();
  const password = input.password;
  const confirmPassword = input.confirmPassword;
  const designation = input.designation || 'Advocate / Litigator';
  const firmName = input.firmName?.trim() || null;
  const barCouncilEnrollment = input.barCouncilEnrollment?.trim() || null;

  if (!name || name.length < 2) {
    const error: any = new Error('Full name must be at least 2 characters.');
    error.code = 'INVALID_NAME';
    throw error;
  }

  if (!email || !email.includes('@')) {
    const error: any = new Error('A valid email address is required.');
    error.code = 'INVALID_EMAIL';
    throw error;
  }

  if (!password || password.length < 8) {
    const error: any = new Error('Password must be at least 8 characters long.');
    error.code = 'INVALID_PASSWORD';
    throw error;
  }

  if (confirmPassword && password !== confirmPassword) {
    const error: any = new Error('Passwords do not match.');
    error.code = 'PASSWORD_MISMATCH';
    throw error;
  }

  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  const isNeonLive = databaseUrl && !databaseUrl.includes('placeholder');

  const passwordHash = crypto.createHash('sha256').update(password + 'hayagriva_salt_2026').digest('hex');
  const userId = `usr_reg_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
  const licenseId = `lic_str_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
  const licenseKey = generateStarterLicenseKey();

  const now = new Date();
  const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year starter access

  const newUser: User = {
    id: userId,
    name,
    email,
    passwordHash: `$sha256$${passwordHash}`,
    role: 'ADVOCATE',
    status: 'ACTIVE',
    plan: 'STARTER',
    org: firmName || `${name} Chambers`,
    avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&fit=crop`,
    isDeleted: false,
    deletedAt: null,
    deletedBy: null,
    createdAt: now,
    updatedAt: now,
  };

  const newLicense: License = {
    id: licenseId,
    userId: userId,
    licenseKey: licenseKey,
    planTier: 'STARTER',
    maxDevices: 1,
    status: 'ACTIVE',
    expiresAt: expiresAt,
    createdAt: now,
  };

  if (isNeonLive) {
    // Check duplicate email in Neon DB
    const existing = await (db as any).query.users.findFirst({
      where: (u: any, { eq }: any) => eq(u.email, email),
    });

    if (existing) {
      const error: any = new Error('An account with this email already exists. Please sign in.');
      error.code = 'EMAIL_ALREADY_EXISTS';
      throw error;
    }

    // Insert user and license
    await (db as any).insert(schema.users).values(newUser);
    await (db as any).insert(schema.licenses).values(newLicense);
  } else {
    // Mock Store fallback
    const store = getMockStore();
    const existing = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      const error: any = new Error('An account with this email already exists. Please sign in.');
      error.code = 'EMAIL_ALREADY_EXISTS';
      throw error;
    }

    store.users.unshift(newUser);
    store.licenses.unshift(newLicense);
  }

  // Create session token payload
  const sessionPayload = {
    userId,
    email,
    name,
    role: 'ADVOCATE',
    plan: 'STARTER',
    issuedAt: Date.now(),
  };

  const b64 = Buffer.from(JSON.stringify(sessionPayload)).toString('base64url');
  const secret = process.env.SESSION_SECRET || 'hayagriva_session_jwt_secret_2026_super_secure';
  const sig = crypto.createHmac('sha256', secret).update(b64).digest('hex');
  const sessionToken = `${b64}.${sig}`;

  return {
    success: true,
    message: 'Practitioner account successfully registered and Starter license provisioned',
    user: newUser,
    license: newLicense,
    sessionToken,
  };
}
