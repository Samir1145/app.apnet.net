import { NextResponse } from 'next/server';
import { ASSET_CATALOG } from '@/lib/catalog';

export async function GET() {
  try {
    const items = ASSET_CATALOG.map((item) => ({
      ...item,
      accessible: true,
      downloadUrl: `/api/downloads/file/${item.id}`,
    }));

    return NextResponse.json({
      success: true,
      items,
      count: items.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch catalog' },
      { status: 500 }
    );
  }
}
