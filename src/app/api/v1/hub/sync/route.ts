import { NextResponse } from 'next/server';
import { getDbClient } from '../../../../../lib/db';
import { getMockStore } from '../../../../../lib/db/seed';
import { licenses, activations, users, hubItems } from '../../../../../lib/db/schema';
import { getPresignedDownloadUrl } from '../../../../../lib/storage/s3';
import { eq, and } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const licenseKey =
      request.headers.get('x-hayagriva-license') ||
      request.headers.get('x-license-key') ||
      request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

    if (!licenseKey) {
      return NextResponse.json(
        { success: false, error: 'Missing chamber license header (X-Hayagriva-License required)' },
        { status: 401 }
      );
    }

    const fingerprint = (
      request.headers.get('x-hayagriva-fingerprint') ||
      request.headers.get('x-device-fingerprint') ||
      ''
    ).trim();

    if (!fingerprint) {
      return NextResponse.json(
        { success: false, error: 'Hardware fingerprint header (X-Hayagriva-Fingerprint) required' },
        { status: 403 }
      );
    }

    const client = getDbClient();
    const isMock = (client as any).isMock;
    const store = getMockStore();

    let license: any = null;
    let activation: any = null;
    let user: any = null;

    if (isMock) {
      license = store.licenses.find((l) => l.licenseKey.trim() === licenseKey.trim());
      if (license) {
        activation = store.activations.find(
          (a) =>
            a.licenseId === license.id &&
            a.hardwareFingerprint.trim() === fingerprint &&
            a.isActive === true
        );
        user = store.users.find((u) => u.id === license.userId);
      }
    } else {
      try {
        const licenseRecords = await (client as any)
          .select()
          .from(licenses)
          .where(eq(licenses.licenseKey, licenseKey.trim()))
          .limit(1);
        license = licenseRecords[0] || null;

        if (license) {
          const actRecords = await (client as any)
            .select()
            .from(activations)
            .where(
              and(
                eq(activations.licenseId, license.id),
                eq(activations.hardwareFingerprint, fingerprint),
                eq(activations.isActive, true)
              )
            )
            .limit(1);
          activation = actRecords[0] || null;

          const userRecords = await (client as any)
            .select()
            .from(users)
            .where(eq(users.id, license.userId))
            .limit(1);
          user = userRecords[0] || null;
        }

        // If activation wasn't in DB, check fallback in-memory store
        if (!activation && license) {
          activation = store.activations.find(
            (a) =>
              a.licenseId === license.id &&
              a.hardwareFingerprint.trim() === fingerprint &&
              a.isActive === true
          );
        }
        if (!user && license) {
          user = store.users.find((u) => u.id === license.userId);
        }
      } catch (dbErr) {
        console.error('Error querying license/activation in DB, checking fallback store:', dbErr);
        license = store.licenses.find((l) => l.licenseKey.trim() === licenseKey.trim());
        if (license) {
          activation = store.activations.find(
            (a) =>
              a.licenseId === license.id &&
              a.hardwareFingerprint.trim() === fingerprint &&
              a.isActive === true
          );
          user = store.users.find((u) => u.id === license.userId);
        }
      }
    }

    if (!license) {
      return NextResponse.json(
        { success: false, error: 'Chamber license not recognized' },
        { status: 401 }
      );
    }

    if (license.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, error: `License status is ${license.status}` },
        { status: 401 }
      );
    }

    if (new Date(license.expiresAt).getTime() < Date.now()) {
      return NextResponse.json(
        { success: false, error: 'Chamber license has expired' },
        { status: 401 }
      );
    }

    // Hardware device activation verification
    if (!activation) {
      return NextResponse.json(
        {
          success: false,
          error: 'Hardware fingerprint not activated or bound to this license',
        },
        { status: 403 }
      );
    }

    const chamberOrg = user?.org || 'Independent Chamber';

    // Collect public items & chamber private items
    let rawItems: any[] = [];
    if (isMock) {
      const publicItems = (store.hubItems || []).filter((item) => item.visibility === 'PUBLIC');
      const privateItems = (store.hubItems || []).filter(
        (item) => item.visibility === 'PRIVATE_CHAMBER' && item.orgId === chamberOrg
      );
      rawItems = [...publicItems, ...privateItems];
    } else {
      try {
        const allDbItems = await (client as any).select().from(hubItems);
        const publicItems = allDbItems.filter((item: any) => item.visibility === 'PUBLIC');
        const privateItems = allDbItems.filter(
          (item: any) => item.visibility === 'PRIVATE_CHAMBER' && item.orgId === chamberOrg
        );
        rawItems = [...publicItems, ...privateItems];
      } catch {
        const publicItems = (store.hubItems || []).filter((item) => item.visibility === 'PUBLIC');
        const privateItems = (store.hubItems || []).filter(
          (item) => item.visibility === 'PRIVATE_CHAMBER' && item.orgId === chamberOrg
        );
        rawItems = [...publicItems, ...privateItems];
      }
    }

    // Attach signed presigned download URLs for seamless binary or archive syncing
    const itemsWithDownloadUrls = await Promise.all(
      rawItems.map(async (item) => {
        const assetKey =
          item.cartridgeUrl ||
          `hub-packages/${item.itemType}/${item.slug || item.id}.zip`;
        const packageDownloadUrl = await getPresignedDownloadUrl(assetKey, 900);
        return {
          ...item,
          packageDownloadUrl,
        };
      })
    );

    return NextResponse.json({
      success: true,
      chamber: {
        org: chamberOrg,
        planTier: license.planTier,
        licenseKey: license.licenseKey,
        userEmail: user?.email,
        maxDevices: license.maxDevices,
        hardwareFingerprint: fingerprint,
      },
      items: itemsWithDownloadUrls,
      count: itemsWithDownloadUrls.length,
      syncedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Chamber sync failure' },
      { status: 500 }
    );
  }
}
