// admin-panel/src/app/dashboard/licenses/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { 
  KeyRound, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Laptop, 
  PowerOff, 
  RefreshCw, 
  Apple, 
  Monitor, 
  DownloadCloud,
  CheckCircle2,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { License, Activation } from '@/lib/db/schema';
import { DeactivateModal } from '@/components/client/deactivate-modal';
import { cn } from '@/lib/utils';

export default function LicensesPage() {
  const [license, setLicense] = useState<License | null>(null);
  const [activations, setActivations] = useState<Activation[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [maxDevices, setMaxDevices] = useState(3);
  const [loading, setLoading] = useState(true);

  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const [selectedDevice, setSelectedDevice] = useState<Activation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLicenses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/licenses');
      if (res.ok) {
        const json = await res.json();
        setLicense(json.license);
        setActivations(json.activations);
        setActiveCount(json.activeDevicesCount);
        setMaxDevices(json.maxDevices);
      }
    } catch (err) {
      console.error('Failed to fetch licenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  const handleCopyKey = () => {
    if (license) {
      navigator.clipboard.writeText(license.licenseKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenDeactivate = (device: Activation) => {
    setSelectedDevice(device);
    setIsModalOpen(true);
  };

  const handleDeactivate = async (activationId: string) => {
    const res = await fetch('/api/user/licenses', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activationId }),
    });

    if (res.ok) {
      fetchLicenses();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">License Keys & Device Activations</h1>
            <span className="text-[10px] bg-blue-500/10 text-blue-500 font-bold px-2 py-0.5 rounded-full border border-blue-500/20 font-mono">
              {activeCount} / {maxDevices} Slots Used
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your sovereign desktop IDE cryptographic license keys and authorized practitioner hardware.
          </p>
        </div>

        <button
          onClick={fetchLicenses}
          disabled={loading}
          className="px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md border border-border flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading ? "animate-spin" : "")} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Master License Card */}
      <div className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-700 text-white font-bold shadow-md shadow-amber-500/20">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-foreground">Master Desktop IDE License</h2>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-0.2 rounded border border-emerald-500/20 font-mono">
                  {license?.status || 'ACTIVE'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Plan: <strong className="text-foreground">{license?.planTier || 'ENTERPRISE'}</strong> · Expires {license ? new Date(license.expiresAt).toLocaleDateString() : '01/09/2027'}
              </p>
            </div>
          </div>

          <span className="text-xs text-muted-foreground font-mono">
            Capacity: <strong>{maxDevices} Concurrent Devices</strong>
          </span>
        </div>

        {/* License Key Reveal & Copy Box */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Cryptographic License Secret</label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-secondary/60 border border-input rounded-md px-3.5 py-2 flex items-center justify-between font-mono text-xs font-bold text-foreground select-all">
              <span>
                {license
                  ? showKey
                    ? license.licenseKey
                    : `${license.licenseKey.slice(0, 8)}-••••-••••-${license.licenseKey.slice(-4)}`
                  : 'HAYA-••••-••••-••••'}
              </span>
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                title={showKey ? 'Hide key' : 'Reveal key'}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyKey}
              className="px-3.5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-md shadow-sm flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Key'}</span>
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Paste this license key into your Hayagriva Desktop IDE during startup to activate offline agent capabilities.
          </p>
        </div>
      </div>

      {/* Registered Hardware Activations Table */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div>
            <h2 className="text-sm font-bold text-foreground">Authorized Hardware Devices</h2>
            <p className="text-[11px] text-muted-foreground">Machines currently activated and consuming license slots</p>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {activeCount} of {maxDevices} active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Device & OS</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Hardware Hash</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Last Seen</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {activations.length > 0 ? (
                activations.map((a) => (
                  <tr key={a.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-xs text-foreground flex items-center gap-2">
                        <Laptop className="w-3.5 h-3.5 text-primary" />
                        <span>{a.deviceName}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">{a.osInfo}</div>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                      {a.hardwareFingerprint.slice(0, 16)}...
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold border font-mono",
                        a.isActive
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                      )}>
                        {a.isActive ? 'ACTIVE' : 'DEACTIVATED'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                      {a.lastPingAt ? new Date(a.lastPingAt).toLocaleString() : 'Recent'}
                    </td>
                    <td className="px-4 py-3">
                      {a.isActive ? (
                        <button
                          onClick={() => handleOpenDeactivate(a)}
                          className="px-2.5 py-1 text-xs font-medium text-destructive hover:bg-destructive/10 rounded border border-destructive/20 transition-colors flex items-center gap-1"
                          title="Deactivate device and free slot"
                        >
                          <PowerOff className="w-3 h-3" />
                          <span>Deactivate</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-muted-foreground italic">Revoked</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-xs text-muted-foreground">
                    No hardware devices registered yet. Download the desktop app and activate your key.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Desktop App Installer Downloads */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
        <div className="pb-2 border-b border-border">
          <h2 className="text-sm font-bold text-foreground">Download Hayagriva Desktop IDE</h2>
          <p className="text-[11px] text-muted-foreground">Available for macOS, Windows, and Linux with local bare act vaults</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <button
            onClick={() => alert('Downloading Hayagriva Desktop for macOS Apple Silicon (arm64)...')}
            className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary border border-border text-left space-y-1 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                <Apple className="w-4 h-4 text-amber-500" /> macOS (Apple Silicon)
              </span>
              <DownloadCloud className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <p className="text-[10px] text-muted-foreground font-mono">harness-macos-arm64.dmg (v1.2.0)</p>
          </button>

          <button
            onClick={() => alert('Downloading Hayagriva Desktop for Windows 10/11 (x64)...')}
            className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary border border-border text-left space-y-1 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                <Monitor className="w-4 h-4 text-blue-500" /> Windows 10 / 11
              </span>
              <DownloadCloud className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <p className="text-[10px] text-muted-foreground font-mono">Hayagriva-Setup-x64.exe (v1.2.0)</p>
          </button>

          <button
            onClick={() => alert('Downloading Hayagriva Desktop for macOS Intel (x64)...')}
            className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary border border-border text-left space-y-1 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                <Apple className="w-4 h-4 text-emerald-500" /> macOS (Intel x64)
              </span>
              <DownloadCloud className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <p className="text-[10px] text-muted-foreground font-mono">harness-macos-x64.dmg (v1.2.0)</p>
          </button>
        </div>
      </div>

      {/* Deactivate Confirmation Modal */}
      <DeactivateModal
        device={selectedDevice}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeactivate}
      />
    </div>
  );
}
