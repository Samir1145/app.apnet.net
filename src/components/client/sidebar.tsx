// admin-panel/src/components/client/sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  KeyRound, 
  UserCheck, 
  CreditCard, 
  Activity, 
  HelpCircle,
  DownloadCloud,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const clientNavItems: NavItem[] = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Licenses & Devices', href: '/dashboard/licenses', icon: KeyRound, badge: '2 Active' },
  { name: 'Profile & Security', href: '/dashboard/profile', icon: UserCheck },
  { name: 'Billing & Invoices', href: '/dashboard/billing', icon: CreditCard },
  { name: 'API & MCP Logs', href: '/dashboard/logs', icon: Activity },
  { name: 'Support', href: '/dashboard/support', icon: HelpCircle },
];

export function ClientSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-screen select-none sticky top-0 shrink-0">
      {/* Brand Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
            🐎
          </div>
          <div>
            <div className="font-semibold text-sm tracking-tight text-foreground flex items-center gap-1.5">
              <span>HAYAGRIVA</span>
              <span className="text-[10px] bg-blue-500/15 text-blue-500 dark:text-blue-400 font-mono px-1.5 py-0.5 rounded font-bold">
                PORTAL
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">Practitioner Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          Workspace
        </div>
        {clientNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25 font-semibold"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={cn(
                  "px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                  isActive ? "bg-white/20 text-white" : "bg-blue-500/15 text-blue-500 dark:text-blue-400"
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Desktop App Download & MCP Agent Footer */}
      <div className="p-3 border-t border-border bg-secondary/30 space-y-2.5 text-xs">
        <div className="p-2 rounded-lg bg-card border border-border space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-amber-500" /> MCP Cloud Agents
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <p className="text-[10px] text-muted-foreground">Connected to Desktop Harness v1.2.0</p>
        </div>

        <Link
          href="/dashboard/licenses"
          className="w-full py-1.5 px-2.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border flex items-center justify-center gap-1.5 text-[11px] font-semibold transition-colors"
        >
          <DownloadCloud className="w-3.5 h-3.5 text-primary" />
          <span>Download Desktop IDE</span>
        </Link>
      </div>
    </aside>
  );
}
