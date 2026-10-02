// admin-panel/src/app/api/admin/logs/route.ts
import { NextResponse } from 'next/server';
import { getMockStore } from '@/lib/db/seed';
import { filterLogs } from '@/lib/services/modules';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const method = searchParams.get('method') || 'ALL';
    const errorOnly = searchParams.get('errorOnly') === 'true';
    const search = searchParams.get('search') || '';

    const store = getMockStore();
    const logs = filterLogs(store, { method, errorOnly, search });

    return NextResponse.json({ logs, total: logs.length }, {
      status: 200,
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to list logs' }, { status: 500 });
  }
}
