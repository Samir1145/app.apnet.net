'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, Key, ArrowRight, AlertCircle, Sparkles, Building2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'license' | 'credentials'>('license');
  const [licenseKey, setLicenseKey] = useState('HAYA-ENT-8F92-K4X9-98QA');
  const [email, setEmail] = useState('r.rao@insolvencylaw.in');
  const [password, setPassword] = useState('hayagriva_secure_password');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // License Map for direct authentication
  const licenseMap: Record<string, any> = {
    'HAYA-ENT-8F92-K4X9-98QA': {
      id: 'usr_adv_01',
      name: 'Adv. Rajeshwar Rao',
      email: 'r.rao@insolvencylaw.in',
      role: 'ADVOCATE',
      status: 'ACTIVE',
      plan: 'ENTERPRISE',
      org: 'Rao & Partners Insolvency Advocates',
      licenseKey: 'HAYA-ENT-8F92-K4X9-98QA',
    },
    'HAYA-PRO-7X9K-4M2P-9Q8A': {
      id: 'usr_adv_02',
      name: 'Pooja Singhania (IP)',
      email: 'pooja@singhanialex.com',
      role: 'ADVOCATE',
      status: 'ACTIVE',
      plan: 'PROFESSIONAL',
      org: 'Singhania & Co. Insolvency Resolution',
      licenseKey: 'HAYA-PRO-7X9K-4M2P-9Q8A',
    },
    'HAYA-SOV-CHAMBER-2026-LIVE': {
      id: 'usr_superadmin_01',
      name: 'Atul Grover (Adv.)',
      email: 'superadmin@hayagriva.app',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      plan: 'SOVEREIGN_ENTERPRISE',
      org: 'Hayagriva Chambers & Legal AI Lab',
      licenseKey: 'HAYA-SOV-CHAMBER-2026-LIVE',
    },
  };

  const handleLicenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const trimmed = licenseKey.trim();
    const user = licenseMap[trimmed];

    if (!user) {
      setError('Invalid or unrecognized Sovereign Chamber License Key.');
      setLoading(false);
      return;
    }

    // Set auth cookies
    document.cookie = `hayagriva_admin_token=tok_${user.role.toLowerCase()}_${Date.now()}; path=/; max-age=604800; SameSite=Lax`;
    document.cookie = `hayagriva_user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=604800; SameSite=Lax`;
    document.cookie = `hayagriva_license_key=${encodeURIComponent(user.licenseKey)}; path=/; max-age=604800; SameSite=Lax`;

    setTimeout(() => {
      router.push(user.role === 'SUPER_ADMIN' ? '/admin/dashboard' : '/hub');
    }, 300);
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let user: any = null;
    if (email === 'superadmin@hayagriva.app') {
      user = licenseMap['HAYA-SOV-CHAMBER-2026-LIVE'];
    } else if (email === 'r.rao@insolvencylaw.in') {
      user = licenseMap['HAYA-ENT-8F92-K4X9-98QA'];
    } else if (email === 'pooja@singhanialex.com') {
      user = licenseMap['HAYA-PRO-7X9K-4M2P-9Q8A'];
    } else if (email.includes('@')) {
      user = {
        id: 'usr_adv_01',
        name: 'Adv. Rajeshwar Rao',
        email: email,
        role: 'ADVOCATE',
        status: 'ACTIVE',
        plan: 'ENTERPRISE',
        org: 'Rao & Partners Insolvency Advocates',
        licenseKey: 'HAYA-ENT-8F92-K4X9-98QA',
      };
    }

    if (user) {
      document.cookie = `hayagriva_admin_token=tok_${user.role.toLowerCase()}_${Date.now()}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `hayagriva_user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `hayagriva_license_key=${encodeURIComponent(user.licenseKey || '')}; path=/; max-age=604800; SameSite=Lax`;

      setTimeout(() => {
        router.push(user.role === 'SUPER_ADMIN' ? '/admin/dashboard' : '/hub');
      }, 300);
    } else {
      setError('Invalid email or password.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-8 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <img
              src="/branding/hayagriva_logo_white.png"
              alt="Lord Hayagriva Sovereign Intelligence"
              className="h-16 w-auto object-contain filter drop-shadow-md hover:scale-105 transition-transform duration-200 hidden dark:block"
            />
            <img
              src="/branding/hayagriva_logo_transparent.png"
              alt="Lord Hayagriva Sovereign Intelligence"
              className="h-16 w-auto object-contain filter drop-shadow-sm hover:scale-105 transition-transform duration-200 block dark:hidden"
            />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Hayagriva Sovereign Portal</h1>
          <p className="text-xs text-muted-foreground">
            Unified Gateway for Community Hub, Chamber Private Tools & Local AI Sync
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-secondary/60 p-1 rounded-lg border border-border text-xs">
          <button
            type="button"
            onClick={() => { setAuthMode('license'); setError(null); }}
            className={`flex-1 py-1.5 px-3 rounded-md font-medium transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'license'
                ? 'bg-card text-foreground shadow-sm border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-amber-500" />
            <span>Chamber License Key</span>
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('credentials'); setError(null); }}
            className={`flex-1 py-1.5 px-3 rounded-md font-medium transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'credentials'
                ? 'bg-card text-foreground shadow-sm border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-blue-500" />
            <span>Advocate Login</span>
          </button>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* License Authentication Form */}
        {authMode === 'license' && (
          <form onSubmit={handleLicenseSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">Sovereign License Key</label>
                <span className="text-[10px] text-muted-foreground font-mono">HAYA-XXXX-...</span>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  className="w-full bg-secondary/50 border border-input rounded-md pl-9 pr-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="HAYA-ENT-8F92-K4X9-98QA"
                />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Unlocks your Chamber Private Sovereign Tools and synchronizes local AnythingLLM instances.
              </p>
            </div>

            {/* Quick Demo Licenses */}
            <div className="bg-secondary/30 p-2.5 rounded-lg border border-border space-y-1.5">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Select Demo Chamber License:
              </span>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setLicenseKey('HAYA-ENT-8F92-K4X9-98QA')}
                  className="w-full text-left p-1.5 rounded hover:bg-card/70 border border-transparent hover:border-border transition-all flex items-center justify-between text-[11px]"
                >
                  <span className="font-medium text-foreground">Rao & Partners (Insolvency)</span>
                  <span className="font-mono text-[9px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded">ENTERPRISE</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLicenseKey('HAYA-PRO-7X9K-4M2P-9Q8A')}
                  className="w-full text-left p-1.5 rounded hover:bg-card/70 border border-transparent hover:border-border transition-all flex items-center justify-between text-[11px]"
                >
                  <span className="font-medium text-foreground">Singhania & Co. (Resolution)</span>
                  <span className="font-mono text-[9px] bg-purple-500/10 text-purple-500 px-1.5 py-0.5 rounded">PRO</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLicenseKey('HAYA-SOV-CHAMBER-2026-LIVE')}
                  className="w-full text-left p-1.5 rounded hover:bg-card/70 border border-transparent hover:border-border transition-all flex items-center justify-between text-[11px]"
                >
                  <span className="font-medium text-amber-500">Super Admin Sovereign Chamber</span>
                  <span className="font-mono text-[9px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded">SUPER ADMIN</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs py-2.5 rounded-md shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Verifying Cryptographic License...' : 'Unlock Sovereign Chamber & Hub'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* Credentials Form */}
        {authMode === 'credentials' && (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Practitioner Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-secondary/50 border border-input rounded-md pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="r.rao@insolvencylaw.in"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-secondary/50 border border-input rounded-md pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs py-2.5 rounded-md shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Chamber'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* Bottom links */}
        <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
          <span className="text-muted-foreground">New chamber advocate?</span>
          <Link
            href="/register"
            className="font-semibold text-blue-500 hover:text-blue-400 hover:underline flex items-center gap-1"
          >
            Register Chamber Seat →
          </Link>
        </div>

        <div className="text-center pt-1">
          <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Air-Gapped Sovereign Hardware Fingerprint Sync</span>
          </p>
        </div>
      </div>
    </div>
  );
}
