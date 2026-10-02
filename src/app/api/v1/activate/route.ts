// admin-panel/src/app/api/v1/activate/route.ts
import { NextResponse } from 'next/server';
import { getMockStore } from '@/lib/db/seed';
import { activateDevice } from '@/lib/services/licensing';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { license_key, hardware_fingerprint, device_name, os_info, app_version } = body;

    if (!license_key || !hardware_fingerprint) {
      return NextResponse.json(
        { error: 'MISSING_FIELDS', message: 'license_key and hardware_fingerprint are required' },
        { status: 400 }
      );
    }

    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';

    const store = getMockStore();
    const result = activateDevice(store, {
      licenseKey: license_key,
      hardwareFingerprint: hardware_fingerprint,
      deviceName: device_name || 'Desktop Station',
      osInfo: os_info || 'Desktop OS',
      ipAddress,
      appVersion: app_version
    });

    if (!result.success) {
      const status = result.error === 'DEVICE_LIMIT_EXCEEDED' ? 403 : 400;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: error?.message || 'Activation failed' },
      { status: 500 }
    );
  }
}
