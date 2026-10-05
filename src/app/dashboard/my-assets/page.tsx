// admin-panel/src/app/dashboard/my-assets/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Laptop, 
  Database, 
  Cpu, 
  Bot, 
  ShieldCheck, 
  DownloadCloud, 
  ArrowUpRight, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  AlertCircle
} from 'lucide-react';

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
    status: 'ACTIVE',
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

export default function MyAssetsInventoryPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30">
              SOVEREIGN INVENTORY
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-500">
              Air-Gapped Telemetry
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            My Sovereign Chamber Inventory
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Complete inventory of authorized hardware seats, bare act cartridges, AI models, and custom compiled agent packages.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/agents/builder"
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm shadow-amber-500/20"
          >
            <Bot className="w-4 h-4" />
            <span>Create New Agent</span>
          </Link>
        </div>
      </div>

      {/* Grid of 4 Inventory Cards */}
      <div className="space-y-6">
        {/* Section 1: Hardware Seats */}
        <div className="p-6 rounded-xl border border-border bg-card space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Laptop className="w-4 h-4 text-amber-500" />
              Active Hardware Seats & Devices
              <span className="text-xs font-normal text-muted-foreground">(2 / 3 Seats Activated)</span>
            </h2>
            <Link href="/dashboard/licenses" className="text-xs text-amber-500 hover:underline flex items-center gap-1">
              Manage Seats <ArrowUpRight className="w-3.5 h-3.5" />
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

        {/* Section 2: Statutory Vault Cartridges */}
        <div className="p-6 rounded-xl border border-border bg-card space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-500" />
              Chamber Statutory Vault Cartridges
              <span className="text-xs font-normal text-muted-foreground">(3 Cartridges Chambered)</span>
            </h2>
            <Link href="/dashboard/vaults" className="text-xs text-amber-500 hover:underline flex items-center gap-1">
              Browse Vaults Catalog <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockVaults.map((vault) => (
              <div key={vault.id} className="p-4 rounded-lg bg-secondary/40 border border-border/80 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{vault.name}</h3>
                    <span className="text-xs font-mono text-muted-foreground">{vault.id}</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                </div>
                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{vault.size}</span>
                  <span className="text-amber-500 font-mono text-[11px]">{vault.memory}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: AI Models */}
        <div className="p-6 rounded-xl border border-border bg-card space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-500" />
              Installed Local AI Models
            </h2>
            <Link href="/dashboard/models" className="text-xs text-amber-500 hover:underline flex items-center gap-1">
              AI Models Hub <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockModels.map((model) => (
              <div key={model.id} className="p-4 rounded-lg bg-secondary/40 border border-border/80 flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-semibold text-foreground">{model.name}</h3>
                  <p className="text-xs font-mono text-muted-foreground">{model.location}</p>
                </div>
                <span className="text-xs font-mono font-bold text-foreground bg-secondary px-2 py-1 rounded">
                  {model.size}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Sovereign Agent Packages */}
        <div className="p-6 rounded-xl border border-border bg-card space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Bot className="w-4 h-4 text-amber-500" />
              Custom Sovereign Agent Packages (.haya)
              <span className="text-xs font-normal text-muted-foreground">(2 Packages Active)</span>
            </h2>
            <Link href="/dashboard/agents" className="text-xs text-amber-500 hover:underline flex items-center gap-1">
              Manage in Agent Foundry <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockAgents.map((agt) => (
              <div key={agt.id} className="p-4 rounded-lg bg-secondary/40 border border-border/80 flex items-center justify-between">
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
                  className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium flex items-center gap-1.5 border border-border transition-colors"
                >
                  <DownloadCloud className="w-3.5 h-3.5 text-amber-500" />
                  <span>Download</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
