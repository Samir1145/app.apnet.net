'use client';

import React, { useState } from 'react';
import {
  Copy,
  Check,
  FileCode,
  BookOpen,
  Terminal,
  Cpu,
  Shield,
  Layers,
  Database,
  Zap,
  Bot,
} from 'lucide-react';
import { ManifestExtractedFiles, extractCognitiveContract } from './manifest-utils';

interface ManifestCodeViewerProps {
  files: ManifestExtractedFiles;
  item?: any;
}

export function ManifestCodeViewer({ files, item }: ManifestCodeViewerProps) {
  const [activeTab, setActiveTab] = useState<'contract' | 'readme' | 'handler' | 'plugin'>(
    item?.urn ? 'contract' : 'readme'
  );
  const [copied, setCopied] = useState(false);

  const contract = item ? extractCognitiveContract(item) : null;

  const getActiveContent = () => {
    switch (activeTab) {
      case 'contract':
        return JSON.stringify(contract, null, 2);
      case 'readme':
        return files.readme;
      case 'handler':
        return files.handler;
      case 'plugin':
        return files.plugin;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-background border border-border/80 rounded-xl overflow-hidden shadow-inner">
      {/* Tab Switcher Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-secondary/70 border-b border-border/80 text-xs">
        <div className="flex items-center gap-1.5 font-medium flex-wrap">
          {contract && (
            <button
              onClick={() => setActiveTab('contract')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'contract'
                  ? 'bg-card text-foreground shadow-sm font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cognitive Contract</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('readme')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'readme'
                ? 'bg-card text-foreground shadow-sm font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            <span>README.md</span>
          </button>

          <button
            onClick={() => setActiveTab('handler')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'handler'
                ? 'bg-card text-foreground shadow-sm font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>handler.js</span>
          </button>

          <button
            onClick={() => setActiveTab('plugin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'plugin'
                ? 'bg-card text-foreground shadow-sm font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-purple-400" />
            <span>plugin.json</span>
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary text-xs transition-colors shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Content Display Area */}
      <div className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed text-foreground/90 bg-card/40 selection:bg-primary/20">
        {activeTab === 'contract' && contract ? (
          <div className="space-y-4 font-sans text-xs">
            {/* Identity & Taxonomy Header */}
            <div className="p-3.5 rounded-xl bg-secondary/40 border border-border/80 space-y-2.5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Universal Resource Name (URN)
                </span>
                <span className="font-mono text-[11px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  {contract.urn || 'urn:custom:chamber:unassigned'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Domain:</span>
                  <span className="font-medium text-foreground">{contract.domain}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Subdomain:</span>
                  <span className="font-medium text-foreground">{contract.subdomain}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Archetype:</span>
                  <span className="font-medium text-emerald-400">{contract.archetype || 'autonomous-agent'}</span>
                </div>
              </div>
            </div>

            {/* Cognition Specs */}
            {(contract.role || contract.goal || contract.reasoningEffort) && (
              <div className="p-3.5 rounded-xl bg-secondary/40 border border-border/80 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Bot className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cognitive Parameters</span>
                </div>

                {contract.role && (
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Role Specification:</span>
                    <p className="text-foreground/90 mt-0.5">{contract.role}</p>
                  </div>
                )}

                {contract.goal && (
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Primary Goal:</span>
                    <p className="text-foreground/90 mt-0.5">{contract.goal}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-border/40 mt-2">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Reasoning Effort:</span>
                    <span className="font-mono text-emerald-400">{contract.reasoningEffort || 'medium'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Critic Agent:</span>
                    <span className="font-mono text-foreground/80">{contract.criticAgent || 'none'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Subagents:</span>
                    <span className="font-mono text-foreground/80">{contract.allowSubagents ? 'Allowed' : 'Disabled'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Required Skills & Statutory Vaults */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-secondary/40 border border-border/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Required Skills ({contract.requiredSkills.length})</span>
                </div>
                {contract.requiredSkills.length > 0 ? (
                  <ul className="space-y-1 pt-1">
                    {contract.requiredSkills.map((skl, idx) => (
                      <li key={idx} className="font-mono text-[10px] text-muted-foreground bg-card/60 p-1.5 rounded border border-border/60 break-all">
                        {skl}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-muted-foreground">Self-contained skill (no external prerequisites).</p>
                )}
              </div>

              <div className="p-3 rounded-xl bg-secondary/40 border border-border/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <Database className="w-3.5 h-3.5" />
                  <span>Statutory Vaults ({contract.statutoryVaults.length})</span>
                </div>
                {contract.statutoryVaults.length > 0 ? (
                  <ul className="space-y-1 pt-1">
                    {contract.statutoryVaults.map((vlt, idx) => (
                      <li key={idx} className="font-mono text-[10px] text-muted-foreground bg-card/60 p-1.5 rounded border border-border/60 break-all">
                        {vlt}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-muted-foreground">Universal knowledge base or custom local index.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <pre className="whitespace-pre-wrap break-words">{getActiveContent()}</pre>
        )}
      </div>
    </div>
  );
}
