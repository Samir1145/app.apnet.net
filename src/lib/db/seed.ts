// admin-panel/src/lib/db/seed.ts
import { User, SystemLog, Invoice, DownloadRecord, SupportTicket, AdminAuditLog, License, Activation, ApiKey } from './schema';

export interface AdminStore {
  users: User[];
  systemLogs: SystemLog[];
  invoices: Invoice[];
  downloadTelemetry: DownloadRecord[];
  supportTickets: SupportTicket[];
  adminAuditLogs: AdminAuditLog[];
  licenses: License[];
  activations: Activation[];
  apiKeys: ApiKey[];
}

let globalStore: AdminStore | null = null;

export function seedInitialData(): AdminStore {
  const users: User[] = [
    {
      id: 'usr_superadmin_01',
      name: 'Atul Grover (Adv.)',
      email: 'superadmin@hayagriva.app',
      passwordHash: '$2b$10$hashed_superadmin_pw',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      plan: 'ENTERPRISE',
      org: 'Hayagriva Chambers & Legal AI Lab',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&fit=crop',
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
      createdAt: new Date('2026-01-01T09:00:00Z'),
      updatedAt: new Date('2026-10-01T10:00:00Z'),
    },
    {
      id: 'usr_adv_01',
      name: 'Adv. Rajeshwar Rao',
      email: 'r.rao@insolvencylaw.in',
      passwordHash: '$2b$10$hashed_rao_pw',
      role: 'ADVOCATE',
      status: 'ACTIVE',
      plan: 'ENTERPRISE',
      org: 'Rao & Partners Insolvency Advocates',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&fit=crop',
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
      createdAt: new Date('2026-03-15T11:20:00Z'),
      updatedAt: new Date('2026-09-28T14:30:00Z'),
    },
    {
      id: 'usr_adv_02',
      name: 'Pooja Singhania (IP)',
      email: 'pooja@singhanialex.com',
      passwordHash: '$2b$10$hashed_pooja_pw',
      role: 'ADVOCATE',
      status: 'ACTIVE',
      plan: 'PROFESSIONAL',
      org: 'Singhania & Co. Insolvency Resolution',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&fit=crop',
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
      createdAt: new Date('2026-04-10T15:00:00Z'),
      updatedAt: new Date('2026-09-30T18:00:00Z'),
    },
    {
      id: 'usr_adv_03',
      name: 'Vikramjit Bannerjee',
      email: 'vikram@bannerjeechambers.com',
      passwordHash: '$2b$10$hashed_vikram_pw',
      role: 'ADVOCATE',
      status: 'ACTIVE',
      plan: 'PROFESSIONAL',
      org: 'Bannerjee Commercial Chambers',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&fit=crop',
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
      createdAt: new Date('2026-05-02T12:00:00Z'),
      updatedAt: new Date('2026-09-15T16:00:00Z'),
    },
    {
      id: 'usr_adv_04',
      name: 'Ananya Deshmukh',
      email: 'ananya@deshmukhlegal.in',
      passwordHash: '$2b$10$hashed_ananya_pw',
      role: 'ADVOCATE',
      status: 'SUSPENDED',
      plan: 'STARTER',
      org: 'Deshmukh & Associates',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&fit=crop',
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
      createdAt: new Date('2026-06-20T10:15:00Z'),
      updatedAt: new Date('2026-09-25T11:45:00Z'),
    },
    {
      id: 'usr_client_01',
      name: 'Sunil Mittal (CFO)',
      email: 'sunil.m@kestrelinfra.com',
      passwordHash: '$2b$10$hashed_sunil_pw',
      role: 'CLIENT',
      status: 'ACTIVE',
      plan: 'STARTER',
      org: 'Kestrel Infrastructure Pvt Ltd',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&fit=crop',
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
      createdAt: new Date('2026-07-01T08:30:00Z'),
      updatedAt: new Date('2026-08-12T09:00:00Z'),
    },
    {
      id: 'usr_admin_02',
      name: 'Meenakshi Sundaram',
      email: 'meenakshi@hayagriva.app',
      passwordHash: '$2b$10$hashed_meenakshi_pw',
      role: 'ADMIN',
      status: 'ACTIVE',
      plan: 'ENTERPRISE',
      org: 'Hayagriva Operations',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&fit=crop',
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
      createdAt: new Date('2026-02-01T10:00:00Z'),
      updatedAt: new Date('2026-10-01T12:00:00Z'),
    }
  ];

  const systemLogs: SystemLog[] = [
    {
      id: 1,
      userId: 'usr_adv_01',
      method: 'POST',
      endpoint: '/api/auth/login',
      statusCode: 200,
      responseTimeMs: 48,
      ipAddress: '103.21.124.5',
      userAgent: 'Hayagriva-Desktop/1.2.0 (macOS Darwin 24.1.0; arm64)',
      createdAt: new Date('2026-10-02T17:45:12Z')
    },
    {
      id: 2,
      userId: 'usr_adv_02',
      method: 'POST',
      endpoint: '/api/hayagriva/agent/chat',
      statusCode: 200,
      responseTimeMs: 1420,
      ipAddress: '49.36.18.92',
      userAgent: 'Hayagriva-Desktop/1.2.0 (Windows NT 10.0; Win64; x64)',
      createdAt: new Date('2026-10-02T17:42:00Z')
    },
    {
      id: 3,
      userId: 'usr_adv_03',
      method: 'GET',
      endpoint: '/api/hayagriva/vault/acts',
      statusCode: 200,
      responseTimeMs: 18,
      ipAddress: '14.139.224.10',
      userAgent: 'Hayagriva-Desktop/1.2.0 (macOS Darwin 24.1.0; x64)',
      createdAt: new Date('2026-10-02T17:38:22Z')
    },
    {
      id: 4,
      userId: null,
      method: 'POST',
      endpoint: '/api/auth/login',
      statusCode: 401,
      responseTimeMs: 32,
      ipAddress: '185.220.101.5',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      createdAt: new Date('2026-10-02T17:30:15Z')
    },
    {
      id: 5,
      userId: 'usr_adv_01',
      method: 'POST',
      endpoint: '/api/hayagriva/drafts/generate',
      statusCode: 200,
      responseTimeMs: 3100,
      ipAddress: '103.21.124.5',
      userAgent: 'Hayagriva-Desktop/1.2.0 (macOS Darwin 24.1.0; arm64)',
      createdAt: new Date('2026-10-02T17:25:00Z')
    },
    {
      id: 6,
      userId: 'usr_adv_04',
      method: 'GET',
      endpoint: '/api/hayagriva/estate/accounts',
      statusCode: 403,
      responseTimeMs: 15,
      ipAddress: '122.161.48.33',
      userAgent: 'Hayagriva-Desktop/1.1.9 (Linux x86_64)',
      createdAt: new Date('2026-10-02T17:15:30Z')
    },
    {
      id: 7,
      userId: 'usr_superadmin_01',
      method: 'GET',
      endpoint: '/api/admin/metrics',
      statusCode: 200,
      responseTimeMs: 25,
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      createdAt: new Date('2026-10-02T17:10:00Z')
    },
    {
      id: 8,
      userId: 'usr_adv_02',
      method: 'POST',
      endpoint: '/api/hayagriva/claims/reconcile',
      statusCode: 200,
      responseTimeMs: 840,
      ipAddress: '49.36.18.92',
      userAgent: 'Hayagriva-Desktop/1.2.0 (Windows NT 10.0; Win64; x64)',
      createdAt: new Date('2026-10-02T17:05:18Z')
    },
    {
      id: 9,
      userId: null,
      method: 'GET',
      endpoint: '/api/download/harness-macos-arm64.dmg',
      statusCode: 200,
      responseTimeMs: 120,
      ipAddress: '103.44.52.88',
      userAgent: 'Mozilla/5.0 (Macintosh; Apple Silicon)',
      createdAt: new Date('2026-10-02T16:55:00Z')
    },
    {
      id: 10,
      userId: 'usr_adv_03',
      method: 'POST',
      endpoint: '/api/hayagriva/vault/sync',
      statusCode: 200,
      responseTimeMs: 650,
      ipAddress: '14.139.224.10',
      userAgent: 'Hayagriva-Desktop/1.2.0 (macOS Darwin 24.1.0; x64)',
      createdAt: new Date('2026-10-02T16:40:00Z')
    }
  ];

  const invoices: Invoice[] = [
    {
      id: 'INV-2026-0891',
      userId: 'usr_adv_01',
      userName: 'Adv. Rajeshwar Rao',
      userEmail: 'r.rao@insolvencylaw.in',
      amountInr: '49999.00',
      status: 'PAID',
      planTier: 'ENTERPRISE',
      pdfUrl: '/invoices/INV-2026-0891.pdf',
      issuedAt: new Date('2026-09-01T00:00:00Z'),
      paidAt: new Date('2026-09-01T04:15:00Z')
    },
    {
      id: 'INV-2026-0892',
      userId: 'usr_adv_02',
      userName: 'Pooja Singhania (IP)',
      userEmail: 'pooja@singhanialex.com',
      amountInr: '19999.00',
      status: 'PAID',
      planTier: 'PROFESSIONAL',
      pdfUrl: '/invoices/INV-2026-0892.pdf',
      issuedAt: new Date('2026-09-05T00:00:00Z'),
      paidAt: new Date('2026-09-05T07:30:00Z')
    },
    {
      id: 'INV-2026-0893',
      userId: 'usr_adv_03',
      userName: 'Vikramjit Bannerjee',
      userEmail: 'vikram@bannerjeechambers.com',
      amountInr: '19999.00',
      status: 'PAID',
      planTier: 'PROFESSIONAL',
      pdfUrl: '/invoices/INV-2026-0893.pdf',
      issuedAt: new Date('2026-09-10T00:00:00Z'),
      paidAt: new Date('2026-09-10T09:45:00Z')
    },
    {
      id: 'INV-2026-0894',
      userId: 'usr_adv_04',
      userName: 'Ananya Deshmukh',
      userEmail: 'ananya@deshmukhlegal.in',
      amountInr: '4999.00',
      status: 'OVERDUE',
      planTier: 'STARTER',
      pdfUrl: '/invoices/INV-2026-0894.pdf',
      issuedAt: new Date('2026-09-15T00:00:00Z'),
      paidAt: null
    },
    {
      id: 'INV-2026-0895',
      userId: 'usr_client_01',
      userName: 'Sunil Mittal (CFO)',
      userEmail: 'sunil.m@kestrelinfra.com',
      amountInr: '4999.00',
      status: 'PAID',
      planTier: 'STARTER',
      pdfUrl: '/invoices/INV-2026-0895.pdf',
      issuedAt: new Date('2026-09-20T00:00:00Z'),
      paidAt: new Date('2026-09-20T11:00:00Z')
    },
    {
      id: 'INV-2026-0896',
      userId: 'usr_adv_01',
      userName: 'Adv. Rajeshwar Rao',
      userEmail: 'r.rao@insolvencylaw.in',
      amountInr: '49999.00',
      status: 'PENDING',
      planTier: 'ENTERPRISE',
      pdfUrl: '/invoices/INV-2026-0896.pdf',
      issuedAt: new Date('2026-10-01T00:00:00Z'),
      paidAt: null
    }
  ];

  const downloadTelemetry: DownloadRecord[] = [
    {
      id: 1,
      platform: 'MACOS_ARM64',
      appVersion: '1.2.0',
      countryCode: 'IN',
      city: 'New Delhi',
      ipHash: '8f4e2...a19',
      downloadedAt: new Date('2026-10-02T16:55:00Z')
    },
    {
      id: 2,
      platform: 'WINDOWS_X64',
      appVersion: '1.2.0',
      countryCode: 'IN',
      city: 'Mumbai',
      ipHash: '3c7d1...e42',
      downloadedAt: new Date('2026-10-02T15:20:00Z')
    },
    {
      id: 3,
      platform: 'MACOS_ARM64',
      appVersion: '1.2.0',
      countryCode: 'IN',
      city: 'Bengaluru',
      ipHash: '9a1b4...f73',
      downloadedAt: new Date('2026-10-02T14:10:00Z')
    },
    {
      id: 4,
      platform: 'LINUX_X64',
      appVersion: '1.2.0',
      countryCode: 'IN',
      city: 'Hyderabad',
      ipHash: '5e8c2...d11',
      downloadedAt: new Date('2026-10-02T12:00:00Z')
    },
    {
      id: 5,
      platform: 'MACOS_X64',
      appVersion: '1.1.9',
      countryCode: 'IN',
      city: 'Chennai',
      ipHash: '7b2a9...c48',
      downloadedAt: new Date('2026-10-02T10:30:00Z')
    },
    {
      id: 6,
      platform: 'WINDOWS_X64',
      appVersion: '1.2.0',
      countryCode: 'IN',
      city: 'Kolkata',
      ipHash: '1f3d6...e90',
      downloadedAt: new Date('2026-10-01T22:15:00Z')
    },
    {
      id: 7,
      platform: 'MACOS_ARM64',
      appVersion: '1.2.0',
      countryCode: 'AE',
      city: 'Dubai',
      ipHash: '4a8e0...b22',
      downloadedAt: new Date('2026-10-01T20:00:00Z')
    },
    {
      id: 8,
      platform: 'WINDOWS_X64',
      appVersion: '1.2.0',
      countryCode: 'IN',
      city: 'Ahmedabad',
      ipHash: '6d1c8...a55',
      downloadedAt: new Date('2026-10-01T18:40:00Z')
    },
    {
      id: 9,
      platform: 'MACOS_ARM64',
      appVersion: '1.2.0',
      countryCode: 'SG',
      city: 'Singapore',
      ipHash: '2c9f4...d81',
      downloadedAt: new Date('2026-10-01T16:10:00Z')
    },
    {
      id: 10,
      platform: 'MACOS_ARM64',
      appVersion: '1.2.0',
      countryCode: 'IN',
      city: 'Pune',
      ipHash: '0e5b7...c14',
      downloadedAt: new Date('2026-10-01T14:00:00Z')
    }
  ];

  const supportTickets: SupportTicket[] = [
    {
      id: 'TCK-8012',
      userId: 'usr_adv_01',
      userName: 'Adv. Rajeshwar Rao',
      userEmail: 'r.rao@insolvencylaw.in',
      subject: 'Custom Bare Act XML integration for Customs Act',
      description: 'Need assistance importing a custom Customs Act 1962 cartridge into the VMS Vault catalog.',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      adminResponse: 'Engineering has verified the XML schema. Preparing the AES-256 encrypted VMS cartridge package for deployment.',
      respondedAt: new Date('2026-10-02T14:30:00Z'),
      createdAt: new Date('2026-10-02T10:00:00Z'),
      updatedAt: new Date('2026-10-02T14:30:00Z')
    },
    {
      id: 'TCK-8013',
      userId: 'usr_adv_02',
      userName: 'Pooja Singhania (IP)',
      userEmail: 'pooja@singhanialex.com',
      subject: 'Exporting Section 29A Affidavits to Supreme Court Green Paper layout',
      description: 'Requesting DOCX export styling alignment for NCLAT Principal Bench formatting guidelines.',
      priority: 'MEDIUM',
      status: 'OPEN',
      adminResponse: null,
      respondedAt: null,
      createdAt: new Date('2026-10-02T12:15:00Z'),
      updatedAt: new Date('2026-10-02T12:15:00Z')
    },
    {
      id: 'TCK-8014',
      userId: 'usr_adv_04',
      userName: 'Ananya Deshmukh',
      userEmail: 'ananya@deshmukhlegal.in',
      subject: 'Account suspension clarification regarding invoice INV-2026-0894',
      description: 'Submitted payment via NEFT, kindly re-enable the desktop IDE estate accounting module.',
      priority: 'URGENT',
      status: 'OPEN',
      adminResponse: null,
      respondedAt: null,
      createdAt: new Date('2026-10-02T15:00:00Z'),
      updatedAt: new Date('2026-10-02T15:00:00Z')
    },
    {
      id: 'TCK-8009',
      userId: 'usr_client_01',
      userName: 'Sunil Mittal (CFO)',
      userEmail: 'sunil.m@kestrelinfra.com',
      subject: 'Add 2 additional read-only team members to client portal',
      description: 'Need credentials for the internal finance team to inspect creditor claim verification tables.',
      priority: 'LOW',
      status: 'RESOLVED',
      adminResponse: 'Read-only access granted for the 2 requested accounts. Invitation emails dispatched.',
      respondedAt: new Date('2026-09-29T16:00:00Z'),
      createdAt: new Date('2026-09-28T09:00:00Z'),
      updatedAt: new Date('2026-09-29T16:00:00Z')
    }
  ];

  const adminAuditLogs: AdminAuditLog[] = [
    {
      id: 1,
      adminId: 'usr_superadmin_01',
      adminEmail: 'superadmin@hayagriva.app',
      action: 'USER_SUSPENDED',
      targetUserId: 'usr_adv_04',
      previousState: { status: 'ACTIVE' },
      newState: { status: 'SUSPENDED', reason: 'Overdue invoice INV-2026-0894' },
      ipAddress: '127.0.0.1',
      createdAt: new Date('2026-09-25T11:45:00Z')
    },
    {
      id: 2,
      adminId: 'usr_superadmin_01',
      adminEmail: 'superadmin@hayagriva.app',
      action: 'PASSWORD_RESET_GENERATED',
      targetUserId: 'usr_adv_02',
      previousState: null,
      newState: { tempPasswordSent: true },
      ipAddress: '127.0.0.1',
      createdAt: new Date('2026-09-30T18:00:00Z')
    }
  ];

  const licenses: License[] = [
    {
      id: 'lic_enterprise_rao',
      userId: 'usr_adv_01',
      licenseKey: 'HAYA-ENT-8F92-K4X9-98QA',
      planTier: 'ENTERPRISE',
      maxDevices: 1,
      status: 'ACTIVE',
      expiresAt: new Date('2027-09-01T00:00:00Z'),
      createdAt: new Date('2026-03-15T11:20:00Z')
    },
    {
      id: 'lic_pro_pooja',
      userId: 'usr_adv_02',
      licenseKey: 'HAYA-PRO-7X9K-4M2P-9Q8A',
      planTier: 'PROFESSIONAL',
      maxDevices: 1,
      status: 'ACTIVE',
      expiresAt: new Date('2027-09-05T00:00:00Z'),
      createdAt: new Date('2026-04-10T15:00:00Z')
    },
    {
      id: 'lic_pro_vikram',
      userId: 'usr_adv_03',
      licenseKey: 'HAYA-PRO-3D1N-8L5W-2Z7C',
      planTier: 'PROFESSIONAL',
      maxDevices: 1,
      status: 'ACTIVE',
      expiresAt: new Date('2027-09-10T00:00:00Z'),
      createdAt: new Date('2026-05-02T12:00:00Z')
    }
  ];

  const activations: Activation[] = [
    {
      id: 'act_rao_m3max',
      licenseId: 'lic_enterprise_rao',
      userId: 'usr_adv_01',
      hardwareFingerprint: 'a3f89e21bc047de193021fa4b732e91048a6df29c48e01934ba7109283f619a0',
      deviceName: 'Rajeshwar MacBook Pro (Apple M3 Max)',
      osInfo: 'macOS Darwin 24.1.0 (arm64)',
      ipAddress: '103.21.124.5',
      lastPingAt: new Date('2026-10-02T17:45:12Z'),
      isActive: true,
      activatedAt: new Date('2026-03-16T10:00:00Z'),
      deactivatedAt: null
    },
    {
      id: 'act_rao_office_pc',
      licenseId: 'lic_enterprise_rao',
      userId: 'usr_adv_01',
      hardwareFingerprint: 'f49a8102bdc9472183e91029ba834190cba72189304192847102938475102938',
      deviceName: 'Chamber Drafting Station (Dell Precision)',
      osInfo: 'Windows NT 10.0 (Win64; x64)',
      ipAddress: '103.21.124.8',
      lastPingAt: new Date('2026-10-02T16:20:00Z'),
      isActive: false,
      activatedAt: new Date('2026-03-20T14:30:00Z'),
      deactivatedAt: new Date('2026-10-02T16:20:00Z')
    },
    {
      id: 'act_pooja_air',
      licenseId: 'lic_pro_pooja',
      userId: 'usr_adv_02',
      hardwareFingerprint: '7b2a910248c01928471928304918273645019283746102938475610293847561',
      deviceName: 'Pooja MacBook Air (M2)',
      osInfo: 'macOS Darwin 24.1.0 (arm64)',
      ipAddress: '49.36.18.92',
      lastPingAt: new Date('2026-10-02T17:42:00Z'),
      isActive: true,
      activatedAt: new Date('2026-04-12T11:00:00Z'),
      deactivatedAt: null
    }
  ];

  const apiKeys: ApiKey[] = [
    {
      id: 'key_rao_mcp_01',
      userId: 'usr_adv_01',
      activationId: 'act_rao_m3max',
      name: 'MacBook Pro MCP Agent Bridge',
      keyPrefix: 'mcp_live_9f2a',
      keyHash: 'c4ca4238a0b923820dcc509a6f75849b',
      scopes: ['mcp:agent:read', 'mcp:agent:exec', 'mcp:vault:query'],
      isActive: true,
      createdAt: new Date('2026-03-16T10:00:00Z'),
      lastUsedAt: new Date('2026-10-02T17:45:12Z')
    },
    {
      id: 'key_pooja_mcp_01',
      userId: 'usr_adv_02',
      activationId: 'act_pooja_air',
      name: 'NCLT Drafting Assistant Key',
      keyPrefix: 'mcp_live_3b81',
      keyHash: 'c81e728d9d4c2f636f067f89cc14862c',
      scopes: ['mcp:agent:read', 'mcp:agent:exec'],
      isActive: true,
      createdAt: new Date('2026-04-12T11:00:00Z'),
      lastUsedAt: new Date('2026-10-02T17:42:00Z')
    }
  ];

  globalStore = {
    users,
    systemLogs,
    invoices,
    downloadTelemetry,
    supportTickets,
    adminAuditLogs,
    licenses,
    activations,
    apiKeys
  };

  return globalStore;
}

export function getMockStore(): AdminStore {
  if (!globalStore) {
    return seedInitialData();
  }
  return globalStore;
}
