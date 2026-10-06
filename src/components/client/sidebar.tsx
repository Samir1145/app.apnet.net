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
  HelpCircle,
  DownloadCloud,
  Database,
  Cpu,
  Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Workspace',
    items: [
      { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    ]
  },
  {
    title: 'Sovereign Assets',
    items: [
      { name: 'Desktop Harness', href: '/dashboard/harness', icon: DownloadCloud },
      { name: 'Statutory Bare Act Vaults', href: '/dashboard/vaults', icon: Database },
      { name: 'AI Models Hub', href: '/dashboard/models', icon: Cpu },
    ]
  },
  {
    title: 'Agent Foundry',
    items: [
      { name: 'Agent Studio & Registry', href: '/dashboard/agents', icon: Bot },
    ]
  },
  {
    title: 'Governance & Accounting',
    items: [
      { name: 'Licenses & Devices', href: '/dashboard/licenses', icon: KeyRound, badge: '2 Active' },
      { name: 'Billing & Invoices', href: '/dashboard/billing', icon: CreditCard },
      { name: 'Profile & Security', href: '/dashboard/profile', icon: UserCheck },
      { name: 'Support', href: '/dashboard/support', icon: HelpCircle },
    ]
  }
];

export function ClientSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-screen select-none sticky top-0 shrink-0">
      {/* Brand Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center p-0.5 shadow-sm overflow-hidden">
            <img
              src="/branding/hayagriva_icon_white.png"
              alt="Hayagriva"
              className="w-full h-full object-contain filter drop-shadow-sm hidden dark:block"
            />
            <img
              src="/branding/hayagriva_icon.png"
              alt="Hayagriva"
              className="w-full h-full object-contain filter drop-shadow-sm block dark:hidden"
            />
          </div>
          <div>
            <div className="font-semibold text-sm tracking-tight text-foreground flex items-center gap-1.5">
              <span>HAYAGRIVA</span>
              <span className="text-[10px] bg-amber-500/15 text-amber-500 dark:text-amber-400 font-mono px-1.5 py-0.5 rounded font-bold">
                PORTAL
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">Practitioner Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-3 px-2 space-y-4 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {section.title}
            </div>
            {section.items.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-medium transition-all group",
                    isActive
                      ? "bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/30 font-semibold"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", isActive ? "text-amber-500 dark:text-amber-400" : "text-muted-foreground group-hover:text-foreground")} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={cn(
                      "px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                      isActive ? "bg-amber-500/20 text-amber-500" : "bg-emerald-500/15 text-emerald-500"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

    </aside>
  );
}
