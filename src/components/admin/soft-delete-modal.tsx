// admin-panel/src/components/admin/soft-delete-modal.tsx
'use client';

import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { User } from '@/lib/db/schema';

interface SoftDeleteModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userId: string, reason: string) => Promise<void>;
}

export function SoftDeleteModal({ user, isOpen, onClose, onConfirm }: SoftDeleteModalProps) {
  const [reason, setReason] = useState('Account deactivated per practitioner request');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !user) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(user.id, reason);
      onClose();
    } catch (err) {
      console.error('Failed to soft delete:', err);
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
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">Confirm Soft Deletion</h3>
            <p className="text-xs text-muted-foreground">
              Are you sure you want to deactivate <strong className="text-foreground">{user.name}</strong> ({user.email})?
            </p>
          </div>
        </div>

        <div className="bg-secondary/40 border border-border p-3 rounded-lg text-xs space-y-1">
          <p className="font-semibold text-foreground flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Compliance & Fiduciary Preservation
          </p>
          <p className="text-[11px] text-muted-foreground">
            This action flags the account as <code className="text-amber-500 font-mono">is_deleted = true</code>. Historical claim records, generated court drafts, and audit trail entries will remain preserved.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Audit Reason</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-secondary/50 border border-input rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-destructive focus:border-destructive"
            placeholder="Reason for deactivation..."
          />
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
            <Trash2 className="w-3.5 h-3.5" />
            <span>{loading ? 'Deactivating...' : 'Confirm Soft Deletion'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
