'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { UnifiedNavbar } from '@/components/navigation/UnifiedNavbar';
import { CategoryTabs } from '@/components/hub/CategoryTabs';
import { ItemCard } from '@/components/hub/ItemCard';
import { ItemDetailModal } from '@/components/hub/ItemDetailModal';
import { PublishModal } from '@/components/hub/PublishModal';
import { FleetSyncModal } from '@/components/hub/FleetSyncModal';
import { TaxonomySidebar } from '@/components/hub/TaxonomySidebar';
import { Search, Sparkles, RefreshCw, X } from 'lucide-react';
import { HubItem } from '@/lib/db/schema';
import { TaxonomyDomain } from '@/lib/taxonomy/types';

export default function HubPage() {
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
    // Read user cookie
    const cookies = document.cookie.split('; ');
    const userCookie = cookies.find(c => c.startsWith('hayagriva_user='));
    let parsedUser: any = null;
    if (userCookie) {
      try {
        parsedUser = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
        setUser(parsedUser);
      } catch {
        setUser(null);
      }
    }

    const licCookie = cookies.find(c => c.startsWith('hayagriva_license_key='));
    const licenseKey = licCookie ? decodeURIComponent(licCookie.split('=')[1]) : 'HAYA-ENT-8F92-K4X9-98QA';

    // Fetch initial items via sync
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/v1/hub/sync', {
          headers: {
            'x-hayagriva-license': licenseKey,
          },
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.items)) {
          setItems(data.items);
        } else {
          // Fallback to public discovery
          const pubRes = await fetch('/api/v1/hub/items?limit=150');
          const pubData = await pubRes.json();
          if (pubData.success) {
            setItems(pubData.items);
          }
        }
      } catch (err) {
        console.error('Error fetching hub items:', err);
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
        console.error('Error fetching taxonomy tree:', err);
      }
    };

    fetchItems();
    fetchTaxonomy();
  }, []);

  // Filter & Sort Items
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Taxonomy domain / subdomain filter
    if (selectedDomain) {
      result = result.filter(item => item.domain === selectedDomain);
    }
    if (selectedSubdomain) {
      result = result.filter(item => item.subdomain === selectedSubdomain);
    }

    // Category filter
    if (activeCategory === 'chamber') {
      result = result.filter(item => item.visibility === 'PRIVATE_CHAMBER');
    } else if (activeCategory !== 'all') {
      result = result.filter(item => item.itemType === activeCategory);
    }

    // Search query
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

    // Sorting
    if (sortBy === 'downloads') {
      result.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    } else if (sortBy === 'recent') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'name') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return result;
  }, [items, selectedDomain, selectedSubdomain, activeCategory, searchQuery, sortBy]);

  // Dynamic counts for tabs
  const counts = useMemo(() => {
    // base items respecting current taxonomy selection
    let base = items;
    if (selectedDomain) {
      base = base.filter(i => i.domain === selectedDomain);
    }
    if (selectedSubdomain) {
      base = base.filter(i => i.subdomain === selectedSubdomain);
    }

    return {
      all: base.length,
      chamber: base.filter(i => i.visibility === 'PRIVATE_CHAMBER').length,
      'agent-skill': base.filter(i => i.itemType === 'agent-skill').length,
      'custom-agent': base.filter(i => i.itemType === 'custom-agent' || i.itemType === 'agent').length,
      'legal-vault': base.filter(i => i.itemType === 'legal-vault' || i.itemType === 'bare-act-vault').length,
      'ai-model': base.filter(i => i.itemType === 'ai-model' || i.itemType === 'slm-model').length,
      'slash-command': base.filter(i => i.itemType === 'slash-command').length,
      'system-prompt': base.filter(i => i.itemType === 'system-prompt').length,
      'agent-flow': base.filter(i => i.itemType === 'agent-flow').length,
    };
  }, [items, selectedDomain, selectedSubdomain]);

  const handlePublishSuccess = (newItem: HubItem) => {
    setItems(prev => [newItem, ...prev]);
    setSelectedItem(newItem);
  };

  const activeDomainObj = taxonomyDomains.find(d => d.id === selectedDomain);
  const activeSubdomainObj = activeDomainObj?.subdomains?.find(s => s.id === selectedSubdomain);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors">
      <UnifiedNavbar
        onOpenPublish={() => setIsPublishOpen(true)}
        onTriggerSync={() => setIsSyncOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-card border border-border p-6 sm:p-8 shadow-sm">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sovereign AI Community &amp; Chamber Marketplace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Discover, Publish &amp; Synchronize Sovereign AI Tools
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Explore 4 master legal &amp; enterprise domains: IBC avoidance auditors, commercial pleading writers, transfer pricing calculators, and regulatory vaults. Synchronized directly with local workstation instances.
            </p>

            {/* Live Search Bar */}
            <div className="pt-2">
              <div className="relative max-w-lg">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 100+ skills, slash commands, insolvency flows, prompts..."
                  className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout: Taxonomy Sidebar + Catalog Content */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Taxonomy Tree Sidebar */}
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

          {/* Right Main Content */}
          <div className="flex-1 w-full space-y-4 min-w-0">
            {/* Category Filter Tabs */}
            <CategoryTabs
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              counts={counts}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            {/* Active Taxonomy Filter Breadcrumb Bar */}
            {(selectedDomain || selectedSubdomain) && (
              <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-card/90 border border-border/80 text-xs backdrop-blur-sm">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-muted-foreground">Practice Area:</span>
                  <span className="font-semibold text-emerald-400">
                    {activeDomainObj?.name || selectedDomain}
                  </span>
                  {selectedSubdomain && (
                    <>
                      <span className="text-muted-foreground">›</span>
                      <span className="font-bold text-foreground">
                        {activeSubdomainObj?.name || selectedSubdomain}
                      </span>
                    </>
                  )}
                  <span className="text-[10px] text-muted-foreground ml-1">
                    ({filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'})
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedDomain(null);
                    setSelectedSubdomain(null);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors px-2 py-0.5 rounded-md hover:bg-secondary"
                >
                  <X className="w-3 h-3" />
                  <span>Clear Filter</span>
                </button>
              </div>
            )}

            {/* Catalog Grid */}
            {loading ? (
              <div className="py-16 text-center space-y-3">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Loading Sovereign Catalog...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="py-16 text-center bg-card border border-border rounded-2xl p-8 space-y-3">
                <p className="text-sm font-semibold text-foreground">No resources matched your search query or domain filter.</p>
                <p className="text-xs text-muted-foreground">Try clearing the domain selection or switching categories.</p>
                <button
                  onClick={() => {
                    setSelectedDomain(null);
                    setSelectedSubdomain(null);
                    setActiveCategory('all');
                    setSearchQuery('');
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs bg-primary text-primary-foreground font-semibold"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onSelect={(selected) => setSelectedItem(selected)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <ItemDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />

      <PublishModal
        isOpen={isPublishOpen}
        onClose={() => setIsPublishOpen(false)}
        onPublishSuccess={handlePublishSuccess}
      />

      <FleetSyncModal
        isOpen={isSyncOpen}
        onClose={() => setIsSyncOpen(false)}
      />
    </div>
  );
}
