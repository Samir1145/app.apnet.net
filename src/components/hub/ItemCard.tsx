'use client';

import React, { useState } from 'react';
import { Download, Check, Copy, Sparkles, Command, MessageSquare, GitFork, Database, CheckCircle2, Lock, ShieldCheck } from 'lucide-react';
import { HubItem } from '@/lib/db/schema';

interface ItemCardProps {
  item: HubItem;
  onSelect: (item: HubItem) => void;
}

export function ItemCard({ item, onSelect }: ItemCardProps) {
  const [copied, setCopied] = useState(false);

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'agent-skill':
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
      case 'slash-command':
        return <Command className="w-4 h-4 text-purple-400" />;
      case 'system-prompt':
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      case 'agent-flow':
        return <GitFork className="w-4 h-4 text-blue-400" />;
      default:
        return <Database className="w-4 h-4 text-amber-400" />;
    }
  };

  const getCategoryLabel = (type: string) => {
    switch (type) {
      case 'agent-skill':
        return 'Agent Skill';
      case 'slash-command':
        return 'Slash Command';
      case 'system-prompt':
        return 'System Prompt';
      case 'agent-flow':
        return 'Agent Flow';
      default:
        return 'Sovereign Tool';
    }
  };

  const handleCopyImport = (e: React.MouseEvent) => {
    e.stopPropagation();
    const copyText = item.importId || item.id;
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPrivate = item.visibility === 'PRIVATE_CHAMBER';

  return (
    <div
      onClick={() => onSelect(item)}
      className={`group bg-card hover:bg-secondary/40 border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-sm hover:shadow-xl relative overflow-hidden ${
        isPrivate 
          ? 'border-amber-500/40 hover:border-amber-500 hover:shadow-amber-500/10' 
          : 'border-border hover:border-border/80'
      }`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                getCategoryIcon(item.itemType)
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {item.name}
                </h3>
                {item.verified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                )}
              </div>
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                by <span className="text-foreground font-semibold">{item.authorName || 'MintplexLabs'}</span>
              </span>
            </div>
          </div>

          {/* Visibility / Type Badges */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            {isPrivate ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/30">
                <Lock className="w-2.5 h-2.5" /> Chamber Private
              </span>
            ) : (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-secondary text-muted-foreground border border-border">
                {getCategoryLabel(item.itemType)}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="mt-3.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {item.description || 'Sovereign resource for local workspace automation.'}
        </p>

        {/* Tags */}
        {Array.isArray(item.tags) && item.tags.length > 0 && (
          <div className="flex items-center flex-wrap gap-1.5 mt-3">
            {item.tags.slice(0, 3).map((tag: any, idx: number) => (
              <span
                key={idx}
                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-secondary text-muted-foreground border border-border"
              >
                #{tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="text-[10px] text-muted-foreground">
                +{item.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Footer Action Strip */}
      <div className="mt-4 pt-3.5 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <Download className="w-3.5 h-3.5" />
          <span>{(item.downloads || 0).toLocaleString()}</span>
        </div>

        <button
          onClick={handleCopyImport}
          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
            copied
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-secondary hover:bg-secondary/80 text-foreground border border-border'
          }`}
          title="Copy Import ID for AnythingLLM Desktop"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : (item.importId || item.id).slice(0, 8) + '...'}</span>
        </button>
      </div>
    </div>
  );
}
