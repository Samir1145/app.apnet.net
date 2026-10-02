// admin-panel/src/app/admin/logs/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Activity, Search, RefreshCw, AlertTriangle, CheckCircle, Clock, Globe } from 'lucide-react';
import { SystemLog } from '@/lib/db/schema';
import { cn } from '@/lib/utils';

export default function LogsPage() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [method, setMethod] = useState('ALL');
  const [errorOnly, setErrorOnly] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (method !== 'ALL') params.append('method', method);
      if (errorOnly) params.append('errorOnly', 'true');

      const res = await fetch(`/api/admin/logs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
      }
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [search, method, errorOnly]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">System & API Invocations</h1>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/20">
              Live Edge Stream
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit endpoint response latencies, authentication verification calls, and client desktop errors.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md border border-border flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card border border-border p-3 rounded-xl shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by endpoint, IP address or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-secondary/50 border border-input rounded-md pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="bg-secondary/50 border border-input rounded-md px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Methods</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="DELETE">DELETE</option>
          </select>

          <button
            onClick={() => setErrorOnly(!errorOnly)}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-semibold border flex items-center gap-1.5 transition-colors",
              errorOnly
                ? "bg-destructive text-destructive-foreground border-destructive"
                : "bg-secondary text-secondary-foreground border-border hover:bg-secondary/80"
            )}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Errors Only</span>
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Timestamp</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Method</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Endpoint</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Latency</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">IP Address</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Client Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.length > 0 ? (
                logs.map((log) => {
                  const isError = log.statusCode >= 400;
                  const methodColor = {
                    GET: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
                    POST: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
                    PUT: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
                    DELETE: 'bg-destructive/10 text-destructive border-destructive/20',
                  }[log.method] || 'bg-secondary text-foreground';

                  return (
                    <tr key={log.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-2.5 text-[11px] font-mono text-muted-foreground whitespace-nowrap">
                        {log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : '17:00:00'}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={cn("px-2 py-0.5 rounded text-[10px] font-mono font-bold border", methodColor)}>
                          {log.method}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs font-semibold text-foreground truncate max-w-[240px]">
                        {log.endpoint}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-mono font-bold border",
                          isError
                            ? "bg-destructive/15 text-destructive border-destructive/25"
                            : "bg-emerald-500/15 text-emerald-500 border-emerald-500/25"
                        )}>
                          {log.statusCode}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs font-mono">
                        <span className={cn(log.responseTimeMs > 1000 ? "text-amber-500 font-bold" : "text-muted-foreground")}>
                          {log.responseTimeMs}ms
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-[11px] font-mono text-muted-foreground">
                        {log.ipAddress}
                      </td>
                      <td className="px-4 py-2.5 text-[11px] text-muted-foreground truncate max-w-[200px]" title={log.userAgent || ''}>
                        {log.userAgent || '—'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-xs text-muted-foreground">
                    No logs matching the current criteria.
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
