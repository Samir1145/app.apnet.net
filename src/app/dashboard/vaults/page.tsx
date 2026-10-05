// admin-panel/src/app/dashboard/vaults/page.tsx
'use client';

import React, { useState } from 'react';
import { 
  Database, 
  ShieldCheck, 
  DownloadCloud, 
  FileCheck, 
  Check, 
  Copy, 
  Lock, 
  Cpu, 
  RefreshCw,
  Search
} from 'lucide-react';

interface StatutoryVault {
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
}

const vaults: StatutoryVault[] = [
  {
    id: 'bare_ibc.vault',
    name: 'Insolvency and Bankruptcy Code, 2016',
    actCode: 'IBC 2016',
    category: 'Insolvency & CIRP',
    sectionsCount: 255,
    amendedUpto: 'August 2026 (Live India Code Sync)',
    fileSize: '4.8 MB',
    ramFootprint: '~81 KB (48ms boot)',
    encryption: 'AES-256-GCM',
    sha256: '9f2a410b88e10c73d4e8b31a529f0e4c1973b88e210a47bc3921ea029471b63e',
  },
  {
    id: 'cirp_regs.vault',
    name: 'IBBI (Insolvency Resolution Process for Corporate Persons) Regulations, 2016',
    actCode: 'CIRP Regs 2016',
    category: 'Insolvency & CIRP',
    sectionsCount: 42,
    amendedUpto: 'July 2026',
    fileSize: '2.1 MB',
    ramFootprint: '~45 KB',
    encryption: 'AES-256-GCM',
    sha256: '3c8e91024b12389d40a18e2098bc1410ef78921a41b2039ec149810ea47bc910',
  },
  {
    id: 'commercial_courts.vault',
    name: 'Commercial Courts Act, 2015 & Commercial Court Rules',
    actCode: 'CCA 2015',
    category: 'Commercial Litigation',
    sectionsCount: 23,
    amendedUpto: '2026 Amendment',
    fileSize: '1.6 MB',
    ramFootprint: '~32 KB',
    encryption: 'AES-256-GCM',
    sha256: 'a14b7e8902c3ef41890e713840b2f5619ca4210e7b89d412ef88019a31bc2014',
  },
  {
    id: 'cpc_1908.vault',
    name: 'Code of Civil Procedure, 1908 (Orders 38, 39, VI, XI)',
    actCode: 'CPC 1908',
    category: 'Commercial Litigation',
    sectionsCount: 158,
    amendedUpto: 'Official Gazette',
    fileSize: '8.4 MB',
    ramFootprint: '~110 KB',
    encryption: 'AES-256-GCM',
    sha256: '7b8192a01948bc10398ea71490b213840e7912bc4019ea81029348bc19e41029',
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
  },
  {
    id: 'ni_act.vault',
    name: 'Negotiable Instruments Act, 1881 (Section 138 & 141)',
    actCode: 'NI Act 1881',
    category: 'Commercial Litigation',
    sectionsCount: 148,
    amendedUpto: 'Consolidated',
    fileSize: '2.9 MB',
    ramFootprint: '~40 KB',
    encryption: 'AES-256-GCM',
    sha256: '2a10e47bc9103c8e91024b12389d40a18e2098bc1410ef78921a41b2039ec149',
  },
];

export default function VaultsCatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredVaults = vaults.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.actCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyHash = (id: string, hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30">
              STATUTORY VAULTS CATALOG
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-500">
              India Code Synced
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Statutory Bare Act Vault Cartridges
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Authoritative, air-gapped legislative memory cartridges compiled from the official India Code legislative mirror.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search statutes, rules, acts..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border bg-card text-foreground focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Cartridge Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredVaults.map((vault) => (
          <div 
            key={vault.id} 
            className="p-5 rounded-xl border border-border bg-card hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4 shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                    {vault.category}
                  </span>
                  <h3 className="text-base font-semibold text-foreground mt-0.5">
                    {vault.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono font-bold text-foreground bg-secondary px-2 py-0.5 rounded">
                      {vault.actCode}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {vault.sectionsCount} Sections
                    </span>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-secondary text-foreground">
                  <Database className="w-5 h-5 text-amber-500" />
                </div>
              </div>

              {/* Telemetry Chips */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-secondary/40 border border-border/60">
                  <span className="text-[10px] text-muted-foreground block">ENCRYPTION</span>
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-500" /> {vault.encryption}
                  </span>
                </div>
                <div className="p-2 rounded bg-secondary/40 border border-border/60">
                  <span className="text-[10px] text-muted-foreground block">RAM FOOTPRINT</span>
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-amber-500" /> {vault.ramFootprint}
                  </span>
                </div>
              </div>

              {/* Checksum */}
              <div className="p-2 rounded bg-secondary/30 border border-border/60 flex items-center justify-between text-[11px] font-mono">
                <span className="truncate text-muted-foreground">
                  <strong className="text-foreground">SHA-256: </strong>
                  {vault.sha256}
                </span>
                <button
                  onClick={() => copyHash(vault.id, vault.sha256)}
                  className="p-1 hover:bg-secondary rounded ml-1 text-muted-foreground hover:text-foreground"
                >
                  {copiedId === vault.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-mono">{vault.id} ({vault.fileSize})</span>
              <button
                onClick={() => alert(`Downloading ${vault.name} cartridge (${vault.id})`)}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm shadow-amber-500/20"
              >
                <DownloadCloud className="w-3.5 h-3.5" />
                <span>Download .vault</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
