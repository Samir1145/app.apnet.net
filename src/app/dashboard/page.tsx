// admin-panel/src/app/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  KeyRound, 
  Activity, 
  CreditCard, 
  Zap, 
  DownloadCloud, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  RefreshCw,
  Laptop,
  Shield,
  FileText
} from 'lucide-react';
import { ClientOverviewData } from '@/lib/services/client_overview';
import { cn } from '@/lib/utils';

export default function ClientDashboardPage() {
  const [data, setData] = useState<ClientOverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/overview');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to fetch client overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-6 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Welcome, {data ? data.user.name : 'Practitioner'}
            </h1>
            <span className="text-[10px] bg-blue-500/10 text-blue-500 font-bold px-2 py-0.5 rounded-full border border-blue-500/20 font-mono">
              {data ? data.user.plan : 'ENTERPRISE'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {data?.user.org || 'Rao & Partners Insolvency Advocates'} · Connected to Sovereign Legal Cloud
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Link
            href="/dashboard/licenses"
            className="px-3.5 py-2 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-sm shadow-primary/20 flex items-center gap-1.5 transition-all"
          >
            <DownloadCloud className="w-3.5 h-3.5" />
            <span>Download Desktop IDE</span>
          </Link>
          <button
            onClick={fetchOverview}
            disabled={loading}
            className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border transition-colors"
            title="Refresh dashboard"
          >
            <RefreshCw className={cn("w-4 h-4", loading ? "animate-spin" : "")} />
          </button>
        </div>
      </div>

      {/* 4 Stat / Quota Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: License & Device Capacity */}
        <div className="bg-card border border-border p-4 rounded-xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Device Slots</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <Laptop className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">
              {data?.license ? `${data.license.activeDevices} / ${data.license.maxDevices}` : '2 / 10'}
            </div>
            <p className="text-[11px] text-muted-foreground">Active Workstations & Laptops</p>
          </div>
          <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500 h-full rounded-full transition-all"
              style={{ width: `${((data?.license?.activeDevices || 2) / (data?.license?.maxDevices || 10)) * 100}%` }}
            />
          </div>
          <Link
            href="/dashboard/licenses"
            className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 pt-1"
          >
            <span>Manage Hardware Slots</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Card 2: API & MCP Usage Meter */}
        <div className="bg-card border border-border p-4 rounded-xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">API & MCP Quota</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">
              {data ? `${(data.apiUsage.requestsUsed / 1000).toFixed(1)}k` : '18.4k'}
              <span className="text-xs font-normal text-muted-foreground ml-1">/ 500k reqs</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Monthly Ingestion & Agent Calls</p>
          </div>
          <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${data?.apiUsage.usagePercent || 3.7}%` }}
            />
          </div>
          <Link
            href="/dashboard/logs"
            className="text-[11px] font-semibold text-emerald-500 hover:underline flex items-center gap-1 pt-1"
          >
            <span>View Consumption Logs</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Card 3: Subscription & Billing */}
        <div className="bg-card border border-border p-4 rounded-xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subscription</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">
              ₹{Number(data?.billing.amountInr || 49999).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-muted-foreground">Annual Renewal: {data?.billing.nextBillingDate || '01/09/2027'}</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active Subscription</span>
          </div>
          <Link
            href="/dashboard/billing"
            className="text-[11px] font-semibold text-amber-500 hover:underline flex items-center gap-1 pt-1"
          >
            <span>Invoices & Payment</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Card 4: MCP Cloud Agent Bridge */}
        <div className="bg-card border border-border p-4 rounded-xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">MCP Cloud Keys</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500 border border-purple-500/20">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">
              {data?.apiUsage.activeMcpKeysCount || 1} Active
            </div>
            <p className="text-[11px] text-muted-foreground">MacBook Pro Agent Bridge</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-purple-500 font-semibold">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
            <span>Agent Gateway Online</span>
          </div>
          <Link
            href="/dashboard/profile"
            className="text-[11px] font-semibold text-purple-500 hover:underline flex items-center gap-1 pt-1"
          >
            <span>Manage MCP Keys</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Recent API & Agent Activity Table */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div>
            <h2 className="text-sm font-bold text-foreground">Recent Agent & Workspace Activity</h2>
            <p className="text-[11px] text-muted-foreground">Invocations generated from your authenticated desktop IDE sessions</p>
          </div>
          <Link
            href="/dashboard/logs"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>View All Logs</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Timestamp</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Method</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Endpoint</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data && data.recentLogs.length > 0 ? (
                data.recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-2.5 text-[11px] font-mono text-muted-foreground">
                      {new Date(log.createdAt).toLocaleTimeString()}
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-xs text-muted-foreground">
                    No recent API activity logged in this session.
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
