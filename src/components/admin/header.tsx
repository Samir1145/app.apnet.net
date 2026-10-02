// admin-panel/src/components/admin/header.tsx
'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { 
  Sun, 
  Moon, 
  Search, 
  Bell, 
  LogOut, 
  ShieldAlert,
  UserCheck
} from 'lucide-react';

export function AdminHeader() {
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
      {/* Search Command input */}
      <div className="flex items-center space-x-3 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search advocates, claims, invoices, telemetry..."
            className="w-full bg-secondary/50 border border-input rounded-md pl-9 pr-8 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-card border border-border text-muted-foreground px-1.5 py-0.5 rounded font-mono font-medium pointer-events-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Action Icons & Controls */}
      <div className="flex items-center space-x-3">
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

        {/* Notifications */}
        <button 
          className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground relative transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1.5 right-1.5 ring-2 ring-card" />
        </button>

        <div className="h-4 w-[1px] bg-border mx-1" />

        {/* Super Admin Profile Pill */}
        <div className="flex items-center space-x-2.5 pl-1">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white text-xs font-bold ring-2 ring-amber-500/20">
            AG
          </div>
          <div className="text-left hidden md:block">
            <div className="text-xs font-semibold text-foreground flex items-center gap-1">
              <span>Atul Grover</span>
              <span className="text-[9px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-1 py-0.2 rounded font-mono">
                SUPER_ADMIN
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground font-mono">superadmin@hayagriva.app</p>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            className="p-2 ml-2 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            title="Sign Out of Super Admin Portal"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
