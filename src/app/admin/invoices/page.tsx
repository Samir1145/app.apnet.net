// admin-panel/src/app/admin/invoices/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { CreditCard, Search, RefreshCw, FileText, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Invoice } from '@/lib/db/schema';
import { cn } from '@/lib/utils';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [totalRevenue, setTotalRevenue] = useState(0);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status !== 'ALL') params.append('status', status);

      const res = await fetch(`/api/admin/invoices?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setInvoices(data.invoices);
        setTotalRevenue(data.totalRevenueInr);
      }
    } catch (err) {
      console.error('Failed to fetch invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [search, status]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">Billing & Invoice Ledger</h1>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/20">
              ₹{totalRevenue.toLocaleString('en-IN')} Collected
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Subscription disbursements across Commercial Recovery, Insolvency & ADR Practice Suites.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={fetchInvoices}
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
            placeholder="Search by invoice ID, advocate or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-secondary/50 border border-input rounded-md pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-secondary/50 border border-input rounded-md px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="ALL">All Payment Statuses</option>
          <option value="PAID">PAID</option>
          <option value="PENDING">PENDING</option>
          <option value="OVERDUE">OVERDUE</option>
        </select>
      </div>

      {/* Invoices Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Invoice ID</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Practitioner</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Plan Tier</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Amount (INR)</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Issued Date</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.length > 0 ? (
                invoices.map((inv) => {
                  const statusColor = {
                    PAID: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
                    PENDING: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
                    OVERDUE: 'bg-destructive/10 text-destructive border-destructive/20',
                  }[inv.status] || 'bg-secondary text-foreground';

                  return (
                    <tr key={inv.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono font-bold text-foreground">
                        {inv.id}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-xs text-foreground">{inv.userName}</div>
                        <div className="text-[11px] text-muted-foreground font-mono">{inv.userEmail}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-semibold text-amber-500">
                          {inv.planTier}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-bold font-mono text-foreground">
                        ₹{Number(inv.amountInr).toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold border font-mono", statusColor)}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                        {inv.issuedAt ? new Date(inv.issuedAt).toLocaleDateString() : '2026-09-01'}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => alert(`Downloading official GST invoice receipt for ${inv.id}`)}
                          className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                          title="Download Invoice PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-xs text-muted-foreground">
                    No invoices matching the current criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
