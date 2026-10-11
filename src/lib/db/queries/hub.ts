// admin-panel/src/lib/db/queries/hub.ts
import { getDbClient } from '../index';
import { hubItems, type HubItem } from '../schema';
import { getMockStore } from '../seed';
import { desc, eq, and, or, sql, ilike } from 'drizzle-orm';

export interface FilterHubOptions {
  category?: string;
  q?: string;
  domain?: string;
  subdomain?: string;
  archetype?: string;
  visibility?: 'PUBLIC' | 'PRIVATE_CHAMBER' | 'ALL';
  includePrivate?: boolean;
  orgId?: string | null;
  limit?: number;
  offset?: number;
  page?: number;
}

export function filterHubItems(
  items: HubItem[],
  options: FilterHubOptions = {}
): { items: HubItem[]; total: number } {
  let filtered = [...items];

  // Visibility / Chamber isolation
  if (options.includePrivate && options.orgId) {
    filtered = filtered.filter(
      (item) => item.visibility === 'PUBLIC' || (item.visibility === 'PRIVATE_CHAMBER' && item.orgId === options.orgId)
    );
  } else if (options.visibility && options.visibility !== 'ALL') {
    filtered = filtered.filter((item) => item.visibility === options.visibility);
  } else if (!options.visibility) {
    // Default to PUBLIC only if not specified
    filtered = filtered.filter((item) => item.visibility === 'PUBLIC');
  }

  // Category / itemType
  if (options.category && options.category !== 'all') {
    filtered = filtered.filter((item) => item.itemType === options.category);
  }

  // Domain filter
  if (options.domain && options.domain !== 'all') {
    filtered = filtered.filter((item) => item.domain === options.domain);
  }

  // Subdomain filter
  if (options.subdomain && options.subdomain !== 'all') {
    filtered = filtered.filter((item) => item.subdomain === options.subdomain);
  }

  // Archetype filter
  if (options.archetype && options.archetype !== 'all') {
    filtered = filtered.filter((item) => item.archetype === options.archetype);
  }

  // Search query
  if (options.q && options.q.trim()) {
    const query = options.q.trim().toLowerCase();
    filtered = filtered.filter((item) => {
      const nameMatch = (item.name || '').toLowerCase().includes(query);
      const descMatch = (item.description || '').toLowerCase().includes(query);
      const tags = Array.isArray(item.tags) ? item.tags : [];
      const tagMatch = tags.some((t: any) => String(t).toLowerCase().includes(query));
      return nameMatch || descMatch || tagMatch;
    });
  }

  // Sort by downloads descending
  filtered.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));

  const total = filtered.length;
  const limit = options.limit || 24;
  const offset = options.offset !== undefined ? options.offset : ((options.page || 1) - 1) * limit;

  const paginated = filtered.slice(offset, offset + limit);

  return {
    items: paginated,
    total,
  };
}

export async function getHubItems(options: FilterHubOptions = {}): Promise<{ items: HubItem[]; total: number }> {
  const client = getDbClient();
  
  // If we're using mock / offline fallback
  if ((client as any).isMock) {
    const store = getMockStore();
    return filterHubItems(store.hubItems || [], options);
  }

  // Neon / Postgres with Drizzle
  try {
    const conditions = [];

    if (options.includePrivate && options.orgId) {
      conditions.push(
        or(
          eq(hubItems.visibility, 'PUBLIC'),
          and(eq(hubItems.visibility, 'PRIVATE_CHAMBER'), eq(hubItems.orgId, options.orgId))
        )
      );
    } else if (options.visibility && options.visibility !== 'ALL') {
      conditions.push(eq(hubItems.visibility, options.visibility));
    } else {
      conditions.push(eq(hubItems.visibility, 'PUBLIC'));
    }

    if (options.category && options.category !== 'all') {
      conditions.push(eq(hubItems.itemType, options.category));
    }

    if (options.domain && options.domain !== 'all') {
      conditions.push(eq(hubItems.domain, options.domain));
    }

    if (options.subdomain && options.subdomain !== 'all') {
      conditions.push(eq(hubItems.subdomain, options.subdomain));
    }

    if (options.archetype && options.archetype !== 'all') {
      conditions.push(eq(hubItems.archetype, options.archetype));
    }

    if (options.q && options.q.trim()) {
      const pattern = `%${options.q.trim()}%`;
      conditions.push(
        or(
          ilike(hubItems.name, pattern),
          ilike(hubItems.description, pattern)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const limit = options.limit || 24;
    const offset = options.offset !== undefined ? options.offset : ((options.page || 1) - 1) * limit;

    const [itemsResult, countResult] = await Promise.all([
      (client as any)
        .select()
        .from(hubItems)
        .where(whereClause)
        .orderBy(desc(hubItems.downloads))
        .limit(limit)
        .offset(offset),
      (client as any)
        .select({ count: sql<number>`count(*)` })
        .from(hubItems)
        .where(whereClause),
    ]);

    const total = Number(countResult[0]?.count || 0);
    return { items: itemsResult, total };
  } catch (error) {
    console.error('Failed to query hubItems from DB, falling back to mock store:', error);
    const store = getMockStore();
    return filterHubItems(store.hubItems || [], options);
  }
}

export async function getHubItemById(id: string): Promise<HubItem | null> {
  const client = getDbClient();
  if ((client as any).isMock) {
    const store = getMockStore();
    return store.hubItems.find((item) => item.id === id) || null;
  }

  try {
    const results = await (client as any)
      .select()
      .from(hubItems)
      .where(eq(hubItems.id, id))
      .limit(1);
    return results[0] || null;
  } catch {
    const store = getMockStore();
    return store.hubItems.find((item) => item.id === id) || null;
  }
}

export async function getTaxonomyTree(options: {
  includePrivate?: boolean;
  orgId?: string | null;
} = {}) {
  const { getMasterTaxonomy } = await import('../../taxonomy/types');
  const master = getMasterTaxonomy();

  // Clone master domains to avoid mutation
  const tree = JSON.parse(JSON.stringify(master));

  // Fetch all items within current visibility scope
  const { items } = await getHubItems({
    visibility: 'ALL',
    includePrivate: options.includePrivate,
    orgId: options.orgId,
    limit: 10000,
  });

  // Map counts per domain and subdomain
  for (const domain of tree) {
    for (const sub of domain.subdomains) {
      const subItems = items.filter(
        (i: any) => i.domain === domain.id && i.subdomain === sub.id
      );
      sub.agentCount = subItems.filter((i: any) => {
        if (i.urn?.startsWith('agent:')) return true;
        return i.itemType === 'agent' || i.itemType === 'agent-flow';
      }).length;

      sub.skillCount = subItems.filter((i: any) => {
        if (i.urn?.startsWith('skill:') || i.urn?.startsWith('command:')) return true;
        return i.itemType === 'skill' || i.itemType === 'agent-skill' || i.itemType === 'slash-command';
      }).length;

      sub.vaultCount = subItems.filter((i: any) => {
        if (i.urn?.startsWith('vault:')) return true;
        return i.itemType === 'vault' || i.itemType === 'data-connector';
      }).length;

      (sub as any).totalCount = subItems.length;
    }
    (domain as any).totalCount = domain.subdomains.reduce(
      (acc: number, s: any) => acc + (s.totalCount || 0),
      0
    );
  }

  return tree;
}
