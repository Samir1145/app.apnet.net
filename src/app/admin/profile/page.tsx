// admin-panel/src/app/admin/profile/page.tsx
'use client';

import React from 'react';
import { ShieldCheck, Database, Server, Key, Lock, CheckCircle2, RefreshCw, Activity } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Super Admin Profile & Infrastructure</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Master administrative credentials, cryptographic key rings, and serverless database deployment status.
        </p>
      </div>

      {/* Admin Identity Hero */}
      <div className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-amber-500/20">
              AG
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground">Atul Grover (Adv.)</h2>
                <span className="text-[10px] bg-amber-500/15 text-amber-500 border border-amber-500/25 px-2 py-0.5 rounded-full font-mono font-bold">
                  SUPER_ADMIN
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">superadmin@hayagriva.app</p>
              <p className="text-xs text-muted-foreground">Founder & Senior Counsel · Hayagriva Chambers & AI Labs</p>
            </div>
          </div>

          <span className="text-[11px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified Sovereign Root
          </span>
        </div>
      </div>

      {/* Infrastructure & Security Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Neon Postgres Card */}
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-foreground">Neon Serverless DB</h3>
            </div>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-mono font-semibold px-2 py-0.5 rounded">
              Connected
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Driver:</span>
              <span className="font-mono text-foreground">@neondatabase/serverless</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">ORM Adapter:</span>
              <span className="font-mono text-foreground">drizzle-orm/neon-http</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Connection Limits:</span>
              <span className="text-emerald-500 font-semibold">Zero-Exhaustion (HTTP)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Hosting Tier:</span>
              <span className="font-semibold text-foreground">Vercel + Neon Free Tier</span>
            </div>
          </div>
        </div>

        {/* Vercel Edge Runtime Card */}
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Edge Deployment</h3>
            </div>
            <span className="text-[10px] bg-primary/10 text-primary font-mono font-semibold px-2 py-0.5 rounded">
              Active
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Framework:</span>
              <span className="font-mono text-foreground">Next.js 15 (App Router)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Styling Engine:</span>
              <span className="font-mono text-foreground">Tailwind CSS + shadcn/ui</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Grid Library:</span>
              <span className="font-mono text-foreground">@tanstack/react-table</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Auth Security:</span>
              <span className="font-semibold text-foreground">Edge Middleware + RBAC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
