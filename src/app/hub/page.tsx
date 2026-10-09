'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { UnifiedNavbar } from '@/components/navigation/UnifiedNavbar';
import { CategoryTabs } from '@/components/hub/CategoryTabs';
import { ItemCard } from '@/components/hub/ItemCard';
import { ItemDetailModal } from '@/components/hub/ItemDetailModal';
import { PublishModal } from '@/components/hub/PublishModal';
import { FleetSyncModal } from '@/components/hub/FleetSyncModal';
import { Search, Sparkles, Shield, Cpu, RefreshCw, HardDrive, Lock } from 'lucide-react';
import { HubItem } from '@/lib/db/schema';

export default function HubPage() {
  const [items, setItems] = useState<HubItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('downloads');
  const [selectedItem, setSelectedItem] = useState<HubItem | null>(null);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Load User & Hub Items
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

    // Fetch initial items via sync (to get both public and chamber private if license exists)
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

    fetchItems();
  }, []);

  // Filter & Sort Items
  const filteredItems = useMemo(() => {
    let result = [...items];

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
        return nameMatch || descMatch || tagMatch;
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
  }, [items, activeCategory, searchQuery, sortBy]);

  // Dynamic counts for tabs
  const counts = useMemo(() => {
    return {
      all: items.length,
      chamber: items.filter(i => i.visibility === 'PRIVATE_CHAMBER').length,
      'agent-skill': items.filter(i => i.itemType === 'agent-skill').length,
      'slash-command': items.filter(i => i.itemType === 'slash-command').length,
      'system-prompt': items.filter(i => i.itemType === 'system-prompt').length,
      'agent-flow': items.filter(i => i.itemType === 'agent-flow').length,
    };
  }, [items]);

  const handlePublishSuccess = (newItem: HubItem) => {
    setItems(prev => [newItem, ...prev]);
    setSelectedItem(newItem);
  };

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
              Explore agent skills, statutory prompts, and automated resolution flows. Directly synchronized with 100s of air-gapped local AnythingLLM instances across your chamber.
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

        {/* Category Filter Tabs */}
        <CategoryTabs
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          counts={counts}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Catalog Grid */}
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Loading Sovereign Catalog...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center bg-card border border-border rounded-2xl p-8 space-y-3">
            <p className="text-sm font-semibold text-foreground">No resources matched your search query.</p>
            <p className="text-xs text-muted-foreground">Try clearing the search or switching categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onSelect={(selected) => setSelectedItem(selected)}
              />
            ))}
          </div>
        )}
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
