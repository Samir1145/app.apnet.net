import { NextRequest, NextResponse } from 'next/server';
import { ASSET_CATALOG } from '@/lib/catalog';
import { getPresignedDownloadUrl } from '@/lib/storage/s3';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ assetId: string }> }
) {
  try {
    const { assetId } = await params;
    const item = ASSET_CATALOG.find((c) => c.id === assetId);

    if (!item) {
      return NextResponse.json(
        { success: false, error: `Asset '${assetId}' not found in catalog.` },
        { status: 404 }
      );
    }

    // Generate short-lived (15 min) Cloudflare R2 pre-signed URL
    const downloadUrl = await getPresignedDownloadUrl(item.r2Key, 900);

    return NextResponse.json({
      success: true,
      assetId: item.id,
      name: item.name,
      category: item.category,
      size: item.size,
      r2Key: item.r2Key,
      downloadUrl,
      expiresIn: 900,
      message: `Presigned R2 download ready for ${item.name}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to generate download URL' },
      { status: 500 }
    );
  }
}
