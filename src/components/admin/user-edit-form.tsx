// admin-panel/src/components/admin/user-edit-form.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Lock, 
  Save, 
  Key, 
  AlertCircle, 
  CheckCircle2, 
  Copy, 
  Check, 
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import { User } from '@/lib/db/schema';
import Link from 'next/link';

interface UserEditFormProps {
  user: User;
}

export function UserEditForm({ user: initialUser }: UserEditFormProps) {
  const router = useRouter();
  const [user, setUser] = useState<User>(initialUser);
  const [name, setName] = useState(initialUser.name);
  const [role, setRole] = useState(initialUser.role);
  const [status, setStatus] = useState(initialUser.status);
  const [plan, setPlan] = useState(initialUser.plan);
  const [org, setOrg] = useState(initialUser.org || '');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role, status, plan, org }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update user');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleGeneratePassword = async () => {
    setResetting(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/reset-password`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        setTempPassword(data.tempPassword);
        setResetModalOpen(true);
      }
    } catch (err) {
      console.error('Password reset failed:', err);
    } finally {
      setResetting(false);
    }
  };

  const handleCopyPassword = () => {
    if (tempPassword) {
      navigator.clipboard.writeText(tempPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/users"
            className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-lg font-bold text-foreground">Edit Practitioner Account</h2>
            <p className="text-xs text-muted-foreground">Modify chamber permissions, subscription tiers, and access credentials.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGeneratePassword}
          disabled={resetting}
          className="px-3 py-1.5 text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border rounded-md flex items-center gap-1.5 transition-colors"
        >
          <Key className="w-3.5 h-3.5 text-amber-500" />
          <span>{resetting ? 'Generating...' : 'Reset Password'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs p-3 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>User account updated successfully. Audit entry logged to Neon Postgres.</span>
        </div>
      )}

      {saveError && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5 bg-card border border-border p-6 rounded-xl shadow-sm">
        {/* Email Field - STRICTLY LOCKED */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <span>Primary Email Identifier</span>
              <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded flex items-center gap-1 font-mono">
                <Lock className="w-2.5 h-2.5" /> IMMUTABLE
              </span>
            </label>
            <span className="text-[11px] text-muted-foreground">UID: {user.id}</span>
          </div>
          <input
            type="email"
            disabled
            value={user.email}
            className="w-full bg-secondary/80 border border-input rounded-md px-3 py-2 text-xs text-muted-foreground font-mono cursor-not-allowed select-none opacity-80"
          />
          <p className="text-[11px] text-muted-foreground">
            Email addresses are cryptographically bound to chamber telemetry and cannot be edited.
          </p>
        </div>

        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Practitioner Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-secondary/50 border border-input rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Organization / Chamber */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Organization / Legal Chambers</label>
          <input
            type="text"
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            className="w-full bg-secondary/50 border border-input rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            placeholder="e.g. Rao & Partners Commercial Advocates"
          />
        </div>

        {/* Grid for Role, Status, and Plan */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">System Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-secondary/50 border border-input rounded-md px-2.5 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              <option value="ADMIN">ADMIN</option>
              <option value="ADVOCATE">ADVOCATE</option>
              <option value="CLIENT">CLIENT</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Account Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-secondary/50 border border-input rounded-md px-2.5 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="SUSPENDED">SUSPENDED</option>
              <option value="DEACTIVATED">DEACTIVATED</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Subscription Plan</label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="w-full bg-secondary/50 border border-input rounded-md px-2.5 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="STARTER">STARTER</option>
              <option value="PROFESSIONAL">PROFESSIONAL</option>
              <option value="ENTERPRISE">ENTERPRISE</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-border flex items-center justify-end space-x-3">
          <Link
            href="/admin/users"
            className="px-4 py-2 text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-md shadow-md shadow-primary/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>

      {/* Password Reset Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setResetModalOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          />
          <div className="relative bg-card border border-border rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Temporary Credentials Generated</h3>
                <p className="text-xs text-muted-foreground">Valid for 24 hours for {user.name}</p>
              </div>
            </div>

            <div className="bg-secondary/50 border border-border p-3.5 rounded-lg space-y-2">
              <div className="text-[11px] text-muted-foreground">Temporary One-Time Password:</div>
              <div className="flex items-center justify-between bg-card border border-input p-2 rounded font-mono text-sm font-bold text-foreground select-all">
                <span>{tempPassword}</span>
                <button
                  type="button"
                  onClick={handleCopyPassword}
                  className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  title="Copy password to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground">
              Provide this temporary password to the advocate. They will be prompted to set a permanent password upon their next login to the desktop IDE.
            </p>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-md shadow"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
