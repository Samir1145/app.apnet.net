// admin-panel/src/app/api/v1/deactivate/route.ts
import { NextResponse } from 'next/server';
import { getMockStore } from '@/lib/db/seed';
import { deactivateDevice } from '@/lib/services/licensing';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { activation_id, license_key } = body;

    if (!activation_id) {
      return NextResponse.json(
        { error: 'MISSING_FIELDS', message: 'activation_id is required' },
        { status: 400 }
      );
    }

    const store = getMockStore();
    const result = deactivateDevice(store, activation_id, license_key);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: error?.message || 'Deactivation failed' },
      { status: 500 }
    );
  }
}
