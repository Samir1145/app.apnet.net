// admin-panel/src/components/client/header.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { 
  Sun, 
  Moon, 
  Search, 
  HelpCircle, 
  LogOut, 
  User,
  ShieldCheck,
  Zap
} from 'lucide-react';

export function ClientHeader() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    document.cookie = 'hayagriva_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'hayagriva_user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/login';
  };

  return (
    <header className="h-14 border-b border-border bg-card/80 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search Input */}
      <div className="flex items-center space-x-3 w-80">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search licenses, logs, invoices..."
            className="w-full bg-secondary/50 border border-input rounded-md pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Live Status Badge */}
        <div className="hidden sm:flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-2.5 py-1 rounded-md text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Cloud MCP Gateway Online</span>
        </div>

        {/* Support Link */}
        <Link
          href="/dashboard/support"
          className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          title="Practitioner Support"
        >
          <HelpCircle className="w-4 h-4" />
        </Link>

        {/* Theme Switcher Button */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 hover:text-amber-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        )}

        <div className="h-4 w-[1px] bg-border mx-1" />

        {/* Practitioner Profile Pill */}
        <div className="flex items-center space-x-2.5 pl-1">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-blue-500/20">
            RR
          </div>
          <div className="text-left hidden md:block">
            <div className="text-xs font-semibold text-foreground flex items-center gap-1">
              <span>Adv. Rajeshwar Rao</span>
              <span className="text-[9px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-1 py-0.2 rounded font-mono">
                ENTERPRISE
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground font-mono">r.rao@insolvencylaw.in</p>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            className="p-2 ml-2 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            title="Sign Out of Practitioner Portal"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
