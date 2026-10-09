import { NextResponse } from 'next/server';
import { getMockStore } from '@/lib/db/seed';

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

    const store = getMockStore();
    const license = store.licenses.find(l => l.licenseKey.trim() === licenseKey.trim());

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

    // Locate chamber advocate/user
    const user = store.users.find(u => u.id === license.userId);
    const chamberOrg = user?.org || 'Independent Chamber';

    // Collect public items
    const publicItems = (store.hubItems || []).filter(item => item.visibility === 'PUBLIC');

    // Collect strictly authorized private chamber items
    const privateItems = (store.hubItems || []).filter(
      item => item.visibility === 'PRIVATE_CHAMBER' && item.orgId === chamberOrg
    );

    const mergedItems = [...publicItems, ...privateItems];

    return NextResponse.json({
      success: true,
      chamber: {
        org: chamberOrg,
        planTier: license.planTier,
        licenseKey: license.licenseKey,
        userEmail: user?.email,
        maxDevices: license.maxDevices,
      },
      items: mergedItems,
      count: mergedItems.length,
      syncedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Chamber sync failure' },
      { status: 500 }
    );
  }
}
