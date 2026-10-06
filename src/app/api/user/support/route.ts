// admin-panel/src/app/api/user/support/route.ts
import { NextResponse } from 'next/server';
import { getMockStore } from '@/lib/db/seed';
import { SupportTicket } from '@/lib/db/schema';

export async function GET(request: Request) {
  try {
    const sessionUserCookie = request.headers.get('cookie')
      ?.split(';')
      .find(c => c.trim().startsWith('hayagriva_user='));

    let userId = 'usr_adv_01'; // Default fallback

    if (sessionUserCookie) {
      try {
        const val = sessionUserCookie.split('=')[1];
        const parsed = JSON.parse(decodeURIComponent(val));
        if (parsed?.id) userId = parsed.id;
      } catch {}
    }

    const store = getMockStore();
    const tickets = store.supportTickets.filter(t => t.userId === userId);

    return NextResponse.json({ tickets, total: tickets.length }, {
      status: 200,
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch tickets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subject, priority, description } = body;

    const sessionUserCookie = request.headers.get('cookie')
      ?.split(';')
      .find(c => c.trim().startsWith('hayagriva_user='));

    let userId = 'usr_adv_01';
    let userName = 'Adv. Rajeshwar Rao';
    let userEmail = 'r.rao@insolvencylaw.in';

    if (sessionUserCookie) {
      try {
        const val = sessionUserCookie.split('=')[1];
        const parsed = JSON.parse(decodeURIComponent(val));
        if (parsed?.id) userId = parsed.id;
        if (parsed?.name) userName = parsed.name;
        if (parsed?.email) userEmail = parsed.email;
      } catch {}
    }

    const newTicket: SupportTicket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      userId,
      userName,
      userEmail,
      subject: subject || 'Support Request',
      description: description || '',
      priority: priority || 'MEDIUM',
      status: 'OPEN',
      adminResponse: null,
      respondedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const store = getMockStore();
    store.supportTickets.push(newTicket);

    return NextResponse.json({ success: true, ticket: newTicket }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to submit ticket' }, { status: 500 });
  }
}
