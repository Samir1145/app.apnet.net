// admin-panel/src/app/api/user/licenses/transfer/route.ts
import { NextResponse } from 'next/server';
import { getMockStore } from '@/lib/db/seed';
import { transferSeat } from '@/lib/services/licensing';

export async function POST(request: Request) {
  try {
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

    const body = await request.json();
    const { deviceName, osInfo, hardwareFingerprint } = body;

    if (!hardwareFingerprint) {
      return NextResponse.json({ error: 'hardwareFingerprint is required' }, { status: 400 });
    }

    const store = getMockStore();
    const license = store.licenses.find(l => l.userId === userId) || store.licenses[0];

    if (!license) {
      return NextResponse.json({ error: 'License not found for this practitioner' }, { status: 404 });
    }

    const result = transferSeat(store, license.id, {
      deviceName: deviceName || 'Transferred Chamber Seat',
      osInfo: osInfo || 'Chamber OS',
      hardwareFingerprint,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to transfer seat' }, { status: 500 });
  }
}
