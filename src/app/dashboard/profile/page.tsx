// admin-panel/src/app/dashboard/profile/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { 
  User as UserIcon, 
  Lock, 
  Key, 
  ShieldCheck, 
  Building2, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Zap, 
  Clock, 
  Shield
} from 'lucide-react';
import { User, ApiKey } from '@/lib/db/schema';
import { GenerateKeyModal } from '@/components/client/generate-key-modal';
import { cn } from '@/lib/utils';

export default function ClientProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [org, setOrg] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

  // 2FA Mock State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const [profileRes, keysRes] = await Promise.all([
        fetch('/api/user/profile'),
        fetch('/api/user/keys'),
      ]);

      if (profileRes.ok) {
        const pData = await profileRes.json();
        setUser(pData.user);
        setName(pData.user.name);
        setOrg(pData.user.org || '');
      }

      if (keysRes.ok) {
        const kData = await keysRes.json();
        setKeys(kData.keys);
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

  const handleRevokeKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to revoke this MCP API key? Any agents using it will immediately lose cloud access.')) {
      return;
    }

    const res = await fetch('/api/user/keys', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyId }),
    });

    if (res.ok) {
      setKeys((prev) => prev.map((k) => (k.id === keyId ? { ...k, isActive: false } : k)));
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Practitioner Profile & Security</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage firm contact credentials, multi-factor authentication, and programmatic MCP agent tokens.
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

      {/* Programmatic & MCP Cloud API Keys */}
      <div className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-500" />
              <h2 className="text-sm font-bold text-foreground">Programmatic & MCP Cloud API Keys</h2>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Bearer tokens used by autonomous AI agents to query bare acts, verify claims, and draft petitions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsKeyModalOpen(true)}
            className="px-3 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generate New Key</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Key Identifier</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Prefix Token</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Last Used</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {keys.length > 0 ? (
                keys.map((k) => (
                  <tr key={k.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 font-semibold text-xs text-foreground">
                      {k.name}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-purple-500 font-bold">
                      {k.keyPrefix}...
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold border font-mono",
                        k.isActive
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-destructive/10 text-destructive border-destructive/20"
                      )}>
                        {k.isActive ? 'ACTIVE' : 'REVOKED'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                      {k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-4 py-3">
                      {k.isActive ? (
                        <button
                          type="button"
                          onClick={() => handleRevokeKey(k.id)}
                          className="px-2 py-1 text-xs text-destructive hover:bg-destructive/10 rounded transition-colors flex items-center gap-1"
                          title="Revoke key"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Revoke</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-muted-foreground italic">Revoked</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-xs text-muted-foreground">
                    No MCP API keys created yet. Generate one to connect automated CI/CD pipelines.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Key Modal */}
      <GenerateKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onSuccess={(newKey) => {
          setKeys((prev) => [newKey, ...prev]);
        }}
      />
    </div>
  );
}
