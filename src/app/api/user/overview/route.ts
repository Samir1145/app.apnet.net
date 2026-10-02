// admin-panel/src/app/api/user/overview/route.ts
import { NextResponse } from 'next/server';
import { getMockStore } from '@/lib/db/seed';
import { calculateClientOverview } from '@/lib/services/client_overview';

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
    const overview = calculateClientOverview(store, userId);

    return NextResponse.json(overview, {
      status: 200,
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch overview' }, { status: 500 });
  }
}
