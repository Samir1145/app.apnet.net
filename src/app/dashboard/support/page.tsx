// admin-panel/src/app/dashboard/support/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { HelpCircle, Plus, RefreshCw, Clock, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';
import { SupportTicket } from '@/lib/db/schema';
import { CreateTicketModal } from '@/components/client/create-ticket-modal';
import { cn } from '@/lib/utils';

export default function ClientSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/support');
      if (res.ok) {
        const json = await res.json();
        setTickets(json.tickets);
      }
    } catch (err) {
      console.error('Failed to load tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Chamber Support & Inquiries</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            File engineering inquiries, statutory template requests, and bare act XML cartridge assistance.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={fetchTickets}
            disabled={loading}
            className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border transition-colors"
            title="Refresh tickets"
          >
            <RefreshCw className={cn("w-4 h-4", loading ? "animate-spin" : "")} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Support Ticket</span>
          </button>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {tickets.length > 0 ? (
          tickets.map((t) => {
            const priorityColor = {
              URGENT: 'bg-destructive/15 text-destructive border-destructive/25',
              HIGH: 'bg-amber-500/15 text-amber-500 border-amber-500/25',
              MEDIUM: 'bg-blue-500/15 text-blue-500 border-blue-500/25',
              LOW: 'bg-slate-500/15 text-slate-400 border-slate-500/25',
            }[t.priority] || 'bg-secondary text-foreground';

            const statusColor = {
              OPEN: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
              IN_PROGRESS: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
              RESOLVED: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
            }[t.status] || 'bg-secondary text-foreground';

            return (
              <div
                key={t.id}
                className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-3 hover:border-border/80 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-500">{t.id}</span>
                      <h3 className="text-sm font-bold text-foreground">{t.subject}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold border font-mono", priorityColor)}>
                      {t.priority}
                    </span>
                    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold border font-mono", statusColor)}>
                      {t.status}
                    </span>
                  </div>
                </div>

                <div className="bg-secondary/40 p-3 rounded-lg text-xs text-foreground/90 border border-border/50 leading-relaxed">
                  {t.description}
                </div>

                {/* Official Operations / Engineering Response */}
                {t.adminResponse && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Hayagriva Support Team Response
                      </span>
                      {t.respondedAt && (
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {new Date(t.respondedAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">{t.adminResponse}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs pt-1 text-muted-foreground font-mono">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3" />
                    Filed: {t.createdAt ? new Date(t.createdAt).toLocaleString() : 'Recent'}
                  </span>
                  <span className="text-[11px]">
                    {t.status === 'RESOLVED' ? 'Status: Resolved & Dispatched' : 'Chamber Response Time: ~2 hrs'}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-card border border-border rounded-xl p-8 text-center text-xs text-muted-foreground space-y-2">
            <p>You have no active support tickets.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-xs font-semibold"
            >
              Submit a Ticket
            </button>
          </div>
        )}
      </div>

      {/* Ticket Modal */}
      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(ticket) => setTickets((prev) => [ticket, ...prev])}
      />
    </div>
  );
}
