'use client';

import React, { useState } from 'react';
import { Copy, Check, FileCode, BookOpen, Terminal } from 'lucide-react';
import { ManifestExtractedFiles } from './manifest-utils';

interface ManifestCodeViewerProps {
  files: ManifestExtractedFiles;
}

export function ManifestCodeViewer({ files }: ManifestCodeViewerProps) {
  const [activeTab, setActiveTab] = useState<'readme' | 'handler' | 'plugin'>('readme');
  const [copied, setCopied] = useState(false);

  const getActiveContent = () => {
    switch (activeTab) {
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
        <div className="flex items-center gap-1.5 font-medium">
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
          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary text-xs transition-colors"
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

      {/* Code Display Area with Line Numbers */}
      <div className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed text-foreground/90 bg-card/40 selection:bg-primary/20">
        <pre className="whitespace-pre-wrap break-words">{getActiveContent()}</pre>
      </div>
    </div>
  );
}
