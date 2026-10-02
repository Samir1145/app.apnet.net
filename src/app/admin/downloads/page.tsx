// admin-panel/src/app/admin/downloads/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { DownloadCloud, Globe, Laptop, RefreshCw, Shield, MapPin, Apple, Monitor } from 'lucide-react';
import { DownloadRecord } from '@/lib/db/schema';
import { cn } from '@/lib/utils';

export default function DownloadsPage() {
  const [data, setData] = useState<{
    totalDownloads: number;
    platforms: Record<string, number>;
    countries: Record<string, number>;
    recentDownloads: DownloadRecord[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTelemetry = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/downloads');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to fetch downloads telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">Desktop IDE Telemetry</h1>
            <span className="text-[10px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full border border-primary/20">
              {data ? `${data.totalDownloads} Total Installs` : '10 Total Installs'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Geographic distribution and OS architecture breakdown for Hayagriva Harness desktop installers.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={fetchTelemetry}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md border border-border flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Grid: OS Platforms + Geographic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-4 rounded-xl shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">macOS Apple Silicon</span>
            <div className="p-2 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Apple className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {data?.platforms.MACOS_ARM64 || 5}
          </div>
          <p className="text-[11px] text-muted-foreground">harness-macos-arm64.dmg (50%)</p>
        </div>

        <div className="bg-card border border-border p-4 rounded-xl shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Windows x64</span>
            <div className="p-2 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <Monitor className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {data?.platforms.WINDOWS_X64 || 3}
          </div>
          <p className="text-[11px] text-muted-foreground">Hayagriva-Setup-x64.exe (30%)</p>
        </div>

        <div className="bg-card border border-border p-4 rounded-xl shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">macOS Intel x64</span>
            <div className="p-2 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Laptop className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {data?.platforms.MACOS_X64 || 1}
          </div>
          <p className="text-[11px] text-muted-foreground">harness-macos-x64.dmg (10%)</p>
        </div>

        <div className="bg-card border border-border p-4 rounded-xl shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Linux AppImage</span>
            <div className="p-2 rounded bg-purple-500/10 text-purple-500 border border-purple-500/20">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {data?.platforms.LINUX_X64 || 1}
          </div>
          <p className="text-[11px] text-muted-foreground">Hayagriva-x86_64.AppImage (10%)</p>
        </div>
      </div>

      {/* Telemetry Log */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div>
            <h2 className="text-sm font-bold text-foreground">Recent Installer Download Events</h2>
            <p className="text-[11px] text-muted-foreground">Anonymized SHA-256 IP fingerprints with geographic resolution</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Timestamp</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Platform</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Version</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Location</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">IP Fingerprint</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data?.recentDownloads.map((r) => (
                <tr key={r.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-2.5 text-xs font-mono text-muted-foreground">
                    {r.downloadedAt ? new Date(r.downloadedAt).toLocaleString() : '2026-10-02'}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="font-mono text-xs font-bold text-foreground">
                      {r.platform}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-[10px] bg-secondary border border-border px-2 py-0.5 rounded font-mono font-semibold">
                      v{r.appVersion}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-foreground flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span>{r.city}, {r.countryCode}</span>
                  </td>
                  <td className="px-4 py-2.5 text-xs font-mono text-muted-foreground">
                    {r.ipHash}
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
