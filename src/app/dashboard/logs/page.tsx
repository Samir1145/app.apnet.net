// admin-panel/src/app/dashboard/logs/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Activity, Search, RefreshCw, Clock, Globe } from 'lucide-react';
import { SystemLog } from '@/lib/db/schema';
import { cn } from '@/lib/utils';

export default function ClientLogsPage() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [method, setMethod] = useState('ALL');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (method !== 'ALL') params.append('method', method);

      const res = await fetch(`/api/user/logs?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setLogs(json.logs);
      }
    } catch (err) {
      console.error('Failed to load logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [search, method]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">API & Agent Consumption Logs</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit API requests, bare act retrievals, and autonomous agent executions initiated by your account.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md border border-border flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading ? "animate-spin" : "")} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card border border-border p-3 rounded-xl shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by endpoint path..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-secondary/50 border border-input rounded-md pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="bg-secondary/50 border border-input rounded-md px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="ALL">All HTTP Methods</option>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Timestamp</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Method</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Endpoint Path</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Latency</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Origin IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-2.5 text-[11px] font-mono text-muted-foreground whitespace-nowrap">
                      {log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : 'Recent'}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        {log.method}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs font-semibold text-foreground">
                      {log.endpoint}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        {log.statusCode}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs font-mono text-muted-foreground">
                      {log.responseTimeMs}ms
                    </td>
                    <td className="px-4 py-2.5 text-[11px] font-mono text-muted-foreground">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-xs text-muted-foreground">
                    No consumption logs found for this account.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
