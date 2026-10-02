// admin-panel/src/lib/services/client_overview.ts
import { AdminStore } from '../db/seed';

export interface ClientOverviewData {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    plan: string;
    org?: string | null;
  };
  license: {
    key: string;
    planTier: string;
    maxDevices: number;
    activeDevices: number;
    status: string;
    expiresAt: string;
  } | null;
  apiUsage: {
    requestsUsed: number;
    monthlyLimit: number;
    usagePercent: number;
    activeMcpKeysCount: number;
  };
  billing: {
    latestInvoiceStatus: string;
    amountInr: string;
    nextBillingDate: string;
  };
  recentLogs: Array<{
    id: number;
    userId: string | null;
    method: string;
    endpoint: string;
    statusCode: number;
    responseTimeMs: number;
    createdAt: string;
  }>;
}

export function calculateClientOverview(store: AdminStore, userId: string): ClientOverviewData {
  const user = store.users.find(u => u.id === userId) || store.users[1]; // default to first advocate

  // License & Devices
  const userLicense = store.licenses.find(l => l.userId === user.id) || null;
  const activeActivations = store.activations.filter(a => a.userId === user.id && a.isActive);

  // API / MCP Usage
  const userLogs = store.systemLogs.filter(l => l.userId === user.id);
  const activeKeys = store.apiKeys.filter(k => k.userId === user.id && k.isActive);

  const planLimits: Record<string, number> = {
    STARTER: 10000,
    PROFESSIONAL: 100000,
    ENTERPRISE: 500000,
  };

  const monthlyLimit = planLimits[user.plan] || 100000;
  const requestsUsed = Math.max(userLogs.length * 3240, 18420); // realistic mock calculation
  const usagePercent = Math.min(Number(((requestsUsed / monthlyLimit) * 100).toFixed(1)), 100);

  // Invoices & Billing
  const userInvoices = store.invoices.filter(i => i.userId === user.id);
  const latestInvoice = userInvoices[userInvoices.length - 1] || store.invoices[0];

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan,
      org: user.org,
    },
    license: userLicense ? {
      key: userLicense.licenseKey,
      planTier: userLicense.planTier,
      maxDevices: userLicense.maxDevices,
      activeDevices: activeActivations.length,
      status: userLicense.status,
      expiresAt: new Date(userLicense.expiresAt).toISOString(),
    } : null,
    apiUsage: {
      requestsUsed,
      monthlyLimit,
      usagePercent,
      activeMcpKeysCount: activeKeys.length,
    },
    billing: {
      latestInvoiceStatus: latestInvoice ? latestInvoice.status : 'PAID',
      amountInr: latestInvoice ? latestInvoice.amountInr : '49999.00',
      nextBillingDate: userLicense ? new Date(userLicense.expiresAt).toLocaleDateString() : '2027-09-01',
    },
    recentLogs: userLogs.slice(0, 6).map(l => ({
      id: l.id,
      userId: l.userId,
      method: l.method,
      endpoint: l.endpoint,
      statusCode: l.statusCode,
      responseTimeMs: l.responseTimeMs,
      createdAt: l.createdAt ? new Date(l.createdAt).toISOString() : new Date().toISOString(),
    })),
  };
}
