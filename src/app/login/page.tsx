// admin-panel/src/app/login/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('superadmin@hayagriva.app');
  const [password, setPassword] = useState('hayagriva_secure_password');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Match against seed users
    const isSuperAdmin = email === 'superadmin@hayagriva.app';
    const isAdvocateRao = email === 'r.rao@insolvencylaw.in';
    const isPooja = email === 'pooja@singhanialex.com';

    let user: any = null;

    if (isSuperAdmin) {
      user = {
        id: 'usr_superadmin_01',
        name: 'Atul Grover (Adv.)',
        email: email,
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        plan: 'ENTERPRISE'
      };
    } else if (isAdvocateRao) {
      user = {
        id: 'usr_adv_01',
        name: 'Adv. Rajeshwar Rao',
        email: email,
        role: 'ADVOCATE',
        status: 'ACTIVE',
        plan: 'ENTERPRISE',
        org: 'Rao & Partners Insolvency Advocates'
      };
    } else if (isPooja) {
      user = {
        id: 'usr_adv_02',
        name: 'Pooja Singhania (IP)',
        email: email,
        role: 'ADVOCATE',
        status: 'ACTIVE',
        plan: 'PROFESSIONAL',
        org: 'Singhania & Co. Insolvency Resolution'
      };
    } else if (email.includes('@')) {
      // Generic active advocate session
      user = {
        id: 'usr_adv_01',
        name: 'Adv. Rajeshwar Rao',
        email: email,
        role: 'ADVOCATE',
        status: 'ACTIVE',
        plan: 'ENTERPRISE'
      };
    }

    if (user) {
      // Set cookies for 7 days
      document.cookie = `hayagriva_admin_token=tok_${user.role.toLowerCase()}_${Date.now()}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `hayagriva_user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=604800; SameSite=Lax`;

      const targetRoute = user.role === 'SUPER_ADMIN' ? '/admin/dashboard' : '/dashboard';

      setTimeout(() => {
        router.push(targetRoute);
      }, 400);
    } else {
      setError('Invalid credentials or unauthorized account role.');
      setLoading(false);
    }
  };

  const handleQuickSelect = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('hayagriva_secure_password');
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 mx-auto flex items-center justify-center text-2xl shadow-lg shadow-blue-500/25">
            🐎
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Hayagriva Portal Access</h1>
          <p className="text-xs text-muted-foreground">Sign in to your Practitioner Workspace or Admin Center</p>
        </div>

        {/* Quick Demo Role Selector */}
        <div className="bg-secondary/40 p-2.5 rounded-lg border border-border space-y-1.5 text-xs">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Quick Demo Login:</span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickSelect('r.rao@insolvencylaw.in')}
              className="px-2 py-1 bg-card hover:bg-card/80 border border-border rounded text-[11px] font-medium text-foreground transition-colors flex items-center gap-1"
            >
              <span>Adv. Rao</span>
              <span className="text-[9px] bg-blue-500/10 text-blue-500 px-1 rounded font-mono">ADVOCATE</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect('pooja@singhanialex.com')}
              className="px-2 py-1 bg-card hover:bg-card/80 border border-border rounded text-[11px] font-medium text-foreground transition-colors flex items-center gap-1"
            >
              <span>Pooja (IP)</span>
              <span className="text-[9px] bg-purple-500/10 text-purple-500 px-1 rounded font-mono">PRO</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect('superadmin@hayagriva.app')}
              className="px-2 py-1 bg-card hover:bg-card/80 border border-border rounded text-[11px] font-medium text-amber-500 font-mono transition-colors"
            >
              Super Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Practitioner or Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-secondary/50 border border-input rounded-md pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="advocate@chambers.in"
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
            {loading ? 'Authenticating...' : 'Enter Sovereign Workspace'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Registration Navigation Link */}
        <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
          <span className="text-muted-foreground">New practitioner?</span>
          <Link
            href="/register"
            className="font-semibold text-blue-500 hover:text-blue-400 hover:underline flex items-center gap-1"
          >
            Create Free Account →
          </Link>
        </div>

        <div className="text-center pt-2">
          <p className="text-[11px] text-muted-foreground">
            Sovereign Legal Chambers · Neon Serverless DB · Vercel Edge
          </p>
        </div>
      </div>
    </div>
  );
}
