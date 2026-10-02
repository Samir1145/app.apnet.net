// admin-panel/src/components/admin/sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  DownloadCloud, 
  CreditCard, 
  Activity, 
  HelpCircle, 
  ShieldCheck, 
  Database,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const navItems: NavItem[] = [
  { name: 'Executive Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users Directory', href: '/admin/users', icon: Users },
  { name: 'Downloads & Telemetry', href: '/admin/downloads', icon: DownloadCloud },
  { name: 'Billing & Invoices', href: '/admin/invoices', icon: CreditCard },
  { name: 'System & API Logs', href: '/admin/logs', icon: Activity },
  { name: 'Support Tickets', href: '/admin/support', icon: HelpCircle, badge: '4' },
  { name: 'Admin Profile & Security', href: '/admin/profile', icon: ShieldCheck },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-screen select-none sticky top-0 shrink-0">
      {/* Brand Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold shadow-md shadow-amber-500/20">
            🐎
          </div>
          <div>
            <div className="font-semibold text-sm tracking-tight text-foreground flex items-center gap-1.5">
              <span>HAYAGRIVA</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-500 dark:text-amber-400 font-mono px-1.5 py-0.5 rounded font-bold">
                ROOT
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">Control Center</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          Management
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
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
                  isActive ? "bg-white/20 text-white" : "bg-amber-500/15 text-amber-500 dark:text-amber-400"
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Infrastructure Telemetry Footer */}
      <div className="p-3 border-t border-border bg-secondary/30 space-y-2 text-xs">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Neon Serverless</span>
          </span>
          <span className="font-mono text-[10px] font-semibold text-foreground">Active</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Vercel Edge</span>
          </span>
          <span className="font-mono text-[10px] font-semibold text-foreground">v15.1</span>
        </div>
      </div>
    </aside>
  );
}
