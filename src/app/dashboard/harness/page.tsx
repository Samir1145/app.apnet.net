// admin-panel/src/app/dashboard/harness/page.tsx
'use client';

import React, { useState } from 'react';
import { 
  Laptop, 
  DownloadCloud, 
  Check, 
  Copy, 
  ShieldCheck, 
  Cpu, 
  HardDrive,
  FileCode,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface BinaryRelease {
  id: string;
  os: string;
  arch: string;
  label: string;
  version: string;
  fileSize: string;
  fileName: string;
  sha256: string;
  recommended?: boolean;
}

const releases: BinaryRelease[] = [
  {
    id: 'mac-arm',
    os: 'macOS',
    arch: 'Apple Silicon (M1/M2/M3/M4)',
    label: 'macOS ARM64',
    version: '1.2.0',
    fileSize: '142 MB',
    fileName: 'Hayagriva-1.2.0-arm64.dmg',
    sha256: '9f2a4b88e10c73d4e8b31a529f0e4c1973b88e210a47bc3921ea029471b63ef1',
    recommended: true,
  },
  {
    id: 'mac-x64',
    os: 'macOS',
    arch: 'Intel Core x64',
    label: 'macOS x64',
    version: '1.2.0',
    fileSize: '148 MB',
    fileName: 'Hayagriva-1.2.0-x64.dmg',
    sha256: 'a14b7e8902c3ef41890e713840b2f5619ca4210e7b89d412ef88019a31bc2014',
  },
  {
    id: 'win-x64',
    os: 'Windows',
    arch: 'Windows 10 / 11 64-bit',
    label: 'Windows x64 Installer',
    version: '1.2.0',
    fileSize: '156 MB',
    fileName: 'Hayagriva-Setup-1.2.0.exe',
    sha256: '3c8e91024b12389d40a18e2098bc1410ef78921a41b2039ec149810ea47bc910',
  },
  {
    id: 'linux-x64',
    os: 'Linux',
    arch: 'Ubuntu / Debian / RHEL AppImage',
    label: 'Linux x64',
    version: '1.2.0',
    fileSize: '139 MB',
    fileName: 'Hayagriva-1.2.0.AppImage',
    sha256: '7b8192a01948bc10398ea71490b213840e7912bc4019ea81029348bc19e41029',
  },
];

export default function HarnessDownloadPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
              DESKTOP HARNESS v1.2.0
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-500">
              Production Release
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Download Hayagriva Desktop IDE
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Native, air-gapped sovereign workspace with local SQLite FTS5 search, encrypted bare act vaults, and offline LLM reasoning.
          </p>
        </div>
      </div>

      {/* Release Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {releases.map((rel) => (
          <div 
            key={rel.id} 
            className="p-5 rounded-xl border border-border bg-card hover:border-amber-500/40 transition-all flex flex-col justify-between relative group shadow-sm"
          >
            {rel.recommended && (
              <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded-full">
                Recommended
              </span>
            )}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-foreground group-hover:text-amber-500 transition-colors">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                    {rel.os}
                    <span className="text-xs text-muted-foreground font-normal">({rel.fileSize})</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">{rel.arch}</p>
                </div>
              </div>

              {/* SHA256 Pill */}
              <div className="p-2.5 rounded-lg bg-secondary/50 border border-border/80 flex items-center justify-between text-xs font-mono">
                <div className="truncate mr-2 text-[11px] text-muted-foreground">
                  <span className="text-foreground font-semibold">SHA-256: </span>
                  {rel.sha256}
                </div>
                <button
                  onClick={() => copyHash(rel.id, rel.sha256)}
                  className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground shrink-0 transition-colors"
                  title="Copy SHA-256 checksum"
                >
                  {copiedId === rel.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-mono">{rel.fileName}</span>
              <a
                href={`#download-${rel.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Starting download of ${rel.fileName} (${rel.fileSize})`);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm shadow-amber-500/20"
              >
                <DownloadCloud className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
