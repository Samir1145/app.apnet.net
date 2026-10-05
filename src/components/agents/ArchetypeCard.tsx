// admin-panel/src/components/agents/ArchetypeCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  Scale, 
  Receipt, 
  UserX, 
  Sparkles, 
  ArrowRight,
  Database,
  Bot
} from 'lucide-react';
import { CourtArchetype } from './archetypes';

const iconMap: Record<string, React.ElementType> = {
  ShieldAlert,
  Scale,
  ReceiptCheck: Receipt,
  UserX,
  Sparkles,
};

interface ArchetypeCardProps {
  archetype: CourtArchetype;
}

export function ArchetypeCard({ archetype }: ArchetypeCardProps) {
  const IconComponent = iconMap[archetype.icon] || Bot;

  return (
    <div className="p-5 rounded-xl border border-border bg-card hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4 group relative shadow-sm hover:shadow-md">
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${archetype.badgeColor}`}>
            {archetype.badge}
          </span>
          <span className="text-[11px] font-mono text-muted-foreground">
            {archetype.domain}
          </span>
        </div>

        {/* Title and Icon */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-foreground group-hover:text-amber-500 transition-colors shrink-0">
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground group-hover:text-amber-400 transition-colors">
              {archetype.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-3 leading-relaxed">
              {archetype.description}
            </p>
          </div>
        </div>

        {/* Vault Pills */}
        <div className="pt-2 flex flex-wrap gap-1.5">
          {archetype.defaultVaults.map((v) => (
            <span key={v} className="text-[10px] font-mono bg-secondary/80 text-foreground px-1.5 py-0.5 rounded border border-border flex items-center gap-1">
              <Database className="w-2.5 h-2.5 text-amber-500" />
              {v.replace('.vault', '')}
            </span>
          ))}
          {archetype.subagentsEnabled && (
            <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded">
              +Subagent Critique
            </span>
          )}
        </div>
      </div>

      {/* CTA Button */}
      <div className="pt-3 border-t border-border flex items-center justify-between">
        <span className="text-[11px] font-mono text-muted-foreground">{archetype.slashTrigger}</span>
        <Link
          href={`/dashboard/agents/builder?archetype=${archetype.key}`}
          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm shadow-amber-500/20"
        >
          <span>Use Template</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
