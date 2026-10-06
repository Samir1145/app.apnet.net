// admin-panel/src/app/dashboard/licenses/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  KeyRound, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Laptop, 
  PowerOff, 
  RefreshCw, 
  CheckCircle2,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRightLeft,
  Info
} from 'lucide-react';
import { License, Activation } from '@/lib/db/schema';
import { DeactivateModal } from '@/components/client/deactivate-modal';
import { TransferSeatModal } from '@/components/client/transfer-seat-modal';
import { cn } from '@/lib/utils';

function LicensesContent() {
  const searchParams = useSearchParams();
  const isNewRegistration = searchParams?.get('new_registration') === 'true';

  const [license, setLicense] = useState<License | null>(null);
  const [activations, setActivations] = useState<Activation[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [maxDevices, setMaxDevices] = useState(1);
  const [loading, setLoading] = useState(true);

  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const [selectedDevice, setSelectedDevice] = useState<Activation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferTargetDevice, setTransferTargetDevice] = useState<Activation | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchLicenses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/licenses');
      if (res.ok) {
        const json = await res.json();
        setLicense(json.license);
        setActivations(json.activations);
        setActiveCount(json.activeDevicesCount);
        setMaxDevices(json.maxDevices || 1);
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
      setFeedbackMessage({ type: 'success', text: 'Hardware device deactivated. Your chamber seat is now open.' });
      setTimeout(() => setFeedbackMessage(null), 5000);
      fetchLicenses();
    }
  };

  const handleOpenTransfer = (target?: Activation) => {
    setTransferTargetDevice(target || null);
    setIsTransferModalOpen(true);
  };

  const handleConfirmTransfer = async (data: { deviceName: string; hardwareFingerprint?: string; osInfo?: string }) => {
    const res = await fetch('/api/user/licenses/transfer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        licenseKey: license?.licenseKey,
        ...data,
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Seat transfer failed');
    }

    setFeedbackMessage({
      type: 'success',
      text: `Seat successfully transferred to ${json.activation?.deviceName || data.deviceName}!`,
    });
    setTimeout(() => setFeedbackMessage(null), 5000);
    fetchLicenses();
  };

  const currentActive = activations.find((a) => a.isActive);

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner for Newly Registered Practitioners */}
      {isNewRegistration && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-600/15 via-indigo-600/15 to-purple-600/15 border border-blue-500/30 flex items-start gap-3.5 shadow-md animate-in fade-in duration-300">
          <div className="p-2 rounded-lg bg-blue-600 text-white shadow-sm mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-xs">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <span>🎉 Welcome to Hayagriva! Your Starter License is Ready</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Your 1-seat Starter License Key has been automatically generated below. Download the sovereign desktop installer for your operating system and enter your key during initial startup.
            </p>
          </div>
        </div>
      )}

      {/* Temporary Feedback Notification */}
      {feedbackMessage && (
        <div className={cn(
          "p-3.5 rounded-xl border flex items-center gap-3 text-xs shadow-sm transition-all animate-in fade-in",
          feedbackMessage.type === 'success'
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
            : "bg-destructive/10 border-destructive/20 text-destructive"
        )}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-medium">{feedbackMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">Licenses & Device Activations</h1>
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full border font-mono",
              activeCount > 0 
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-500 border-amber-500/20"
            )}>
              {activeCount} / {maxDevices} Seat Bound
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            1 License = 1 Chamber Machine. Sovereign, airgapped verification with 1-click hardware transfer.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => handleOpenTransfer()}
            className="px-3 py-1.5 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-md shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Transfer Seat</span>
          </button>

          <button
            onClick={fetchLicenses}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md border border-border flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", loading ? "animate-spin" : "")} />
            <span>Refresh</span>
          </button>
        </div>
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
                <h2 className="text-sm font-bold text-foreground">Master Chamber Harness License</h2>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-0.2 rounded border border-emerald-500/20 font-mono">
                  {license?.status || 'ACTIVE'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Plan: <strong className="text-foreground">{license?.planTier || 'ENTERPRISE'}</strong> · Expires {license ? new Date(license.expiresAt).toLocaleDateString() : '01/09/2027'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono bg-secondary/60 px-3 py-1 rounded-md border border-border">
              Capacity: <strong className="text-foreground">1 Authorized Chamber Seat (Single-Seat License)</strong>
            </span>
          </div>
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
            Enter this license key into your Hayagriva Desktop Harness to link your Chamber assets and sync models.
          </p>
        </div>

        {/* 1-Seat Policy Notice */}
        <div className="bg-secondary/30 border border-border/80 rounded-lg p-3 text-xs flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-[11px] text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Single-Seat Flexibility: </strong>
            Each license binds exclusively to 1 active machine at a time. If you switch from your chamber PC to a courtroom laptop, click <strong>Transfer Seat</strong> to rebind in seconds without needing support approval.
          </div>
        </div>
      </div>

      {/* Registered Hardware Activations Table */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div>
            <h2 className="text-sm font-bold text-foreground">Workstation Hardware Activations</h2>
            <p className="text-[11px] text-muted-foreground">
              {activeCount > 0 
                ? `Currently bound machine (${currentActive?.deviceName}) and previous workstation registry`
                : 'No machine currently bound. Activate in harness or use 1-click transfer below.'}
            </p>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {activeCount} of {maxDevices} active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Workstation & OS</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Hardware Hash</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Seat Status</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Last Verified</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {activations.length > 0 ? (
                activations.map((a) => (
                  <tr key={a.id} className={cn("transition-colors", a.isActive ? "bg-emerald-500/5 hover:bg-emerald-500/10" : "hover:bg-secondary/20")}>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-xs text-foreground flex items-center gap-2">
                        <Laptop className={cn("w-3.5 h-3.5", a.isActive ? "text-emerald-500" : "text-muted-foreground")} />
                        <span>{a.deviceName}</span>
                        {a.isActive && (
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                            Bound
                          </span>
                        )}
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
                        {a.isActive ? 'ACTIVE SEAT' : 'TRANSFERRED'}
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
                          title="Release seat from this machine"
                        >
                          <PowerOff className="w-3 h-3" />
                          <span>Release Seat</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenTransfer(a)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-500 hover:bg-blue-500/10 rounded border border-blue-500/20 transition-colors flex items-center gap-1"
                          title="Re-bind license seat to this machine"
                        >
                          <ArrowRightLeft className="w-3 h-3" />
                          <span>Transfer Seat Here</span>
                        </button>
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

      {/* Deactivate / Release Confirmation Modal */}
      <DeactivateModal
        device={selectedDevice}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeactivate}
      />

      {/* Transfer Seat Modal */}
      <TransferSeatModal
        currentActiveDevice={currentActive}
        targetDevice={transferTargetDevice}
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onConfirmTransfer={handleConfirmTransfer}
      />
    </div>
  );
}

export default function LicensesPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-xs text-muted-foreground">Loading license details...</div>}>
      <LicensesContent />
    </React.Suspense>
  );
}
