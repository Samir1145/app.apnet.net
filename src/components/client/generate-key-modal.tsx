// admin-panel/src/components/client/generate-key-modal.tsx
'use client';

import React, { useState } from 'react';
import { Key, Copy, Check, X, AlertTriangle, Zap } from 'lucide-react';

interface GenerateKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newKey: any) => void;
}

export function GenerateKeyModal({ isOpen, onClose, onSuccess }: GenerateKeyModalProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/user/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name || 'Cloud Agent MCP Key' }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedKey(data.rawToken);
        onSuccess(data.apiKey);
      }
    } catch (err) {
      console.error('Failed to generate key:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in"
      />

      <div className="relative bg-card border border-border rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Generate MCP Cloud API Key</h3>
              <p className="text-xs text-muted-foreground">For programmatic AI agent invocation</p>
            </div>
          </div>

          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {!generatedKey ? (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Key Name / Identifier</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-secondary/50 border border-input rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="e.g. CI/CD Claim Verification Bot"
              />
            </div>

            <div className="bg-secondary/40 border border-border p-3 rounded-lg text-xs space-y-1">
              <p className="font-semibold text-foreground">Included Scopes:</p>
              <p className="text-[11px] text-muted-foreground">
                <code className="text-purple-500 font-mono">mcp:agent:read</code>, <code className="text-purple-500 font-mono">mcp:agent:exec</code>, <code className="text-purple-500 font-mono">mcp:vault:query</code>
              </p>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-3 py-1.5 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-md shadow flex items-center gap-1.5 disabled:opacity-50"
              >
                <Key className="w-3.5 h-3.5" />
                <span>{loading ? 'Generating...' : 'Generate Secret Key'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg flex items-start gap-2.5 text-xs text-amber-500">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Make sure to copy your secret token now. For your security, you will not be able to see it again!
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Your MCP Bearer Token</label>
              <div className="flex items-center justify-between bg-card border border-input p-2.5 rounded font-mono text-xs font-bold text-foreground select-all">
                <span className="truncate mr-2">{generatedKey}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  title="Copy token"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-md shadow"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
