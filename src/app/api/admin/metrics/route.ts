// admin-panel/src/app/api/admin/metrics/route.ts
import { NextResponse } from 'next/server';
import { getMockStore } from '@/lib/db/seed';
import { calculateDashboardMetrics } from '@/lib/services/metrics';

export async function GET() {
  try {
    const store = getMockStore();
    const metrics = calculateDashboardMetrics(store);

    return NextResponse.json(metrics, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error: any) {
    console.error('Error fetching admin metrics:', error);
    return NextResponse.json(
      { error: 'Failed to compute dashboard metrics', details: error?.message },
      { status: 500 }
    );
  }
}
