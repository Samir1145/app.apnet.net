// admin-panel/src/app/api/user/licenses/route.ts
import { NextResponse } from 'next/server';
import { getMockStore } from '@/lib/db/seed';
import { deactivateDevice } from '@/lib/services/licensing';

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
    const license = store.licenses.find(l => l.userId === userId) || store.licenses[0];
    const userActivations = store.activations.filter(a => a.userId === userId);

    return NextResponse.json({
      license,
      activations: userActivations,
      activeDevicesCount: userActivations.filter(a => a.isActive).length,
      maxDevices: license ? license.maxDevices : 1,
    }, {
      status: 200,
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch licenses' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { activationId } = await request.json();
    if (!activationId) {
      return NextResponse.json({ error: 'activationId is required' }, { status: 400 });
    }

    const store = getMockStore();
    const result = deactivateDevice(store, activationId);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to deactivate device' }, { status: 500 });
  }
}
