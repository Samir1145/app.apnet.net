import { NextResponse } from 'next/server';
import { getMockStore } from '@/lib/db/seed';
import { HubItem } from '@/lib/db/schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, itemType, description, visibility = 'PUBLIC', manifest = { files: [] }, tags = [], authorName } = body;

    if (!name || !itemType) {
      return NextResponse.json(
        { success: false, error: 'Name and itemType are required' },
        { status: 400 }
      );
    }

    const store = getMockStore();
    let orgId: string | null = null;
    let userId: string | null = null;

    const licenseKey = request.headers.get('x-hayagriva-license');

    if (licenseKey) {
      const license = store.licenses.find(l => l.licenseKey.trim() === licenseKey.trim());
      if (license && license.status === 'ACTIVE') {
        const user = store.users.find(u => u.id === license.userId);
        if (user) {
          userId = user.id;
          orgId = user.org || null;
        }
      }
    }

    if (visibility === 'PRIVATE_CHAMBER') {
      if (!licenseKey || !orgId) {
        return NextResponse.json(
          { success: false, error: 'Publishing private chamber tools requires an active chamber license' },
          { status: 401 }
        );
      }
    }

    const id = `hub_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const newItem: HubItem = {
      id,
      userId,
      orgId: visibility === 'PRIVATE_CHAMBER' ? orgId : null,
      itemType,
      name,
      slug,
      description: description || '',
      visibility,
      verified: false,
      downloads: 0,
      tags: Array.isArray(tags) ? tags : [],
      manifest: manifest || { files: [] },
      importId: `import_${id}`,
      authorName: authorName || (userId ? 'Chamber Member' : 'Community Contributor'),
      authorUrl: null,
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (!store.hubItems) {
      store.hubItems = [];
    }
    store.hubItems.unshift(newItem);

    return NextResponse.json(
      { success: true, item: newItem },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Publishing error' },
      { status: 500 }
    );
  }
}
