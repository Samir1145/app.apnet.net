// admin-panel/src/components/admin/user-view-drawer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { 
  X, 
  User as UserIcon, 
  Mail, 
  Building2, 
  ShieldCheck, 
  Calendar, 
  Edit3, 
  Key, 
  CreditCard,
  Activity
} from 'lucide-react';
import { User } from '@/lib/db/schema';
import { cn } from '@/lib/utils';

interface UserViewDrawerProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserViewDrawer({ user, isOpen, onClose }: UserViewDrawerProps) {
  if (!isOpen || !user) return null;

  const roleColor = {
    SUPER_ADMIN: 'bg-amber-500/15 text-amber-500 border-amber-500/20',
    ADMIN: 'bg-purple-500/15 text-purple-500 border-purple-500/20',
    ADVOCATE: 'bg-blue-500/15 text-blue-500 border-blue-500/20',
    CLIENT: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
  }[user.role] || 'bg-secondary text-foreground';

  const statusColor = {
    ACTIVE: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    SUSPENDED: 'bg-destructive/10 text-destructive border-destructive/20',
    DEACTIVATED: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  }[user.status] || 'bg-secondary text-foreground';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-card border-l border-border shadow-2xl p-6 flex flex-col space-y-6 overflow-y-auto animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <UserIcon className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-bold text-foreground">Practitioner Profile</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Hero Details */}
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-lg font-bold shadow-md shadow-amber-500/20 shrink-0">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1 min-w-0">
              <h3 className="text-base font-bold text-foreground truncate">{user.name}</h3>
              <p className="text-xs text-muted-foreground font-mono truncate">{user.email}</p>
              <div className="flex items-center gap-2 pt-1">
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border font-mono", roleColor)}>
                  {user.role}
                </span>
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border font-mono", statusColor)}>
                  {user.status}
                </span>
              </div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="space-y-3 pt-2 text-xs border-t border-border">
            <div className="flex items-center justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Organization
              </span>
              <span className="font-semibold text-foreground truncate max-w-[200px]">
                {user.org || 'Independent Practitioner'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" /> Subscription Plan
              </span>
              <span className="font-mono font-bold text-amber-500">
                {user.plan}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Member Since
              </span>
              <span className="font-mono text-muted-foreground">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2026-01-01'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" /> Telemetry Access
              </span>
              <span className="text-emerald-500 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Verified Client
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 space-y-2.5 mt-auto">
            <Link
              href={`/admin/users/${user.id}/edit`}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold py-2 rounded-md shadow flex items-center justify-center gap-2 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit User Profile & Permissions</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
