'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Download, Terminal, FileCode, BookOpen, Sparkles, CheckCircle2, Lock, ShieldCheck } from 'lucide-react';
import { HubItem } from '@/lib/db/schema';

interface ItemDetailModalProps {
  item: HubItem | null;
  onClose: () => void;
}

export function ItemDetailModal({ item, onClose }: ItemDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'readme' | 'handler' | 'plugin'>('readme');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!item) return null;

  const manifest = (item.manifest as any) || {};
  const files: any[] = manifest.files || [];

  const readmeFile = files.find((f: any) => f.name?.toLowerCase() === 'readme.md');
  const handlerFile = files.find((f: any) => f.name?.toLowerCase() === 'handler.js');
  const pluginFile = files.find((f: any) => f.name?.toLowerCase() === 'plugin.json');

  const getFileContent = () => {
    if (activeTab === 'readme') return readmeFile?.content || item.description || 'No README documentation provided.';
    if (activeTab === 'handler') return handlerFile?.content || '// handler.js source not included in manifest';
    if (activeTab === 'plugin') return pluginFile?.content || JSON.stringify(manifest, null, 2);
    return '';
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(item.importId || item.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getFileContent());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const isPrivate = item.visibility === 'PRIVATE_CHAMBER';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-border flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-secondary border border-border flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
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

        {/* Import Banner Strip */}
        <div className="px-6 py-3.5 bg-secondary/50 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-mono text-foreground">
            <Terminal className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-muted-foreground">Import ID:</span>
            <span className="bg-card px-2 py-1 rounded text-amber-500 font-bold border border-border">
              {item.importId || item.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyId}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all text-xs"
            >
              {copiedId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId ? 'Copied to Clipboard' : 'Copy Import ID'}</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between px-6 pt-3 border-b border-border bg-card">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('readme')}
              className={`px-4 py-2 text-xs font-semibold rounded-t-lg border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'readme'
                  ? 'border-amber-500 text-foreground bg-secondary/40'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>README / Docs</span>
            </button>
            <button
              onClick={() => setActiveTab('handler')}
              className={`px-4 py-2 text-xs font-semibold rounded-t-lg border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'handler'
                  ? 'border-amber-500 text-foreground bg-secondary/40'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>handler.js</span>
            </button>
            <button
              onClick={() => setActiveTab('plugin')}
              className={`px-4 py-2 text-xs font-semibold rounded-t-lg border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'plugin'
                  ? 'border-amber-500 text-foreground bg-secondary/40'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-purple-400" />
              <span>plugin.json / Manifest</span>
            </button>
          </div>

          <button
            onClick={handleCopyCode}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2 px-2.5 py-1 rounded bg-secondary border border-border"
          >
            {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>

        {/* Code / Content Area */}
        <div className="p-6 overflow-y-auto max-h-[50vh] bg-secondary/20">
          {activeTab === 'readme' ? (
            <div className="prose prose-invert max-w-none text-xs text-foreground leading-relaxed whitespace-pre-wrap font-sans">
              {getFileContent()}
            </div>
          ) : (
            <pre className="p-4 rounded-xl bg-card border border-border text-[11px] font-mono text-foreground overflow-x-auto leading-relaxed">
              <code>{getFileContent()}</code>
            </pre>
          )}
        </div>

        {/* Instructions Footer */}
        <div className="p-4 border-t border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>To install on local AnythingLLM: Paste Import ID in AnythingLLM &gt; Agent Skills &gt; Import.</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 border border-border text-foreground text-xs font-semibold"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
