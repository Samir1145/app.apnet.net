// admin-panel/src/app/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  DownloadCloud, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Laptop,
  Database,
  Cpu,
  Bot,
  Plus,
  Sparkles
} from 'lucide-react';
import { ClientOverviewData } from '@/lib/services/client_overview';
import { cn } from '@/lib/utils';

interface DeviceSeat {
  id: string;
  deviceName: string;
  osInfo: string;
  fingerprint: string;
  ipAddress: string;
  lastPing: string;
  status: 'ACTIVE' | 'IDLE';
}

const mockDevices: DeviceSeat[] = [
  {
    id: 'act_001',
    deviceName: "Atul's MacBook Pro (Chamber Silicon)",
    osInfo: 'macOS 15.1 (ARM64 Apple M3 Pro)',
    fingerprint: 'fp_m3p_9981a_b2c4',
    ipAddress: '192.168.1.45 (Local Chamber)',
    lastPing: '2 minutes ago',
    status: 'ACTIVE',
  },
  {
    id: 'act_002',
    deviceName: "Courtroom ThinkPad X1",
    osInfo: 'Windows 11 Pro 64-bit',
    fingerprint: 'fp_win11_x1c_3391',
    ipAddress: '10.0.4.12 (Courtroom Wi-Fi)',
    lastPing: 'Yesterday at 17:40',
    status: 'IDLE',
  },
];

const mockVaults = [
  { id: 'bare_ibc.vault', name: 'IBC 2016 Bare Act Vault', size: '4.8 MB', memory: '~81 KB in-RAM', verified: true },
  { id: 'commercial_courts.vault', name: 'Commercial Courts Act 2015', size: '1.6 MB', memory: '~32 KB in-RAM', verified: true },
  { id: 'cirp_regs.vault', name: 'IBBI CIRP Regulations 2016', size: '2.1 MB', memory: '~45 KB in-RAM', verified: true },
];

const mockModels = [
  { id: 'deepseek-r1-7b', name: 'DeepSeek-R1-Distill-Qwen-7B (GGUF Q4_K_M)', size: '4.68 GB', location: '~/.hayagriva/models/' },
  { id: 'bge-small-onnx', name: 'BGE-Small-EN-v1.5 Dense Embeddings', size: '133 MB', location: '~/.hayagriva/models/' },
];

const mockAgents = [
  { id: 'agt_001', name: 'Section 43 Avoidance Auditor', archetype: 'avoidance_auditor', version: 'v1.0.0', compiled: 'Today at 22:30', file: 'avoidance-inquest-v1.0.0.haya' },
  { id: 'agt_002', name: 'Commercial Injunction Drafter', archetype: 'commercial_pleading', version: 'v1.1.0', compiled: 'Yesterday', file: 'commercial-pleading-v1.1.0.haya' },
];

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
      {/* Sovereign Chamber Inventory Section */}
      <div className="space-y-6">
        {/* Section 1: Sovereign Agent Packages (Star of the Show) */}
        <div className="p-6 rounded-xl border border-amber-500/30 bg-card space-y-4 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-500">
                  <Bot className="w-5 h-5" />
                </div>
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  Custom Sovereign Agent Packages (.haya)
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/20">
                    FLAGSHIP
                  </span>
                </h2>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Active custom agents crafted for your chamber. Download compiled <code className="text-amber-500">.haya</code> packages to dock directly into your desktop harness.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Link
                href="/dashboard/agents/builder?archetype=custom_chamber"
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm shadow-amber-500/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Agent</span>
              </Link>
              <Link
                href="/dashboard/agents"
                className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium flex items-center gap-1 border border-border transition-colors"
              >
                <span>Agent Studio</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockAgents.map((agt) => (
              <div key={agt.id} className="p-4 rounded-lg bg-secondary/40 border border-border/80 flex items-center justify-between hover:border-amber-500/40 transition-colors">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{agt.name}</h3>
                    <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500">
                      {agt.version}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">{agt.file} • {agt.compiled}</p>
                </div>
                <button
                  onClick={() => alert(`Downloading ${agt.file} for Chamber Docking`)}
                  className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium flex items-center gap-1.5 border border-border transition-colors cursor-pointer"
                >
                  <DownloadCloud className="w-3.5 h-3.5 text-amber-500" />
                  <span>Download</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Hardware Seats & Devices */}
        <div className="p-6 rounded-xl border border-border bg-card space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Laptop className="w-4 h-4 text-amber-500" />
              Chamber Hardware Seat & Transfer
              <span className="text-xs font-normal text-muted-foreground">
                ({data?.license ? `${data.license.activeDevices} / ${data.license.maxDevices}` : '1 / 1'} Seat Bound)
              </span>
            </h2>
            <Link href="/dashboard/licenses" className="text-xs text-amber-500 hover:underline flex items-center gap-1">
              Manage / Transfer Seat <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockDevices.map((dev) => (
              <div key={dev.id} className="p-4 rounded-lg bg-secondary/40 border border-border/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{dev.deviceName}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500">
                    {dev.status}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>{dev.osInfo}</p>
                  <p className="font-mono text-[11px]">Fingerprint: {dev.fingerprint}</p>
                  <p className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3 text-muted-foreground" /> Last active: {dev.lastPing}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Sovereign Reference Catalogs (In-Harness Background Sync) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pt-2">
            <div>
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider text-muted-foreground">
                Sovereign Reference Catalogs (In-Harness Sync)
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Statutory vaults and certified BharatGen weights sync automatically in the background from within your Desktop Harness.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Statutory Vaults Card */}
            <div className="p-5 rounded-xl border border-border bg-card space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-500" />
                  Statutory Vaults
                  <span className="text-xs font-normal text-muted-foreground">({mockVaults.length} Cartridges)</span>
                </h3>
                <Link href="/dashboard/vaults" className="text-xs text-amber-500 hover:underline flex items-center gap-1">
                  View Catalog <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-2">
                {mockVaults.map((vault) => (
                  <div key={vault.id} className="p-3 rounded-lg bg-secondary/40 border border-border/70 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-foreground">{vault.name}</div>
                      <div className="font-mono text-[11px] text-muted-foreground">{vault.id}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-muted-foreground font-mono text-[11px]">{vault.size}</div>
                      <div className="text-amber-500 font-mono text-[10px]">{vault.memory}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BharatGen Models Card */}
            <div className="p-5 rounded-xl border border-border bg-card space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-amber-500" />
                  BharatGen Models
                  <span className="text-xs font-normal text-muted-foreground">({mockModels.length} Certified SLMs)</span>
                </h3>
                <Link href="/dashboard/models" className="text-xs text-amber-500 hover:underline flex items-center gap-1">
                  View Models <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-2">
                {mockModels.map((model) => (
                  <div key={model.id} className="p-3 rounded-lg bg-secondary/40 border border-border/70 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-foreground">{model.name}</div>
                      <div className="font-mono text-[11px] text-muted-foreground">{model.location}</div>
                    </div>
                    <span className="text-xs font-mono font-bold text-foreground bg-secondary px-2 py-1 rounded">
                      {model.size}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
