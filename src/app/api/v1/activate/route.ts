// admin-panel/src/app/api/v1/activate/route.ts
import { NextResponse } from 'next/server';
import { getMockStore } from '../../../../lib/db/seed';
import { activateDevice } from '../../../../lib/services/licensing';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { license_key, hardware_fingerprint, device_name, os_info, app_version, move_seat, domain } = body;

    if (!license_key || !hardware_fingerprint) {
      return NextResponse.json(
        { error: 'MISSING_FIELDS', message: 'license_key and hardware_fingerprint are required' },
        { status: 400 }
      );
    }

    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';

    const store = getMockStore();

    // Check Neon DB if license not in in-memory store
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    const isNeonLive = databaseUrl && !databaseUrl.includes("placeholder");
    if (isNeonLive && !store.licenses.some(l => l.licenseKey === license_key)) {
      try {
        const { db } = await import("../../../../lib/db");
        const dbLicense = await (db as any).query.licenses.findFirst({
          where: (l: any, { eq }: any) => eq(l.licenseKey, license_key),
        });
        if (dbLicense) {
          store.licenses.unshift(dbLicense);
        }
      } catch (err) {
        console.error("[Activate] Neon lookup failed:", err);
      }
    }

    const result = activateDevice(store, {
      licenseKey: license_key,
      hardwareFingerprint: hardware_fingerprint,
      deviceName: device_name || 'Desktop Station',
      osInfo: os_info || 'Desktop OS',
      ipAddress,
      appVersion: app_version,
      moveSeat: !!move_seat,
      domain: domain || undefined
    });

    if (!result.success) {
      const status = result.error === 'DEVICE_LIMIT_EXCEEDED' ? 403 : 400;
      return NextResponse.json(result, { status });
    }

    // Look up practitioner in store or Neon DB
    let practitioner = null;
    const licenseObj = store.licenses.find(l => l.licenseKey === license_key);
    if (licenseObj?.userId) {
      const u = store.users.find(usr => usr.id === licenseObj.userId);
      if (u) {
        practitioner = {
          name: u.name,
          email: u.email,
          org: u.org,
          role: u.role
        };
      } else if (isNeonLive) {
        try {
          const { db } = await import("@/lib/db");
          const dbUser = await (db as any).query.users.findFirst({
            where: (usr: any, { eq }: any) => eq(usr.id, licenseObj.userId),
          });
          if (dbUser) {
            practitioner = {
              name: dbUser.name,
              email: dbUser.email,
              org: dbUser.org,
              role: dbUser.role
            };
          }
        } catch (uErr) {
          console.error("[Activate] Failed to fetch user for practitioner:", uErr);
        }
      }
    }

    return NextResponse.json({ ...result, practitioner }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: error?.message || 'Activation failed' },
      { status: 500 }
    );
  }
}
