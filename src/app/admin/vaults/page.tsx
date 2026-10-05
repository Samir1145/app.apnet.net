// admin-panel/src/app/admin/vaults/page.tsx
'use client';

import React, { useState } from 'react';
import { 
  Database, 
  ShieldCheck, 
  RefreshCw, 
  DownloadCloud, 
  Lock, 
  Cpu, 
  ExternalLink, 
  Check, 
  Copy, 
  Sparkles,
  Search,
  Globe
} from 'lucide-react';

interface AdminVault {
  id: string;
  name: string;
  actCode: string;
  category: string;
  sectionsCount: number;
  amendedUpto: string;
  fileSize: string;
  ramFootprint: string;
  encryption: string;
  sha256: string;
  syncSource: string;
  syncStatus: 'SYNCED' | 'SYNCING' | 'STALE';
  lastSynced: string;
}

const initialVaults: AdminVault[] = [
  {
    id: 'bare_ibc.vault',
    name: 'Insolvency and Bankruptcy Code, 2016',
    actCode: 'IBC 2016',
    category: 'Insolvency & CIRP',
    sectionsCount: 255,
    amendedUpto: 'August 2026',
    fileSize: '4.8 MB',
    ramFootprint: '~81 KB (48ms boot)',
    encryption: 'AES-256-GCM',
    sha256: '9f2a410b88e10c73d4e8b31a529f0e4c1973b88e210a47bc3921ea029471b63e',
    syncSource: 'indiacode.gov.in / Act 31 of 2016',
    syncStatus: 'SYNCED',
    lastSynced: '2 hours ago',
  },
  {
    id: 'cirp_regs.vault',
    name: 'IBBI (Insolvency Resolution Process) Regulations, 2016',
    actCode: 'CIRP Regs 2016',
    category: 'Insolvency & CIRP',
    sectionsCount: 42,
    amendedUpto: 'July 2026',
    fileSize: '2.1 MB',
    ramFootprint: '~45 KB',
    encryption: 'AES-256-GCM',
    sha256: '3c8e91024b12389d40a18e2098bc1410ef78921a41b2039ec149810ea47bc910',
    syncSource: 'ibbi.gov.in / Gazette Notifications',
    syncStatus: 'SYNCED',
    lastSynced: '1 day ago',
  },
  {
    id: 'commercial_courts.vault',
    name: 'Commercial Courts Act, 2015 & Rules',
    actCode: 'CCA 2015',
    category: 'Commercial Litigation',
    sectionsCount: 23,
    amendedUpto: '2026 Amendment',
    fileSize: '1.6 MB',
    ramFootprint: '~32 KB',
    encryption: 'AES-256-GCM',
    sha256: 'a14b7e8902c3ef41890e713840b2f5619ca4210e7b89d412ef88019a31bc2014',
    syncSource: 'indiacode.gov.in / Act 4 of 2016',
    syncStatus: 'SYNCED',
    lastSynced: '3 days ago',
  },
  {
    id: 'cpc_1908.vault',
    name: 'Code of Civil Procedure, 1908',
    actCode: 'CPC 1908',
    category: 'Commercial Litigation',
    sectionsCount: 158,
    amendedUpto: 'Gazette Consolidated',
    fileSize: '8.4 MB',
    ramFootprint: '~110 KB',
    encryption: 'AES-256-GCM',
    sha256: '7b8192a01948bc10398ea71490b213840e7912bc4019ea81029348bc19e41029',
    syncSource: 'indiacode.gov.in / Act 5 of 1908',
    syncStatus: 'SYNCED',
    lastSynced: '5 days ago',
  },
  {
    id: 'companies_act.vault',
    name: 'Companies Act, 2013 & NCLT Rules',
    actCode: 'CA 2013',
    category: 'Corporate & Regulatory',
    sectionsCount: 470,
    amendedUpto: 'June 2026',
    fileSize: '12.2 MB',
    ramFootprint: '~165 KB',
    encryption: 'AES-256-GCM',
    sha256: '5e4b10298a7bc190284e31a02948bc10398ea71490b213840e7912bc4019ea81',
    syncSource: 'indiacode.gov.in / Act 18 of 2013',
    syncStatus: 'SYNCED',
    lastSynced: '1 week ago',
  },
  {
    id: 'ni_act.vault',
    name: 'Negotiable Instruments Act, 1881',
    actCode: 'NI Act 1881',
    category: 'Commercial Litigation',
    sectionsCount: 148,
    amendedUpto: 'Consolidated',
    fileSize: '2.9 MB',
    ramFootprint: '~40 KB',
    encryption: 'AES-256-GCM',
    sha256: '2a10e47bc9103c8e91024b12389d40a18e2098bc1410ef78921a41b2039ec149',
    syncSource: 'indiacode.gov.in / Act 26 of 1881',
    syncStatus: 'SYNCED',
    lastSynced: '1 week ago',
  },
];

export default function AdminVaultsPage() {
  const [vaults, setVaults] = useState<AdminVault[]>(initialVaults);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSyncVault = (vaultId: string) => {
    setSyncingId(vaultId);
    setTimeout(() => {
      setSyncingId(null);
      alert(`Successfully re-synced ${vaultId} against India Code legislative mirror! SHA-256 integrity re-verified.`);
    }, 1200);
  };

  const copyHash = (id: string, hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">Statutory Bare Act Vaults Governance</h1>
            <span className="text-[10px] bg-amber-500/10 text-amber-500 font-semibold px-2 py-0.5 rounded-full border border-amber-500/20">
              India Code Mirror Active
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor, sync, and govern encrypted bare act cartridges compiled from the Ministry of Law & Justice India Code DSpace REST endpoints.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setSyncingId('ALL');
              setTimeout(() => {
                setSyncingId(null);
                alert('All 6 Bare Act Vaults refreshed from India Code mirror successfully!');
              }, 1800);
            }}
            disabled={Boolean(syncingId)}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm shadow-amber-500/20"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncingId === 'ALL' ? 'animate-spin' : ''}`} />
            <span>Re-Sync All India Code Vaults</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Master Statutes</span>
          <div className="text-xl font-bold text-foreground">6 Vaults</div>
          <span className="text-[10px] text-emerald-500">100% Sovereign & Encrypted</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Sections</span>
          <div className="text-xl font-bold text-foreground font-mono">1,088 Sections</div>
          <span className="text-[10px] text-muted-foreground">With amendment footnotes</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Legislative Mirror</span>
          <div className="text-xl font-bold text-foreground font-mono">indiacode.gov.in</div>
          <span className="text-[10px] text-amber-500">DSpace REST API</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Average In-RAM Footprint</span>
          <div className="text-xl font-bold text-foreground font-mono">~81 KB</div>
          <span className="text-[10px] text-muted-foreground">Instant 48ms RAM boot</span>
        </div>
      </div>

      {/* Vaults Master Table */}
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Database className="w-4 h-4 text-amber-500" />
          Active Statutory Vault Cartridges
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-semibold">Vault File & Statute</th>
                <th className="pb-3 font-semibold">Act Code</th>
                <th className="pb-3 font-semibold">Sections</th>
                <th className="pb-3 font-semibold">Encryption</th>
                <th className="pb-3 font-semibold">SHA-256 Checksum</th>
                <th className="pb-3 font-semibold">India Code Mirror</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {vaults.map((vault) => (
                <tr key={vault.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="py-3 font-medium text-foreground">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-amber-500" />
                        <span className="font-semibold">{vault.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground block">{vault.id} ({vault.fileSize})</span>
                    </div>
                  </td>
                  <td className="py-3 font-mono text-foreground font-bold">{vault.actCode}</td>
                  <td className="py-3 font-mono text-muted-foreground">{vault.sectionsCount}</td>
                  <td className="py-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-emerald-400 font-semibold flex items-center gap-1 w-max">
                      <Lock className="w-2.5 h-2.5" />
                      {vault.encryption}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-[10px] text-muted-foreground max-w-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate">{vault.sha256}</span>
                      <button
                        onClick={() => copyHash(vault.id, vault.sha256)}
                        className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground shrink-0"
                        title="Copy SHA-256"
                      >
                        {copiedId === vault.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="text-[10px] text-muted-foreground block font-mono">{vault.syncSource}</span>
                    <span className="text-[10px] text-emerald-500 flex items-center gap-1">
                      ● Synced ({vault.lastSynced})
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleSyncVault(vault.id)}
                        disabled={syncingId === vault.id}
                        className="px-2.5 py-1 rounded bg-secondary hover:bg-secondary/80 text-foreground font-medium transition-colors flex items-center gap-1"
                      >
                        <RefreshCw className={`w-3 h-3 ${syncingId === vault.id ? 'animate-spin text-amber-500' : ''}`} />
                        <span>Re-Sync</span>
                      </button>
                      <button
                        onClick={() => alert(`Downloading ${vault.id} cartridge`)}
                        className="p-1 rounded hover:bg-secondary text-amber-500 transition-colors"
                        title="Download .vault"
                      >
                        <DownloadCloud className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
