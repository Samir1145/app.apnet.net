'use client';

import React, { useState, useEffect } from 'react';
import { X, RefreshCw, HardDrive, CheckCircle2, ShieldCheck, Lock, Globe, AlertCircle, Cpu } from 'lucide-react';
import { HubItem } from '@/lib/db/schema';

interface FleetSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FleetSyncModal({ isOpen, onClose }: FleetSyncModalProps) {
  const [loading, setLoading] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [licenseKey, setLicenseKey] = useState('HAYA-ENT-8F92-K4X9-98QA');

  useEffect(() => {
    const cookies = document.cookie.split('; ');
    const lic = cookies.find(c => c.startsWith('hayagriva_license_key='));
    if (lic) {
      setLicenseKey(decodeURIComponent(lic.split('=')[1]));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSync = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/hub/sync', {
        headers: {
          'x-hayagriva-license': licenseKey,
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Sync handshake failed');
      }

      setSyncResult(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Error communicating with sync service');
      setLoading(false);
    }
  };

  const publicCount = syncResult?.items?.filter((i: any) => i.visibility === 'PUBLIC')?.length || 0;
  const privateCount = syncResult?.items?.filter((i: any) => i.visibility === 'PRIVATE_CHAMBER')?.length || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl p-6 relative overflow-hidden space-y-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Multi-Machine Fleet Synchronizer</h3>
              <p className="text-xs text-muted-foreground">Air-gapped sync for 100s of distributed AnythingLLM nodes</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* License Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Active Chamber License</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              className="flex-1 bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs font-mono text-foreground outline-none focus:border-amber-500"
              placeholder="HAYA-ENT-8F92-K4X9-98QA"
            />
            <button
              onClick={handleSync}
              disabled={loading}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Syncing...' : 'Perform Handshake'}</span>
            </button>
          </div>
        </div>

        {/* Sync Summary Card */}
        {syncResult && (
          <div className="bg-secondary/30 border border-border rounded-xl p-4 space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <div>
                <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Fleet Sync Verified</span>
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Chamber: <strong className="text-foreground">{syncResult.chamber.org}</strong> ({syncResult.chamber.planTier})
                </p>
              </div>
              <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                200 OK
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-card border border-border flex items-center gap-3">
                <div className="p-2 rounded-md bg-cyan-500/10 text-cyan-400">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground font-mono">{publicCount}</div>
                  <div className="text-[10px] text-muted-foreground">Public Tools</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-card border border-border flex items-center gap-3">
                <div className="p-2 rounded-md bg-amber-500/10 text-amber-500">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground font-mono">{privateCount}</div>
                  <div className="text-[10px] text-muted-foreground">Chamber Private Tools</div>
                </div>
              </div>
            </div>

            {/* Private Tool List */}
            {privateCount > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider block">
                  Synchronized Chamber Confidential Tools:
                </span>
                <div className="space-y-1 max-h-32 overflow-y-auto pr-1 text-xs">
                  {syncResult.items
                    .filter((i: any) => i.visibility === 'PRIVATE_CHAMBER')
                    .map((item: any) => (
                      <div key={item.id} className="p-1.5 rounded bg-card border border-border flex items-center justify-between text-[11px]">
                        <span className="font-medium text-foreground truncate max-w-[280px]">{item.name}</span>
                        <span className="font-mono text-[9px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">{item.itemType}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Local Command instruction */}
        <div className="p-3 rounded-xl bg-secondary/50 border border-border text-[11px] space-y-1.5 text-muted-foreground">
          <div className="font-bold text-foreground flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-primary" />
            <span>Air-Gapped AnythingLLM Workstation Sync Command:</span>
          </div>
          <p className="leading-relaxed">
            From any workstation terminal running AnythingLLM on your local chamber LAN:
          </p>
          <pre className="p-2 rounded bg-card font-mono text-[10px] text-foreground border border-border overflow-x-auto">
            curl -H &quot;X-Hayagriva-License: {licenseKey}&quot; http://localhost:3300/api/v1/hub/sync
          </pre>
        </div>
      </div>
    </div>
  );
}
