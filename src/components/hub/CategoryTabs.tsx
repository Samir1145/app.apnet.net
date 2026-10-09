'use client';

import React from 'react';
import { LayoutGrid, Sparkles, Command, MessageSquare, GitFork, Database, SlidersHorizontal, Lock } from 'lucide-react';

export const CATEGORIES = [
  { id: 'all', name: 'All Resources', icon: LayoutGrid, countKey: null },
  { id: 'chamber', name: 'Chamber Private', icon: Lock, color: 'text-amber-500', isChamber: true },
  { id: 'agent-skill', name: 'Agent Skills', icon: Sparkles, color: 'text-cyan-400' },
  { id: 'slash-command', name: 'Slash Commands', icon: Command, color: 'text-purple-400' },
  { id: 'system-prompt', name: 'System Prompts', icon: MessageSquare, color: 'text-emerald-400' },
  { id: 'agent-flow', name: 'Agent Flows', icon: GitFork, color: 'text-blue-400' },
];

interface CategoryTabsProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  counts: Record<string, number>;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export function CategoryTabs({
  activeCategory,
  setActiveCategory,
  counts = {},
  sortBy,
  setSortBy,
}: CategoryTabsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scroll">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = activeCategory === cat.id;
          const count = counts[cat.id] ?? 0;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'bg-card hover:bg-secondary text-muted-foreground hover:text-foreground border border-border'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : cat.color || 'text-muted-foreground'}`} />
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  isSelected
                    ? 'bg-slate-950/20 text-slate-950 font-extrabold'
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sort Selector */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Sort:</span>
        </span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-card border border-border text-foreground text-xs rounded-xl px-2.5 py-1.5 outline-none focus:border-amber-500/50 cursor-pointer shadow-sm"
        >
          <option value="downloads">Most Popular (Downloads)</option>
          <option value="recent">Recently Added</option>
          <option value="name">Alphabetical (A-Z)</option>
        </select>
      </div>
    </div>
  );
}
