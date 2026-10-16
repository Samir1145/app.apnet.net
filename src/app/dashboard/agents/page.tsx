'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Bot, 
  Sparkles, 
  DownloadCloud, 
  Plus, 
  Search, 
  RefreshCw, 
  X, 
  Globe, 
  Cpu, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Code2
} from 'lucide-react';
import { courtArchetypes } from '@/components/agents/archetypes';
import { ArchetypeCard } from '@/components/agents/ArchetypeCard';
import { CategoryTabs } from '@/components/hub/CategoryTabs';
import { ItemCard } from '@/components/hub/ItemCard';
import { ItemDetailModal } from '@/components/hub/ItemDetailModal';
import { PublishModal } from '@/components/hub/PublishModal';
import { FleetSyncModal } from '@/components/hub/FleetSyncModal';
import { TaxonomySidebar } from '@/components/hub/TaxonomySidebar';
import { HubItem } from '@/lib/db/schema';
import { TaxonomyDomain } from '@/lib/taxonomy/types';

const mockExistingAgents = [
  {
    id: 'agt_001',
    name: 'Section 43 Avoidance Auditor',
    archetype: 'avoidance_auditor',
    version: '1.0.0',
    vaults: ['bare_ibc.vault', 'cirp_regs.vault'],
    slashTrigger: '/avoidance-inquest',
    downloads: 14,
    updatedAt: '2 hours ago',
    status: 'ACTIVE',
  },
  {
    id: 'agt_002',
    name: 'Commercial Injunction Drafter',
    archetype: 'commercial_pleading',
    version: '1.1.0',
    vaults: ['commercial_courts.vault', 'cpc_1908.vault'],
    slashTrigger: '/cpc-order39',
    downloads: 8,
    updatedAt: 'Yesterday',
    status: 'ACTIVE',
  },
];

function AgentsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get('tab') === 'chamber' ? 'chamber' : 'bazaar';
  const [activeTab, setActiveTab] = useState<'bazaar' | 'chamber'>(initialTab);

  // Sync state with URL search param
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'chamber' || tabParam === 'bazaar') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'bazaar' | 'chamber') => {
    setActiveTab(tab);
    router.replace(`/dashboard/agents?tab=${tab}`);
  };

  // Bazaar Marketplace State
  const [items, setItems] = useState<HubItem[]>([]);
  const [taxonomyDomains, setTaxonomyDomains] = useState<TaxonomyDomain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedSubdomain, setSelectedSubdomain] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('downloads');
  const [selectedItem, setSelectedItem] = useState<HubItem | null>(null);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Load User & Hub Items & Taxonomy
  useEffect(() => {
    const cookies = document.cookie.split('; ');
    const userCookie = cookies.find(c => c.startsWith('hayagriva_user='));
    if (userCookie) {
      try {
        setUser(JSON.parse(decodeURIComponent(userCookie.split('=')[1])));
      } catch {
        setUser(null);
      }
    }

    const licCookie = cookies.find(c => c.startsWith('hayagriva_license_key='));
    const licenseKey = licCookie ? decodeURIComponent(licCookie.split('=')[1]) : 'HAYA-ENT-8F92-K4X9-98QA';

    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/v1/hub/sync', {
          headers: { 'x-hayagriva-license': licenseKey },
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.items)) {
          setItems(data.items);
        } else {
          const fallbackRes = await fetch('/api/v1/hub/items');
          const fallbackData = await fallbackRes.json();
          if (fallbackData.success) {
            setItems(fallbackData.items || []);
          }
        }
      } catch (err) {
        console.error('Failed to load marketplace items:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchTaxonomy = async () => {
      try {
        const res = await fetch('/api/v1/hub/taxonomy');
        const data = await res.json();
        if (data.success && Array.isArray(data.domains)) {
          setTaxonomyDomains(data.domains);
        }
      } catch (err) {
        console.error('Failed to load taxonomy tree:', err);
      }
    };

    fetchItems();
    fetchTaxonomy();
  }, []);

  // Filter & Sort Bazaar Items
  const filteredItems = useMemo(() => {
    let result = [...items];

    if (selectedDomain) {
      result = result.filter(item => item.domain === selectedDomain);
    }
    if (selectedSubdomain) {
      result = result.filter(item => item.subdomain === selectedSubdomain);
    }

    if (activeCategory === 'chamber') {
      result = result.filter(item => item.visibility === 'PRIVATE_CHAMBER');
    } else if (activeCategory !== 'all') {
      result = result.filter(item => item.itemType === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(item => {
        const nameMatch = (item.name || '').toLowerCase().includes(q);
        const descMatch = (item.description || '').toLowerCase().includes(q);
        const tags = Array.isArray(item.tags) ? item.tags : [];
        const tagMatch = tags.some((t: any) => String(t).toLowerCase().includes(q));
        const domainMatch = (item.domain || '').toLowerCase().includes(q);
        const subMatch = (item.subdomain || '').toLowerCase().includes(q);
        const archMatch = (item.archetype || '').toLowerCase().includes(q);
        return nameMatch || descMatch || tagMatch || domainMatch || subMatch || archMatch;
      });
    }

    if (sortBy === 'downloads') {
      result.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    } else if (sortBy === 'recent') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'name') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return result;
  }, [items, selectedDomain, selectedSubdomain, activeCategory, searchQuery, sortBy]);

  const counts = useMemo(() => {
    let base = items;
    if (selectedDomain) {
      base = base.filter(i => i.domain === selectedDomain);
    }
    if (selectedSubdomain) {
      base = base.filter(i => i.subdomain === selectedSubdomain);
    }
    return {
      all: base.length,
      'ai-agent': base.filter(i => i.itemType === 'ai-agent').length,
      'agent-skill': base.filter(i => i.itemType === 'agent-skill').length,
      'statutory-vault': base.filter(i => i.itemType === 'statutory-vault').length,
      'slash-command': base.filter(i => i.itemType === 'slash-command').length,
      chamber: base.filter(i => i.visibility === 'PRIVATE_CHAMBER').length,
    };
  }, [items, selectedDomain, selectedSubdomain]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Main Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30">
              AGENT STUDIO &amp; BAZAAR
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-500">
              Sovereign Chamber Suite
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Varaha Agentic Platform &amp; Studio
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Discover sovereign, community-curated agents from the Varaha registry across Legal, Clinical, Agri, and CA/Tax, or build custom <code className="text-amber-500">.haya</code> cartridges in the Varaha Agentic Studio.
          </p>
        </div>

        {/* Global Action CTAs */}
        <div className="flex items-center gap-2">
          {activeTab === 'bazaar' ? (
            <>
              <button
                onClick={() => setIsSyncOpen(true)}
                className="px-3.5 py-2 rounded-lg bg-secondary hover:bg-secondary/80 border border-border text-foreground font-medium text-xs flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
                <span>Sync Fleet</span>
              </button>
              <button
                onClick={() => setIsPublishOpen(true)}
                className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm shadow-amber-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Agent</span>
              </button>
            </>
          ) : (
            <Link
              href="/dashboard/agents/builder?archetype=custom_chamber"
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs flex items-center gap-2 transition-colors shadow-sm shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Create Custom Agent</span>
            </Link>
          )}
        </div>
      </div>

      {/* Primary Tab Switcher */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-secondary/50 border border-border w-fit shadow-inner">
        <button
          onClick={() => handleTabChange('bazaar')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'bazaar'
              ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Varaha Catalog (Community &amp; Official)</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
            activeTab === 'bazaar' ? 'bg-black/20 text-black' : 'bg-secondary text-muted-foreground'
          }`}>
            {items.length}
          </span>
        </button>

        <button
          onClick={() => handleTabChange('chamber')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'chamber'
              ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Chamber Studio (My Custom Agents)</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
            activeTab === 'chamber' ? 'bg-black/20 text-black' : 'bg-secondary text-muted-foreground'
          }`}>
            {mockExistingAgents.length}
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: RESOLUTION BAZAAR (Community & Official Catalog)   */}
      {/* ======================================================== */}
      {activeTab === 'bazaar' && (
        <div className="space-y-6">
          {/* Search & Category Filter Sub-Bar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search community agents, skills, statutory flows..."
                className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <CategoryTabs
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              counts={counts}
            />
          </div>

          {/* 2-Column Responsive Layout: Left 4-Tier Taxonomy, Right Catalog Grid */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <TaxonomySidebar
              domains={taxonomyDomains}
              selectedDomain={selectedDomain}
              selectedSubdomain={selectedSubdomain}
              onSelect={(dom, sub) => {
                setSelectedDomain(dom);
                setSelectedSubdomain(sub);
              }}
              totalCatalogCount={items.length}
            />

            <div className="flex-1 w-full space-y-4">
              {/* Active Filter Chips & Sort Selector */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2 flex-wrap">
                  <span>Showing <strong className="text-foreground">{filteredItems.length}</strong> items</span>
                  {selectedDomain && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-medium">
                      Domain: {selectedDomain}
                      <button onClick={() => setSelectedDomain(null)} className="hover:text-amber-300">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedSubdomain && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-foreground font-medium">
                      Subdomain: {selectedSubdomain}
                      <button onClick={() => setSelectedSubdomain(null)} className="hover:text-muted-foreground">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <span>Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-secondary/50 border border-border rounded-md px-2 py-1 text-xs text-foreground outline-none"
                  >
                    <option value="downloads">Most Popular</option>
                    <option value="recent">Recently Added</option>
                    <option value="name">Alphabetical</option>
                  </select>
                </div>
              </div>

              {/* Items Cards Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-44 rounded-xl border border-border bg-card animate-pulse" />
                  ))}
                </div>
              ) : filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredItems.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onClick={() => setSelectedItem(item)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border border-dashed border-border rounded-xl bg-card/50 space-y-2">
                  <Bot className="w-8 h-8 text-muted-foreground mx-auto" />
                  <h3 className="text-sm font-semibold text-foreground">No community agents found</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Try adjusting your taxonomy domain filters or search query, or publish a new agent package.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: CHAMBER STUDIO (Starter Archetypes & Custom Agents)*/}
      {/* ======================================================== */}
      {activeTab === 'chamber' && (
        <div className="space-y-8">
          {/* Section 1: Starter Archetypes Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Chamber Starter Archetypes
                </h2>
                <p className="text-xs text-muted-foreground">
                  Select an archetype to pre-load statutory prompts, bare act vaults, and Monaco slash triggers into the builder.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {courtArchetypes.map((archetype) => (
                <ArchetypeCard key={archetype.key} archetype={archetype} />
              ))}
            </div>
          </div>

          {/* Section 2: Active Chamber Agents Table */}
          <div className="p-6 rounded-xl border border-border bg-card space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Bot className="w-4 h-4 text-amber-500" />
                Active Chamber Agents
                <span className="text-xs font-normal text-muted-foreground">({mockExistingAgents.length} Agents Configured)</span>
              </h2>
              <Link href="/dashboard/agents/builder?archetype=custom_chamber" className="text-xs text-amber-500 hover:underline">
                Create New Agent in Studio →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider">
                    <th className="pb-3 font-semibold">Agent Name</th>
                    <th className="pb-3 font-semibold">Archetype</th>
                    <th className="pb-3 font-semibold">Slash Trigger</th>
                    <th className="pb-3 font-semibold">Vaults</th>
                    <th className="pb-3 font-semibold">Downloads</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {mockExistingAgents.map((agt) => (
                    <tr key={agt.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="py-3 font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-[10px]">
                            🪙
                          </div>
                          <span>{agt.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                            v{agt.version}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-muted-foreground font-mono">{agt.archetype}</td>
                      <td className="py-3 text-amber-400 font-mono">{agt.slashTrigger}</td>
                      <td className="py-3">
                        <div className="flex gap-1 flex-wrap">
                          {agt.vaults.map((v) => (
                            <span key={v} className="text-[10px] font-mono bg-secondary px-1.5 py-0.5 rounded text-foreground">
                              {v.replace('.vault', '')}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 text-muted-foreground font-mono">{agt.downloads} downloads</td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/agents/builder?edit=${agt.id}`}
                            className="px-2.5 py-1 rounded bg-secondary hover:bg-secondary/80 text-foreground font-medium transition-colors"
                          >
                            Edit in Studio
                          </Link>
                          <button
                            onClick={() => alert(`Downloading ${agt.name} .haya cartridge`)}
                            className="p-1 rounded hover:bg-secondary text-amber-500 transition-colors"
                            title="Download .haya package"
                          >
                            <DownloadCloud className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modals for Community Bazaar */}
      <ItemDetailModal
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
      />

      <PublishModal
        isOpen={isPublishOpen}
        onClose={() => setIsPublishOpen(false)}
        onPublishSuccess={(newItem) => {
          setItems(prev => [newItem, ...prev]);
          setIsPublishOpen(false);
        }}
      />

      <FleetSyncModal
        isOpen={isSyncOpen}
        onClose={() => setIsSyncOpen(false)}
      />
    </div>
  );
}

export default function AgentRegistryPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-muted-foreground animate-pulse">Loading Agents &amp; Bazaar...</div>}>
      <AgentsContent />
    </Suspense>
  );
}
