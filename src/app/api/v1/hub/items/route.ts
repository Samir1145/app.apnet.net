import { NextResponse } from 'next/server';
import { getHubItems } from '../../../../../lib/db/queries/hub';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const domain = searchParams.get('domain') || undefined;
    const subdomain = searchParams.get('subdomain') || undefined;
    const archetype = searchParams.get('archetype') || undefined;
    const q = (searchParams.get('q') || '').trim();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '24', 10));
    const orgId = searchParams.get('orgId') || undefined;
    const includePrivate = searchParams.get('includePrivate') === 'true';

    const { items, total } = await getHubItems({
      category,
      domain,
      subdomain,
      archetype,
      q,
      page,
      limit,
      orgId,
      includePrivate,
    });

    const totalPages = Math.ceil(total / limit) || 1;

    return NextResponse.json({
      success: true,
      items,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
