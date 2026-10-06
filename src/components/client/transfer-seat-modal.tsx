// admin-panel/src/components/client/transfer-seat-modal.tsx
'use client';

import React, { useState } from 'react';
import { ArrowRightLeft, Laptop, ShieldCheck, X, AlertCircle } from 'lucide-react';
import { Activation } from '@/lib/db/schema';

interface TransferSeatModalProps {
  currentActiveDevice?: Activation | null;
  targetDevice?: Activation | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmTransfer: (data: { deviceName: string; hardwareFingerprint?: string; osInfo?: string }) => Promise<void>;
}

export function TransferSeatModal({
  currentActiveDevice,
  targetDevice,
  isOpen,
  onClose,
  onConfirmTransfer,
}: TransferSeatModalProps) {
  const [deviceName, setDeviceName] = useState(targetDevice?.deviceName || '');
  const [osInfo, setOsInfo] = useState(targetDevice?.osInfo || 'macOS (Apple Silicon)');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (targetDevice) {
      setDeviceName(targetDevice.deviceName);
      setOsInfo(targetDevice.osInfo);
    } else {
      setDeviceName('');
      setOsInfo('macOS (Apple Silicon)');
    }
    setError(null);
  }, [targetDevice, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceName.trim()) {
      setError('Please provide a workstation or device name');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onConfirmTransfer({
        deviceName: deviceName.trim(),
        hardwareFingerprint: targetDevice?.hardwareFingerprint || `hw_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        osInfo: osInfo.trim(),
      });
      onClose();
    } catch (err: unknown) {
      console.error('Failed to transfer seat:', err);
      const msg = err instanceof Error ? err.message : 'Transfer failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in"
      />

      <div className="relative bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-600 border border-blue-500/20 shrink-0">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Transfer 1-Seat Chamber License</h3>
              <p className="text-xs text-muted-foreground">
                Move your active license seat to another workstation
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Transfer Path Explainer */}
        <div className="bg-secondary/40 border border-border p-3.5 rounded-lg space-y-2 text-xs">
          <div className="flex items-center justify-between text-muted-foreground text-[11px] font-semibold uppercase">
            <span>Currently Bound</span>
            <span>New Bound Workstation</span>
          </div>
          <div className="flex items-center justify-between font-medium">
            <div className="flex items-center gap-2 text-destructive font-mono">
              <Laptop className="w-3.5 h-3.5" />
              <span>{currentActiveDevice ? currentActiveDevice.deviceName : 'No Active Device'}</span>
            </div>
            <ArrowRightLeft className="w-4 h-4 text-blue-500" />
            <div className="flex items-center gap-2 text-emerald-500 font-mono">
              <Laptop className="w-3.5 h-3.5" />
              <span>{deviceName || 'Target Workstation'}</span>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground pt-1 border-t border-border">
            Under the single-seat policy, confirming will immediately release the seat from your previous machine and grant sovereign offline access to this new machine.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Target Workstation Name</label>
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              placeholder="e.g., Chamber M3 MacBook Pro or Courtroom Laptop"
              className="w-full bg-secondary/50 border border-input rounded-md px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Operating System</label>
            <select
              value={osInfo}
              onChange={(e) => setOsInfo(e.target.value)}
              className="w-full bg-secondary/50 border border-input rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="macOS (Apple Silicon)">macOS (Apple Silicon / M-Series)</option>
              <option value="macOS (Intel)">macOS (Intel x64)</option>
              <option value="Windows 11 (x64)">Windows 11 (x64)</option>
              <option value="Windows 10 Pro (x64)">Windows 10 Pro (x64)</option>
              <option value="Ubuntu Linux (x64)">Ubuntu Linux LTS (x64)</option>
            </select>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-md shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>{loading ? 'Transferring...' : 'Confirm 1-Click Transfer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
