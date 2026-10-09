'use client';

import React, { useState, useEffect } from 'react';
import { X, Upload, Sparkles, AlertCircle, Check, Lock, Globe, ShieldCheck } from 'lucide-react';
import { HubItem } from '@/lib/db/schema';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishSuccess: (item: HubItem) => void;
}

export function PublishModal({ isOpen, onClose, onPublishSuccess }: PublishModalProps) {
  const [itemType, setItemType] = useState('agent-skill');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('legal, chamber-tools');
  const [visibility, setVisibility] = useState<'PUBLIC' | 'PRIVATE_CHAMBER'>('PRIVATE_CHAMBER');
  const [code, setCode] = useState(`module.exports.runtime = {
  handler: async function(params) {
    return JSON.stringify({ success: true, processed: params });
  }
};`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [licenseKey, setLicenseKey] = useState('');

  useEffect(() => {
    // Check license cookie
    const cookies = document.cookie.split('; ');
    const lic = cookies.find(c => c.startsWith('hayagriva_license_key='));
    if (lic) {
      setLicenseKey(decodeURIComponent(lic.split('=')[1]));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/hub/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hayagriva-license': licenseKey || 'HAYA-ENT-8F92-K4X9-98QA',
        },
        body: JSON.stringify({
          name: name.trim(),
          itemType,
          description: description.trim(),
          visibility,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          manifest: {
            files: [
              {
                name: 'handler.js',
                path: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/handler.js`,
                size: code.length,
                content: code,
              },
              {
                name: 'README.md',
                path: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/README.md`,
                size: description.length,
                content: `# ${name}\n\n${description}`,
              }
            ]
          }
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to publish item');
      }

      onPublishSuccess(data.item);
      setLoading(false);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Publishing error');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl p-6 relative overflow-hidden max-h-[92vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Publish Sovereign Resource</h3>
              <p className="text-xs text-muted-foreground">Share with the public or isolate within your chamber</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Visibility Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">Resource Visibility &amp; Isolation</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setVisibility('PRIVATE_CHAMBER')}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  visibility === 'PRIVATE_CHAMBER'
                    ? 'border-amber-500 bg-amber-500/10 text-foreground'
                    : 'border-border bg-secondary/30 text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-amber-500">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Chamber Private</span>
                </div>
                <span className="text-[11px] text-muted-foreground leading-tight">
                  Air-gapped sync strictly to your chamber's licensed workstations.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setVisibility('PUBLIC')}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  visibility === 'PUBLIC'
                    ? 'border-cyan-500 bg-cyan-500/10 text-foreground'
                    : 'border-border bg-secondary/30 text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-cyan-400">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Public Community</span>
                </div>
                <span className="text-[11px] text-muted-foreground leading-tight">
                  Open to all sovereign legal advocates across India.
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Resource Type</label>
              <select
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:border-amber-500"
              >
                <option value="agent-skill">Agent Skill (.js handler)</option>
                <option value="slash-command">Slash Command</option>
                <option value="system-prompt">System Prompt</option>
                <option value="agent-flow">Agent Flow</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Chamber License</label>
              <input
                type="text"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                placeholder="HAYA-ENT-XXXX-..."
                className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs font-mono text-foreground outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Title / Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Insolvency Resolution Cost (CIRPC) Auditing Skill"
              className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Description</label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain practical legal benefits, statutory basis, or workflow automation capabilities..."
              className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">handler.js Source Code</label>
            <textarea
              rows={4}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-card border border-border rounded-xl p-3 text-[11px] font-mono text-foreground outline-none focus:border-amber-500 leading-relaxed"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs py-2.5 rounded-xl shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Publishing &amp; Encrypting Manifest...' : (visibility === 'PRIVATE_CHAMBER' ? 'Publish Confidential Chamber Tool' : 'Publish to Community Hub')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
