// admin-panel/src/app/api/admin/support/route.ts
import { NextResponse } from 'next/server';
import { getMockStore } from '@/lib/db/seed';
import { triageTickets } from '@/lib/services/modules';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'ALL';
    const priority = searchParams.get('priority') || 'ALL';
    const search = searchParams.get('search') || '';

    const store = getMockStore();
    const tickets = triageTickets(store, { status, priority, search });

    return NextResponse.json({ tickets, total: tickets.length }, {
      status: 200,
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to list tickets' }, { status: 500 });
  }
}
