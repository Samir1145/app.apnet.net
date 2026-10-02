// admin-panel/src/lib/services/metrics.ts
import { AdminStore } from '../db/seed';

export interface DashboardMetrics {
  downloads: {
    total: number;
    growthPercent: number;
    byPlatform: {
      macosArm64: number;
      macosX64: number;
      windowsX64: number;
      linuxX64: number;
    };
  };
  users: {
    total: number;
    active: number;
    suspended: number;
    advocates: number;
    clients: number;
    admins: number;
  };
  revenue: {
    totalInr: number;
    monthlyInr: number;
    paidInvoicesCount: number;
    pendingInvoicesCount: number;
    overdueInvoicesCount: number;
    monthlyChartData: Array<{ month: string; revenue: number; downloads: number }>;
  };
  systemHealth: {
    avgResponseTimeMs: number;
    errorRatePercent: number;
    uptimePercent: number;
  };
  recentActivity: Array<{
    id: number;
    type: 'LOG' | 'DOWNLOAD' | 'AUDIT' | 'PAYMENT';
    title: string;
    description: string;
    timestamp: string;
    statusBadge?: string;
  }>;
}

export function calculateDashboardMetrics(store: AdminStore): DashboardMetrics {
  const users = store.users.filter(u => !u.isDeleted);
  const activeUsers = users.filter(u => u.status === 'ACTIVE').length;
  const suspendedUsers = users.filter(u => u.status === 'SUSPENDED').length;
  const advocates = users.filter(u => u.role === 'ADVOCATE').length;
  const clients = users.filter(u => u.role === 'CLIENT').length;
  const admins = users.filter(u => u.role === 'SUPER_ADMIN' || u.role === 'ADMIN').length;

  // Telemetry downloads
  const downloads = store.downloadTelemetry;
  const totalDownloads = downloads.length;
  const macosArm64 = downloads.filter(d => d.platform === 'MACOS_ARM64').length;
  const macosX64 = downloads.filter(d => d.platform === 'MACOS_X64').length;
  const windowsX64 = downloads.filter(d => d.platform === 'WINDOWS_X64').length;
  const linuxX64 = downloads.filter(d => d.platform === 'LINUX_X64').length;

  // Invoices & Revenue
  const invoices = store.invoices;
  const paidInvoices = invoices.filter(i => i.status === 'PAID');
  const pendingInvoices = invoices.filter(i => i.status === 'PENDING');
  const overdueInvoices = invoices.filter(i => i.status === 'OVERDUE');

  const totalRevenueInr = paidInvoices.reduce((acc, inv) => acc + parseFloat(inv.amountInr), 0);

  // Monthly breakdown for chart
  const monthlyChartData = [
    { month: 'Jun 2026', revenue: 19999, downloads: 4 },
    { month: 'Jul 2026', revenue: 39998, downloads: 8 },
    { month: 'Aug 2026', revenue: 64997, downloads: 14 },
    { month: 'Sep 2026', revenue: 94996, downloads: 22 },
    { month: 'Oct 2026', revenue: totalRevenueInr, downloads: totalDownloads },
  ];

  // System Logs & Health
  const logs = store.systemLogs;
  const totalLogs = logs.length;
  const errorLogs = logs.filter(l => l.statusCode >= 400).length;
  const avgResponseTimeMs = totalLogs > 0 
    ? Math.round(logs.reduce((acc, l) => acc + l.responseTimeMs, 0) / totalLogs)
    : 35;
  const errorRatePercent = totalLogs > 0 ? Number(((errorLogs / totalLogs) * 100).toFixed(1)) : 0;

  // Merge recent activity
  const recentActivity = [
    ...store.systemLogs.slice(0, 4).map(l => ({
      id: l.id,
      type: 'LOG' as const,
      title: `${l.method} ${l.endpoint}`,
      description: `IP: ${l.ipAddress} · ${l.responseTimeMs}ms · Status ${l.statusCode}`,
      timestamp: l.createdAt ? new Date(l.createdAt).toISOString() : new Date().toISOString(),
      statusBadge: l.statusCode >= 400 ? 'destructive' : 'default'
    })),
    ...store.adminAuditLogs.map(a => ({
      id: 100 + a.id,
      type: 'AUDIT' as const,
      title: `Admin Action: ${a.action}`,
      description: `By: ${a.adminEmail} on ${a.targetUserId || 'system'}`,
      timestamp: a.createdAt ? new Date(a.createdAt).toISOString() : new Date().toISOString(),
      statusBadge: 'warning'
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return {
    downloads: {
      total: totalDownloads,
      growthPercent: 28.4,
      byPlatform: {
        macosArm64,
        macosX64,
        windowsX64,
        linuxX64,
      }
    },
    users: {
      total: users.length,
      active: activeUsers,
      suspended: suspendedUsers,
      advocates,
      clients,
      admins,
    },
    revenue: {
      totalInr: totalRevenueInr,
      monthlyInr: totalRevenueInr,
      paidInvoicesCount: paidInvoices.length,
      pendingInvoicesCount: pendingInvoices.length,
      overdueInvoicesCount: overdueInvoices.length,
      monthlyChartData,
    },
    systemHealth: {
      avgResponseTimeMs,
      errorRatePercent,
      uptimePercent: 99.98,
    },
    recentActivity: recentActivity.slice(0, 7)
  };
}
