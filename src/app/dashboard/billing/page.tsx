// admin-panel/src/app/dashboard/billing/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { Invoice } from '@/lib/db/schema';
import { cn } from '@/lib/utils';

export default function ClientBillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/invoices');
      if (res.ok) {
        const json = await res.json();
        setInvoices(json.invoices);
      }
    } catch (err) {
      console.error('Failed to load invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Billing & Invoices</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Download and manage your practice suite tax invoice receipts and accounting records.
          </p>
        </div>

        <button
          onClick={fetchInvoices}
          disabled={loading}
          className="px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md border border-border flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading ? "animate-spin" : "")} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Invoices Table */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div>
            <h2 className="text-sm font-bold text-foreground">Invoice History & Receipts</h2>
            <p className="text-[11px] text-muted-foreground">Download tax compliant GST invoices for accounting records</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Invoice ID</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Plan Tier</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Amount (INR)</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Issued Date</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">PDF Receipt</th>
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
                      <td className="px-4 py-3 font-mono text-xs font-bold text-foreground">
                        {inv.id}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-amber-500 font-semibold">
                        {inv.planTier}
                      </td>
                      <td className="px-4 py-3 font-bold text-xs font-mono text-foreground">
                        ₹{Number(inv.amountInr).toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold border font-mono", statusColor)}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                        {inv.issuedAt ? new Date(inv.issuedAt).toLocaleDateString() : '01/09/2026'}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => alert(`Downloading official GST Tax Invoice receipt for ${inv.id}`)}
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
                  <td colSpan={6} className="px-4 py-6 text-center text-xs text-muted-foreground">
                    No past invoices recorded.
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
