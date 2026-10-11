'use client';

import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Terminal, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Download,
  Share2
} from 'lucide-react';
import { HubItem } from '@/lib/db/schema';
import { extractManifestFiles, formatInstallCommand } from './manifest-utils';
import { ManifestCodeViewer } from './ManifestCodeViewer';

interface ItemDetailModalProps {
  item: HubItem | null;
  onClose: () => void;
}

export function ItemDetailModal({ item, onClose }: ItemDetailModalProps) {
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [installed, setInstalled] = useState(false);

  if (!item) return null;

  const manifest = (item.manifest as any) || {};
  const extractedFiles = extractManifestFiles(manifest);
  const installCmd = formatInstallCommand(item.importId || item.id);
  const isPrivate = item.visibility === 'PRIVATE_CHAMBER';

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(installCmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handlePushToWorkstation = () => {
    setInstalling(true);
    // Simulate push handshake to local workstation endpoint
    setTimeout(() => {
      setInstalling(false);
      setInstalled(true);
      setTimeout(() => setInstalled(false), 3000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-border flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-secondary/80 border border-border flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <Sparkles className="w-7 h-7 text-amber-500" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-foreground tracking-tight">{item.name}</h2>
                {item.verified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
                {isPrivate && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30">
                    <Lock className="w-3 h-3" /> Chamber Confidential ({item.orgId || 'Private'})
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Published by <span className="text-foreground font-semibold">{item.authorName || 'MintplexLabs'}</span> • {(item.downloads || 0).toLocaleString()} downloads
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action & CLI Strip */}
        <div className="px-6 py-3.5 bg-secondary/50 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-mono text-foreground">
            <Terminal className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-muted-foreground">Install Command:</span>
            <span className="bg-card px-2.5 py-1 rounded-md text-amber-500 font-bold border border-border">
              {installCmd}
            </span>
            <button
              onClick={handleCopyCmd}
              className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              title="Copy Install Command"
            >
              {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button
            onClick={handlePushToWorkstation}
            disabled={installing}
            className={`px-4 py-2 rounded-xl font-semibold transition-all shadow-md flex items-center gap-2 shrink-0 ${
              installed 
                ? 'bg-emerald-500 text-white' 
                : 'bg-primary hover:bg-primary/90 text-primary-foreground'
            }`}
          >
            {installed ? (
              <>
                <Check className="w-4 h-4" />
                <span>Pushed to Local Workstation!</span>
              </>
            ) : installing ? (
              <span>Pushing to AnythingLLM...</span>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Push to Local Workstation</span>
              </>
            )}
          </button>
        </div>

        {/* Tabbed Code Inspector View */}
        <div className="p-6 flex-1 flex flex-col min-h-0 overflow-hidden">
          <ManifestCodeViewer files={extractedFiles} />
        </div>
      </div>
    </div>
  );
}
