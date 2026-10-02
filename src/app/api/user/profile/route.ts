// admin-panel/src/app/api/user/profile/route.ts
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
    const user = store.users.find(u => u.id === userId) || store.users[1];

    return NextResponse.json({ user }, {
      status: 200,
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { name, org } = body;

    const sessionUserCookie = request.headers.get('cookie')
      ?.split(';')
      .find(c => c.trim().startsWith('hayagriva_user='));

    let userId = 'usr_adv_01';

    if (sessionUserCookie) {
      try {
        const val = sessionUserCookie.split('=')[1];
        const parsed = JSON.parse(decodeURIComponent(val));
        if (parsed?.id) userId = parsed.id;
      } catch {}
    }

    const store = getMockStore();
    const user = store.users.find(u => u.id === userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (name) user.name = name;
    if (org) user.org = org;
    user.updatedAt = new Date();

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update profile' }, { status: 500 });
  }
}
