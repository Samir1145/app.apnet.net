// admin-panel/src/components/client/deactivate-modal.tsx
'use client';

import React, { useState } from 'react';
import { PowerOff } from 'lucide-react';
import { Activation } from '@/lib/db/schema';

interface DeactivateModalProps {
  device: Activation | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (activationId: string) => Promise<void>;
}

export function DeactivateModal({ device, isOpen, onClose, onConfirm }: DeactivateModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !device) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(device.id);
      onClose();
    } catch (err) {
      console.error('Failed to deactivate device:', err);
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

      <div className="relative bg-card border border-border rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20 shrink-0">
            <PowerOff className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">Release Chamber Seat</h3>
            <p className="text-xs text-muted-foreground">
              Are you sure you want to unbind <strong className="text-foreground">{device.deviceName}</strong>?
            </p>
          </div>
        </div>

        <div className="bg-secondary/40 border border-border p-3 rounded-lg text-xs space-y-1">
          <p className="font-semibold text-foreground flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Opens 1 Chamber Seat
          </p>
          <p className="text-[11px] text-muted-foreground">
            Releasing this machine frees your single seat, allowing you to bind another courtroom laptop or drafting workstation immediately.
          </p>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-semibold bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-md shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <PowerOff className="w-3.5 h-3.5" />
            <span>{loading ? 'Releasing...' : 'Release Seat'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
