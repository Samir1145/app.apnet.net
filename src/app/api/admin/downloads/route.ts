// admin-panel/src/app/api/admin/downloads/route.ts
import { NextResponse } from 'next/server';
import { getMockStore } from '@/lib/db/seed';
import { aggregateDownloads } from '@/lib/services/modules';

export async function GET() {
  try {
    const store = getMockStore();
    const result = aggregateDownloads(store);

    return NextResponse.json(result, {
      status: 200,
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to aggregate downloads' }, { status: 500 });
  }
}
