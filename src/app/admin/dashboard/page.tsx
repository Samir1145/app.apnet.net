// admin-panel/src/app/admin/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  DownloadCloud, 
  Users, 
  IndianRupee, 
  Activity, 
  ArrowUpRight, 
  ShieldAlert, 
  FileText, 
  Plus,
  RefreshCw,
  Server,
  Zap,
  Bot,
  Scale,
  Cpu,
  Monitor,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { MetricsCard } from '@/components/admin/metrics-card';
import { RevenueChart } from '@/components/admin/revenue-chart';
import { ActivityStream } from '@/components/admin/activity-stream';
import { DashboardMetrics } from '@/lib/services/metrics';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/metrics');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Banner / Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">Executive Overview</h1>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Live Telemetry
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cross-platform desktop distribution, billing revenue, bare act vaults, and agent cartridge moderation.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={fetchMetrics}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md border border-border flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Link
            href="/admin/users"
            className="px-3 py-1.5 text-xs font-semibold bg-amber-500 text-slate-950 hover:bg-amber-600 rounded-md shadow-sm shadow-amber-500/20 flex items-center gap-1.5 transition-all"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Manage Users</span>
          </Link>
        </div>
      </div>

      {/* 4 Primary Financial & Infrastructure Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard
          title="Total Downloads"
          value={metrics ? metrics.downloads.total : '10'}
          subtitle="macOS (6) · Windows (3) · Linux (1)"
          icon={DownloadCloud}
          trend={{ value: '+28.4%', isPositive: true }}
          highlightColor="amber"
        />

        <MetricsCard
          title="Active Advocates"
          value={metrics ? `${metrics.users.active} / ${metrics.users.total}` : '6 / 7'}
          subtitle="1 Suspended (Overdue Bill)"
          icon={Users}
          trend={{ value: '85.7% Active', isPositive: true }}
          highlightColor="blue"
        />

        <MetricsCard
          title="Gross Revenue"
          value={metrics ? `₹${metrics.revenue.totalInr.toLocaleString('en-IN')}` : '₹94,996'}
          subtitle="5 Paid Invoices · 1 Pending"
          icon={IndianRupee}
          trend={{ value: '+42.1%', isPositive: true }}
          highlightColor="emerald"
        />

        <MetricsCard
          title="API Response Time"
          value={metrics ? `${metrics.systemHealth.avgResponseTimeMs} ms` : '35 ms'}
          subtitle="99.98% Uptime · 0 Fatal Errs"
          icon={Zap}
          trend={{ value: 'Optimal', isPositive: true }}
          highlightColor="purple"
        />
      </div>

      {/* Sovereign Asset & Agent Inventory Governance Row */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            Sovereign Asset & In-Chamber Agent Governance
          </h2>
          <span className="text-[11px] text-muted-foreground font-mono">Real-Time Registry</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Agent Cartridges */}
          <Link 
            href="/admin/agents"
            className="p-4 rounded-xl bg-card border border-border hover:border-amber-500/40 transition-all group shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Agent Cartridges</span>
                <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">5 Packages</div>
              <div className="text-xs text-muted-foreground mt-1">4 Official · 1 Under Review</div>
            </div>
            <div className="pt-3 border-t border-border/50 mt-3 flex items-center justify-between text-xs text-amber-500 font-medium">
              <span>Moderate Foundry</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Bare Act Vaults */}
          <Link 
            href="/admin/vaults"
            className="p-4 rounded-xl bg-card border border-border hover:border-amber-500/40 transition-all group shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Chamber Vaults</span>
                <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
                  <Scale className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">8 Statutes</div>
              <div className="text-xs text-muted-foreground mt-1">1,840 Sections · AES-256</div>
            </div>
            <div className="pt-3 border-t border-border/50 mt-3 flex items-center justify-between text-xs text-blue-400 font-medium">
              <span>Manage Law Vaults</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* AI Models Registry */}
          <Link 
            href="/admin/models"
            className="p-4 rounded-xl bg-card border border-border hover:border-amber-500/40 transition-all group shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">AI Reasoning Engines</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">3 Engines</div>
              <div className="text-xs text-muted-foreground mt-1">DeepSeek, Llama, BGE-ONNX</div>
            </div>
            <div className="pt-3 border-t border-border/50 mt-3 flex items-center justify-between text-xs text-emerald-400 font-medium">
              <span>Inspect Models</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Desktop Harness Rollout */}
          <Link 
            href="/admin/harness"
            className="p-4 rounded-xl bg-card border border-border hover:border-amber-500/40 transition-all group shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Harness Rollout</span>
                <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
                  <Monitor className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">v1.2.0 Active</div>
              <div className="text-xs text-muted-foreground mt-1">4 Binaries Built & Signed</div>
            </div>
            <div className="pt-3 border-t border-border/50 mt-3 flex items-center justify-between text-xs text-purple-400 font-medium">
              <span>View Releases</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Main Charts & Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Revenue Trajectory & Downloads */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div>
              <h2 className="text-sm font-bold text-foreground">Revenue Trajectory (INR)</h2>
              <p className="text-[11px] text-muted-foreground">Monthly subscription intake across practice suites</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded bg-amber-500"></span>
                <span>Revenue (₹)</span>
              </span>
            </div>
          </div>

          <RevenueChart data={metrics?.revenue.monthlyChartData || []} />
        </div>

        {/* Right 1 Col: Platform Telemetry Distribution */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <div className="pb-2 border-b border-border">
            <h2 className="text-sm font-bold text-foreground">Client Distribution by OS</h2>
            <p className="text-[11px] text-muted-foreground">Installed Desktop IDE instances</p>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-semibold text-foreground">macOS Apple Silicon (ARM64)</span>
                <span className="font-mono text-muted-foreground">50% (5)</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full w-1/2"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-semibold text-foreground">Windows 10/11 (x64)</span>
                <span className="font-mono text-muted-foreground">30% (3)</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full w-[30%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-semibold text-foreground">macOS Intel (x64)</span>
                <span className="font-mono text-muted-foreground">10% (1)</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-[10%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-semibold text-foreground">Linux AppImage (x64)</span>
                <span className="font-mono text-muted-foreground">10% (1)</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full w-[10%]"></div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border bg-secondary/30 -mx-5 -mb-5 p-4 rounded-b-xl space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">Active Version Release:</span>
              <span className="font-mono font-bold text-foreground">v1.2.0 (Build 890)</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">Target Architecture:</span>
              <span className="font-mono text-foreground">Standalone Node.js Air-Gap</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Stream Section */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div>
            <h2 className="text-sm font-bold text-foreground">Real-Time Activity & Audit Logs</h2>
            <p className="text-[11px] text-muted-foreground">Recent API invocations, authentication attempts, and admin interventions</p>
          </div>
          <Link
            href="/admin/logs"
            className="text-xs font-semibold text-amber-500 hover:underline flex items-center gap-1"
          >
            <span>View All Logs</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ActivityStream items={metrics?.recentActivity || []} />
      </div>
    </div>
  );
}
