import { NextResponse } from 'next/server';
import { getTaxonomyTree } from '../../../../../lib/db/queries/hub';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includePrivate = searchParams.get('includePrivate') === 'true';
    const orgId = searchParams.get('orgId') || null;

    const domains = await getTaxonomyTree({
      includePrivate,
      orgId,
    });

    return NextResponse.json({
      success: true,
      domains,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Failed to get taxonomy tree:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
