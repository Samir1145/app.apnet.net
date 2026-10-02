// admin-panel/src/app/api/admin/users/[id]/route.ts
import { NextResponse } from 'next/server';
import { getMockStore } from '@/lib/db/seed';
import { updateUser } from '@/lib/services/users';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const store = getMockStore();
    const user = store.users.find(u => u.id === id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Guard against attempted email modification
    if (body.email !== undefined) {
      // Ignore or reject email modification to maintain strict immutability
      delete body.email;
    }

    const store = getMockStore();
    const result = updateUser(
      store,
      id,
      {
        name: body.name,
        role: body.role,
        status: body.status,
        plan: body.plan,
        org: body.org,
      },
      'usr_superadmin_01',
      'superadmin@hayagriva.app'
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: result.user }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update user' }, { status: 500 });
  }
}
