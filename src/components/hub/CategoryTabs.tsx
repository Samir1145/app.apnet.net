'use client';

import React from 'react';
import { 
  LayoutGrid, 
  Zap, 
  Bot, 
  Database, 
  Cpu, 
  Command, 
  Lock, 
  SlidersHorizontal 
} from 'lucide-react';

export const CATEGORIES = [
  { id: 'all', name: 'All Resources', icon: LayoutGrid, countKey: null },
  { id: 'chamber', name: 'Chamber Private', icon: Lock, color: 'text-amber-500', isChamber: true },
  { id: 'agent-skill', name: 'Agent Skills', icon: Zap, color: 'text-cyan-400' },
  { id: 'custom-agent', name: 'Autonomous Agents', icon: Bot, color: 'text-amber-400' },
  { id: 'legal-vault', name: 'Statutory Vaults', icon: Database, color: 'text-emerald-400' },
  { id: 'ai-model', name: 'AI Models (GGUF)', icon: Cpu, color: 'text-purple-400' },
  { id: 'slash-command', name: 'Slash Commands', icon: Command, color: 'text-sky-400' },
];

interface CategoryTabsProps {
  activeCategory: string;
  setActiveCategory?: (cat: string) => void;
  onSelectCategory?: (cat: string) => void;
  counts: Record<string, number>;
  sortBy?: string;
  setSortBy?: (sort: string) => void;
}

export function CategoryTabs({
  activeCategory,
  setActiveCategory,
  onSelectCategory,
  counts = {},
  sortBy = "popular",
  setSortBy = () => {},
}: CategoryTabsProps) {
  const handleCategoryChange = onSelectCategory || setActiveCategory || (() => {});
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
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-md font-bold'
                  : 'bg-card/70 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-primary-foreground' : cat.color || 'text-muted-foreground'}`} />
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  isSelected
                    ? 'bg-primary-foreground/20 text-primary-foreground font-extrabold'
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
          className="bg-card border border-border text-foreground text-xs rounded-xl px-2.5 py-1.5 outline-none focus:border-primary/50 cursor-pointer shadow-sm"
        >
          <option value="downloads">Most Popular (Downloads)</option>
          <option value="recent">Recently Added</option>
          <option value="name">Alphabetical (A-Z)</option>
        </select>
      </div>
    </div>
  );
}
