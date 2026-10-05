// admin-panel/src/app/admin/harness/page.tsx
'use client';

import React, { useState } from 'react';
import { 
  DownloadCloud, 
  Laptop, 
  ShieldCheck, 
  Check, 
  Copy, 
  Plus, 
  Edit3, 
  RefreshCw, 
  UploadCloud,
  FileCode,
  Tag,
  AlertCircle
} from 'lucide-react';

interface ReleaseBinary {
  id: string;
  platform: string;
  arch: string;
  fileName: string;
  fileSize: string;
  sha256: string;
  downloadUrl: string;
  downloadCount: number;
  status: 'LIVE' | 'STAGED';
}

const initialBinaries: ReleaseBinary[] = [
  {
    id: 'bin_mac_arm',
    platform: 'macOS',
    arch: 'Apple Silicon (M1/M2/M3/M4)',
    fileName: 'Hayagriva-1.2.0-arm64.dmg',
    fileSize: '142 MB',
    sha256: '9f2a4b88e10c73d4e8b31a529f0e4c1973b88e210a47bc3921ea029471b63ef1',
    downloadUrl: 'https://releases.hayagriva.legal/v1.2.0/Hayagriva-1.2.0-arm64.dmg',
    downloadCount: 42,
    status: 'LIVE',
  },
  {
    id: 'bin_mac_x64',
    platform: 'macOS',
    arch: 'Intel Core x64',
    fileName: 'Hayagriva-1.2.0-x64.dmg',
    fileSize: '148 MB',
    sha256: 'a14b7e8902c3ef41890e713840b2f5619ca4210e7b89d412ef88019a31bc2014',
    downloadUrl: 'https://releases.hayagriva.legal/v1.2.0/Hayagriva-1.2.0-x64.dmg',
    downloadCount: 16,
    status: 'LIVE',
  },
  {
    id: 'bin_win_x64',
    platform: 'Windows',
    arch: 'Windows 10 / 11 64-bit',
    fileName: 'Hayagriva-Setup-1.2.0.exe',
    fileSize: '156 MB',
    sha256: '3c8e91024b12389d40a18e2098bc1410ef78921a41b2039ec149810ea47bc910',
    downloadUrl: 'https://releases.hayagriva.legal/v1.2.0/Hayagriva-Setup-1.2.0.exe',
    downloadCount: 28,
    status: 'LIVE',
  },
  {
    id: 'bin_linux_x64',
    platform: 'Linux',
    arch: 'Ubuntu / Debian / RHEL AppImage',
    fileName: 'Hayagriva-1.2.0.AppImage',
    fileSize: '139 MB',
    sha256: '7b8192a01948bc10398ea71490b213840e7912bc4019ea81029348bc19e41029',
    downloadUrl: 'https://releases.hayagriva.legal/v1.2.0/Hayagriva-1.2.0.AppImage',
    downloadCount: 9,
    status: 'LIVE',
  },
];

export default function AdminHarnessPage() {
  const [binaries, setBinaries] = useState<ReleaseBinary[]>(initialBinaries);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
            <h1 className="text-xl font-bold tracking-tight text-foreground">Desktop Harness Release Manager</h1>
            <span className="text-[10px] bg-amber-500/10 text-amber-500 font-semibold px-2 py-0.5 rounded-full border border-amber-500/20">
              v1.2.0 Production
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Oversee desktop IDE binary distributions, SHA-256 checksums, and update notification channels for practitioners.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => alert('Opening release staging modal...')}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm shadow-amber-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Publish New Release</span>
          </button>
        </div>
      </div>

      {/* Active Release Overview Hero Card */}
      <div className="p-5 rounded-xl border border-border bg-card space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold text-base">
              🐎
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-foreground">Hayagriva Sovereign IDE v1.2.0</h2>
                <span className="text-[10px] bg-emerald-500/15 text-emerald-500 px-2 py-0.5 rounded-full font-bold">
                  ACTIVE DEPLOYMENT
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Released October 2026 • 95 Total Practitioner Installations Across 4 Platforms
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-secondary px-2.5 py-1 rounded text-foreground">
              Channel: Stable (Main)
            </span>
          </div>
        </div>
      </div>

      {/* Multi-Platform Binary Table */}
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <DownloadCloud className="w-4 h-4 text-amber-500" />
          Binary Assets & Checksums
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-semibold">Platform & OS</th>
                <th className="pb-3 font-semibold">File Name</th>
                <th className="pb-3 font-semibold">Size</th>
                <th className="pb-3 font-semibold">SHA-256 Checksum</th>
                <th className="pb-3 font-semibold">Installs</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {binaries.map((bin) => (
                <tr key={bin.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="py-3 font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <Laptop className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <span className="block font-semibold">{bin.platform}</span>
                        <span className="text-[10px] text-muted-foreground">{bin.arch}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 font-mono text-foreground">{bin.fileName}</td>
                  <td className="py-3 text-muted-foreground font-mono">{bin.fileSize}</td>
                  <td className="py-3 font-mono text-[10px] text-muted-foreground max-w-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate">{bin.sha256}</span>
                      <button
                        onClick={() => copyHash(bin.id, bin.sha256)}
                        className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground shrink-0"
                        title="Copy SHA-256"
                      >
                        {copiedId === bin.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </td>
                  <td className="py-3 font-mono text-foreground font-semibold">{bin.downloadCount}</td>
                  <td className="py-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500">
                      {bin.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => alert(`Edit binary settings for ${bin.fileName}`)}
                      className="px-2.5 py-1 rounded bg-secondary hover:bg-secondary/80 text-foreground font-medium transition-colors"
                    >
                      Edit URL
                    </button>
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
