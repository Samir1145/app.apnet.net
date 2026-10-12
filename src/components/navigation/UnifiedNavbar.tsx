'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { 
  Compass, 
  LayoutDashboard, 
  ShieldCheck, 
  Sun, 
  Moon, 
  LogOut, 
  RefreshCw, 
  PlusCircle, 
  Lock, 
  Sparkles,
  Building2,
  HardDrive
} from 'lucide-react';

interface UnifiedNavbarProps {
  onOpenPublish?: () => void;
  onTriggerSync?: () => void;
}

export function UnifiedNavbar({ onOpenPublish, onTriggerSync }: UnifiedNavbarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    // Parse user cookie
    const cookies = document.cookie.split('; ');
    const userCookie = cookies.find(c => c.startsWith('hayagriva_user='));
    if (userCookie) {
      try {
        const parsed = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
        setUser(parsed);
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    document.cookie = 'hayagriva_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'hayagriva_user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'hayagriva_license_key=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/login';
  };

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  return (
    <header className="h-14 border-b border-border bg-card/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 transition-colors">
      {/* Left: Brand & Main Navigation Tabs */}
      <div className="flex items-center space-x-6">
        <Link href="/hub" className="flex items-center space-x-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-sm shadow-md group-hover:scale-105 transition-transform">
            ॐ
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-xs font-bold tracking-tight text-foreground flex items-center gap-1.5">
              HAYAGRIVA
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500 font-semibold border border-amber-500/20">
                SOVEREIGN HUB
              </span>
            </span>
            <span className="text-[9px] text-muted-foreground">Legal AI Community & Chamber Fleet</span>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <Link
            href="/dashboard/agents?tab=bazaar"
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              (pathname.includes('/agents') || pathname.startsWith('/hub'))
                ? 'bg-secondary text-foreground shadow-sm font-semibold'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-500" />
            <span>Varaha Agents</span>
          </Link>

          <Link
            href="/dashboard"
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              pathname.startsWith('/dashboard')
                ? 'bg-secondary text-foreground shadow-sm font-semibold'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-blue-500" />
            <span>Workstations</span>
          </Link>

          {isSuperAdmin && (
            <Link
              href="/admin/dashboard"
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                pathname.startsWith('/admin')
                  ? 'bg-secondary text-foreground shadow-sm font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Admin Console</span>
            </Link>
          )}
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Chamber Badge */}
        {user ? (
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-secondary/50 border border-border text-[11px]">
            <Building2 className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-medium text-foreground max-w-[140px] truncate">
              {user.org || user.name}
            </span>
            <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-primary/10 text-primary font-bold">
              {user.plan || 'ENTERPRISE'}
            </span>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-xs text-amber-500 hover:text-amber-400 font-medium px-2 py-1"
          >
            Sign In with License
          </Link>
        )}

        {/* Sync Trigger Button */}
        {onTriggerSync && (
          <button
            onClick={onTriggerSync}
            className="px-2.5 py-1.5 bg-secondary hover:bg-secondary/80 border border-border rounded-md text-xs font-medium text-foreground transition-all flex items-center gap-1.5 shadow-sm"
            title="Synchronize Public & Private tools with AnythingLLM"
          >
            <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Sync Fleet</span>
          </button>
        )}

        {/* Publish Asset Button */}
        {onOpenPublish && (
          <button
            onClick={onOpenPublish}
            className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm shadow-primary/20"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Publish</span>
          </button>
        )}

        {/* Theme Toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        )}

        {/* Logout */}
        {user && (
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
}
