import { NextResponse } from 'next/server';
import { getMockStore } from '@/lib/db/seed';
import { triageTickets, updateTicket } from '@/lib/services/modules';

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

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const body = await request.json().catch(() => ({}));

    const ticketId = body.ticketId || body.id || searchParams.get('ticketId') || searchParams.get('id');

    if (!ticketId) {
      return NextResponse.json({ error: 'Ticket ID (ticketId or id) is required' }, { status: 400 });
    }

    const { status, priority, adminResponse } = body;

    // Extract admin identity from session cookie if present
    const sessionCookie = request.headers.get('cookie')
      ?.split(';')
      .find(c => c.trim().startsWith('hayagriva_user='));

    let adminId = 'usr_superadmin_01';
    let adminEmail = 'superadmin@hayagriva.app';

    if (sessionCookie) {
      try {
        const val = sessionCookie.split('=')[1];
        const parsed = JSON.parse(decodeURIComponent(val));
        if (parsed?.id) adminId = parsed.id;
        if (parsed?.email) adminEmail = parsed.email;
      } catch {}
    }

    const store = getMockStore();
    const result = updateTicket(
      store,
      ticketId,
      { status, priority, adminResponse },
      { adminId, adminEmail }
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({ success: true, ticket: result.ticket }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update ticket' }, { status: 500 });
  }
}
