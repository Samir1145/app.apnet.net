// admin-panel/src/app/api/admin/users/[id]/reset-password/route.ts
import { NextResponse } from 'next/server';
import { getMockStore } from '@/lib/db/seed';
import { generateTemporaryPassword } from '@/lib/services/passwords';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const store = getMockStore();

    const result = generateTemporaryPassword(
      store,
      id,
      'usr_superadmin_01',
      'superadmin@hayagriva.app'
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to reset password' }, { status: 500 });
  }
}
