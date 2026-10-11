'use client';

import React, { useState, useMemo } from 'react';
import {
  Scale,
  Building2,
  Receipt,
  Layers,
  ChevronDown,
  ChevronRight,
  Search,
  Sparkles,
  Bot,
  Zap,
  Database,
  Globe2,
} from 'lucide-react';
import { TaxonomyDomain } from '../../lib/taxonomy/types';
import { computeDomainBadges, filterTaxonomyTree } from './taxonomy-utils';

const ICON_MAP: Record<string, React.ElementType> = {
  Scale,
  Building2,
  Receipt,
  Layers,
};

interface TaxonomySidebarProps {
  domains: TaxonomyDomain[];
  selectedDomain: string | null;
  selectedSubdomain: string | null;
  onSelect: (domainId: string | null, subdomainId: string | null) => void;
  totalCatalogCount?: number;
}

export function TaxonomySidebar({
  domains = [],
  selectedDomain,
  selectedSubdomain,
  onSelect,
  totalCatalogCount = 0,
}: TaxonomySidebarProps) {
  const [filterQuery, setFilterQuery] = useState('');
  const [openDomains, setOpenDomains] = useState<Record<string, boolean>>(() => {
    // By default open the active domain or first domain
    const initial: Record<string, boolean> = {};
    domains.forEach((d, idx) => {
      initial[d.id] = selectedDomain ? selectedDomain === d.id : idx === 0;
    });
    return initial;
  });

  const toggleDomain = (domainId: string) => {
    setOpenDomains((prev) => ({
      ...prev,
      [domainId]: !prev[domainId],
    }));
  };

  const filteredDomains = useMemo(() => {
    return filterTaxonomyTree(domains, filterQuery);
  }, [domains, filterQuery]);

  const isAllSelected = !selectedDomain && !selectedSubdomain;

  return (
    <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-3">
      {/* Header & Quick Search */}
      <div className="bg-card/90 backdrop-blur-md border border-border/80 rounded-2xl p-3.5 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold tracking-wider uppercase text-foreground">
                Agent Directory
              </h3>
              <p className="text-[10px] text-muted-foreground">
                Domain Taxonomy & Skills
              </p>
            </div>
          </div>
          {totalCatalogCount > 0 && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
              {totalCatalogCount}
            </span>
          )}
        </div>

        {/* Filter Input */}
        <div className="relative mt-2">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search practices or skills..."
            className="w-full pl-8 pr-3 py-1.5 bg-background/80 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      {/* Domain Navigation List */}
      <div className="bg-card/90 backdrop-blur-md border border-border/80 rounded-2xl p-2 shadow-sm flex flex-col gap-1 overflow-hidden">
        {/* All Domains Root Button */}
        <button
          onClick={() => onSelect(null, null)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
            isAllSelected
              ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
              : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center gap-2">
            <Globe2 className={`w-3.5 h-3.5 ${isAllSelected ? 'text-primary-foreground' : 'text-primary'}`} />
            <span>All Domains & Catalog</span>
          </div>
          {totalCatalogCount > 0 && (
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                isAllSelected ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-secondary text-muted-foreground'
              }`}
            >
              {totalCatalogCount}
            </span>
          )}
        </button>

        <div className="h-px bg-border/60 my-1 mx-2" />

        {/* Domain Accordions */}
        <div className="flex flex-col gap-1 max-h-[600px] overflow-y-auto pr-1">
          {filteredDomains.map((domain) => {
            const Icon = ICON_MAP[domain.icon] || Layers;
            const isOpen = Boolean(openDomains[domain.id] || filterQuery.trim().length > 0);
            const isDomainActive = selectedDomain === domain.id;
            const badges = computeDomainBadges(domain);

            return (
              <div key={domain.id} className="flex flex-col rounded-xl overflow-hidden">
                {/* Domain Header Row */}
                <div
                  className={`flex items-center justify-between px-2.5 py-2 rounded-xl cursor-pointer select-none transition-colors ${
                    isDomainActive && !selectedSubdomain
                      ? 'bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30'
                      : 'hover:bg-secondary/60 text-foreground'
                  }`}
                  onClick={() => {
                    toggleDomain(domain.id);
                    // Also select domain level if not already chosen
                    if (selectedDomain !== domain.id) {
                      onSelect(domain.id, null);
                    }
                  }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDomain(domain.id);
                      }}
                      className="p-0.5 hover:bg-background/40 rounded text-muted-foreground"
                    >
                      {isOpen ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <Icon className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="text-xs font-medium truncate">{domain.name}</span>
                  </div>

                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-secondary/80 text-muted-foreground ml-1 flex-shrink-0">
                    {badges.total}
                  </span>
                </div>

                {/* Subdomain List (Collapsible) */}
                {isOpen && domain.subdomains && domain.subdomains.length > 0 && (
                  <div className="flex flex-col gap-0.5 pl-6 pr-1 py-1 border-l-2 border-border/40 ml-4 my-0.5">
                    {domain.subdomains.map((sub) => {
                      const isSubActive =
                        selectedDomain === domain.id &&
                        selectedSubdomain === sub.id;
                      const subTotal =
                        (sub.agentCount || 0) +
                        (sub.skillCount || 0) +
                        (sub.vaultCount || 0);

                      return (
                        <button
                          key={sub.id}
                          onClick={() => onSelect(domain.id, sub.id)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-[11px] transition-all group ${
                            isSubActive
                              ? 'bg-primary/20 text-primary font-bold border border-primary/30'
                              : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                          }`}
                        >
                          <span className="truncate pr-1">{sub.name}</span>

                          <div className="flex items-center gap-1 flex-shrink-0">
                            {sub.agentCount ? (
                              <span
                                title="Autonomous Agents"
                                className="inline-flex items-center text-[9px] font-mono text-amber-400 bg-amber-400/10 px-1 py-0.2 rounded"
                              >
                                <Bot className="w-2.5 h-2.5 mr-0.5" />
                                {sub.agentCount}
                              </span>
                            ) : null}
                            {sub.skillCount ? (
                              <span
                                title="Skills & Commands"
                                className="inline-flex items-center text-[9px] font-mono text-cyan-400 bg-cyan-400/10 px-1 py-0.2 rounded"
                              >
                                <Zap className="w-2.5 h-2.5 mr-0.5" />
                                {sub.skillCount}
                              </span>
                            ) : null}
                            {sub.vaultCount ? (
                              <span
                                title="Statutory Vaults"
                                className="inline-flex items-center text-[9px] font-mono text-emerald-400 bg-emerald-400/10 px-1 py-0.2 rounded"
                              >
                                <Database className="w-2.5 h-2.5 mr-0.5" />
                                {sub.vaultCount}
                              </span>
                            ) : null}
                            {subTotal === 0 && (
                              <span className="text-[9px] font-mono text-muted-foreground/60">
                                0
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {filteredDomains.length === 0 && (
            <div className="py-4 text-center text-xs text-muted-foreground">
              No matching practice areas found.
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
