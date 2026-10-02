// admin-panel/src/lib/services/modules.ts
import { AdminStore } from '../db/seed';

export function filterLogs(store: AdminStore, options: { method?: string; errorOnly?: boolean; search?: string }) {
  let logs = [...store.systemLogs];

  if (options.errorOnly) {
    logs = logs.filter(l => l.statusCode >= 400);
  }

  if (options.method && options.method !== 'ALL') {
    logs = logs.filter(l => l.method === options.method);
  }

  if (options.search && options.search.trim()) {
    const q = options.search.trim().toLowerCase();
    logs = logs.filter(l => 
      l.endpoint.toLowerCase().includes(q) || 
      l.ipAddress.toLowerCase().includes(q) ||
      (l.userAgent && l.userAgent.toLowerCase().includes(q))
    );
  }

  return logs;
}

export function filterInvoices(store: AdminStore, options: { status?: string; search?: string }) {
  let invoices = [...store.invoices];

  if (options.status && options.status !== 'ALL') {
    invoices = invoices.filter(i => i.status === options.status);
  }

  if (options.search && options.search.trim()) {
    const q = options.search.trim().toLowerCase();
    invoices = invoices.filter(i => 
      i.id.toLowerCase().includes(q) || 
      i.userName.toLowerCase().includes(q) || 
      i.userEmail.toLowerCase().includes(q) ||
      i.planTier.toLowerCase().includes(q)
    );
  }

  return invoices;
}

export function aggregateDownloads(store: AdminStore) {
  const records = store.downloadTelemetry;
  const platforms: Record<string, number> = {
    MACOS_ARM64: 0,
    MACOS_X64: 0,
    WINDOWS_X64: 0,
    LINUX_X64: 0,
  };

  const countries: Record<string, number> = {};

  records.forEach(r => {
    platforms[r.platform] = (platforms[r.platform] || 0) + 1;
    countries[r.countryCode] = (countries[r.countryCode] || 0) + 1;
  });

  return {
    totalDownloads: records.length,
    platforms,
    countries,
    recentDownloads: records.slice(0, 10),
  };
}

export function triageTickets(store: AdminStore, options: { status?: string; priority?: string; search?: string }) {
  let tickets = [...store.supportTickets];

  if (options.status && options.status !== 'ALL') {
    tickets = tickets.filter(t => t.status === options.status);
  }

  if (options.priority && options.priority !== 'ALL') {
    tickets = tickets.filter(t => t.priority === options.priority);
  }

  if (options.search && options.search.trim()) {
    const q = options.search.trim().toLowerCase();
    tickets = tickets.filter(t => 
      t.subject.toLowerCase().includes(q) || 
      t.userName.toLowerCase().includes(q) || 
      t.userEmail.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q)
    );
  }

  return tickets;
}
