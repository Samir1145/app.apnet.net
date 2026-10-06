// admin-panel/src/app/admin/support/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { HelpCircle, Search, RefreshCw, MessageSquare, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { SupportTicket } from '@/lib/db/schema';
import { TicketResolutionModal } from '@/components/admin/ticket-resolution-modal';
import { cn } from '@/lib/utils';

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [priority, setPriority] = useState('ALL');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status !== 'ALL') params.append('status', status);
      if (priority !== 'ALL') params.append('priority', priority);

      const res = await fetch(`/api/admin/support?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets);
      }
    } catch (err) {
      console.error('Failed to fetch support tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [search, status, priority]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">Practitioner Support Inbox</h1>
            <span className="text-[10px] bg-amber-500/10 text-amber-500 font-semibold px-2 py-0.5 rounded-full border border-amber-500/20">
              {tickets.filter(t => t.status === 'OPEN').length} Open Tickets
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Resolve advocate inquiries regarding Bare Act cartridges, DOCX styling, and client authorizations.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={fetchTickets}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md border border-border flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card border border-border p-3 rounded-xl shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tickets by subject, advocate or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-secondary/50 border border-input rounded-md pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-secondary/50 border border-input rounded-md px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="bg-secondary/50 border border-input rounded-md px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">URGENT</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {tickets.map((t) => {
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
              className="bg-card border border-border rounded-xl p-4 shadow-sm hover:border-border/80 transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-500">{t.id}</span>
                    <h3 className="text-sm font-bold text-foreground">{t.subject}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    From: <strong className="text-foreground">{t.userName}</strong> ({t.userEmail})
                  </p>
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

              {/* Official Response Callout if Present */}
              {t.adminResponse && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-amber-500 font-semibold text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                      Hayagriva Operations Reply
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

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  Filed: {t.createdAt ? new Date(t.createdAt).toLocaleString() : '2026-10-02'}
                </span>

                <button
                  onClick={() => {
                    setSelectedTicket(t);
                    setIsModalOpen(true);
                  }}
                  className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Reply / Update Status</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ticket Resolution / Reply Modal */}
      <TicketResolutionModal
        ticket={selectedTicket}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTicket(null);
        }}
        onSuccess={(updated) => {
          setTickets((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        }}
      />
    </div>
  );
}
