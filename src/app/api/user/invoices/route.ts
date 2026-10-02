// admin-panel/src/app/api/user/invoices/route.ts
import { NextResponse } from 'next/server';
import { getMockStore } from '@/lib/db/seed';

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
    const invoices = store.invoices.filter(i => i.userId === userId);

    return NextResponse.json({ invoices, total: invoices.length }, {
      status: 200,
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch invoices' }, { status: 500 });
  }
}
