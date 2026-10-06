// admin-panel/src/app/dashboard/profile/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Save, 
  CheckCircle2 
} from 'lucide-react';
import { User } from '@/lib/db/schema';
import { cn } from '@/lib/utils';

export default function ClientProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [org, setOrg] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 2FA Mock State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const profileRes = await fetch('/api/user/profile');

      if (profileRes.ok) {
        const pData = await profileRes.json();
        setUser(pData.user);
        setName(pData.user.name);
        setOrg(pData.user.org || '');
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, org }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Practitioner Profile & Security</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage firm contact credentials and multi-factor authentication.
        </p>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs p-3 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Profile changes saved successfully.</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-5">
        <h2 className="text-sm font-bold text-foreground pb-2 border-b border-border">Firm & Practitioner Details</h2>

        <div className="space-y-4">
          {/* Email - Strictly Locked */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <span>Primary Email Address</span>
                <span className="text-[10px] bg-blue-500/10 text-blue-500 border border-blue-500/20 px-1.5 py-0.5 rounded flex items-center gap-1 font-mono">
                  <Lock className="w-2.5 h-2.5" /> IMMUTABLE
                </span>
              </label>
              <span className="text-[11px] text-muted-foreground">Contact support to modify email</span>
            </div>
            <input
              type="email"
              disabled
              value={user?.email || 'advocate@chambers.in'}
              className="w-full bg-secondary/80 border border-input rounded-md px-3 py-2 text-xs text-muted-foreground font-mono cursor-not-allowed select-none opacity-80"
            />
          </div>

          {/* Name & Org */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Practitioner Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-secondary/50 border border-input rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Legal Chambers / Organization</label>
              <input
                type="text"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                className="w-full bg-secondary/50 border border-input rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="e.g. Rao & Partners Insolvency Advocates"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-md shadow flex items-center gap-1.5 disabled:opacity-50 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>

      {/* Security & 2FA Section */}
      <div className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-foreground pb-2 border-b border-border">Account Security & MFA</h2>

        <div className="flex items-center justify-between py-2 border-b border-border/50 text-xs">
          <div>
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Two-Factor Authentication (2FA)</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Requires an authenticator app (TOTP) code on new workstation logins.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
            className={cn(
              "px-3 py-1.5 rounded-md font-semibold text-xs border transition-colors",
              twoFactorEnabled
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20"
                : "bg-secondary text-muted-foreground border-border hover:text-foreground"
            )}
          >
            {twoFactorEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>
    </div>
  );
}
