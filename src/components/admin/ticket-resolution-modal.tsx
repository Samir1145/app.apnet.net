// admin-panel/src/components/admin/ticket-resolution-modal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  User,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { SupportTicket } from '@/lib/db/schema';
import { cn } from '@/lib/utils';

interface TicketResolutionModalProps {
  ticket: SupportTicket | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedTicket: SupportTicket) => void;
}

const CANNED_RESPONSES = [
  {
    label: 'Cartridge Deployed',
    text: 'Engineering has verified and compiled the custom Bare Act XML into an AES-256 encrypted VMS cartridge. It is now accessible in your practitioner vault.'
  },
  {
    label: 'Under Investigation',
    text: 'Our legal-tech engineering team is actively investigating this schema issue. We will update you with a patch shortly.'
  },
  {
    label: 'Payment Verified',
    text: 'NEFT/RTGS transaction has been reconciled. Account standing is restored and all desktop IDE modules are active.'
  },
  {
    label: 'Formatting Aligned',
    text: 'The DOCX export style presets have been updated to comply with the Principal Bench court filing specifications.'
  }
];

export function TicketResolutionModal({
  ticket,
  isOpen,
  onClose,
  onSuccess
}: TicketResolutionModalProps) {
  const [status, setStatus] = useState<string>('IN_PROGRESS');
  const [priority, setPriority] = useState<string>('MEDIUM');
  const [adminResponse, setAdminResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status || 'OPEN');
      setPriority(ticket.priority || 'MEDIUM');
      setAdminResponse(ticket.adminResponse || '');
      setError(null);
    }
  }, [ticket]);

  if (!isOpen || !ticket) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/support', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: ticket.id,
          status,
          priority,
          adminResponse: adminResponse.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update ticket');
      }

      onSuccess(data.ticket);
      onClose();
    } catch (err: any) {
      console.error('Failed to resolve ticket:', err);
      setError(err?.message || 'Failed to update ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyTemplate = (templateText: string) => {
    setAdminResponse((prev) => {
      if (!prev.trim()) return templateText;
      return `${prev}\n\n${templateText}`;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in"
      />

      <div className="relative bg-card border border-border rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-500">{ticket.id}</span>
                <span className="text-muted-foreground text-xs">·</span>
                <h3 className="text-sm font-bold text-foreground">Ticket Resolution & Reply</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Responding to <strong className="text-foreground">{ticket.userName}</strong> ({ticket.userEmail})
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

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Original Ticket Context */}
        <div className="bg-secondary/40 border border-border rounded-lg p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">{ticket.subject}</span>
            <span className="text-[11px] text-muted-foreground font-mono">
              Filed: {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'N/A'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {ticket.description}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Status Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <span>Ticket Status</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-secondary/50 border border-input rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-medium"
              >
                <option value="OPEN">OPEN (Awaiting Review)</option>
                <option value="IN_PROGRESS">IN_PROGRESS (Investigating)</option>
                <option value="RESOLVED">RESOLVED (Solution Dispatched)</option>
                <option value="CLOSED">CLOSED (Archived)</option>
              </select>
            </div>

            {/* Priority Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <span>Priority Level</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-secondary/50 border border-input rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-medium"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT (Court Hearing Blockage)</option>
              </select>
            </div>
          </div>

          {/* Quick Response Templates */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Quick Canned Response Templates</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CANNED_RESPONSES.map((tmpl) => (
                <button
                  type="button"
                  key={tmpl.label}
                  onClick={() => handleApplyTemplate(tmpl.text)}
                  className="px-2.5 py-1 text-[11px] rounded bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border transition-colors font-medium"
                >
                  + {tmpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Response Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Official Practitioner Response & Resolution Note</span>
              <span className="text-[10px] text-muted-foreground">Will be visible in practitioner's portal</span>
            </label>
            <textarea
              rows={4}
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              className="w-full bg-secondary/50 border border-input rounded-md px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary leading-relaxed"
              placeholder="Explain resolution steps, cartridge deployment status, or guidance for the advocate..."
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "px-4 py-2 text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-all text-white",
                status === 'RESOLVED' 
                  ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20"
                  : "bg-primary hover:bg-primary/90 shadow-primary/20"
              )}
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : status === 'RESOLVED' ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>{status === 'RESOLVED' ? 'Mark Resolved & Dispatch' : 'Update Ticket & Reply'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
