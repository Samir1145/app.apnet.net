import { NextResponse } from 'next/server';
import { getMockStore } from '@/lib/db/seed';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const q = (searchParams.get('q') || '').trim().toLowerCase();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '24', 10));

    const store = getMockStore();
    let allItems = (store.hubItems || []).filter(item => item.visibility === 'PUBLIC');

    // Filter by category / itemType
    if (category && category !== 'all') {
      allItems = allItems.filter(item => item.itemType === category);
    }

    // Filter by query string
    if (q) {
      allItems = allItems.filter(item => {
        const nameMatch = (item.name || '').toLowerCase().includes(q);
        const descMatch = (item.description || '').toLowerCase().includes(q);
        const tags = Array.isArray(item.tags) ? item.tags : [];
        const tagMatch = tags.some((t: any) => String(t).toLowerCase().includes(q));
        return nameMatch || descMatch || tagMatch;
      });
    }

    // Sort by downloads descending
    allItems.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));

    const total = allItems.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;
    const paginatedItems = allItems.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      items: paginatedItems,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
