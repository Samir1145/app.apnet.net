// admin-panel/src/app/register/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Sparkles, AlertCircle, ArrowRight, Lock, User, Mail, Building, Award, CheckCircle2, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function RegisterPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    designation: 'Advocate / Litigator',
    firmName: '',
    barCouncilEnrollment: '',
    termsAccepted: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || formData.name.length < 2) {
      setError('Please provide your full professional name.');
      return;
    }

    if (!formData.email || !formData.email.includes('@')) {
      setError('Please provide a valid work or chamber email.');
      return;
    }

    if (!formData.password || formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!formData.termsAccepted) {
      setError('Please accept the Terms of Service to proceed.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      // Automatically logged in via cookie, redirect to licenses dashboard with welcome state
      router.push('/dashboard/licenses?new_registration=true');
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center p-4 selection:bg-blue-500/20">
      {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full border border-border bg-card hover:bg-muted text-muted-foreground transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </div>

      <div className="w-full max-w-xl space-y-6">
        {/* Branding Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 mb-1">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
            <span>🐎 HAYAGRIVA</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 font-mono">
              SOVEREIGN LEGAL OS
            </span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Create Your Practitioner Account &amp; Start Drafting Court-Ready Pleadings
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-card border border-border rounded-xl shadow-xl p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2.5 text-red-500 text-xs animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-muted-foreground" /> Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Adv. Rajeshwar Rao"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-9 px-3 text-xs rounded-md bg-background border border-border focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                />
              </div>

              {/* Professional Role Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-muted-foreground" /> Professional Role *
                </label>
                <select
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full h-9 px-3 text-xs rounded-md bg-background border border-border focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                >
                  <option value="Advocate / Litigator">Advocate / Litigator</option>
                  <option value="Insolvency Professional (IP / IRP / RP)">Insolvency Professional (IP / IRP / RP)</option>
                  <option value="Law Firm Partner / Associate">Law Firm Partner / Associate</option>
                  <option value="Chartered Accountant / Forensic Auditor">Chartered Accountant / Forensic Auditor</option>
                  <option value="Corporate In-House Counsel">Corporate In-House Counsel</option>
                </select>
              </div>
            </div>

            {/* Work / Chamber Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" /> Work / Chamber Email *
                </span>
                <span className="text-[10px] text-muted-foreground">Used for license delivery</span>
              </label>
              <input
                type="email"
                required
                placeholder="r.rao@insolvencylaw.in"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-9 px-3 text-xs rounded-md bg-background border border-border focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              />
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-muted-foreground" /> Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-9 px-3 text-xs rounded-md bg-background border border-border focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-muted-foreground" /> Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full h-9 px-3 text-xs rounded-md bg-background border border-border focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>

            {/* Chamber / Law Firm Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-muted-foreground" /> Law Firm / Chamber Name (Optional)
              </label>
              <input
                type="text"
                placeholder="Rao & Partners Insolvency Advocates"
                value={formData.firmName}
                onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
                className="w-full h-9 px-3 text-xs rounded-md bg-background border border-border focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              />
            </div>

            {/* Bar Council / IBBI Enrollment */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-muted-foreground" /> Bar Council / IBBI Enrollment No. (Optional)
                </span>
                <span className="text-[10px] text-muted-foreground">For Verified Chamber Badge</span>
              </label>
              <input
                type="text"
                placeholder="D/1482/2018 or IBBI/IPA-001/..."
                value={formData.barCouncilEnrollment}
                onChange={(e) => setFormData({ ...formData, barCouncilEnrollment: e.target.value })}
                className="w-full h-9 px-3 text-xs rounded-md bg-background border border-border focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              />
            </div>

            {/* Terms and Privacy Checkbox */}
            <div className="pt-1 flex items-start gap-2.5">
              <input
                type="checkbox"
                id="termsAccepted"
                checked={formData.termsAccepted}
                onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                className="mt-0.5 rounded border-border text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="termsAccepted" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                I agree to the <span className="text-foreground underline">Terms of Service</span> and acknowledge the <span className="text-foreground underline">Air-Gapped Sovereign Privacy Architecture</span>.
              </label>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 mt-2 rounded-md bg-blue-600 text-white font-medium text-xs hover:bg-blue-500 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-sm font-semibold tracking-wide"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>PROVISIONING STARTER LICENSE...</span>
                </>
              ) : (
                <>
                  <span>CREATE ACCOUNT &amp; DOWNLOAD HARNESS</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>Already have an account?</span>
            <Link
              href="/login"
              className="font-semibold text-blue-500 hover:text-blue-400 hover:underline flex items-center gap-1"
            >
              Sign In Here →
            </Link>
          </div>
        </div>

        {/* Instant Value Badge Strip */}
        <div className="grid grid-cols-3 gap-3 text-center text-[11px] text-muted-foreground">
          <div className="p-2 rounded-lg bg-card/60 border border-border/60">
            <span className="font-semibold text-foreground block">⚡ Instant Access</span>
            <span>1-Device Free Starter</span>
          </div>
          <div className="p-2 rounded-lg bg-card/60 border border-border/60">
            <span className="font-semibold text-foreground block">🔒 Zero Data Leak</span>
            <span>100% Air-Gapped Engine</span>
          </div>
          <div className="p-2 rounded-lg bg-card/60 border border-border/60">
            <span className="font-semibold text-foreground block">📜 Court Ready</span>
            <span>Bare Acts &amp; Forms Built-in</span>
          </div>
        </div>
      </div>
    </div>
  );
}
