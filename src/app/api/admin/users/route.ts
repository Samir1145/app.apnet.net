// admin-panel/src/app/api/admin/users/route.ts
import { NextResponse } from 'next/server';
import { getMockStore } from '@/lib/db/seed';
import { queryUsersList, softDeleteUser } from '@/lib/services/users';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || 'ALL';
    const status = searchParams.get('status') || 'ALL';
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    const store = getMockStore();
    const result = queryUsersList(store, { search, role, status, includeDeleted });

    return NextResponse.json(result, {
      status: 200,
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to list users' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId, reason } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const store = getMockStore();
    const result = softDeleteUser(
      store,
      userId,
      'usr_superadmin_01',
      'superadmin@hayagriva.app',
      reason
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: result.user }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to delete user' }, { status: 500 });
  }
}
